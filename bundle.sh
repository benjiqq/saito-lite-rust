#!/bin/sh

echo "ABOUT TO NODE WEBPACK!"
echo $1
echo $2
echo $3

node webpack.cjs $1 $2 $3

