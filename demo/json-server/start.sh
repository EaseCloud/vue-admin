#!/usr/bin/env bash

cd `dirname $0`
if [[ -z `which json-server` ]]; then
  sudo npm i -g json-server
fi
json-server --watch db.json --middleware middleware.js
