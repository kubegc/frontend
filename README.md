# kubernetes-frontend

Kubernetes-oriented Low-Code Platform using kube-backend to support various scenario, such as AppMgr, DevOps, FaaS，CMP, Edge.

This project assumes the following system are running

- [Kubernetes](https://github.com/kubernetes/kubernetes)  
- [kube-backend](https://github.com/kubesys/kube-backend)


# Quick start

you can use the follwing commands to install all required systems

```
// download tool
curl --url https://raw.githubusercontent.com/kubesys/installer/master/kubeinst --output /usr/bin/kubeinst
chmod 777 /usr/bin/kubeinst

kubeinst init-env                    // install docker and kubeadm
kubeinst init-kube                   // install Kubernetes using kubeadm
kubeinst init-backend                // install kube-backend
kubeinst init-frontend               // only install are required files 
```

then

```
git clone https://github.com/kubesys/kube-frontend
npm install
npm run dev
```

# Authors

- lichengzhi99@otcaix.iscas.ac.cn
- xuyuanjia2017@otcaix.iscas.ac.cn
- tangting18@otcaix.iscass.ac.cn
- wuheng@otcaix.iscas.ac.cn






