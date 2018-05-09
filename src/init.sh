#!/usr/bin/env bash

cd `dirname $0`


# 第一步：安装依赖包

#echo $PWD

#sed -n '5,10p' package.json

read_packages () {
  FILE=$1
  PATTERN=$2

  BEGIN=`awk "/$PATTERN/{print NR}" $FILE`
  END=`sed -n $BEGIN,999p $FILE | awk '/}/{print NR; exit;}'`
#  echo $DEV_DEP_START,$DEV_DEP_END
  sed -n "$(($BEGIN + 1)),$(($BEGIN + $END - 3))p" $FILE \
  | awk '{gsub(/:/,"@")}{gsub(/[",]/,"")}{print $1$2}' \
  | paste -sd " " -
}

DEP=`read_packages ./package.json '"dependencies"'`
DEV_DEP=`read_packages ./package.json '"devDependencies"'`

cd ../../

#echo $PWD
#echo $DEP
#echo $DEV_DEP

npm i
npm i --save $DEP
npm i --save-dev $DEV_DEP
