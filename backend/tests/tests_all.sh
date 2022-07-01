#!/bin/bash

#
# COMMENT OUT ANY TESTS THAT YOU DO NO WANT TO RUN.
#

# Make sure that we are in the same dir as this script.
BASEDIR=$(dirname $0)
cd $BASEDIR


# (NOTE: THIS WILL CLEAR AND RE-INIT THE DATABASE.)
php tests_re_init_db.php

# Run the PHP tests. 
php tests_php.php

# Run the NODE tests.
node tests_node.js

# Run the BASH CURL tests.
./tests_curl.sh 