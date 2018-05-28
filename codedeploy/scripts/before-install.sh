#!/usr/bin/env bash

echo $(pwd -P) > /tmp/before-install
rm -rf /var/www/releases/americanbeautystar.com/{,.[^.]}
exit 0
