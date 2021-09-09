# kubernetes-frontend

Kubernetes-oriented Low-Code Platform using kube-backend to support various scenario, such as AppMgr, DevOps, FaaS，CMP, Edge.

This project assumes the following system are running.

- [Kubernetes](https://github.com/kubernetes/kubernetes)  
- [kube-backend](https://github.com/kubesys/kube-backend)

If these componets are not working, using ['kubeinit'](https://github.com/kubesys/kube-installer) tool.

```
kubeinst init-env
kubeinst init-kube
kubeinst init-backend
kubeinst init-frontend
````

# Authors

- lichengzhi99@otcaix.iscas.ac.cn
- xuyuanjia2017@otcaix.iscas.ac.cn
- tangting18@otcaix.iscass.ac.cn
- wuheng@otcaix.iscas.ac.cn

# Quick start

- [install from scratch](#install_from_scratch)
- [just_install frontend](#just_install_frontend)
- [enjoy_frontend](#enjoy_frontend)


## install_from_scratch 

[required] download 'kubeinst' command

```
// download tool
curl --url https://gitee.com/syswu/kube-installer/raw/master/kubeinst --output /usr/bin/kubeinst
chmod 777 /usr/bin/kubeinst
```

[optional] if it is a VM with a public IP, open /usr/bin/kubeinst, and set fip='public ip'

[required] you can use the follwing commands to install all required systems

```
kubeinst init-env                    // install docker and kubeadm
kubeinst init-kube                   // install Kubernetes using kubeadm
kubeinst init-backend                // install kube-backend
kubeinst init-frontend               // install kube-frontend
```

## just_install_frontend


[required]  download this project 

```
git clone https://github.com/kubesys/kube-frontend
```

[required] open install.sh and set fip='ip'. If it is a VM with a public IP, the 'ip' is public ip; otherwise, it is the ip used by physical or virtual machines 


[required] deploy frontend 

```
bash install.sh
```

## enjoy_frontend

http://IP:30000 (admin/admin)

