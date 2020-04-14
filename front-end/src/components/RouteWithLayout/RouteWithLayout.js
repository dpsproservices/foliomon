import React from 'react';
import { Route, withRouter } from 'react-router-dom';

const RouteWithLayout = props => {
  const { layout: Layout, component, ...rest } = props;
  const Component = withRouter(component);

  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

export default RouteWithLayout;