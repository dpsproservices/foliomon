#!/bin/bash

# foliomonAppDir=/Users/jskarulis/eclipse-workspace/foliomon

# /usr/local/bin/node $foliomonAppDir/app.js

lsof -i :4000 -t | xargs kill

nodemon ../app.js