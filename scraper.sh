#!/bin/bash
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

DIR="/var/log/uq-parking/"
FOREVER_LOG="service.log"
STDOUT="log.log"
STDERR="log.log"
PID="pid"

mkdir -p /var/log/uq-parking

if [ $1 = "stop" ]; then
    forever stop index.js
else
    forever start -l $DIR$FOREVER_LOG -o $DIR$STDOUT -e $DIR$STDERR --pidFile $DIR$PID index.js 
fi


