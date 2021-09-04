#! /bin/bash
###############################################
##
##  Copyright (2020, ) Institute of Software
##      Chinese Academy of Sciences
##          wuheng@iscas.ac.cn
##
###############################################


name="kube-frontend"
namespace="kube-system"

kubectl delete deploy $name -n $namespace
kubectl delete service $name -n $namespace
