#! /bin/bash
###############################################
##
##  Copyright (2020, ) Institute of Software
##      Chinese Academy of Sciences
##          wuheng@iscas.ac.cn
##
###############################################


arch=""

if [[ $(arch) == "x86_64" ]]
then
  arch="amd64"
elif [[ $(arch) == "aarch64" ]]
then
  arch="arm64"
else
  echo "only support x86_64(amd64) and aarch64(arm64)"
  exit 1
fi

frontend="kube-frontend"
version=$(cat VERSION)

repo="registry.cn-beijing.aliyuncs.com/doslab"

docker build . -t $repo/$frontend:v$version-$arch

###############################################
##
##  local image to remote
##
###############################################

docker push  $repo/$frontend:v$version-$arch
