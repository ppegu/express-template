#!/bin/bash

set -e


read -p "Project name : " name

./src/index.ts "$@" --name=$name 


exit_code=$?

if [ $exit_code -eq 0 ]; then 
 cd $name
 bun i
else
  echo "Error with exit code: $exit_code"
fi