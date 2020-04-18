import React, { useEffect, useState, useRef } from 'react';
import { getUser } from '../../utils/api';

var ws;
var requestid = 0;

const Websocket = ({ subscriptions, messageHandlers }) => {
  const isMounted = useRef(null);
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [prevSubscriptions, setPrevSubscriptions] = useState();

  useEffect(() => {
    // executed when component mounted
    isMounted.current = true;
    return () => {
      // executed when unmounted
      isMounted.current = false;
    }
  }, []);

  const jsonToQueryString = (json) => {
    return Object.keys(json).map(function(key) {
      return encodeURIComponent(key) + '=' +
          encodeURIComponent(json[key]);
      }).join('&');
  };

  const getCredentials = (user) => {
    //Converts ISO-8601 response in snapshot to ms since epoch accepted by Streamer
    const tokenTimeStampAsDateObj = new Date(user.streamerInfo.tokenTimestamp);
    const tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();

    const credentials = {
      "userid": user.accounts[0].accountId,
      "token": user.streamerInfo.token,
      "company": user.accounts[0].company,
      "segment": user.accounts[0].segment,
      "cddomain": user.accounts[0].accountCdDomainId,
      "usergroup": user.streamerInfo.userGroup,
      "accesslevel": user.streamerInfo.accessLevel,
      "authorized": "Y",
      "timestamp": tokenTimeStampAsMs,
      "appid": user.streamerInfo.appId,
      "acl": user.streamerInfo.acl
    };

    return jsonToQueryString(credentials);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const userRes = await getUser();
        console.log(userRes.data);
        setUser(userRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  useEffect(() => {

    if (isConnected && user) {
      const request = {
        "requests": [
          {
            "service": "ADMIN",
            "command": "LOGIN",
            "requestid": requestid++,
            "account": user.accounts[0].accountId,
            "source": user.streamerInfo.appId,
            "parameters": {
              "credential": getCredentials(user),
              "token": user.streamerInfo.token,
              "version": "1.0"
            }
          }
        ]
      };

      ws.send(JSON.stringify(request));
    }
  }, [user, isConnected]);

  useEffect(() => {
    return () => {
      if (ws && user && isLoggedIn && !isMounted.current) {
        const logout = {
          "requests": [
            {
              "service": "ADMIN",
              "command": "LOGOUT",
              "requestid": requestid++,
              "account": user.accounts[0].accountId,
              "source": user.streamerInfo.appId,
              "parameters": {
                "credential": getCredentials(user),
                "token": user.streamerInfo.token,
                "version": "1.0"
              }
            }
          ]
        };
        console.log("Logging out...")
        ws.send(JSON.stringify(logout));
      };
    }
  }, [user, isLoggedIn, isMounted]);

  useEffect(() => {
    if (user && isLoggedIn && (subscriptions || prevSubscriptions)) {
      const newSubscriptions = [];
      const prevServices = {};
      const currServices = {};

      prevSubscriptions && prevSubscriptions.forEach(p => {
        if (p.command === 'SUBS') {
          prevServices[p.service] = p.parameters;
        }
      });
      subscriptions && subscriptions.forEach(c => {
        if (c.command === 'SUBS') {
          currServices[c.service] = c.parameters;
        }
      });
    
      Object.keys(currServices).forEach(key => {
        // New subscription added.
        if (!prevServices[key]) {
          newSubscriptions.push({ service: key, command: 'SUBS', parameters: currServices[key] });
        }
      });

      Object.keys(prevServices).forEach(key => {
        // Unsubscribe removed subscription.
        if (!currServices[key]) {
          newSubscriptions.push({ service: key, command: 'UNSUBS', parameters: prevServices[key] });
        } else {
          Object.keys(currServices[key]).forEach(param => {
            // Parameter change. Unsubscribe and resubscribe.
            if (currServices[key][param] !== prevServices[key][param]) {
              newSubscriptions.push({ service: key, command: 'UNSUBS', parameters: prevServices[key] });
              newSubscriptions.push({ service: key, command: 'SUBS', parameters: currServices[key] });
            }
          });
        }
      });

      if (newSubscriptions.length > 0) {
        const requests = {
          "requests": newSubscriptions.map(s => (
            {
              "service": s.service,
              "command": s.command,
              "requestid": requestid++,
              "account": user.accounts[0].accountId,
              "source": user.streamerInfo.appId,
              "parameters": s.parameters
            }
          ))
        };
    
        //console.log({requests});
        ws.send(JSON.stringify(requests));
        setPrevSubscriptions(subscriptions)
      }
    }
  }, [isLoggedIn, subscriptions]);

  useEffect(() => {

    if (user) {
      ws = new WebSocket("wss://" + user.streamerInfo.streamerSocketUrl + "/ws");

      ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected');
        setIsConnected(true);
      };

      ws.onmessage = evt => {
        // listen to data sent from the websocket server
        const message = JSON.parse(evt.data);
        console.log(message);

        if (message.response && message.response.length === 1
          && message.response[0].service === 'ADMIN' && message.response[0].command === 'LOGOUT'
          && message.response[0].content.code === 0) {
            if (isMounted.current) setIsLoggedIn(false);
            console.log("LOGOUT received");
            ws.close();
        }

        if (!isMounted.current) return;

        if (message.response && message.response.length === 1
          && message.response[0].service === 'ADMIN' && message.response[0].command === 'LOGIN'
          && message.response[0].content.code === 0) {
            setIsLoggedIn(true);
        }

        messageHandlers.forEach(handler => {
          handler(message);
        });
      };

      ws.onclose = () => {
        console.log('disconnected');
      };

      ws.onerror = (err) => {
        console.log(err);
      };
    }
  }, [user]);

  return (<div style={{ height: 0 }} />);
}

export default Websocket;
