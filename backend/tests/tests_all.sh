#!/bin/bash

BASEDIR=$(dirname $0)
cd $BASEDIR

php tests_php.php
node tests_node.js
./tests_curl.sh 