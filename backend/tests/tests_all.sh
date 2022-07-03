#!/bin/bash

#
# COMMENT OUT ANY TESTS THAT YOU DO NO WANT TO RUN.
#

# Make sure that we are in the same dir as this script.
BASEDIR=$(dirname $0)
cd $BASEDIR

if [ -z "$1" ]; then
	echo "ERROR: You did not specify the config file.";
	exit;
fi
if [ -z "$2" ]; then
	echo "ERROR: You did not specify protocol (http or https.)";
	exit;
fi

# Run the PHP tests. 
php tests_php.php $1 $2

# Run the NODE tests.
node tests_node.js $1 $2

# Run the BASH CURL tests.
./tests_curl.sh $1 $2