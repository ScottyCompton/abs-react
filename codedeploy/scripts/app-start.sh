#!/usr/bin/env bash

cd /var/www/releases/americanbeautystar.com

MODE=$(cat deploy-mode)

cd /home/americanbeautystar.com/americanbeautystar.com

npm install

if [[ $MODE == "staging" ]]; then
  HOST=127.0.0.1 APIHOST=127.0.0.1 STAGING=true npm run build
	HOST=127.0.0.1 APIHOST=127.0.0.1 STAGING=true pm2 start npm -- start
else
  HOST=127.0.0.1 APIHOST=127.0.0.1 npm run build
	HOST=127.0.0.1 APIHOST=127.0.0.1 pm2 start npm -- start
fi

exit 0
