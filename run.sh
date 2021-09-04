#! /bin/bash
###############################################
##
##  Copyright (2020, ) Institute of Software
##      Chinese Academy of Sciences
##          wuheng@iscas.ac.cn
##
###############################################

# global

fip=""
config_dir="/var/lib/doslab/frontend"
config_name="config.js"

rm -rf $config_dir
mkdir -p $config_dir
echo "window.g = {" > $config_dir/$config_name
echo "    baseURL: 'http://$fip:30308/kubesys'" > $config_dir/$config_name
echo "window.g = }" > $config_dir/$config_name

frontend="kube-frontend"
dir="/opt/yamls"


## arch
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

## version
version=$(cat VERSION')

## dir
mkdir -p $dir
\cp yamls/$frontend.yaml $dir/$frontend.yaml

sed -i "s/#token#/$token/g" $dir/$frontend.yaml
sed -i "s/#version#/$version/g" $dir/$frontend.yaml

kubectl apply -f $dir/$frontend.yaml
