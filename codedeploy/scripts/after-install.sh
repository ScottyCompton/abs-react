#!/usr/bin/env bash

cd /var/www/releases/americanbeautystar.com

HASH=$(cat commit)
GIT_URL=$(cat git-remote)
CLONE_PATH=/tmp/americanbeautystar.com

rm -rf $CLONE_PATH || true

/usr/bin/git clone $GIT_URL $CLONE_PATH

cd $CLONE_PATH

/usr/bin/git checkout $HASH

/usr/bin/rsync -va --exclude='.git' $CLONE_PATH/ /home/americanbeautystar.com/americanbeautystar.com/


chown -R americanbeautystar.com:americanbeautystar.com /var/www/html/americanbeautystar.com
chown -R americanbeautystar.com:americanbeautystar.com /var/www/html/americanbeautystar.com/*
chmod -R 0755 /var/www/html/americanbeautystar.com


exit 0
