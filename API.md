Warning: infinite loop forcom.github.kubesys.kubernetes.api.model.virtualmachine.Domain$Devices$Disk$BackingStore
Warning: infinite loop forcom.github.kubesys.kubernetes.api.model.virtualmachine.Domain$Devices$Disk$BackingStore
Warning: infinite loop forcom.github.kubesys.kubernetes.api.model.virtualmachine.Domain$Devices$Disk$BackingStore
Warning: infinite loop forcom.github.kubesys.kubernetes.api.model.virtualmachine.Domain$Devices$Disk$BackingStore
Warning: infinite loop forcom.github.kubesys.kubernetes.api.model.virtualmachine.Domain$Devices$Disk$BackingStore
Warning: infinite loop forcom.github.kubesys.kubernetes.api.model.virtualmachine.Domain$Devices$Disk$BackingStore
# 文档简介

	本文档用于说明基于Kubernetes的虚拟机生命周期如何管理, 项目地址：https://github.com/kubesys/kubeext-jdk.
	本文有两种通用的约束:
		(1)名称：只允许小写字母和、数字、中划线和圆点组合，4-100位
		(2)路径：必须是/xx/xx形式，且在/var/lib/libvirt、/mnt/localfs或/mnt/usb目录下，xx允许小写字母、数字、中划线和点，18-1024位


		(3)目前JDK提供的参数数量多余文档，以文档为准，其它为预留参数，传入会导致系统失败


# 1 VirtualMachine

虚拟机是指安装了OS的磁盘.VirtualMachine所有操作的返回值一样，见**[返回值]**

## 1.1 CreateAndStartVMFromISO(通过ISO装虚拟机)

**接口功能:**
	通过光驱安装云OS，光驱必须存在只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.CreateAndStartVMFromISO

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createAndStartVMFromISO.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createAndStartVMFromISO | CreateAndStartVMFromISO | true | 通过ISO装虚拟机 | 详细见下 |
| eventId | String | fasle | 事件ID | createAndStartVMFromISO.event.001 |

对象createAndStartVMFromISO参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| metadata|String|true|元数据|uuid=<UUID>，UUID是字符串类型，长度是12到36位，只允许数字、小写字母、中划线、以及圆点|uuid=950646e8-c17a-49d0-b83c-1c797811e001|
| livecd|String|false|安装操作系统时光驱是否属于livecd类型|取值范围：true/false|true|
| channel|String|true|管道|只允许数字、小写字母、中划线、以及圆点|uuid=950646e8-c17a-49d0-b83c-1c797811e001|
| graphics|String|true|虚拟机VNC/SPICE及其密码|取值范围：<vnc/spice,listen=0.0.0.0>,password=xxx（<必填>，选填），密码为4-16位，是小写字母、数字和中划线组合|vnc,listen=0.0.0.0,password=abcdefg|
| disk|String|true|虚拟机磁盘，包括硬盘和光驱|硬盘的约束：/var/lib/libvirt/images/test3.qcow2,target=hda,read_bytes_sec=1024000000,write_bytes_sec=1024000000，光驱的约束：/opt/ISO/CentOS-7-x86_64-Minimal-1511.iso,device=cdrom,perms=ro，支持多个硬盘，第一个硬盘无需添加--disk，后续的需要|/var/lib/libvirt/images/test3.qcow2,read_bytes_sec=1024000000,write_bytes_sec=1024000000 --disk /opt/ISO/CentOS-7-x86_64-Minimal-1511.iso,device=cdrom,perms=ro|
| memory|String|true|虚拟机内存大小，单位为MiB|取值范围：100~99999|2048|
| network|String|true|虚拟机网络|type=bridge（libvirt默认网桥virbr0）/ l2bridge（ovs网桥）/ l3bridge（支持ovn的ovs网桥），source=源网桥（必填），inbound=网络输入带宽QoS限制，单位为KiB，outbound=网络输出带宽QoS限制，单位为KiB，ip=IP地址（选填，只有type=l3bridge类型支持该参数），switch=ovn交换机名称（选填，只有type=l3bridge类型支持该参数），model=virtio/e1000/rtl8139（windows虚拟机），inbound=io入带宽，outbound=io出带宽，mac=mac地址（选填），参数顺序必须是type,source,ip,switch,model,inbound,outbound,mac|type=l3bridge,source=br-int,ip=192.168.5.9,switch=switch8888,model=e1000,inbound=102400,outbound=102400|
| virt_type|String|false|虚拟化类型|取值范围：kvm, xen|kvm|
| boot|String|false|设置启动顺序|hd|cdrom，分别表示硬盘和光驱启动|hd|
| redirdev|String|false|支持USB重定向|协议,类型=，服务器=IP：端口|usb,type=tcp,server=192.168.1.1:4000|
| os_variant|String|true|操作系统类型，如果不设置可能发生鼠标偏移等问题|参考https://tower.im/teams/616100/repository_documents/3550/|centos7.0|
| vcpus|String|true|虚拟机CPU个数，及其物理CPU绑定关系|0~100|2,cpuset=1-4|
| cdrom|String|false|虚拟机挂载的光驱，重启失效|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/ISO/CentOS-7-x86_64-Minimal-1511.iso|
| cputune|String|false|设置虚拟机CPU参数|参考virt-install中的--cputune参数|vcpupin0.vcpu=0|
| noautoconsole|Boolean|true|不自动连接到虚拟机终端，必须设置成true|true|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateAndStartVMFromISOspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.2 CreateAndStartVMFromImage(通过镜像复制虚拟机)

**接口功能:**
	通过虚拟机镜像VirtualMachineImage创建云OS只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.CreateAndStartVMFromImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createAndStartVMFromImage.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createAndStartVMFromImage | CreateAndStartVMFromImage | true | 通过镜像复制虚拟机 | 详细见下 |
| eventId | String | fasle | 事件ID | createAndStartVMFromImage.event.001 |

对象createAndStartVMFromImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| metadata|String|true|元数据|uuid=<UUID>，UUID是字符串类型，长度是12到36位，只允许数字、小写字母、中划线、以及圆点|uuid=950646e8-c17a-49d0-b83c-1c797811e001|
| livecd|String|false|安装操作系统时光驱是否属于livecd类型|取值范围：true/false|true|
| channel|String|true|管道|只允许数字、小写字母、中划线、以及圆点|uuid=950646e8-c17a-49d0-b83c-1c797811e001|
| graphics|String|true|虚拟机VNC/SPICE及其密码|取值范围：<vnc/spice,listen=0.0.0.0>,password=xxx（<必填>，选填），密码为4-16位，是小写字母、数字和中划线组合|vnc,listen=0.0.0.0,password=abcdefg|
| disk|String|true|虚拟机磁盘，包括硬盘和光驱|硬盘的约束：/var/lib/libvirt/images/test3.qcow2,target=hda,read_bytes_sec=1024000000,write_bytes_sec=1024000000，光驱的约束：/opt/ISO/CentOS-7-x86_64-Minimal-1511.iso,device=cdrom,perms=ro，支持多个硬盘，第一个硬盘无需添加--disk，后续的需要|/var/lib/libvirt/images/test3.qcow2,read_bytes_sec=1024000000,write_bytes_sec=1024000000 --disk /opt/ISO/CentOS-7-x86_64-Minimal-1511.iso,device=cdrom,perms=ro|
| memory|String|true|虚拟机内存大小，单位为MiB|取值范围：100~99999|2048|
| network|String|true|虚拟机网络|type=bridge（libvirt默认网桥virbr0）/ l2bridge（ovs网桥）/ l3bridge（支持ovn的ovs网桥），source=源网桥（必填），inbound=网络输入带宽QoS限制，单位为KiB，outbound=网络输出带宽QoS限制，单位为KiB，ip=IP地址（选填，只有type=l3bridge类型支持该参数），switch=ovn交换机名称（选填，只有type=l3bridge类型支持该参数），model=virtio/e1000/rtl8139（windows虚拟机），inbound=io入带宽，outbound=io出带宽，mac=mac地址（选填），参数顺序必须是type,source,ip,switch,model,inbound,outbound,mac|type=l3bridge,source=br-int,ip=192.168.5.9,switch=switch8888,model=e1000,inbound=102400,outbound=102400|
| virt_type|String|false|虚拟化类型|取值范围：kvm, xen|kvm|
| boot|String|false|设置启动顺序|hd|cdrom，分别表示硬盘和光驱启动|hd|
| redirdev|String|false|支持USB重定向|协议,类型=，服务器=IP：端口|usb,type=tcp,server=192.168.1.1:4000|
| os_variant|String|true|操作系统类型，如果不设置可能发生鼠标偏移等问题|参考https://tower.im/teams/616100/repository_documents/3550/|centos7.0|
| vcpus|String|true|虚拟机CPU个数，及其物理CPU绑定关系|0~100|2,cpuset=1-4|
| cdrom|String|false|虚拟机挂载的光驱，重启失效|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/ISO/CentOS-7-x86_64-Minimal-1511.iso|
| cputune|String|false|设置虚拟机CPU参数|参考virt-install中的--cputune参数|vcpupin0.vcpu=0|
| noautoconsole|Boolean|true|不自动连接到虚拟机终端，必须设置成true|true|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateAndStartVMFromImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.3 SuspendVM(暂停虚机)

**接口功能:**
	对运行的虚拟机进行暂停操作，已经暂停虚拟机执行暂停会报错只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.SuspendVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | suspendVM.name.001|
| suspendVM | SuspendVM | true | 暂停虚机 | 详细见下 |
| eventId | String | fasle | 事件ID | suspendVM.event.001 |

对象suspendVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看SuspendVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.4 StopVMForce(强制关机)

**接口功能:**
	强制关闭虚拟机，虚拟机在某些情况下无法关闭，本质相当于拔掉电源只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.StopVMForce

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | stopVMForce.name.001|
| stopVMForce | StopVMForce | true | 强制关机 | 详细见下 |
| eventId | String | fasle | 事件ID | stopVMForce.event.001 |

对象stopVMForce参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看StopVMForcespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.5 UnplugDevice(卸载设备)

**接口功能:**
	卸载GPU、云盘、网卡等资源，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.UnplugDevice

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | unplugDevice.name.001|
| unplugDevice | UnplugDevice | true | 卸载设备 | 详细见下 |
| eventId | String | fasle | 事件ID | unplugDevice.event.001 |

对象unplugDevice参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| persistent|Boolean|false|对配置进行持久化|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| file|String|true|设备xml文件，可以是GPU、硬盘、网卡、光驱等|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/unplug.xml|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看UnplugDevicespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.6 UnplugNIC(卸载网卡)

**接口功能:**
	卸载网卡，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.UnplugNIC

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | unplugNIC.name.001|
| unplugNIC | UnplugNIC | true | 卸载网卡 | 详细见下 |
| eventId | String | fasle | 事件ID | unplugNIC.event.001 |

对象unplugNIC参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| persistent|Boolean|false|对配置进行持久化|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| type|String|true|虚拟机网络类型|只能取值bridge，l2bridge，l3bridge. brdige表示libvirt自定义交换机，但不支持设置mac和IP等；l2bridge是Ovs交换机，虚拟机或获得与当前物理机网络一样的IP，但不能动态指定；l3bridge是基于gre或vxlan的，可设置mac和IP等|true|
| mac|String|true|mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看UnplugNICspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.7 MigrateVM(虚机迁移)

**接口功能:**
	虚拟机迁移，必须依赖共享存储，且所有物理机之间免密登陆只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.MigrateVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | migrateVM.name.001|
| migrateVM | MigrateVM | true | 虚机迁移 | 详细见下 |
| eventId | String | fasle | 事件ID | migrateVM.event.001 |

对象migrateVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| offline|Boolean|false|虚拟机关机迁移，关机时时必填|虚拟机关机迁移，关机时时必填|true|
| ip|String|true|目标主机服务地址，主机之间需要提前免密登录|目标主机的服务url，主机之间需要提前配置免密登录|133.133.135.31|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看MigrateVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.8 MigrateVMDisk(虚机存储迁移)

**接口功能:**
	虚拟机存储迁移，只支持冷迁，迁移之前虚拟机需要关机只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.MigrateVMDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | migrateVMDisk.name.001|
| migrateVMDisk | MigrateVMDisk | true | 虚机存储迁移 | 详细见下 |
| eventId | String | fasle | 事件ID | migrateVMDisk.event.001 |

对象migrateVMDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| ip|String|true|目标主机服务地址，主机之间需要提前免密登录|目标主机的服务url，主机之间需要提前配置免密登录|133.133.135.31|
| migratedisks|String|true|需要迁移的云盘和云盘要迁移到的存储池，必须遵守vol=disk1,pool=poolnfs1的格式，有多个要迁移的云盘需要用分号分割开，如vol=/var/lib/libvirt/cstor/pool1/pool1/disk1,pool=poolnfs1;vol=/var/lib/libvirt/cstor/pool2/pool2/disk2,pool=poolnfs2，目标存储池要在要迁移的目标节点。支持其他类型的存储到的文件类型存储的迁移，支持块设备到相同存储池uuid之间的迁移，不支持文件类型到块设备类型的迁移和块设备类型到其他uuid块设备存储的迁移。|云主机存储迁移|disk=/var/lib/libvirt/cstor/pool1/pool1/disk1,pool=poolnfs1;disk=/var/lib/libvirt/cstor/pool2/pool2/disk2,pool=poolnfs2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看MigrateVMDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.9 ChangeNumberOfCPU(CPU设置)

**接口功能:**
	修改虚拟机CPU个数只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ChangeNumberOfCPU

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | changeNumberOfCPU.name.001|
| changeNumberOfCPU | ChangeNumberOfCPU | true | CPU设置 | 详细见下 |
| eventId | String | fasle | 事件ID | changeNumberOfCPU.event.001 |

对象changeNumberOfCPU参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| hotpluggable|Boolean|false|对于开机虚拟机进行运行时插拔，与--live等价|true或者false|true|
| count|String|true|vcpu数量|1-100个|16|
| guest|Boolean|false|修改虚拟机CPU状态|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ChangeNumberOfCPUspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.10 ResumeVM(恢复虚机)

**接口功能:**
	恢复暂停的虚拟机，对运行的虚拟机执行恢复会报错只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ResumeVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | resumeVM.name.001|
| resumeVM | ResumeVM | true | 恢复虚机 | 详细见下 |
| eventId | String | fasle | 事件ID | resumeVM.event.001 |

对象resumeVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ResumeVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.11 PlugDisk(添加云盘)

**接口功能:**
	添加云盘，云盘必须通过CreateVirtualMachineDisk预先创建好只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage,或CreateVirtualMachineDisk

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.PlugDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | plugDisk.name.001|
| plugDisk | PlugDisk | true | 添加云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | plugDisk.event.001 |

对象plugDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| persistent|Boolean|false|对配置进行持久化|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| cache|String|false|云盘缓存类型|取值范围：none, writethrough, directsync, unsafe, writeback|none|
| sgio|String|false|云盘SCSI设备IO模式，默认值unfiltered|取值范围：unfiltered, filtered|unfiltered|
| source|String|true|云盘源路径|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/images/test1.qcow2|
| targetbus|String|false|虚拟的云盘总线类型，如果不填将根据target的取值自动匹配，例如vdX匹配为virtio类型的总线、sdX匹配为scsi类型的总线|取值范围：ide, scsi, virtio, xen, usb, sata, sd|virtio|
| type|String|false|云盘类型|取值范围：disk, lun, cdrom, floppy|disk|
| subdriver|String|false|云盘子驱动类型|取值范围：qcow2, raw|qcow2|
| target|String|true|目标盘符，对应虚拟机内看到的盘符号，其中vdX对应virtio支持的文件存储，hdX对应ide存储（如cdrom），sdX对应iscsi块存储|取值范围：vdX, hdX, sdX|vdc|
| mode|String|false|读写类型|取值范围：readonly, shareable|shareable|
| driver|String|false|云盘驱动类型|取值范围：qemu|qemu|
| sourcetype|String|false|云盘源类型|取值范围：file, block|file|
| total_bytes_sec|String|false|云盘总bps的QoS设置，单位为bytes，与read,write互斥|0~9999999999|1GiB: 1073741824|
| read_bytes_sec|String|false|云盘读bps的QoS设置，单位为bytes，与total互斥|0~9999999999|1GiB: 1073741824|
| write_bytes_sec|String|false|云盘写bps的QoS设置，单位为bytes，与total互斥|0~9999999999|1GiB: 1073741824|
| total_iops_sec|String|false|云盘总iops的QoS设置，单位为bytes，与read,write互斥|0~9999999999|1GiB: 1073741824|
| read_iops_sec|String|false|云盘读iops的QoS设置，与total互斥|0~99999|40000|
| write_iops_sec|String|false|云盘写iops的QoS设置，与total互斥|0~99999|40000|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看PlugDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.12 PlugDevice(添加设备)

**接口功能:**
	添加GPU、云盘、网卡等，这种方法相对于pluginDisk等可设置高级选项，如QoS只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.PlugDevice

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | plugDevice.name.001|
| plugDevice | PlugDevice | true | 添加设备 | 详细见下 |
| eventId | String | fasle | 事件ID | plugDevice.event.001 |

对象plugDevice参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| persistent|Boolean|false|对配置进行持久化|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| file|String|true|设备xml文件，可以是GPU、硬盘、网卡、光驱等|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/unplug.xml|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看PlugDevicespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.13 ResetVM(强制重启)

**接口功能:**
	强制重置虚拟机，即强制重启虚拟机只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ResetVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | resetVM.name.001|
| resetVM | ResetVM | true | 强制重启 | 详细见下 |
| eventId | String | fasle | 事件ID | resetVM.event.001 |

对象resetVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ResetVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.14 UnplugDisk(卸载云盘)

**接口功能:**
	卸载虚拟机云盘只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage,或CreateVirtualMachineDisk

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.UnplugDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | unplugDisk.name.001|
| unplugDisk | UnplugDisk | true | 卸载云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | unplugDisk.event.001 |

对象unplugDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| persistent|Boolean|false|对配置进行持久化|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| target|String|true|设备的目标，即在虚拟机中fdisk -l看到的硬盘标记|windows可适用hdx驱动，Linux可适用vdx驱动，x是指a,b,c,d可增长，但不能重名，disk具体是哪种target，以及适用了哪些target可以通过get方法获取进行分析|windows: hdb, Linux: vdb|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看UnplugDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.15 StopVM(虚机关机)

**接口功能:**
	关闭虚拟机，但不一定能关闭，如虚拟机中OS受损，对关闭虚拟机再执行关闭会报错只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.StopVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | stopVM.name.001|
| stopVM | StopVM | true | 虚机关机 | 详细见下 |
| eventId | String | fasle | 事件ID | stopVM.event.001 |

对象stopVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看StopVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.16 StartVM(启动虚机)

**接口功能:**
	启动虚拟机，能否正常启动取决于虚拟机OS是否受损，对运行虚拟机执行启动会报错只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.StartVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | startVM.name.001|
| startVM | StartVM | true | 启动虚机 | 详细见下 |
| eventId | String | fasle | 事件ID | startVM.event.001 |

对象startVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看StartVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.17 DeleteVM(删除虚机)

**接口功能:**
	删除虚拟机，需要先关闭虚拟机只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage或StopVM，或StopVMForce

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.DeleteVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteVM.name.001|
| deleteVM | DeleteVM | true | 删除虚机 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteVM.event.001 |

对象deleteVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| snapshots_metadata|Boolean|false|删除虚拟机所有快照，否则如果虚拟机还存在快照，会导致删除失败|true或者false|true|
| remove_all_storage|Boolean|false|是否删除虚拟机所有快照对应的磁盘存储|true或者false|true|
| storage|String|false|需要删除的虚拟机磁盘|约束：盘符,路径|vda,/var/lib/libvirt/images/disk1|
| nvram|Boolean|false|ARM架构机器需要添加此参数|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.18 RebootVM(虚机重启)

**接口功能:**
	重启虚拟机，能否正常重新启动取决于虚拟机OS是否受损只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.RebootVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | rebootVM.name.001|
| rebootVM | RebootVM | true | 虚机重启 | 详细见下 |
| eventId | String | fasle | 事件ID | rebootVM.event.001 |

对象rebootVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看RebootVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.19 PlugNIC(添加网卡)

**接口功能:**
	给虚拟机添加网卡只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.PlugNIC

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | plugNIC.name.001|
| plugNIC | PlugNIC | true | 添加网卡 | 详细见下 |
| eventId | String | fasle | 事件ID | plugNIC.event.001 |

对象plugNIC参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| persistent|Boolean|false|对配置进行持久化|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| inbound|String|false|网络输入带宽QoS限制，单位为KiB，示例参考https://libvirt.org/formatnetwork.html#elementQoS|0~99999999|1000MiB: 1024000|
| source|String|true|网络源设置|source=源网桥（必填，默认为virbr0, br-native, br-int，以及用户自己创建的任何两层bridge名称），ip=IP地址（选填，只有type=l3bridge类型支持该参数），switch=ovn交换机名称（选填，只有type=l3bridge类型支持该参数）,顺序必须是source,ip,switch|source=br-int,ip=192.168.5.2,switch=switch|
| type|String|true|网络源类型设置|取值范围：bridge（libvirt默认网桥virbr0）, l2bridge（ovs网桥）, l3bridge（支持ovn的ovs网桥）|bridge|
| mac|String|true|mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
| outbound|String|false|网络输出带宽QoS限制，单位为KiB，示例参考https://libvirt.org/formatnetwork.html#elementQoS|0~99999999|1000MiB: 1024000|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看PlugNICspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.20 ManageISO(插拔光驱)

**接口功能:**
	插入或者拔出光驱只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage或plugDevice

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ManageISO

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | manageISO.name.001|
| manageISO | ManageISO | true | 插拔光驱 | 详细见下 |
| eventId | String | fasle | 事件ID | manageISO.event.001 |

对象manageISO参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| path|String|true|目标盘符，对应虚拟机内看到的盘符号|取值范围：vdX, hdX, sdX|vdc|
| source|String|true|模板虚拟机的路径|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/target.iso|
| eject|Boolean|true|弹出光驱，与--insert不可同时设置为true|true或者false|true|
| insert|Boolean|true|插入光驱|true或者false|true|
| update|Boolean|true|更新操作|true或者false|true|
| force|Boolean|true|强制执行|true或者false|true|
| block|Boolean|true|如果适用物理机光驱，应该设置为true|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ManageISOspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.21 UpdateOS(更换OS)

**接口功能:**
	更换云主机的OS，云主机必须关机只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.UpdateOS

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | updateOS.name.001|
| updateOS | UpdateOS | true | 更换OS | 详细见下 |
| eventId | String | fasle | 事件ID | updateOS.event.001 |

对象updateOS参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| source|String|true|需要被替换的虚拟机路径|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/source.xml|
| target|String|true|模板虚拟机的路径|路径是字符串类型，长度是2到64位，只允许数字、小写字母、中划线、以及圆点|/var/lib/libvirt/target.xml|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看UpdateOSspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.22 ConvertVMToImage(转化模板)

**接口功能:**
	转化为虚拟机镜像只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ConvertVMToImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | convertVMToImage.name.001|
| convertVMToImage | ConvertVMToImage | true | 转化模板 | 详细见下 |
| eventId | String | fasle | 事件ID | convertVMToImage.event.001 |

对象convertVMToImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| targetPool|String|true|目标存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ConvertVMToImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.23 InsertISO(插入光驱)

**接口功能:**
	插入只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage或plugDevice

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.InsertISO

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | insertISO.name.001|
| insertISO | InsertISO | true | 插入光驱 | 详细见下 |
| eventId | String | fasle | 事件ID | insertISO.event.001 |

对象insertISO参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| path|String|true|模板虚拟机的路径|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/target.iso|
| insert|Boolean|true|插入光驱|true或者false|true|
| force|Boolean|true|强制执行|true或者false|true|
| block|Boolean|true|如果适用物理机光驱，应该设置为true|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看InsertISOspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.24 EjectISO(拔出光驱)

**接口功能:**
	拔出光驱只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage或plugDevice

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.EjectISO

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | ejectISO.name.001|
| ejectISO | EjectISO | true | 拔出光驱 | 详细见下 |
| eventId | String | fasle | 事件ID | ejectISO.event.001 |

对象ejectISO参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| path|String|true|模板虚拟机的路径|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/target.iso|
| eject|Boolean|true|弹出光驱，与--insert不可同时设置为true|true或者false|true|
| force|Boolean|true|强制执行|true或者false|true|
| block|Boolean|true|如果适用物理机光驱，应该设置为true|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看EjectISOspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.25 ResizeVM(调整磁盘)

**接口功能:**
	调整虚拟机大小，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ResizeVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | resizeVM.name.001|
| resizeVM | ResizeVM | true | 调整磁盘 | 详细见下 |
| eventId | String | fasle | 事件ID | resizeVM.event.001 |

对象resizeVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| path|String|true|虚拟机路径|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/images/test1.qcow2|
| size|String|true|虚拟机大小, 1G到1T|1000000-999999999999（单位：KiB）|‭10,737,418,240‬|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ResizeVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.26 CloneVM(克隆虚机)

**接口功能:**
	克隆虚拟机，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.CloneVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | cloneVM.name.001|
| cloneVM | CloneVM | true | 克隆虚机 | 详细见下 |
| eventId | String | fasle | 事件ID | cloneVM.event.001 |

对象cloneVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| name|String|true|克隆虚拟机的名称|新虚拟机名长度是4到100位|newvm|
| file|String|false|新磁盘路径，多个路径用多个--file标识|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/images/test1.qcow2 --file /var/lib/libvirt/images/test2.qcow2|
| preserve_data|Boolean|false|不克隆存储，通过 --file 参数指定的新磁盘镜像将保留不变|true或者false|true|
| mac|String|false|网卡的mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
| nonsparse|Boolean|false|不使用稀疏文件作为克隆的磁盘镜像|true或者false|false|
| auto_clone|Boolean|false|从原始客户机配置中自动生成克隆名称和存储路径|true或者false|false|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CloneVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.27 TuneDiskQoS(磁盘QoS)

**接口功能:**
	设置虚拟机磁盘QoS，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.TuneDiskQoS

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | tuneDiskQoS.name.001|
| tuneDiskQoS | TuneDiskQoS | true | 磁盘QoS | 详细见下 |
| eventId | String | fasle | 事件ID | tuneDiskQoS.event.001 |

对象tuneDiskQoS参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| device|String|true|虚拟机磁盘的盘符号，对应虚拟机内看到的盘符号|取值范围：vdX, hdX, sdX|vdc|
| total_bytes_sec|String|false|云盘总bps的QoS设置，单位为bytes，与read,write互斥|0~9999999999|1GiB: 1073741824|
| read_bytes_sec|String|false|云盘读bps的QoS设置，单位为bytes，与total互斥|0~9999999999|1GiB: 1073741824|
| write_bytes_sec|String|false|云盘写bps的QoS设置，单位为bytes，与total互斥|0~9999999999|1GiB: 1073741824|
| total_iops_sec|String|false|云盘总iops的QoS设置，单位为bytes，与read,write互斥|0~9999999999|1GiB: 1073741824|
| read_iops_sec|String|false|云盘读iops的QoS设置，与total互斥|0~99999|40000|
| write_iops_sec|String|false|云盘写iops的QoS设置，与total互斥|0~99999|40000|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看TuneDiskQoSspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.28 TuneNICQoS(网卡QoS)

**接口功能:**
	设置虚拟机网卡QoS，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.TuneNICQoS

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | tuneNICQoS.name.001|
| tuneNICQoS | TuneNICQoS | true | 网卡QoS | 详细见下 |
| eventId | String | fasle | 事件ID | tuneNICQoS.event.001 |

对象tuneNICQoS参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| inbound|String|false|网络输入带宽QoS限制，单位为KiB，示例参考https://libvirt.org/formatnetwork.html#elementQoS|0~99999999|1000MiB: 1024000|
| _interface|String|true|网卡的mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
| outbound|String|false|网络输出带宽QoS限制，单位为KiB，示例参考https://libvirt.org/formatnetwork.html#elementQoS|0~99999999|1000MiB: 1024000|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看TuneNICQoSspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.29 ResizeMaxRAM(设置虚拟机最大内存)

**接口功能:**
	设置虚拟机最大内存，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ResizeMaxRAM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | resizeMaxRAM.name.001|
| resizeMaxRAM | ResizeMaxRAM | true | 设置虚拟机最大内存 | 详细见下 |
| eventId | String | fasle | 事件ID | resizeMaxRAM.event.001 |

对象resizeMaxRAM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| size|String|true|内存大小，单位为KiB|100MiB到100GiB|1GiB: 1048576|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|本次生效，如果虚拟机开机状态使用|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ResizeMaxRAMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.30 SetBootOrder(启动顺序)

**接口功能:**
	设置虚拟机启动顺序，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.SetBootOrder

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | setBootOrder.name.001|
| setBootOrder | SetBootOrder | true | 启动顺序 | 详细见下 |
| eventId | String | fasle | 事件ID | setBootOrder.event.001 |

对象setBootOrder参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| order|String|true|虚拟机启动顺序，从光盘或者系统盘启动，启动顺序用逗号分隔，对于开机虚拟机重启后生效|取值范围：vdX, hdX, sdX|hda,vda|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看SetBootOrderspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.31 SetVncPassword(设置VNC密码)

**接口功能:**
	设置虚拟机VNC密码，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.SetVncPassword

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | setVncPassword.name.001|
| setVncPassword | SetVncPassword | true | 设置VNC密码 | 详细见下 |
| eventId | String | fasle | 事件ID | setVncPassword.event.001 |

对象setVncPassword参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| persistent|Boolean|false|对配置进行持久化|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| force|Boolean|false|强制执行|true或者false|true|
| password|String|true|虚拟机终端密码|取值范围：密码为4-16位，是小写字母、数字和中划线组合|abcdefg|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看SetVncPasswordspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.32 UnsetVncPassword(取消VNC密码)

**接口功能:**
	取消虚拟机VNC密码，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.UnsetVncPassword

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | unsetVncPassword.name.001|
| unsetVncPassword | UnsetVncPassword | true | 取消VNC密码 | 详细见下 |
| eventId | String | fasle | 事件ID | unsetVncPassword.event.001 |

对象unsetVncPassword参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| persistent|Boolean|false|对配置进行持久化|true或者false|true|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| force|Boolean|false|强制执行|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看UnsetVncPasswordspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.33 SetGuestPassword(虚机密码)

**接口功能:**
	设置虚拟机密码，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.SetGuestPassword

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | setGuestPassword.name.001|
| setGuestPassword | SetGuestPassword | true | 虚机密码 | 详细见下 |
| eventId | String | fasle | 事件ID | setGuestPassword.event.001 |

对象setGuestPassword参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| os_type|String|true|虚拟机操作系统类型|取值范围：windows/linux|linux|
| user|String|true|虚拟机登录用户|名称是字符串类型，长度是4到100位，只允许数字、小写字母、中划线、以及圆点|root|
| password|String|true|虚拟机密码|取值范围：密码为4-16位，是小写字母、数字和中划线组合|abcdefg|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看SetGuestPasswordspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.34 InjectSshKey(虚机ssh key)

**接口功能:**
	注入虚拟机ssh key，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.InjectSshKey

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | injectSshKey.name.001|
| injectSshKey | InjectSshKey | true | 虚机ssh key | 详细见下 |
| eventId | String | fasle | 事件ID | injectSshKey.event.001 |

对象injectSshKey参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| os_type|String|true|虚拟机操作系统类型|取值范围：windows/linux|linux|
| user|String|true|虚拟机登录用户|名称是字符串类型，长度是4到100位，只允许数字、小写字母、中划线、以及圆点|root|
| ssh_key|String|true|ssh登录公钥|取值范围：只允许数字、大小写字母、空格、-+/@|ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC9kyC1EUvxppNqYSr8mh8GIC9VBk0IdL7t+Y4dp5vcyKO+Qtx4W9mRdQ8aPuEVAxSfjDsbpfyW1O/cPUbCJJZR9Gg9FYL63V8Q97UN3V4i/ILUMTazF+MfN82ln80PQhCv0SQwfx9qsAmhmVvukPDESr2i2TO93SiY15dh1niX8AeptfXfAZWg+zJA5gIdov1u88IE1xIPjhytUCnGPJNW0kvqJzRsCSzDY7puYXO7mWRuDYpHV7VZp0qYX9urrQB+YPzIP3UBC6VbhpapRLtir8whzFCu0MKTXjzzE7h++DiTaqLMtQIfuXHKgMTA39wnQPuqnf7Q/hbm9qYMCauf root@node22|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看InjectSshKeyspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.35 ResizeRAM(内存扩容)

**接口功能:**
	对虚拟机内存扩容，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ResizeRAM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | resizeRAM.name.001|
| resizeRAM | ResizeRAM | true | 内存扩容 | 详细见下 |
| eventId | String | fasle | 事件ID | resizeRAM.event.001 |

对象resizeRAM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| current|Boolean|false|对当前虚拟机生效|true或者false|true|
| size|String|true|内存大小，单位为KiB|100MiB到100GiB|1GiB: 1048576|
| config|Boolean|false|如果不设置，当前配置下次不会生效|true或者false|true|
| live|Boolean|false|本次生效，如果虚拟机开机状态使用|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ResizeRAMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.36 BindFloatingIP(绑定浮动IP)

**接口功能:**
	适用浮动和虚拟IP场景，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.BindFloatingIP

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | bindFloatingIP.name.001|
| bindFloatingIP | BindFloatingIP | true | 绑定浮动IP | 详细见下 |
| eventId | String | fasle | 事件ID | bindFloatingIP.event.001 |

对象bindFloatingIP参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| swName|String|true|交换机名|名称是字符串类型，长度是4到100位，只允许数字、小写字母、中划线、以及圆点|switch11|
| outSwName|String|true|外部交换机名|名称是字符串类型，长度是4到100位，只允许数字、小写字母、中划线、以及圆点|switch11|
| fip|String|true|外网IP，以及子网掩码|x.x.x.x,x取值范围0到255|192.168.5.2/24|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看BindFloatingIPspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.37 UnbindFloatingIP(解绑浮动IP)

**接口功能:**
	适用浮动和虚拟IP场景，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.UnbindFloatingIP

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | unbindFloatingIP.name.001|
| unbindFloatingIP | UnbindFloatingIP | true | 解绑浮动IP | 详细见下 |
| eventId | String | fasle | 事件ID | unbindFloatingIP.event.001 |

对象unbindFloatingIP参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| swName|String|true|交换机名|名称是字符串类型，长度是4到100位，只允许数字、小写字母、中划线、以及圆点|switch11|
| vmmac|String|true|虚拟机mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
| fip|String|true|外网IP|x.x.x.x,x取值范围0到255|192.168.5.2|
| vmip|String|true|虚拟机IP|x.x.x.x,x取值范围0到255|192.168.5.2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看UnbindFloatingIPspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.38 AddACL(创建安全组)

**接口功能:**
	创建安全规则，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.AddACL

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | addACL.name.001|
| addACL | AddACL | true | 创建安全组 | 详细见下 |
| eventId | String | fasle | 事件ID | addACL.event.001 |

对象addACL参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| swName|String|true|交换机名|名称是字符串类型，长度是4到100位，只允许数字、小写字母、中划线、以及圆点|switch11|
| vmmac|String|true|虚拟机mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
| type|String|true|ACL类型|from或者to|from|
| rule|String|true|ACL规则|&&连接两个规则，注意src和dst后==前后必须有一个空格|ip4.src == $dmz && tcp.dst == 3306|
| operator|String|true|ACL操作|allow或者drop|allow|
| priority|String|false|优先级|1-999|1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看AddACLspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.39 ModifyACL(修改安全组)

**接口功能:**
	修改安全规则，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ModifyACL

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | modifyACL.name.001|
| modifyACL | ModifyACL | true | 修改安全组 | 详细见下 |
| eventId | String | fasle | 事件ID | modifyACL.event.001 |

对象modifyACL参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| swName|String|true|交换机名|名称是字符串类型，长度是4到100位，只允许数字、小写字母、中划线、以及圆点|switch11|
| vmmac|String|true|虚拟机mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
| type|String|true|ACL类型|from或者to|from|
| rule|String|true|ACL规则|&&连接两个规则，注意src和dst后==前后必须有一个空格|ip4.src == $dmz && tcp.dst == 3306|
| operator|String|true|ACL操作|allow或者drop|allow|
| priority|String|false|优先级|1-999|1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ModifyACLspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.40 DeprecatedACL(删除安全组)

**接口功能:**
	删除安全规则，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.DeprecatedACL

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deprecatedACL.name.001|
| deprecatedACL | DeprecatedACL | true | 删除安全组 | 详细见下 |
| eventId | String | fasle | 事件ID | deprecatedACL.event.001 |

对象deprecatedACL参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| swName|String|true|交换机名|名称是字符串类型，长度是4到100位，只允许数字、小写字母、中划线、以及圆点|switch11|
| vmmac|String|true|虚拟机mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
| type|String|false|ACL类型|from或者to|from|
| rule|String|false|ACL规则|&&连接两个规则，注意src和dst后==前后必须有一个空格|ip4.src == $dmz && tcp.dst == 3306|
| priority|String|false|优先级|1-999|1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeprecatedACLspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.41 BatchDeprecatedACL(批量删除安全组)

**接口功能:**
	删除安全规则，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.BatchDeprecatedACL

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | batchDeprecatedACL.name.001|
| batchDeprecatedACL | BatchDeprecatedACL | true | 批量删除安全组 | 详细见下 |
| eventId | String | fasle | 事件ID | batchDeprecatedACL.event.001 |

对象batchDeprecatedACL参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看BatchDeprecatedACLspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.42 SetQoS(设置QoS)

**接口功能:**
	设置QoS，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.SetQoS

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | setQoS.name.001|
| setQoS | SetQoS | true | 设置QoS | 详细见下 |
| eventId | String | fasle | 事件ID | setQoS.event.001 |

对象setQoS参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| swName|String|true|交换机名|交换机名|switch1|
| type|String|true|QoS类型|from或者to|from|
| rule|String|true|协议类型|只能是ip, ip4, icmp之类|ip|
| rate|String|true|带宽速度|单位是kbps, 0-1000Mbps|10000|
| burst|String|true|带宽波动|单位是kbps, 0-100Mbps|100|
| priority|String|false|优先级|0-32767|2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看SetQoSspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.43 ModifyQoS(修改QoS)

**接口功能:**
	修改QoS，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ModifyQoS

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | modifyQoS.name.001|
| modifyQoS | ModifyQoS | true | 修改QoS | 详细见下 |
| eventId | String | fasle | 事件ID | modifyQoS.event.001 |

对象modifyQoS参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| swName|String|true|交换机名|交换机名|switch1|
| type|String|true|QoS类型|from或者to|from|
| rule|String|true|协议类型|只能是ip, ip4, icmp之类|ip|
| rate|String|true|带宽速度|单位是kbps, 0-1000Mbps|10000|
| burst|String|true|带宽波动|单位是kbps, 0-100Mbps|100|
| priority|String|false|优先级|0-32767|2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ModifyQoSspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.44 UnsetQoS(删除QoS)

**接口功能:**
	删除QoS，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.UnsetQoS

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | unsetQoS.name.001|
| unsetQoS | UnsetQoS | true | 删除QoS | 详细见下 |
| eventId | String | fasle | 事件ID | unsetQoS.event.001 |

对象unsetQoS参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| swName|String|true|交换机名|交换机名|switch1|
| type|String|true|QoS类型|from或者to|from|
| rule|String|true|协议类型|只能是ip, ip4, icmp之类|ip|
| priority|String|true|优先级|0-32767|2|
| vmmac|String|true|mac地址|虚拟机的mac地址|7e:0c:b0:ef:6a:04|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看UnsetQoSspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.45 ExportVM(导出虚拟机)

**接口功能:**
	导出虚拟机，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.ExportVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | exportVM.name.001|
| exportVM | ExportVM | true | 导出虚拟机 | 详细见下 |
| eventId | String | fasle | 事件ID | exportVM.event.001 |

对象exportVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| path|String|true|导出文件保存的路径|/root|from|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ExportVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.46 BackupVM(备份虚拟机)

**接口功能:**
	备份虚拟机，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.BackupVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | backupVM.name.001|
| backupVM | BackupVM | true | 备份虚拟机 | 详细见下 |
| eventId | String | fasle | 事件ID | backupVM.event.001 |

对象backupVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| pool|String|true|备份主机使用的存储池|备份主机使用的存储池|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| all|boolean|false|备份虚拟机所有的盘，否则只备份系统盘，需要注意的是恢复带有数据云盘的记录时，数据云盘必须还挂载在该虚拟机上|备份虚拟机所有的盘，否则只备份系统盘，需要注意的是恢复带有数据云盘的记录时，数据云盘必须还挂载在该虚拟机上|true|
| full|boolean|false|全量备份|全量备份|true|
| remote|String|false|远程备份的ftp主机ip|远程备份的ftp主机ip|172.16.1.214|
| port|String|false|远程备份的ftp主机端口|远程备份的ftp主机端口|21|
| username|String|false|远程备份的ftp用户名|ftpuser|ftpuser|
| password|String|false|远程备份的ftp密码|ftpuser|ftpuser|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看BackupVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.47 RestoreVM(恢复虚拟机)

**接口功能:**
	恢复虚拟机，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.RestoreVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | restoreVM.name.001|
| restoreVM | RestoreVM | true | 恢复虚拟机 | 详细见下 |
| eventId | String | fasle | 事件ID | restoreVM.event.001 |

对象restoreVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| pool|String|true|备份主机使用的存储池|备份主机使用的存储池|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| all|boolean|false|备份虚拟机所有的盘，否则只备份系统盘，需要注意的是恢复带有数据云盘的记录时，数据云盘必须还挂载在该虚拟机上|备份虚拟机所有的盘，否则只备份系统盘，需要注意的是恢复带有数据云盘的记录时，数据云盘必须还挂载在该虚拟机上|true|
| newname|String|false|新建虚拟机的名字|新建虚拟机的名字|13024b305b5c463b80bceee066077079|
| target|String|false|新建虚拟机时所使用的存储池|新建虚拟机所使用的存储池|13024b305b5c463b80bceee066077079|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看RestoreVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.48 DeleteRemoteBackup(删除远程备份)

**接口功能:**
	删除远程备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.DeleteRemoteBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteRemoteBackup.name.001|
| deleteRemoteBackup | DeleteRemoteBackup | true | 删除远程备份 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteRemoteBackup.event.001 |

对象deleteRemoteBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| vol|String|false|仅删除该云主机的云盘备份|仅删除该云主机的云盘备份|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| remote|String|false|远程备份的ftp主机ip|远程备份的ftp主机ip|172.16.1.214|
| port|String|false|远程备份的ftp主机端口|远程备份的ftp主机端口|21|
| username|String|false|远程备份的ftp用户名|ftpuser|ftpuser|
| password|String|false|远程备份的ftp密码|ftpuser|ftpuser|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteRemoteBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.49 PullRemoteBackup(拉取远程备份)

**接口功能:**
	拉取远程备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.PullRemoteBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | pullRemoteBackup.name.001|
| pullRemoteBackup | PullRemoteBackup | true | 拉取远程备份 | 详细见下 |
| eventId | String | fasle | 事件ID | pullRemoteBackup.event.001 |

对象pullRemoteBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| pool|String|true|拉取备份后使用的存储池|拉取备份后使用的存储池|61024b305b5c463b80bceee066077079|
| vol|String|false|仅拉取该云主机的云盘备份|仅拉取云盘备份|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| remote|String|true|远程备份的ftp主机ip|远程备份的ftp主机ip|172.16.1.214|
| port|String|true|远程备份的ftp主机端口|远程备份的ftp主机端口|21|
| username|String|true|远程备份的ftp用户名|ftpuser|ftpuser|
| password|String|true|远程备份的ftp密码|ftpuser|ftpuser|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看PullRemoteBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.50 PushRemoteBackup(上传备份)

**接口功能:**
	上传备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.PushRemoteBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | pushRemoteBackup.name.001|
| pushRemoteBackup | PushRemoteBackup | true | 上传备份 | 详细见下 |
| eventId | String | fasle | 事件ID | pushRemoteBackup.event.001 |

对象pushRemoteBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| pool|String|true|备份使用的存储池|备份使用的存储池|61024b305b5c463b80bceee066077079|
| vol|String|false|仅上传该云主机的云盘备份|仅上传该云主机的云盘备份|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| remote|String|true|远程备份的ftp主机ip|远程备份的ftp主机ip|172.16.1.214|
| port|String|true|远程备份的ftp主机端口|远程备份的ftp主机端口|21|
| username|String|true|远程备份的ftp用户名|ftpuser|ftpuser|
| password|String|true|远程备份的ftp密码|ftpuser|ftpuser|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看PushRemoteBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.51 DeleteVMBackup(删除本地备份)

**接口功能:**
	删除本地备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.DeleteVMBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteVMBackup.name.001|
| deleteVMBackup | DeleteVMBackup | true | 删除本地备份 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteVMBackup.event.001 |

对象deleteVMBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| pool|String|true|备份主机使用的存储池|备份主机使用的存储池|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteVMBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.52 PassthroughDevice(设备透传)

**接口功能:**
	设备透传，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.PassthroughDevice

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | passthroughDevice.name.001|
| passthroughDevice | PassthroughDevice | true | 设备透传 | 详细见下 |
| eventId | String | fasle | 事件ID | passthroughDevice.event.001 |

对象passthroughDevice参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| action|String|true|执行的操作|添加或删除：add/remove|add|
| bus_num|String|true|物理主机上的bus号，例如01:00.0中的01|用lsusb/lspci命令查询的bus号|01|
| sub_bus_num|String|true|（仅影响PCI设备）物理主机上的副bus号，例如01:00.0中的00|用lsusb/lspci命令查询的副bus号|00|
| dev_num|String|true|物理主机上的设备号，例如01:00.0中的0|用lsusb/lspci命令查询的device号|0|
| live|Boolean|false|立即生效，对于开机虚拟机|true或者false|true|
| dev_type|String|true|设备的类型|取值范围：usb/pci|pci|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看PassthroughDevicespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.53 RedirectUsb(usb重定向，需搭配SPICE终端使用)

**接口功能:**
	usb重定向，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.RedirectUsb

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | redirectUsb.name.001|
| redirectUsb | RedirectUsb | true | usb重定向，需搭配SPICE终端使用 | 详细见下 |
| eventId | String | fasle | 事件ID | redirectUsb.event.001 |

对象redirectUsb参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| action|String|true|执行的操作，对于开机虚拟机重启后生效|开启或关闭：on/off|on|
| number|String|false|开启usb透传时，设置虚拟机可透传的usb个数，默认4个|取值范围：0~8|4|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看RedirectUsbspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.54 UpdateGraphic(更新虚拟机远程终端)

**接口功能:**
	更新虚拟机远程终端，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.UpdateGraphic

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | updateGraphic.name.001|
| updateGraphic | UpdateGraphic | true | 更新虚拟机远程终端 | 详细见下 |
| eventId | String | fasle | 事件ID | updateGraphic.event.001 |

对象updateGraphic参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| password|String|false|修改虚拟机终端密码，运行虚拟机重启后生效|取值范围：密码为4-16位，是小写字母、数字和中划线组合|abcdefg|
| no_password|Boolean|false|取消虚拟机终端密码，运行虚拟机重启后生效|true或者false|true|
| type|String|true|修改虚拟机终端类型，运行虚拟机重启后生效|取值范围：vnc/spice|spice|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看UpdateGraphicspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 1.55 AutoStartVM(设置虚拟机高可用，对于正在运行的虚拟机重启后生效)

**接口功能:**
	设置虚拟机高可用，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachine.Lifecycle.AutoStartVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | autoStartVM.name.001|
| autoStartVM | AutoStartVM | true | 设置虚拟机高可用，对于正在运行的虚拟机重启后生效 | 详细见下 |
| eventId | String | fasle | 事件ID | autoStartVM.event.001 |

对象autoStartVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| disable|Boolean|false|取消虚拟机高可用|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看AutoStartVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## **返回值:**

```
{
	"kind":"VirtualMachine",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"domain":{
			"_id":"String",
			"_type":"String",
			"blkiotune":{
				"device":[
					{
						"path":{
							"text":"String"
						},
						"read_bytes_sec":{
							"text":"String"
						},
						"read_iops_sec":{
							"text":"String"
						},
						"weight":{
							"text":"String"
						},
						"write_bytes_sec":{
							"text":"String"
						},
						"write_iops_sec":{
							"text":"String"
						}
					},
					{
						"path":{
							"text":"String"
						},
						"read_bytes_sec":{
							"text":"String"
						},
						"read_iops_sec":{
							"text":"String"
						},
						"weight":{
							"text":"String"
						},
						"write_bytes_sec":{
							"text":"String"
						},
						"write_iops_sec":{
							"text":"String"
						}
					}
				],
				"weight":{
					"text":"String"
				}
			},
			"bootloader":{
				"text":"String"
			},
			"bootloader_args":{
				"text":"String"
			},
			"clock":{
				"_adjustment":"String",
				"_basis":"String",
				"_offset":"String",
				"_timezone":"String",
				"timer":[
					{
						"_frequency":"String",
						"_mode":"String",
						"_name":"String",
						"_present":"String",
						"_tickpolicy":"String",
						"_track":"String",
						"catchup":{
							"_limit":"String",
							"_slew":"String",
							"_threshold":"String"
						}
					},
					{
						"_frequency":"String",
						"_mode":"String",
						"_name":"String",
						"_present":"String",
						"_tickpolicy":"String",
						"_track":"String",
						"catchup":{
							"_limit":"String",
							"_slew":"String",
							"_threshold":"String"
						}
					}
				]
			},
			"cpu":{
				"_check":"String",
				"_match":"String",
				"_mode":"String",
				"cache":{
					"_level":"String",
					"_mode":"String"
				},
				"feature":[
					{
						"_name":"String",
						"_policy":"String"
					},
					{
						"_name":"String",
						"_policy":"String"
					}
				],
				"model":{
					"_fallback":"String",
					"_vendor_id":"String",
					"text":"String"
				},
				"numa":{
					"cell":[
						{
							"_cpus":"String",
							"_discard":"String",
							"_id":"String",
							"_memAccess":"String",
							"_memory":"String",
							"_unit":"String",
							"distances":{
								"sibling":[
									{
										"_id":"String",
										"_value":"String"
									},
									{
										"_id":"String",
										"_value":"String"
									}
								]
							}
						},
						{
							"_cpus":"String",
							"_discard":"String",
							"_id":"String",
							"_memAccess":"String",
							"_memory":"String",
							"_unit":"String",
							"distances":{
								"sibling":[
									{
										"_id":"String",
										"_value":"String"
									},
									{
										"_id":"String",
										"_value":"String"
									}
								]
							}
						}
					]
				},
				"topology":{
					"_cores":"String",
					"_sockets":"String",
					"_threads":"String"
				},
				"vendor":{
					"text":"String"
				}
			},
			"cputune":{
				"cachetune":[
					{
						"_vcpus":"String",
						"cache":[
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							},
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							}
						],
						"monitor":[
							{
								"_level":"String",
								"_vcpus":"String"
							},
							{
								"_level":"String",
								"_vcpus":"String"
							}
						]
					},
					{
						"_vcpus":"String",
						"cache":[
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							},
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							}
						],
						"monitor":[
							{
								"_level":"String",
								"_vcpus":"String"
							},
							{
								"_level":"String",
								"_vcpus":"String"
							}
						]
					}
				],
				"emulator_period":{
					"text":"String"
				},
				"emulator_quota":{
					"text":"String"
				},
				"emulatorpin":{
					"_cpuset":"String"
				},
				"global_period":{
					"text":"String"
				},
				"global_quota":{
					"text":"String"
				},
				"iothread_period":{
					"text":"String"
				},
				"iothread_quota":{
					"text":"String"
				},
				"iothreadpin":[
					{
						"_cpuset":"String",
						"_iothread":"String"
					},
					{
						"_cpuset":"String",
						"_iothread":"String"
					}
				],
				"iothreadsched":[
					{
						"_iothreads":"String",
						"_priority":"String",
						"_scheduler":"String"
					},
					{
						"_iothreads":"String",
						"_priority":"String",
						"_scheduler":"String"
					}
				],
				"memorytune":[
					{
						"_vcpus":"String",
						"node":[
							{
								"_bandwidth":"String",
								"_id":"String"
							},
							{
								"_bandwidth":"String",
								"_id":"String"
							}
						]
					},
					{
						"_vcpus":"String",
						"node":[
							{
								"_bandwidth":"String",
								"_id":"String"
							},
							{
								"_bandwidth":"String",
								"_id":"String"
							}
						]
					}
				],
				"period":{
					"text":"String"
				},
				"quota":{
					"text":"String"
				},
				"shares":{
					"text":"String"
				},
				"vcpupin":[
					{
						"_cpuset":"String",
						"_vcpu":"String"
					},
					{
						"_cpuset":"String",
						"_vcpu":"String"
					}
				],
				"vcpusched":[
					{
						"_priority":"String",
						"_scheduler":"String",
						"_vcpus":"String"
					},
					{
						"_priority":"String",
						"_scheduler":"String",
						"_vcpus":"String"
					}
				]
			},
			"currentMemory":{
				"_unit":"String",
				"text":"String"
			},
			"description":{
				"text":"String"
			},
			"devices":{
				"_interface":[
					{
						"_managed":"String",
						"_trustGuestRxFilters":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_tap":"String",
							"_vhost":"String"
						},
						"bandwidth":{
							"inbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							},
							"outbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							}
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"coalesce":{
							"rx":{
								"frames":{
									"_max":"String"
								}
							}
						},
						"driver":{
							"_ats":"String",
							"_event_idx":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_name":"String",
							"_queues":"String",
							"_rx_queue_size":"String",
							"_tx_queue_size":"String",
							"_txmode":"String",
							"guest":{
								"_csum":"String",
								"_ecn":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							},
							"host":{
								"_csum":"String",
								"_ecn":"String",
								"_gso":"String",
								"_mrg_rxbuf":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							}
						},
						"filterref":{
							"_filter":"String",
							"parameter":[
								{
									"_name":"String",
									"_value":"String"
								},
								{
									"_name":"String",
									"_value":"String"
								}
							]
						},
						"guest":{
							"_actual":"String",
							"_dev":"String"
						},
						"ip":[
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							}
						],
						"link":{
							"_state":"String"
						},
						"mac":{
							"_address":"String"
						},
						"model":{
							"_type":"String"
						},
						"mtu":{
							"_size":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"route":[
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							}
						],
						"script":{
							"_path":"String"
						},
						"source":{
							"_bridge":"String",
							"_dev":"String",
							"_mode":"String",
							"_network":"String",
							"_path":"String",
							"_type":"String"
						},
						"target":{
							"_dev":"String"
						},
						"tune":{
							"sndbuf":{
								"text":"String"
							}
						},
						"virtualport":{
							"_type":"String",
							"parameters":{
								"__interfaceid":"String",
								"_profileid":"String"
							}
						},
						"vlan":{
							"_trunk":"String",
							"tag":[
								{
									"_id":"String",
									"_nativeMode":"String"
								},
								{
									"_id":"String",
									"_nativeMode":"String"
								}
							]
						}
					},
					{
						"_managed":"String",
						"_trustGuestRxFilters":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_tap":"String",
							"_vhost":"String"
						},
						"bandwidth":{
							"inbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							},
							"outbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							}
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"coalesce":{
							"rx":{
								"frames":{
									"_max":"String"
								}
							}
						},
						"driver":{
							"_ats":"String",
							"_event_idx":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_name":"String",
							"_queues":"String",
							"_rx_queue_size":"String",
							"_tx_queue_size":"String",
							"_txmode":"String",
							"guest":{
								"_csum":"String",
								"_ecn":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							},
							"host":{
								"_csum":"String",
								"_ecn":"String",
								"_gso":"String",
								"_mrg_rxbuf":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							}
						},
						"filterref":{
							"_filter":"String",
							"parameter":[
								{
									"_name":"String",
									"_value":"String"
								},
								{
									"_name":"String",
									"_value":"String"
								}
							]
						},
						"guest":{
							"_actual":"String",
							"_dev":"String"
						},
						"ip":[
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							}
						],
						"link":{
							"_state":"String"
						},
						"mac":{
							"_address":"String"
						},
						"model":{
							"_type":"String"
						},
						"mtu":{
							"_size":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"route":[
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							}
						],
						"script":{
							"_path":"String"
						},
						"source":{
							"_bridge":"String",
							"_dev":"String",
							"_mode":"String",
							"_network":"String",
							"_path":"String",
							"_type":"String"
						},
						"target":{
							"_dev":"String"
						},
						"tune":{
							"sndbuf":{
								"text":"String"
							}
						},
						"virtualport":{
							"_type":"String",
							"parameters":{
								"__interfaceid":"String",
								"_profileid":"String"
							}
						},
						"vlan":{
							"_trunk":"String",
							"tag":[
								{
									"_id":"String",
									"_nativeMode":"String"
								},
								{
									"_id":"String",
									"_nativeMode":"String"
								}
							]
						}
					}
				],
				"channel":[
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_mode":"String",
							"_path":"String"
						},
						"target":{
							"_name":"String",
							"_state":"String",
							"_type":"String"
						}
					},
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_mode":"String",
							"_path":"String"
						},
						"target":{
							"_name":"String",
							"_state":"String",
							"_type":"String"
						}
					}
				],
				"console":[
					{
						"_tty":"String",
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					},
					{
						"_tty":"String",
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					}
				],
				"controller":[
					{
						"_index":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_multifunction":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_cmd_per_lun":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_max_sectors":"String",
							"_queues":"String"
						},
						"master":{
							"_startport":"String"
						},
						"model":"String",
						"target":{
							"_chassis":"String",
							"_chassisNr":"String",
							"_port":"String"
						}
					},
					{
						"_index":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_multifunction":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_cmd_per_lun":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_max_sectors":"String",
							"_queues":"String"
						},
						"master":{
							"_startport":"String"
						},
						"model":"String",
						"target":{
							"_chassis":"String",
							"_chassisNr":"String",
							"_port":"String"
						}
					}
				],
				"disk":[
					{
						"_device":"String",
						"_model":"String",
						"_rawio":"String",
						"_sgio":"String",
						"_snapshot":"String",
						"_transient":{},
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_target":"String",
							"_type":"String",
							"_unit":"String"
						},
						"alias":{
							"_name":"String"
						},
						"auth":{
							"_username":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"backingStore":{
							"_file":"String",
							"_index":"String",
							"_type":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_dev":"String",
								"_file":"String",
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"blockio":{
							"_logical_block_size":"String",
							"_physical_block_size":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_ats":"String",
							"_cache":"String",
							"_copy_on_read":"String",
							"_detect_zeroes":"String",
							"_discard":"String",
							"_error_policy":"String",
							"_event_idx":"String",
							"_io":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_name":"String",
							"_queues":"String",
							"_rerror_policy":"String",
							"_type":"String"
						},
						"encryption":{
							"_format":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"geometry":{
							"_cyls":"String",
							"_heads":"String",
							"_secs":"String",
							"_trans":"String"
						},
						"iotune":{
							"group_name":{
								"text":"String"
							},
							"read_bytes_sec":{
								"text":"String"
							},
							"read_bytes_sec_max":{
								"text":"String"
							},
							"read_bytes_sec_max_length":{
								"text":"String"
							},
							"read_iops_sec":{
								"text":"String"
							},
							"read_iops_sec_max":{
								"text":"String"
							},
							"read_iops_sec_max_length":{
								"text":"String"
							},
							"size_iops_sec":{
								"text":"String"
							},
							"total_bytes_sec":{
								"text":"String"
							},
							"total_bytes_sec_max":{
								"text":"String"
							},
							"total_bytes_sec_max_length":{
								"text":"String"
							},
							"total_iops_sec":{
								"text":"String"
							},
							"total_iops_sec_max":{
								"text":"String"
							},
							"total_iops_sec_max_length":{
								"text":"String"
							},
							"write_bytes_sec":{
								"text":"String"
							},
							"write_bytes_sec_max":{
								"text":"String"
							},
							"write_bytes_sec_max_length":{
								"text":"String"
							},
							"write_iops_sec":{
								"text":"String"
							},
							"write_iops_sec_max":{
								"text":"String"
							},
							"write_iops_sec_max_length":{
								"text":"String"
							}
						},
						"mirror":{
							"_job":"String",
							"_ready":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"product":{
							"text":"String"
						},
						"readonly":{},
						"serial":{
							"_type":"String",
							"text":"String"
						},
						"shareable":{},
						"source":{
							"_controller":"String",
							"_dev":"String",
							"_file":"String",
							"_index":"String",
							"_startupPolicy":"String",
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"reservations":{
								"_enabled":"String",
								"_managed":"String",
								"source":{
									"_dev":"String",
									"_mode":"String",
									"_path":"String",
									"_type":"String"
								}
							}
						},
						"target":{
							"_bus":"String",
							"_dev":"String",
							"_removable":"String",
							"_tray":"String"
						},
						"vendor":{
							"text":"String"
						},
						"wwn":{
							"text":"String"
						}
					},
					{
						"_device":"String",
						"_model":"String",
						"_rawio":"String",
						"_sgio":"String",
						"_snapshot":"String",
						"_transient":{},
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_target":"String",
							"_type":"String",
							"_unit":"String"
						},
						"alias":{
							"_name":"String"
						},
						"auth":{
							"_username":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"backingStore":{
							"_file":"String",
							"_index":"String",
							"_type":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_dev":"String",
								"_file":"String",
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"blockio":{
							"_logical_block_size":"String",
							"_physical_block_size":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_ats":"String",
							"_cache":"String",
							"_copy_on_read":"String",
							"_detect_zeroes":"String",
							"_discard":"String",
							"_error_policy":"String",
							"_event_idx":"String",
							"_io":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_name":"String",
							"_queues":"String",
							"_rerror_policy":"String",
							"_type":"String"
						},
						"encryption":{
							"_format":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"geometry":{
							"_cyls":"String",
							"_heads":"String",
							"_secs":"String",
							"_trans":"String"
						},
						"iotune":{
							"group_name":{
								"text":"String"
							},
							"read_bytes_sec":{
								"text":"String"
							},
							"read_bytes_sec_max":{
								"text":"String"
							},
							"read_bytes_sec_max_length":{
								"text":"String"
							},
							"read_iops_sec":{
								"text":"String"
							},
							"read_iops_sec_max":{
								"text":"String"
							},
							"read_iops_sec_max_length":{
								"text":"String"
							},
							"size_iops_sec":{
								"text":"String"
							},
							"total_bytes_sec":{
								"text":"String"
							},
							"total_bytes_sec_max":{
								"text":"String"
							},
							"total_bytes_sec_max_length":{
								"text":"String"
							},
							"total_iops_sec":{
								"text":"String"
							},
							"total_iops_sec_max":{
								"text":"String"
							},
							"total_iops_sec_max_length":{
								"text":"String"
							},
							"write_bytes_sec":{
								"text":"String"
							},
							"write_bytes_sec_max":{
								"text":"String"
							},
							"write_bytes_sec_max_length":{
								"text":"String"
							},
							"write_iops_sec":{
								"text":"String"
							},
							"write_iops_sec_max":{
								"text":"String"
							},
							"write_iops_sec_max_length":{
								"text":"String"
							}
						},
						"mirror":{
							"_job":"String",
							"_ready":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"product":{
							"text":"String"
						},
						"readonly":{},
						"serial":{
							"_type":"String",
							"text":"String"
						},
						"shareable":{},
						"source":{
							"_controller":"String",
							"_dev":"String",
							"_file":"String",
							"_index":"String",
							"_startupPolicy":"String",
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"reservations":{
								"_enabled":"String",
								"_managed":"String",
								"source":{
									"_dev":"String",
									"_mode":"String",
									"_path":"String",
									"_type":"String"
								}
							}
						},
						"target":{
							"_bus":"String",
							"_dev":"String",
							"_removable":"String",
							"_tray":"String"
						},
						"vendor":{
							"text":"String"
						},
						"wwn":{
							"text":"String"
						}
					}
				],
				"emulator":{
					"text":"String"
				},
				"filesystem":[
					{
						"_accessmode":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_format":"String",
							"_iommu":"String",
							"_name":"String",
							"_type":"String",
							"_wrpolicy":"String"
						},
						"readonly":{},
						"source":{},
						"space_hard_limit":{
							"_unit":"String",
							"text":"String"
						},
						"space_soft_limit":{
							"_unit":"String",
							"text":"String"
						},
						"target":{
							"_dir":"String"
						}
					},
					{
						"_accessmode":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_format":"String",
							"_iommu":"String",
							"_name":"String",
							"_type":"String",
							"_wrpolicy":"String"
						},
						"readonly":{},
						"source":{},
						"space_hard_limit":{
							"_unit":"String",
							"text":"String"
						},
						"space_soft_limit":{
							"_unit":"String",
							"text":"String"
						},
						"target":{
							"_dir":"String"
						}
					}
				],
				"graphics":[
					{
						"_autoport":"String",
						"_port":"String",
						"_type":"String",
						"image":{
							"_compression":"String"
						},
						"listen":"String"
					},
					{
						"_autoport":"String",
						"_port":"String",
						"_type":"String",
						"image":{
							"_compression":"String"
						},
						"listen":"String"
					}
				],
				"hostdev":[
					{
						"_managed":"String",
						"_mode":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_device":"String",
							"_domain":"String",
							"_function":"String",
							"_port":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_name":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"source":{
							"address":{
								"_bus":"String",
								"_device":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String"
							}
						}
					},
					{
						"_managed":"String",
						"_mode":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_device":"String",
							"_domain":"String",
							"_function":"String",
							"_port":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_name":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"source":{
							"address":{
								"_bus":"String",
								"_device":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String"
							}
						}
					}
				],
				"hub":[
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						}
					},
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						}
					}
				],
				"input":[
					{
						"_bus":"String",
						"_model":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"source":{
							"_evdev":"String"
						}
					},
					{
						"_bus":"String",
						"_model":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"source":{
							"_evdev":"String"
						}
					}
				],
				"iommu":{
					"_model":"String",
					"driver":{
						"_caching_mode":"String",
						"_eim":"String",
						"_intremap":"String",
						"_iotlb":"String"
					}
				},
				"lease":[
					{
						"key":{
							"text":"String"
						},
						"lockspace":{
							"text":"String"
						},
						"target":{
							"_offset":"String",
							"_path":"String"
						}
					},
					{
						"key":{
							"text":"String"
						},
						"lockspace":{
							"text":"String"
						},
						"target":{
							"_offset":"String",
							"_path":"String"
						}
					}
				],
				"memballoon":{
					"_autodeflate":"String",
					"_model":"String",
					"address":{
						"_bus":"String",
						"_domain":"String",
						"_function":"String",
						"_slot":"String",
						"_type":"String"
					},
					"alias":{
						"_name":"String"
					},
					"driver":{
						"_ats":"String",
						"_iommu":"String"
					},
					"stats":{
						"_period":"String"
					}
				},
				"memory":[
					{
						"_access":"String",
						"_discard":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"source":{
							"alignsize":{
								"_unit":"String",
								"text":"String"
							},
							"nodemask":{
								"text":"String"
							},
							"pagesize":{
								"_unit":"String",
								"text":"String"
							},
							"path":{
								"text":"String"
							},
							"pmem":{}
						},
						"target":{
							"label":{
								"size":{
									"_unit":"String",
									"text":"String"
								}
							},
							"node":{
								"text":"String"
							},
							"readonly":{},
							"size":{
								"_unit":"String",
								"text":"String"
							}
						}
					},
					{
						"_access":"String",
						"_discard":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"source":{
							"alignsize":{
								"_unit":"String",
								"text":"String"
							},
							"nodemask":{
								"text":"String"
							},
							"pagesize":{
								"_unit":"String",
								"text":"String"
							},
							"path":{
								"text":"String"
							},
							"pmem":{}
						},
						"target":{
							"label":{
								"size":{
									"_unit":"String",
									"text":"String"
								}
							},
							"node":{
								"text":"String"
							},
							"readonly":{},
							"size":{
								"_unit":"String",
								"text":"String"
							}
						}
					}
				],
				"nvram":{
					"address":{},
					"alias":{
						"_name":"String"
					}
				},
				"panic":[
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						}
					},
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						}
					}
				],
				"parallel":[
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					},
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					}
				],
				"redirdev":[
					{
						"_bus":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{}
					},
					{
						"_bus":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{}
					}
				],
				"redirfilter":[
					{
						"usbdev":[
							{
								"_allow":"String",
								"_class":"String",
								"_product":"String",
								"_vendor":"String",
								"_version":"String"
							},
							{
								"_allow":"String",
								"_class":"String",
								"_product":"String",
								"_vendor":"String",
								"_version":"String"
							}
						]
					},
					{
						"usbdev":[
							{
								"_allow":"String",
								"_class":"String",
								"_product":"String",
								"_vendor":"String",
								"_version":"String"
							},
							{
								"_allow":"String",
								"_class":"String",
								"_product":"String",
								"_vendor":"String",
								"_version":"String"
							}
						]
					}
				],
				"rng":[
					{
						"_model":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_model":"String",
							"text":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"rate":{
							"_bytes":"String",
							"_period":"String"
						}
					},
					{
						"_model":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_model":"String",
							"text":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"rate":{
							"_bytes":"String",
							"_period":"String"
						}
					}
				],
				"serial":[
					{
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String",
							"model":{
								"_name":"String"
							}
						}
					},
					{
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String",
							"model":{
								"_name":"String"
							}
						}
					}
				],
				"shmem":[
					{
						"_name":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"model":{
							"_type":"String"
						},
						"msi":{
							"_enabled":"String",
							"_ioeventfd":"String",
							"_vectors":"String"
						},
						"server":{
							"_path":"String"
						},
						"size":{
							"_unit":"String",
							"text":"String"
						}
					},
					{
						"_name":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"model":{
							"_type":"String"
						},
						"msi":{
							"_enabled":"String",
							"_ioeventfd":"String",
							"_vectors":"String"
						},
						"server":{
							"_path":"String"
						},
						"size":{
							"_unit":"String",
							"text":"String"
						}
					}
				],
				"smartcard":[
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"certificate":[
							{
								"text":"String"
							},
							{
								"text":"String"
							}
						],
						"database":{
							"text":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{}
					},
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"certificate":[
							{
								"text":"String"
							},
							{
								"text":"String"
							}
						],
						"database":{
							"text":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{}
					}
				],
				"sound":[
					{
						"_model":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"codec":[
							{
								"_type":"String"
							},
							{
								"_type":"String"
							}
						]
					},
					{
						"_model":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"codec":[
							{
								"_type":"String"
							},
							{
								"_type":"String"
							}
						]
					}
				],
				"tpm":[
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"backend":{}
					},
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"backend":{}
					}
				],
				"video":[
					{
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String",
							"_vgaconf":"String"
						},
						"model":{
							"_heads":"String",
							"_primary":"String",
							"_ram":"String",
							"_type":"String",
							"_vgamem":"String",
							"_vram":"String",
							"_vram64":"String",
							"acceleration":{
								"_accel2d":"String",
								"_accel3d":"String"
							}
						}
					},
					{
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String",
							"_vgaconf":"String"
						},
						"model":{
							"_heads":"String",
							"_primary":"String",
							"_ram":"String",
							"_type":"String",
							"_vgamem":"String",
							"_vram":"String",
							"_vram64":"String",
							"acceleration":{
								"_accel2d":"String",
								"_accel3d":"String"
							}
						}
					}
				],
				"vsock":{
					"_model":"String",
					"address":{},
					"alias":{
						"_name":"String"
					},
					"cid":{
						"_address":"String",
						"_auto":"String"
					}
				},
				"watchdog":{
					"_action":"String",
					"_model":"String",
					"address":{},
					"alias":{
						"_name":"String"
					}
				}
			},
			"features":{
				"acpi":{},
				"apic":{
					"_eoi":"String"
				},
				"capabilities":{
					"_policy":"String",
					"audit_control":{
						"_state":"String"
					},
					"audit_write":{
						"_state":"String"
					},
					"block_suspend":{
						"_state":"String"
					},
					"chown":{
						"_state":"String"
					},
					"dac_override":{
						"_state":"String"
					},
					"dac_read_Search":{
						"_state":"String"
					},
					"fowner":{
						"_state":"String"
					},
					"fsetid":{
						"_state":"String"
					},
					"ipc_lock":{
						"_state":"String"
					},
					"ipc_owner":{
						"_state":"String"
					},
					"kill":{
						"_state":"String"
					},
					"lease":{
						"_state":"String"
					},
					"linux_immutable":{
						"_state":"String"
					},
					"mac_admin":{
						"_state":"String"
					},
					"mac_override":{
						"_state":"String"
					},
					"mknod":{
						"_state":"String"
					},
					"net_admin":{
						"_state":"String"
					},
					"net_bind_service":{
						"_state":"String"
					},
					"net_broadcast":{
						"_state":"String"
					},
					"net_raw":{
						"_state":"String"
					},
					"setfcap":{
						"_state":"String"
					},
					"setgid":{
						"_state":"String"
					},
					"setpcap":{
						"_state":"String"
					},
					"setuid":{
						"_state":"String"
					},
					"sys_admin":{
						"_state":"String"
					},
					"sys_boot":{
						"_state":"String"
					},
					"sys_chroot":{
						"_state":"String"
					},
					"sys_module":{
						"_state":"String"
					},
					"sys_nice":{
						"_state":"String"
					},
					"sys_pacct":{
						"_state":"String"
					},
					"sys_ptrace":{
						"_state":"String"
					},
					"sys_rawio":{
						"_state":"String"
					},
					"sys_resource":{
						"_state":"String"
					},
					"sys_time":{
						"_state":"String"
					},
					"sys_tty_config":{
						"_state":"String"
					},
					"syslog":{
						"_state":"String"
					},
					"wake_alarm":{
						"_state":"String"
					}
				},
				"gic":{
					"_version":"String"
				},
				"hap":{
					"_state":"String"
				},
				"hpt":{
					"_resizing":"String",
					"maxpagesize":{
						"_unit":"String",
						"text":"String"
					}
				},
				"htm":{
					"_state":"String"
				},
				"hyperv":{
					"evmcs":{
						"_state":"String"
					},
					"frequencies":{
						"_state":"String"
					},
					"ipi":{
						"_state":"String"
					},
					"reenlightenment":{
						"_state":"String"
					},
					"relaxed":{
						"_state":"String"
					},
					"reset":{
						"_state":"String"
					},
					"runtime":{
						"_state":"String"
					},
					"spinlocks":{
						"_retries":"String",
						"_state":"String"
					},
					"stimer":{
						"_state":"String"
					},
					"synic":{
						"_state":"String"
					},
					"tlbflush":{
						"_state":"String"
					},
					"vapic":{
						"_state":"String"
					},
					"vendor_id":{
						"_value":"String"
					},
					"vpindex":{
						"_state":"String"
					}
				},
				"ioapic":{
					"_driver":"String"
				},
				"kvm":{
					"hidden":{
						"_state":"String"
					}
				},
				"msrs":{
					"_unknown":"String"
				},
				"nested_hv":{
					"_state":"String"
				},
				"pae":{},
				"pmu":{
					"_state":"String"
				},
				"privnet":{},
				"pvspinlock":{
					"_state":"String"
				},
				"smm":{
					"_state":"String",
					"tseg":{
						"_unit":"String",
						"text":"String"
					}
				},
				"viridian":{},
				"vmcoreinfo":{
					"_state":"String"
				},
				"vmport":{
					"_state":"String"
				}
			},
			"genid":{
				"text":"String"
			},
			"idmap":{
				"gid":[
					{
						"_count":"String",
						"_start":"String",
						"_target":"String"
					},
					{
						"_count":"String",
						"_start":"String",
						"_target":"String"
					}
				],
				"uid":[
					{
						"_count":"String",
						"_start":"String",
						"_target":"String"
					},
					{
						"_count":"String",
						"_start":"String",
						"_target":"String"
					}
				]
			},
			"iothreadids":{
				"iothread":[
					{
						"_id":"String"
					},
					{
						"_id":"String"
					}
				]
			},
			"iothreads":{
				"text":"String"
			},
			"keywrap":{
				"cipher":[
					{
						"_name":"String",
						"_state":"String"
					},
					{
						"_name":"String",
						"_state":"String"
					}
				]
			},
			"launchSecurity":{},
			"maxMemory":{
				"_slots":"String",
				"_unit":"String",
				"text":"String"
			},
			"memory":{
				"_dumpCore":"String",
				"_unit":"String",
				"text":"String"
			},
			"memoryBacking":{
				"access":{
					"_mode":"String"
				},
				"allocation":{
					"_mode":"String"
				},
				"discard":{},
				"hugepages":{
					"page":[
						{
							"_nodeset":"String",
							"_size":"String",
							"_unit":"String"
						},
						{
							"_nodeset":"String",
							"_size":"String",
							"_unit":"String"
						}
					]
				},
				"locked":{},
				"nosharepages":{},
				"source":{
					"_type":"String"
				}
			},
			"memtune":{
				"hard_limit":{
					"_unit":"String",
					"text":"String"
				},
				"min_guarantee":{
					"_unit":"String",
					"text":"String"
				},
				"soft_limit":{
					"_unit":"String",
					"text":"String"
				},
				"swap_hard_limit":{
					"_unit":"String",
					"text":"String"
				}
			},
			"metadata":{},
			"name":{
				"text":"String"
			},
			"numatune":{
				"memnode":[
					{
						"_cellid":"String",
						"_mode":"String",
						"_nodeset":"String"
					},
					{
						"_cellid":"String",
						"_mode":"String",
						"_nodeset":"String"
					}
				],
				"memory":{
					"_mode":"String",
					"_nodeset":"String",
					"_placement":"String"
				}
			},
			"on_crash":{
				"text":"String"
			},
			"on_poweroff":{
				"text":"String"
			},
			"on_reboot":{
				"text":"String"
			},
			"os":{
				"acpi":{
					"table":[
						{
							"_type":"String",
							"text":"String"
						},
						{
							"_type":"String",
							"text":"String"
						}
					]
				},
				"bios":{
					"_rebootTimeout":"String",
					"_useserial":"String"
				},
				"boot":[
					{
						"_dev":"String"
					},
					{
						"_dev":"String"
					}
				],
				"bootmenu":{
					"_enable":"String",
					"_timeout":"String"
				},
				"cmdline":{
					"text":"String"
				},
				"dtb":{
					"text":"String"
				},
				"init":{
					"text":"String"
				},
				"initarg":{
					"text":"String"
				},
				"initdir":{
					"text":"String"
				},
				"initenv":[
					{
						"_name":"String",
						"text":"String"
					},
					{
						"_name":"String",
						"text":"String"
					}
				],
				"initgroup":{
					"text":"String"
				},
				"initrd":{
					"text":"String"
				},
				"inituser":{
					"text":"String"
				},
				"kernel":{
					"text":"String"
				},
				"loader":{
					"_readonly":"String",
					"_type":"String",
					"text":"String"
				},
				"nvram":{
					"text":"String"
				},
				"smbios":{
					"_mode":"String"
				},
				"type":{
					"_arch":"String",
					"_machine":"String",
					"text":"String"
				}
			},
			"perf":{
				"event":[
					{
						"_enabled":"String",
						"_name":"String"
					},
					{
						"_enabled":"String",
						"_name":"String"
					}
				]
			},
			"pm":{
				"suspend_to_disk":{
					"_enabled":"String"
				},
				"suspend_to_mem":{
					"_enabled":"String"
				}
			},
			"resource":{
				"partition":{
					"text":"String"
				}
			},
			"seclabel":[
				{
					"_model":"String",
					"_relabel":"String",
					"_type":"String",
					"baselabel":{
						"text":"String"
					},
					"imagelabel":{
						"text":"String"
					},
					"label":{
						"text":"String"
					}
				},
				{
					"_model":"String",
					"_relabel":"String",
					"_type":"String",
					"baselabel":{
						"text":"String"
					},
					"imagelabel":{
						"text":"String"
					},
					"label":{
						"text":"String"
					}
				}
			],
			"sysinfo":{
				"_type":"String",
				"baseBoard":[
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					},
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					}
				],
				"bios":{
					"entry":[
						{
							"_name":"String",
							"text":"String"
						},
						{
							"_name":"String",
							"text":"String"
						}
					]
				},
				"chassis":{
					"entry":[
						{
							"_name":"String",
							"text":"String"
						},
						{
							"_name":"String",
							"text":"String"
						}
					]
				},
				"memory":[
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					},
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					}
				],
				"oemStrings":{
					"entry":{
						"text":"String"
					}
				},
				"processor":[
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					},
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					}
				],
				"system":{
					"entry":[
						{
							"_name":"String",
							"text":"String"
						},
						{
							"_name":"String",
							"text":"String"
						}
					]
				}
			},
			"title":{
				"text":"String"
			},
			"uuid":{
				"text":"String"
			},
			"vcpu":{
				"_cpuset":"String",
				"_current":"String",
				"_placement":"String",
				"text":"String"
			},
			"vcpus":{
				"vcpu":[
					{
						"_enabled":"String",
						"_hotpluggable":"String",
						"_id":"String",
						"_order":"String"
					},
					{
						"_enabled":"String",
						"_hotpluggable":"String",
						"_id":"String",
						"_order":"String"
					}
				]
			}
		},
		"lifecycle":{
			"addACL":{
				"operator":"String",
				"priority":"String",
				"rule":"String",
				"swName":"String",
				"type":"String",
				"vmmac":"String"
			},
			"autoStartVM":{
				"disable":true
			},
			"backupVM":{
				"all":true,
				"full":true,
				"password":"String",
				"pool":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String"
			},
			"batchDeprecatedACL":{
				"deprecatedACLs":[
					{
						"priority":"String",
						"rule":"String",
						"swName":"String",
						"type":"String",
						"vmmac":"String"
					},
					{
						"priority":"String",
						"rule":"String",
						"swName":"String",
						"type":"String",
						"vmmac":"String"
					}
				]
			},
			"bindFloatingIP":{
				"fip":"String",
				"outSwName":"String",
				"swName":"String",
				"vmmac":"String"
			},
			"changeNumberOfCPU":{
				"config":true,
				"count":"String",
				"current":true,
				"guest":true,
				"hotpluggable":true,
				"live":true
			},
			"cloneVM":{
				"auto_clone":true,
				"file":"String",
				"mac":"String",
				"name":"String",
				"nonsparse":true,
				"preserve_data":true
			},
			"convertVMToImage":{
				"targetPool":"String"
			},
			"createAndStartVMFromISO":{
				"_import":true,
				"arch":"String",
				"autostart":"String",
				"blkiotune":"String",
				"boot":"String",
				"cdrom":"String",
				"channel":"String",
				"check":"String",
				"clock":"String",
				"console":"String",
				"container":"String",
				"controller":"String",
				"cpu":"String",
				"cputune":"String",
				"disk":"String",
				"dry_run":"String",
				"events":"String",
				"extra_args":"String",
				"features":"String",
				"filesystem":"String",
				"graphics":"String",
				"hostdev":"String",
				"hvm":"String",
				"idmap":"String",
				"initrd_inject":"String",
				"input":"String",
				"livecd":"String",
				"location":"String",
				"machine":"String",
				"memballoon":"String",
				"memdev":"String",
				"memory":"String",
				"memorybacking":"String",
				"memtune":"String",
				"metadata":"String",
				"network":"String",
				"noautoconsole":true,
				"noreboot":"String",
				"numatune":"String",
				"os_variant":"String",
				"panic":"String",
				"parallel":"String",
				"paravirt":"String",
				"pm":"String",
				"pxe":"String",
				"qemu_commandline":"String",
				"redirdev":"String",
				"resource":"String",
				"rng":"String",
				"security":"String",
				"serial":"String",
				"smartcard":"String",
				"sound":"String",
				"sysinfo":"String",
				"tpm":"String",
				"vcpus":"String,maxvcpus=40",
				"virt_type":"String",
				"watchdog":"String"
			},
			"createAndStartVMFromImage":{
				"noautoconsole":true
			},
			"deleteRemoteBackup":{
				"password":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"deleteVM":{
				"nvram":true,
				"remove_all_storage":true,
				"snapshots_metadata":true,
				"storage":"String"
			},
			"deleteVMBackup":{
				"pool":"String",
				"version":"String"
			},
			"deprecatedACL":{
				"priority":"String",
				"rule":"String",
				"swName":"String",
				"type":"String",
				"vmmac":"String"
			},
			"ejectISO":{
				"block":true,
				"config":true,
				"current":true,
				"eject":true,
				"force":true,
				"live":true,
				"path":"String"
			},
			"exportVM":{
				"path":"String"
			},
			"injectSshKey":{
				"os_type":"String",
				"ssh_key":"String",
				"user":"String"
			},
			"insertISO":{
				"block":true,
				"config":true,
				"current":true,
				"force":true,
				"insert":true,
				"live":true,
				"path":"String"
			},
			"manageISO":{
				"block":true,
				"config":true,
				"current":true,
				"eject":true,
				"force":true,
				"insert":true,
				"live":true,
				"path":"String",
				"source":"String",
				"update":true
			},
			"migrateVM":{
				"abort_on_error":true,
				"auto_converge":true,
				"change_protection":true,
				"compressed":true,
				"copy_storage_all":true,
				"copy_storage_inc":true,
				"desturi":"String",
				"direct":true,
				"domain":"String",
				"ip":"String",
				"live":true,
				"offline":true,
				"p2p":true,
				"persistent":true,
				"postcopy":true,
				"rdma_pin_all":true,
				"suspend":true,
				"tunnelled":true,
				"undefinesource":true,
				"unsafe":true
			},
			"migrateVMDisk":{
				"domain":"String",
				"ip":"String",
				"migratedisks":"String"
			},
			"modifyACL":{
				
			},
			"modifyQoS":{
				
			},
			"passthroughDevice":{
				"action":"String",
				"bus_num":"String",
				"dev_num":"String",
				"dev_type":"String",
				"live":true,
				"sub_bus_num":"String"
			},
			"plugDevice":{
				"config":true,
				"current":true,
				"file":"String",
				"live":true,
				"persistent":true
			},
			"plugDisk":{
				"address":"String",
				"cache":"String",
				"config":true,
				"driver":"String",
				"io":"String",
				"iothread":"String",
				"live":true,
				"mode":"String",
				"multifunction":true,
				"persistent":true,
				"rawio":true,
				"read_bytes_sec":"String",
				"read_iops_sec":"String",
				"serial":"String",
				"sgio":"String",
				"source":"String",
				"sourcetype":"String",
				"subdriver":"String",
				"target":"String",
				"targetbus":"String",
				"total_bytes_sec":"String",
				"total_iops_sec":"String",
				"type":"String",
				"write_bytes_sec":"String",
				"write_iops_sec":"String",
				"wwn":"String"
			},
			"plugNIC":{
				"config":true,
				"current":true,
				"inbound":"String",
				"live":true,
				"mac":"String",
				"managed":true,
				"model":"String",
				"outbound":"String",
				"persistent":true,
				"script":"String",
				"source":"String",
				"target":"String",
				"type":"String"
			},
			"pullRemoteBackup":{
				"password":"String",
				"pool":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"pushRemoteBackup":{
				"password":"String",
				"pool":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"rebootVM":{},
			"redirectUsb":{
				"action":"String",
				"number":"String"
			},
			"resetVM":{},
			"resizeMaxRAM":{
				
			},
			"resizeRAM":{
				"config":true,
				"current":true,
				"live":true,
				"size":"String"
			},
			"resizeVM":{
				"path":"String",
				"size":"String"
			},
			"restoreVM":{
				"all":true,
				"newname":"String",
				"pool":"String",
				"target":"String",
				"version":"String"
			},
			"resumeVM":{},
			"setBootOrder":{
				"order":"String"
			},
			"setGuestPassword":{
				"os_type":"String",
				"password":"String",
				"user":"String"
			},
			"setQoS":{
				"burst":"String",
				"priority":"String",
				"rate":"String",
				"rule":"String",
				"swName":"String",
				"type":"String"
			},
			"setVncPassword":{
				"config":true,
				"current":true,
				"force":true,
				"live":true,
				"password":"String",
				"persistent":true
			},
			"startVM":{},
			"stopVM":{},
			"stopVMForce":{},
			"suspendVM":{},
			"tuneDiskQoS":{
				"config":true,
				"device":"String",
				"live":true,
				"read_bytes_sec":"String",
				"read_iops_sec":"String",
				"total_bytes_sec":"String",
				"total_iops_sec":"String",
				"write_bytes_sec":"String",
				"write_iops_sec":"String"
			},
			"tuneNICQoS":{
				"_interface":"String",
				"config":true,
				"current":true,
				"inbound":"String",
				"live":true,
				"outbound":"String"
			},
			"unbindFloatingIP":{
				"fip":"String",
				"swName":"String",
				"vmip":"String",
				"vmmac":"String"
			},
			"unplugDevice":{
				"config":true,
				"current":true,
				"file":"String",
				"live":true,
				"persistent":true
			},
			"unplugDisk":{
				"config":true,
				"current":true,
				"live":true,
				"persistent":true,
				"target":"String"
			},
			"unplugNIC":{
				"config":true,
				"current":true,
				"live":true,
				"mac":"String",
				"persistent":true,
				"type":"String"
			},
			"unsetQoS":{
				"priority":"String",
				"rule":"String",
				"swName":"String",
				"type":"String",
				"vmmac":"String"
			},
			"unsetVncPassword":{
				"config":true,
				"current":true,
				"force":true,
				"live":true,
				"persistent":true
			},
			"updateGraphic":{
				"no_password":true,
				"password":"String",
				"type":"String"
			},
			"updateOS":{
				"source":"String",
				"target":"String"
			}
		},
		"powerstate":"String",
		"versions":[]
	}
}
```
# 2 VirtualMachineImage

虚拟机模板，包括CPU、内存、OS等信息.VirtualMachineImage所有操作的返回值一样，见**[返回值]**

## 2.1 CreateImage(创建虚拟机镜像)

**接口功能:**
	创建虚拟机镜像，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachineimage.Lifecycle.CreateImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createImage.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createImage | CreateImage | true | 创建虚拟机镜像 | 详细见下 |
| eventId | String | fasle | 事件ID | createImage.event.001 |

对象createImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| disk|String|true|用于创建虚拟机镜像的源文件|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/aaa.qcow2|
| targetPool|String|true|目标存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 2.2 DeleteImage(删除虚拟机镜像)

**接口功能:**
	删除虚拟机镜像，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机镜像存在，即已调用过CreateImage/ConvertVMToImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachineimage.Lifecycle.DeleteImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteImage.name.001|
| deleteImage | DeleteImage | true | 删除虚拟机镜像 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteImage.event.001 |

对象deleteImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 2.3 ConvertImageToVM(将虚拟机镜像转化为虚拟机)

**接口功能:**
	将虚拟机镜像转化为虚拟机，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机镜像存在，即已调用过CreateImage/ConvertVMToImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachineimage.Lifecycle.ConvertImageToVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | convertImageToVM.name.001|
| convertImageToVM | ConvertImageToVM | true | 将虚拟机镜像转化为虚拟机 | 详细见下 |
| eventId | String | fasle | 事件ID | convertImageToVM.event.001 |

对象convertImageToVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| targetPool|String|true|目标存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ConvertImageToVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## **返回值:**

```
{
	"kind":"VirtualMachineImage",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"domain":{
			"_id":"String",
			"_type":"String",
			"blkiotune":{
				"device":[
					{
						"path":{
							"text":"String"
						},
						"read_bytes_sec":{
							"text":"String"
						},
						"read_iops_sec":{
							"text":"String"
						},
						"weight":{
							"text":"String"
						},
						"write_bytes_sec":{
							"text":"String"
						},
						"write_iops_sec":{
							"text":"String"
						}
					},
					{
						"path":{
							"text":"String"
						},
						"read_bytes_sec":{
							"text":"String"
						},
						"read_iops_sec":{
							"text":"String"
						},
						"weight":{
							"text":"String"
						},
						"write_bytes_sec":{
							"text":"String"
						},
						"write_iops_sec":{
							"text":"String"
						}
					}
				],
				"weight":{
					"text":"String"
				}
			},
			"bootloader":{
				"text":"String"
			},
			"bootloader_args":{
				"text":"String"
			},
			"clock":{
				"_adjustment":"String",
				"_basis":"String",
				"_offset":"String",
				"_timezone":"String",
				"timer":[
					{
						"_frequency":"String",
						"_mode":"String",
						"_name":"String",
						"_present":"String",
						"_tickpolicy":"String",
						"_track":"String",
						"catchup":{
							"_limit":"String",
							"_slew":"String",
							"_threshold":"String"
						}
					},
					{
						"_frequency":"String",
						"_mode":"String",
						"_name":"String",
						"_present":"String",
						"_tickpolicy":"String",
						"_track":"String",
						"catchup":{
							"_limit":"String",
							"_slew":"String",
							"_threshold":"String"
						}
					}
				]
			},
			"cpu":{
				"_check":"String",
				"_match":"String",
				"_mode":"String",
				"cache":{
					"_level":"String",
					"_mode":"String"
				},
				"feature":[
					{
						"_name":"String",
						"_policy":"String"
					},
					{
						"_name":"String",
						"_policy":"String"
					}
				],
				"model":{
					"_fallback":"String",
					"_vendor_id":"String",
					"text":"String"
				},
				"numa":{
					"cell":[
						{
							"_cpus":"String",
							"_discard":"String",
							"_id":"String",
							"_memAccess":"String",
							"_memory":"String",
							"_unit":"String",
							"distances":{
								"sibling":[
									{
										"_id":"String",
										"_value":"String"
									},
									{
										"_id":"String",
										"_value":"String"
									}
								]
							}
						},
						{
							"_cpus":"String",
							"_discard":"String",
							"_id":"String",
							"_memAccess":"String",
							"_memory":"String",
							"_unit":"String",
							"distances":{
								"sibling":[
									{
										"_id":"String",
										"_value":"String"
									},
									{
										"_id":"String",
										"_value":"String"
									}
								]
							}
						}
					]
				},
				"topology":{
					"_cores":"String",
					"_sockets":"String",
					"_threads":"String"
				},
				"vendor":{
					"text":"String"
				}
			},
			"cputune":{
				"cachetune":[
					{
						"_vcpus":"String",
						"cache":[
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							},
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							}
						],
						"monitor":[
							{
								"_level":"String",
								"_vcpus":"String"
							},
							{
								"_level":"String",
								"_vcpus":"String"
							}
						]
					},
					{
						"_vcpus":"String",
						"cache":[
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							},
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							}
						],
						"monitor":[
							{
								"_level":"String",
								"_vcpus":"String"
							},
							{
								"_level":"String",
								"_vcpus":"String"
							}
						]
					}
				],
				"emulator_period":{
					"text":"String"
				},
				"emulator_quota":{
					"text":"String"
				},
				"emulatorpin":{
					"_cpuset":"String"
				},
				"global_period":{
					"text":"String"
				},
				"global_quota":{
					"text":"String"
				},
				"iothread_period":{
					"text":"String"
				},
				"iothread_quota":{
					"text":"String"
				},
				"iothreadpin":[
					{
						"_cpuset":"String",
						"_iothread":"String"
					},
					{
						"_cpuset":"String",
						"_iothread":"String"
					}
				],
				"iothreadsched":[
					{
						"_iothreads":"String",
						"_priority":"String",
						"_scheduler":"String"
					},
					{
						"_iothreads":"String",
						"_priority":"String",
						"_scheduler":"String"
					}
				],
				"memorytune":[
					{
						"_vcpus":"String",
						"node":[
							{
								"_bandwidth":"String",
								"_id":"String"
							},
							{
								"_bandwidth":"String",
								"_id":"String"
							}
						]
					},
					{
						"_vcpus":"String",
						"node":[
							{
								"_bandwidth":"String",
								"_id":"String"
							},
							{
								"_bandwidth":"String",
								"_id":"String"
							}
						]
					}
				],
				"period":{
					"text":"String"
				},
				"quota":{
					"text":"String"
				},
				"shares":{
					"text":"String"
				},
				"vcpupin":[
					{
						"_cpuset":"String",
						"_vcpu":"String"
					},
					{
						"_cpuset":"String",
						"_vcpu":"String"
					}
				],
				"vcpusched":[
					{
						"_priority":"String",
						"_scheduler":"String",
						"_vcpus":"String"
					},
					{
						"_priority":"String",
						"_scheduler":"String",
						"_vcpus":"String"
					}
				]
			},
			"currentMemory":{
				"_unit":"String",
				"text":"String"
			},
			"description":{
				"text":"String"
			},
			"devices":{
				"_interface":[
					{
						"_managed":"String",
						"_trustGuestRxFilters":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_tap":"String",
							"_vhost":"String"
						},
						"bandwidth":{
							"inbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							},
							"outbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							}
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"coalesce":{
							"rx":{
								"frames":{
									"_max":"String"
								}
							}
						},
						"driver":{
							"_ats":"String",
							"_event_idx":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_name":"String",
							"_queues":"String",
							"_rx_queue_size":"String",
							"_tx_queue_size":"String",
							"_txmode":"String",
							"guest":{
								"_csum":"String",
								"_ecn":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							},
							"host":{
								"_csum":"String",
								"_ecn":"String",
								"_gso":"String",
								"_mrg_rxbuf":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							}
						},
						"filterref":{
							"_filter":"String",
							"parameter":[
								{
									"_name":"String",
									"_value":"String"
								},
								{
									"_name":"String",
									"_value":"String"
								}
							]
						},
						"guest":{
							"_actual":"String",
							"_dev":"String"
						},
						"ip":[
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							}
						],
						"link":{
							"_state":"String"
						},
						"mac":{
							"_address":"String"
						},
						"model":{
							"_type":"String"
						},
						"mtu":{
							"_size":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"route":[
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							}
						],
						"script":{
							"_path":"String"
						},
						"source":{
							"_bridge":"String",
							"_dev":"String",
							"_mode":"String",
							"_network":"String",
							"_path":"String",
							"_type":"String"
						},
						"target":{
							"_dev":"String"
						},
						"tune":{
							"sndbuf":{
								"text":"String"
							}
						},
						"virtualport":{
							"_type":"String",
							"parameters":{
								"__interfaceid":"String",
								"_profileid":"String"
							}
						},
						"vlan":{
							"_trunk":"String",
							"tag":[
								{
									"_id":"String",
									"_nativeMode":"String"
								},
								{
									"_id":"String",
									"_nativeMode":"String"
								}
							]
						}
					},
					{
						"_managed":"String",
						"_trustGuestRxFilters":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_tap":"String",
							"_vhost":"String"
						},
						"bandwidth":{
							"inbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							},
							"outbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							}
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"coalesce":{
							"rx":{
								"frames":{
									"_max":"String"
								}
							}
						},
						"driver":{
							"_ats":"String",
							"_event_idx":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_name":"String",
							"_queues":"String",
							"_rx_queue_size":"String",
							"_tx_queue_size":"String",
							"_txmode":"String",
							"guest":{
								"_csum":"String",
								"_ecn":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							},
							"host":{
								"_csum":"String",
								"_ecn":"String",
								"_gso":"String",
								"_mrg_rxbuf":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							}
						},
						"filterref":{
							"_filter":"String",
							"parameter":[
								{
									"_name":"String",
									"_value":"String"
								},
								{
									"_name":"String",
									"_value":"String"
								}
							]
						},
						"guest":{
							"_actual":"String",
							"_dev":"String"
						},
						"ip":[
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							}
						],
						"link":{
							"_state":"String"
						},
						"mac":{
							"_address":"String"
						},
						"model":{
							"_type":"String"
						},
						"mtu":{
							"_size":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"route":[
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							}
						],
						"script":{
							"_path":"String"
						},
						"source":{
							"_bridge":"String",
							"_dev":"String",
							"_mode":"String",
							"_network":"String",
							"_path":"String",
							"_type":"String"
						},
						"target":{
							"_dev":"String"
						},
						"tune":{
							"sndbuf":{
								"text":"String"
							}
						},
						"virtualport":{
							"_type":"String",
							"parameters":{
								"__interfaceid":"String",
								"_profileid":"String"
							}
						},
						"vlan":{
							"_trunk":"String",
							"tag":[
								{
									"_id":"String",
									"_nativeMode":"String"
								},
								{
									"_id":"String",
									"_nativeMode":"String"
								}
							]
						}
					}
				],
				"channel":[
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_mode":"String",
							"_path":"String"
						},
						"target":{
							"_name":"String",
							"_state":"String",
							"_type":"String"
						}
					},
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_mode":"String",
							"_path":"String"
						},
						"target":{
							"_name":"String",
							"_state":"String",
							"_type":"String"
						}
					}
				],
				"console":[
					{
						"_tty":"String",
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					},
					{
						"_tty":"String",
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					}
				],
				"controller":[
					{
						"_index":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_multifunction":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_cmd_per_lun":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_max_sectors":"String",
							"_queues":"String"
						},
						"master":{
							"_startport":"String"
						},
						"model":"String",
						"target":{
							"_chassis":"String",
							"_chassisNr":"String",
							"_port":"String"
						}
					},
					{
						"_index":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_multifunction":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_cmd_per_lun":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_max_sectors":"String",
							"_queues":"String"
						},
						"master":{
							"_startport":"String"
						},
						"model":"String",
						"target":{
							"_chassis":"String",
							"_chassisNr":"String",
							"_port":"String"
						}
					}
				],
				"disk":[
					{
						"_device":"String",
						"_model":"String",
						"_rawio":"String",
						"_sgio":"String",
						"_snapshot":"String",
						"_transient":{},
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_target":"String",
							"_type":"String",
							"_unit":"String"
						},
						"alias":{
							"_name":"String"
						},
						"auth":{
							"_username":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"backingStore":{
							"_file":"String",
							"_index":"String",
							"_type":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_dev":"String",
								"_file":"String",
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"blockio":{
							"_logical_block_size":"String",
							"_physical_block_size":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_ats":"String",
							"_cache":"String",
							"_copy_on_read":"String",
							"_detect_zeroes":"String",
							"_discard":"String",
							"_error_policy":"String",
							"_event_idx":"String",
							"_io":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_name":"String",
							"_queues":"String",
							"_rerror_policy":"String",
							"_type":"String"
						},
						"encryption":{
							"_format":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"geometry":{
							"_cyls":"String",
							"_heads":"String",
							"_secs":"String",
							"_trans":"String"
						},
						"iotune":{
							"group_name":{
								"text":"String"
							},
							"read_bytes_sec":{
								"text":"String"
							},
							"read_bytes_sec_max":{
								"text":"String"
							},
							"read_bytes_sec_max_length":{
								"text":"String"
							},
							"read_iops_sec":{
								"text":"String"
							},
							"read_iops_sec_max":{
								"text":"String"
							},
							"read_iops_sec_max_length":{
								"text":"String"
							},
							"size_iops_sec":{
								"text":"String"
							},
							"total_bytes_sec":{
								"text":"String"
							},
							"total_bytes_sec_max":{
								"text":"String"
							},
							"total_bytes_sec_max_length":{
								"text":"String"
							},
							"total_iops_sec":{
								"text":"String"
							},
							"total_iops_sec_max":{
								"text":"String"
							},
							"total_iops_sec_max_length":{
								"text":"String"
							},
							"write_bytes_sec":{
								"text":"String"
							},
							"write_bytes_sec_max":{
								"text":"String"
							},
							"write_bytes_sec_max_length":{
								"text":"String"
							},
							"write_iops_sec":{
								"text":"String"
							},
							"write_iops_sec_max":{
								"text":"String"
							},
							"write_iops_sec_max_length":{
								"text":"String"
							}
						},
						"mirror":{
							"_job":"String",
							"_ready":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"product":{
							"text":"String"
						},
						"readonly":{},
						"serial":{
							"_type":"String",
							"text":"String"
						},
						"shareable":{},
						"source":{
							"_controller":"String",
							"_dev":"String",
							"_file":"String",
							"_index":"String",
							"_startupPolicy":"String",
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"reservations":{
								"_enabled":"String",
								"_managed":"String",
								"source":{
									"_dev":"String",
									"_mode":"String",
									"_path":"String",
									"_type":"String"
								}
							}
						},
						"target":{
							"_bus":"String",
							"_dev":"String",
							"_removable":"String",
							"_tray":"String"
						},
						"vendor":{
							"text":"String"
						},
						"wwn":{
							"text":"String"
						}
					},
					{
						"_device":"String",
						"_model":"String",
						"_rawio":"String",
						"_sgio":"String",
						"_snapshot":"String",
						"_transient":{},
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_target":"String",
							"_type":"String",
							"_unit":"String"
						},
						"alias":{
							"_name":"String"
						},
						"auth":{
							"_username":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"backingStore":{
							"_file":"String",
							"_index":"String",
							"_type":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_dev":"String",
								"_file":"String",
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"blockio":{
							"_logical_block_size":"String",
							"_physical_block_size":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_ats":"String",
							"_cache":"String",
							"_copy_on_read":"String",
							"_detect_zeroes":"String",
							"_discard":"String",
							"_error_policy":"String",
							"_event_idx":"String",
							"_io":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_name":"String",
							"_queues":"String",
							"_rerror_policy":"String",
							"_type":"String"
						},
						"encryption":{
							"_format":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"geometry":{
							"_cyls":"String",
							"_heads":"String",
							"_secs":"String",
							"_trans":"String"
						},
						"iotune":{
							"group_name":{
								"text":"String"
							},
							"read_bytes_sec":{
								"text":"String"
							},
							"read_bytes_sec_max":{
								"text":"String"
							},
							"read_bytes_sec_max_length":{
								"text":"String"
							},
							"read_iops_sec":{
								"text":"String"
							},
							"read_iops_sec_max":{
								"text":"String"
							},
							"read_iops_sec_max_length":{
								"text":"String"
							},
							"size_iops_sec":{
								"text":"String"
							},
							"total_bytes_sec":{
								"text":"String"
							},
							"total_bytes_sec_max":{
								"text":"String"
							},
							"total_bytes_sec_max_length":{
								"text":"String"
							},
							"total_iops_sec":{
								"text":"String"
							},
							"total_iops_sec_max":{
								"text":"String"
							},
							"total_iops_sec_max_length":{
								"text":"String"
							},
							"write_bytes_sec":{
								"text":"String"
							},
							"write_bytes_sec_max":{
								"text":"String"
							},
							"write_bytes_sec_max_length":{
								"text":"String"
							},
							"write_iops_sec":{
								"text":"String"
							},
							"write_iops_sec_max":{
								"text":"String"
							},
							"write_iops_sec_max_length":{
								"text":"String"
							}
						},
						"mirror":{
							"_job":"String",
							"_ready":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"product":{
							"text":"String"
						},
						"readonly":{},
						"serial":{
							"_type":"String",
							"text":"String"
						},
						"shareable":{},
						"source":{
							"_controller":"String",
							"_dev":"String",
							"_file":"String",
							"_index":"String",
							"_startupPolicy":"String",
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"reservations":{
								"_enabled":"String",
								"_managed":"String",
								"source":{
									"_dev":"String",
									"_mode":"String",
									"_path":"String",
									"_type":"String"
								}
							}
						},
						"target":{
							"_bus":"String",
							"_dev":"String",
							"_removable":"String",
							"_tray":"String"
						},
						"vendor":{
							"text":"String"
						},
						"wwn":{
							"text":"String"
						}
					}
				],
				"emulator":{
					"text":"String"
				},
				"filesystem":[
					{
						"_accessmode":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_format":"String",
							"_iommu":"String",
							"_name":"String",
							"_type":"String",
							"_wrpolicy":"String"
						},
						"readonly":{},
						"source":{},
						"space_hard_limit":{
							"_unit":"String",
							"text":"String"
						},
						"space_soft_limit":{
							"_unit":"String",
							"text":"String"
						},
						"target":{
							"_dir":"String"
						}
					},
					{
						"_accessmode":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_format":"String",
							"_iommu":"String",
							"_name":"String",
							"_type":"String",
							"_wrpolicy":"String"
						},
						"readonly":{},
						"source":{},
						"space_hard_limit":{
							"_unit":"String",
							"text":"String"
						},
						"space_soft_limit":{
							"_unit":"String",
							"text":"String"
						},
						"target":{
							"_dir":"String"
						}
					}
				],
				"graphics":[
					{
						"_autoport":"String",
						"_port":"String",
						"_type":"String",
						"image":{
							"_compression":"String"
						},
						"listen":"String"
					},
					{
						"_autoport":"String",
						"_port":"String",
						"_type":"String",
						"image":{
							"_compression":"String"
						},
						"listen":"String"
					}
				],
				"hostdev":[
					{
						"_managed":"String",
						"_mode":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_device":"String",
							"_domain":"String",
							"_function":"String",
							"_port":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_name":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"source":{
							"address":{
								"_bus":"String",
								"_device":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String"
							}
						}
					},
					{
						"_managed":"String",
						"_mode":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_device":"String",
							"_domain":"String",
							"_function":"String",
							"_port":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_name":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"source":{
							"address":{
								"_bus":"String",
								"_device":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String"
							}
						}
					}
				],
				"hub":[
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						}
					},
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						}
					}
				],
				"input":[
					{
						"_bus":"String",
						"_model":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"source":{
							"_evdev":"String"
						}
					},
					{
						"_bus":"String",
						"_model":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"source":{
							"_evdev":"String"
						}
					}
				],
				"iommu":{
					"_model":"String",
					"driver":{
						"_caching_mode":"String",
						"_eim":"String",
						"_intremap":"String",
						"_iotlb":"String"
					}
				},
				"lease":[
					{
						"key":{
							"text":"String"
						},
						"lockspace":{
							"text":"String"
						},
						"target":{
							"_offset":"String",
							"_path":"String"
						}
					},
					{
						"key":{
							"text":"String"
						},
						"lockspace":{
							"text":"String"
						},
						"target":{
							"_offset":"String",
							"_path":"String"
						}
					}
				],
				"memballoon":{
					"_autodeflate":"String",
					"_model":"String",
					"address":{
						"_bus":"String",
						"_domain":"String",
						"_function":"String",
						"_slot":"String",
						"_type":"String"
					},
					"alias":{
						"_name":"String"
					},
					"driver":{
						"_ats":"String",
						"_iommu":"String"
					},
					"stats":{
						"_period":"String"
					}
				},
				"memory":[
					{
						"_access":"String",
						"_discard":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"source":{
							"alignsize":{
								"_unit":"String",
								"text":"String"
							},
							"nodemask":{
								"text":"String"
							},
							"pagesize":{
								"_unit":"String",
								"text":"String"
							},
							"path":{
								"text":"String"
							},
							"pmem":{}
						},
						"target":{
							"label":{
								"size":{
									"_unit":"String",
									"text":"String"
								}
							},
							"node":{
								"text":"String"
							},
							"readonly":{},
							"size":{
								"_unit":"String",
								"text":"String"
							}
						}
					},
					{
						"_access":"String",
						"_discard":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"source":{
							"alignsize":{
								"_unit":"String",
								"text":"String"
							},
							"nodemask":{
								"text":"String"
							},
							"pagesize":{
								"_unit":"String",
								"text":"String"
							},
							"path":{
								"text":"String"
							},
							"pmem":{}
						},
						"target":{
							"label":{
								"size":{
									"_unit":"String",
									"text":"String"
								}
							},
							"node":{
								"text":"String"
							},
							"readonly":{},
							"size":{
								"_unit":"String",
								"text":"String"
							}
						}
					}
				],
				"nvram":{
					"address":{},
					"alias":{
						"_name":"String"
					}
				},
				"panic":[
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						}
					},
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						}
					}
				],
				"parallel":[
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					},
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					}
				],
				"redirdev":[
					{
						"_bus":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{}
					},
					{
						"_bus":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{}
					}
				],
				"redirfilter":[
					{
						"usbdev":[
							{
								"_allow":"String",
								"_class":"String",
								"_product":"String",
								"_vendor":"String",
								"_version":"String"
							},
							{
								"_allow":"String",
								"_class":"String",
								"_product":"String",
								"_vendor":"String",
								"_version":"String"
							}
						]
					},
					{
						"usbdev":[
							{
								"_allow":"String",
								"_class":"String",
								"_product":"String",
								"_vendor":"String",
								"_version":"String"
							},
							{
								"_allow":"String",
								"_class":"String",
								"_product":"String",
								"_vendor":"String",
								"_version":"String"
							}
						]
					}
				],
				"rng":[
					{
						"_model":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_model":"String",
							"text":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"rate":{
							"_bytes":"String",
							"_period":"String"
						}
					},
					{
						"_model":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_model":"String",
							"text":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"rate":{
							"_bytes":"String",
							"_period":"String"
						}
					}
				],
				"serial":[
					{
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String",
							"model":{
								"_name":"String"
							}
						}
					},
					{
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String",
							"model":{
								"_name":"String"
							}
						}
					}
				],
				"shmem":[
					{
						"_name":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"model":{
							"_type":"String"
						},
						"msi":{
							"_enabled":"String",
							"_ioeventfd":"String",
							"_vectors":"String"
						},
						"server":{
							"_path":"String"
						},
						"size":{
							"_unit":"String",
							"text":"String"
						}
					},
					{
						"_name":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"model":{
							"_type":"String"
						},
						"msi":{
							"_enabled":"String",
							"_ioeventfd":"String",
							"_vectors":"String"
						},
						"server":{
							"_path":"String"
						},
						"size":{
							"_unit":"String",
							"text":"String"
						}
					}
				],
				"smartcard":[
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"certificate":[
							{
								"text":"String"
							},
							{
								"text":"String"
							}
						],
						"database":{
							"text":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{}
					},
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"certificate":[
							{
								"text":"String"
							},
							{
								"text":"String"
							}
						],
						"database":{
							"text":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{}
					}
				],
				"sound":[
					{
						"_model":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"codec":[
							{
								"_type":"String"
							},
							{
								"_type":"String"
							}
						]
					},
					{
						"_model":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"codec":[
							{
								"_type":"String"
							},
							{
								"_type":"String"
							}
						]
					}
				],
				"tpm":[
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"backend":{}
					},
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"backend":{}
					}
				],
				"video":[
					{
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String",
							"_vgaconf":"String"
						},
						"model":{
							"_heads":"String",
							"_primary":"String",
							"_ram":"String",
							"_type":"String",
							"_vgamem":"String",
							"_vram":"String",
							"_vram64":"String",
							"acceleration":{
								"_accel2d":"String",
								"_accel3d":"String"
							}
						}
					},
					{
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String",
							"_vgaconf":"String"
						},
						"model":{
							"_heads":"String",
							"_primary":"String",
							"_ram":"String",
							"_type":"String",
							"_vgamem":"String",
							"_vram":"String",
							"_vram64":"String",
							"acceleration":{
								"_accel2d":"String",
								"_accel3d":"String"
							}
						}
					}
				],
				"vsock":{
					"_model":"String",
					"address":{},
					"alias":{
						"_name":"String"
					},
					"cid":{
						"_address":"String",
						"_auto":"String"
					}
				},
				"watchdog":{
					"_action":"String",
					"_model":"String",
					"address":{},
					"alias":{
						"_name":"String"
					}
				}
			},
			"features":{
				"acpi":{},
				"apic":{
					"_eoi":"String"
				},
				"capabilities":{
					"_policy":"String",
					"audit_control":{
						"_state":"String"
					},
					"audit_write":{
						"_state":"String"
					},
					"block_suspend":{
						"_state":"String"
					},
					"chown":{
						"_state":"String"
					},
					"dac_override":{
						"_state":"String"
					},
					"dac_read_Search":{
						"_state":"String"
					},
					"fowner":{
						"_state":"String"
					},
					"fsetid":{
						"_state":"String"
					},
					"ipc_lock":{
						"_state":"String"
					},
					"ipc_owner":{
						"_state":"String"
					},
					"kill":{
						"_state":"String"
					},
					"lease":{
						"_state":"String"
					},
					"linux_immutable":{
						"_state":"String"
					},
					"mac_admin":{
						"_state":"String"
					},
					"mac_override":{
						"_state":"String"
					},
					"mknod":{
						"_state":"String"
					},
					"net_admin":{
						"_state":"String"
					},
					"net_bind_service":{
						"_state":"String"
					},
					"net_broadcast":{
						"_state":"String"
					},
					"net_raw":{
						"_state":"String"
					},
					"setfcap":{
						"_state":"String"
					},
					"setgid":{
						"_state":"String"
					},
					"setpcap":{
						"_state":"String"
					},
					"setuid":{
						"_state":"String"
					},
					"sys_admin":{
						"_state":"String"
					},
					"sys_boot":{
						"_state":"String"
					},
					"sys_chroot":{
						"_state":"String"
					},
					"sys_module":{
						"_state":"String"
					},
					"sys_nice":{
						"_state":"String"
					},
					"sys_pacct":{
						"_state":"String"
					},
					"sys_ptrace":{
						"_state":"String"
					},
					"sys_rawio":{
						"_state":"String"
					},
					"sys_resource":{
						"_state":"String"
					},
					"sys_time":{
						"_state":"String"
					},
					"sys_tty_config":{
						"_state":"String"
					},
					"syslog":{
						"_state":"String"
					},
					"wake_alarm":{
						"_state":"String"
					}
				},
				"gic":{
					"_version":"String"
				},
				"hap":{
					"_state":"String"
				},
				"hpt":{
					"_resizing":"String",
					"maxpagesize":{
						"_unit":"String",
						"text":"String"
					}
				},
				"htm":{
					"_state":"String"
				},
				"hyperv":{
					"evmcs":{
						"_state":"String"
					},
					"frequencies":{
						"_state":"String"
					},
					"ipi":{
						"_state":"String"
					},
					"reenlightenment":{
						"_state":"String"
					},
					"relaxed":{
						"_state":"String"
					},
					"reset":{
						"_state":"String"
					},
					"runtime":{
						"_state":"String"
					},
					"spinlocks":{
						"_retries":"String",
						"_state":"String"
					},
					"stimer":{
						"_state":"String"
					},
					"synic":{
						"_state":"String"
					},
					"tlbflush":{
						"_state":"String"
					},
					"vapic":{
						"_state":"String"
					},
					"vendor_id":{
						"_value":"String"
					},
					"vpindex":{
						"_state":"String"
					}
				},
				"ioapic":{
					"_driver":"String"
				},
				"kvm":{
					"hidden":{
						"_state":"String"
					}
				},
				"msrs":{
					"_unknown":"String"
				},
				"nested_hv":{
					"_state":"String"
				},
				"pae":{},
				"pmu":{
					"_state":"String"
				},
				"privnet":{},
				"pvspinlock":{
					"_state":"String"
				},
				"smm":{
					"_state":"String",
					"tseg":{
						"_unit":"String",
						"text":"String"
					}
				},
				"viridian":{},
				"vmcoreinfo":{
					"_state":"String"
				},
				"vmport":{
					"_state":"String"
				}
			},
			"genid":{
				"text":"String"
			},
			"idmap":{
				"gid":[
					{
						"_count":"String",
						"_start":"String",
						"_target":"String"
					},
					{
						"_count":"String",
						"_start":"String",
						"_target":"String"
					}
				],
				"uid":[
					{
						"_count":"String",
						"_start":"String",
						"_target":"String"
					},
					{
						"_count":"String",
						"_start":"String",
						"_target":"String"
					}
				]
			},
			"iothreadids":{
				"iothread":[
					{
						"_id":"String"
					},
					{
						"_id":"String"
					}
				]
			},
			"iothreads":{
				"text":"String"
			},
			"keywrap":{
				"cipher":[
					{
						"_name":"String",
						"_state":"String"
					},
					{
						"_name":"String",
						"_state":"String"
					}
				]
			},
			"launchSecurity":{},
			"maxMemory":{
				"_slots":"String",
				"_unit":"String",
				"text":"String"
			},
			"memory":{
				"_dumpCore":"String",
				"_unit":"String",
				"text":"String"
			},
			"memoryBacking":{
				"access":{
					"_mode":"String"
				},
				"allocation":{
					"_mode":"String"
				},
				"discard":{},
				"hugepages":{
					"page":[
						{
							"_nodeset":"String",
							"_size":"String",
							"_unit":"String"
						},
						{
							"_nodeset":"String",
							"_size":"String",
							"_unit":"String"
						}
					]
				},
				"locked":{},
				"nosharepages":{},
				"source":{
					"_type":"String"
				}
			},
			"memtune":{
				"hard_limit":{
					"_unit":"String",
					"text":"String"
				},
				"min_guarantee":{
					"_unit":"String",
					"text":"String"
				},
				"soft_limit":{
					"_unit":"String",
					"text":"String"
				},
				"swap_hard_limit":{
					"_unit":"String",
					"text":"String"
				}
			},
			"metadata":{},
			"name":{
				"text":"String"
			},
			"numatune":{
				"memnode":[
					{
						"_cellid":"String",
						"_mode":"String",
						"_nodeset":"String"
					},
					{
						"_cellid":"String",
						"_mode":"String",
						"_nodeset":"String"
					}
				],
				"memory":{
					"_mode":"String",
					"_nodeset":"String",
					"_placement":"String"
				}
			},
			"on_crash":{
				"text":"String"
			},
			"on_poweroff":{
				"text":"String"
			},
			"on_reboot":{
				"text":"String"
			},
			"os":{
				"acpi":{
					"table":[
						{
							"_type":"String",
							"text":"String"
						},
						{
							"_type":"String",
							"text":"String"
						}
					]
				},
				"bios":{
					"_rebootTimeout":"String",
					"_useserial":"String"
				},
				"boot":[
					{
						"_dev":"String"
					},
					{
						"_dev":"String"
					}
				],
				"bootmenu":{
					"_enable":"String",
					"_timeout":"String"
				},
				"cmdline":{
					"text":"String"
				},
				"dtb":{
					"text":"String"
				},
				"init":{
					"text":"String"
				},
				"initarg":{
					"text":"String"
				},
				"initdir":{
					"text":"String"
				},
				"initenv":[
					{
						"_name":"String",
						"text":"String"
					},
					{
						"_name":"String",
						"text":"String"
					}
				],
				"initgroup":{
					"text":"String"
				},
				"initrd":{
					"text":"String"
				},
				"inituser":{
					"text":"String"
				},
				"kernel":{
					"text":"String"
				},
				"loader":{
					"_readonly":"String",
					"_type":"String",
					"text":"String"
				},
				"nvram":{
					"text":"String"
				},
				"smbios":{
					"_mode":"String"
				},
				"type":{
					"_arch":"String",
					"_machine":"String",
					"text":"String"
				}
			},
			"perf":{
				"event":[
					{
						"_enabled":"String",
						"_name":"String"
					},
					{
						"_enabled":"String",
						"_name":"String"
					}
				]
			},
			"pm":{
				"suspend_to_disk":{
					"_enabled":"String"
				},
				"suspend_to_mem":{
					"_enabled":"String"
				}
			},
			"resource":{
				"partition":{
					"text":"String"
				}
			},
			"seclabel":[
				{
					"_model":"String",
					"_relabel":"String",
					"_type":"String",
					"baselabel":{
						"text":"String"
					},
					"imagelabel":{
						"text":"String"
					},
					"label":{
						"text":"String"
					}
				},
				{
					"_model":"String",
					"_relabel":"String",
					"_type":"String",
					"baselabel":{
						"text":"String"
					},
					"imagelabel":{
						"text":"String"
					},
					"label":{
						"text":"String"
					}
				}
			],
			"sysinfo":{
				"_type":"String",
				"baseBoard":[
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					},
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					}
				],
				"bios":{
					"entry":[
						{
							"_name":"String",
							"text":"String"
						},
						{
							"_name":"String",
							"text":"String"
						}
					]
				},
				"chassis":{
					"entry":[
						{
							"_name":"String",
							"text":"String"
						},
						{
							"_name":"String",
							"text":"String"
						}
					]
				},
				"memory":[
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					},
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					}
				],
				"oemStrings":{
					"entry":{
						"text":"String"
					}
				},
				"processor":[
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					},
					{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					}
				],
				"system":{
					"entry":[
						{
							"_name":"String",
							"text":"String"
						},
						{
							"_name":"String",
							"text":"String"
						}
					]
				}
			},
			"title":{
				"text":"String"
			},
			"uuid":{
				"text":"String"
			},
			"vcpu":{
				"_cpuset":"String",
				"_current":"String",
				"_placement":"String",
				"text":"String"
			},
			"vcpus":{
				"vcpu":[
					{
						"_enabled":"String",
						"_hotpluggable":"String",
						"_id":"String",
						"_order":"String"
					},
					{
						"_enabled":"String",
						"_hotpluggable":"String",
						"_id":"String",
						"_order":"String"
					}
				]
			}
		},
		"lifecycle":{
			"convertImageToVM":{
				"targetPool":"String"
			},
			"createImage":{
				"disk":"String",
				"targetPool":"String"
			},
			"deleteImage":{}
		},
		"versions":[]
	}
}
```
# 3 VirtualMachineDisk

云盘是指未格式化的云盘.VirtualMachineDisk所有操作的返回值一样，见**[返回值]**

## 3.1 DeleteDisk(删除云盘)

**接口功能:**
	删除云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.DeleteDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteDisk.name.001|
| deleteDisk | DeleteDisk | true | 删除云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteDisk.event.001 |

对象deleteDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs，vdiskfs，uus，nfs，glusterfs之一|localfs|
| pool|String|true|云盘所在的存储池名|已创建出的存储池|pool2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.2 ResizeDisk(调整云盘大小)

**接口功能:**
	调整云盘大小，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.ResizeDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | resizeDisk.name.001|
| resizeDisk | ResizeDisk | true | 调整云盘大小 | 详细见下 |
| eventId | String | fasle | 事件ID | resizeDisk.event.001 |

对象resizeDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|localfs，vdiskfs，nfs，glusterfs支持扩容，uus类型中dev和iscsi支持扩容，dev-fast和iscsi-fast不支持扩容|localfs|
| pool|String|true|云盘所在的存储池名|已创建出的存储池|pool2|
| capacity|String|true|扩容后的云盘空间大小, 1G到1T|1000000000-999999999999（单位：Byte），需要比以前的云盘空间大|‭10,737,418,240‬|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ResizeDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.3 CreateDisk(创建云盘)

**接口功能:**
	创建云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.CreateDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createDisk.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createDisk | CreateDisk | true | 创建云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | createDisk.event.001 |

对象createDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs，vdiskfs，uus，nfs，glusterfs之一|localfs|
| format|String|true|云盘文件的类型|qcow2|qcow2|
| pool|String|true|创建云盘使用的存储池名|已创建出的存储池|pool2|
| capacity|String|true|云盘空间大小,1G到1T|1000000000-999999999999（单位：Byte）|‭10,737,418,240‬|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.4 CreateDiskFromDiskImage(从镜像创建云盘)

**接口功能:**
	从镜像创建云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.CreateDiskFromDiskImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createDiskFromDiskImage.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createDiskFromDiskImage | CreateDiskFromDiskImage | true | 从镜像创建云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | createDiskFromDiskImage.event.001 |

对象createDiskFromDiskImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs，vdiskfs，nfs，glusterfs之一|localfs|
| targetPool|String|true|目标存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
| source|String|true|云盘镜像的路径|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/test.qcow2|
| full_copy|boolean|false|默认为从快照创建，true为全拷贝|默认为从快照创建，true为全拷贝|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateDiskFromDiskImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.5 CloneDisk(克隆云盘)

**接口功能:**
	克隆云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.CloneDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | cloneDisk.name.001|
| cloneDisk | CloneDisk | true | 克隆云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | cloneDisk.event.001 |

对象cloneDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs, vdiskfs，nfs，glusterfs之一|localfs|
| pool|String|true|目标存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
| newname|String|true|新云盘的名字|由4-100位的数字和小写字母组成|newdisk|
| format|String|true|云盘文件的类型|qcow2|qcow2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CloneDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.6 MigrateDisk(迁移云盘)

**接口功能:**
	迁移云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.MigrateDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | migrateDisk.name.001|
| migrateDisk | MigrateDisk | true | 迁移云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | migrateDisk.event.001 |

对象migrateDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| pool|String|true|云盘所在的存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看MigrateDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.7 CreateDiskInternalSnapshot(创建云盘内部快照)

**接口功能:**
	创建云盘内部快照，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.CreateDiskInternalSnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createDiskInternalSnapshot.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createDiskInternalSnapshot | CreateDiskInternalSnapshot | true | 创建云盘内部快照 | 详细见下 |
| eventId | String | fasle | 事件ID | createDiskInternalSnapshot.event.001 |

对象createDiskInternalSnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs，nfs，glusterfs, vdiskfs之一|localfs|
| pool|String|true|云盘所在的存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
| snapshotname|String|true|快照的名字|由4-100位的数字和小写字母组成|snap1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateDiskInternalSnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.8 RevertDiskInternalSnapshot(从云盘内部快照恢复)

**接口功能:**
	从云盘内部快照恢复，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.RevertDiskInternalSnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | revertDiskInternalSnapshot.name.001|
| revertDiskInternalSnapshot | RevertDiskInternalSnapshot | true | 从云盘内部快照恢复 | 详细见下 |
| eventId | String | fasle | 事件ID | revertDiskInternalSnapshot.event.001 |

对象revertDiskInternalSnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs, vdiskfs，nfs，glusterfs之一|localfs|
| pool|String|true|云盘所在的存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
| snapshotname|String|true|快照的名字|由4-100位的数字和小写字母组成|snap1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看RevertDiskInternalSnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.9 DeleteDiskInternalSnapshot(删除云盘内部快照)

**接口功能:**
	删除云盘内部快照，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.DeleteDiskInternalSnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteDiskInternalSnapshot.name.001|
| deleteDiskInternalSnapshot | DeleteDiskInternalSnapshot | true | 删除云盘内部快照 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteDiskInternalSnapshot.event.001 |

对象deleteDiskInternalSnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs, vdiskfs，nfs，glusterfs之一|localfs|
| pool|String|true|云盘所在的存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
| snapshotname|String|true|快照的名字|由4-100位的数字和小写字母组成|snap1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteDiskInternalSnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.10 BackupDisk(备份云盘)

**接口功能:**
	备份云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.BackupDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | backupDisk.name.001|
| backupDisk | BackupDisk | true | 备份云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | backupDisk.event.001 |

对象backupDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|false|备份云盘所在的云主机|备份云盘所在的云主机|61024b305b5c463b80bceee066077079|
| pool|String|true|备份主机磁盘使用的存储池|备份主机使用的存储池|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| full|boolean|false|全量备份|全量备份|true|
| remote|String|false|远程备份的ftp主机ip|远程备份的ftp主机ip|172.16.1.214|
| port|String|false|远程备份的ftp主机端口|远程备份的ftp主机端口|21|
| username|String|false|远程备份的ftp用户名|ftpuser|ftpuser|
| password|String|false|远程备份的ftp密码|ftpuser|ftpuser|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看BackupDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.11 CreateCloudInitUserDataImage(创建cloud-init的镜像文件)

**接口功能:**
	创建云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.CreateCloudInitUserDataImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createCloudInitUserDataImage.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createCloudInitUserDataImage | CreateCloudInitUserDataImage | true | 创建cloud-init的镜像文件 | 详细见下 |
| eventId | String | fasle | 事件ID | createCloudInitUserDataImage.event.001 |

对象createCloudInitUserDataImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| pool|String|true|云盘使用的存储池|云盘使用的存储池|61024b305b5c463b80bceee066077079|
| userData|String|true|符合cloud-init语法的用户指令|必须能转换成yaml格式||
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateCloudInitUserDataImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 3.12 DeleteCloudInitUserDataImage(删除cloud-init的镜像文件)

**接口功能:**
	创建云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisk.Lifecycle.DeleteCloudInitUserDataImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteCloudInitUserDataImage.name.001|
| deleteCloudInitUserDataImage | DeleteCloudInitUserDataImage | true | 删除cloud-init的镜像文件 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteCloudInitUserDataImage.event.001 |

对象deleteCloudInitUserDataImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| pool|String|true|云盘使用的存储池|云盘使用的存储池|61024b305b5c463b80bceee066077079|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteCloudInitUserDataImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## **返回值:**

```
{
	"kind":"VirtualMachineDisk",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"lifecycle":{
			"backupDisk":{
				"domain":"String",
				"full":true,
				"password":"String",
				"pool":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String"
			},
			"cloneDisk":{
				"format":"String",
				"newname":"String",
				"pool":"String",
				"prealloc_metadata":true,
				"reflink":true,
				"type":"String"
			},
			"createCloudInitUserDataImage":{
				"pool":"String",
				"userData":"String"
			},
			"createDisk":{
				"allocation":"String",
				"capacity":"String",
				"format":"String",
				"pool":"String",
				"prealloc_metadata":true,
				"type":"String"
			},
			"createDiskFromDiskImage":{
				"full_copy":true,
				"source":"String",
				"targetPool":"String",
				"type":"String"
			},
			"createDiskInternalSnapshot":{
				"pool":"String",
				"snapshotname":"String",
				"type":"String"
			},
			"createDiskSnapshot":{"$ref":"$.spec.lifecycle.createDiskInternalSnapshot"},
			"deleteCloudInitUserDataImage":{
				"pool":"String"
			},
			"deleteDisk":{
				"pool":"String",
				"type":"String"
			},
			"deleteDiskInternalSnapshot":{
				"pool":"String",
				"snapshotname":"String",
				"type":"String"
			},
			"deleteDiskSnapshot":{"$ref":"$.spec.lifecycle.deleteDiskInternalSnapshot"},
			"migrateDisk":{
				"pool":"String"
			},
			"resizeDisk":{
				"allocate":true,
				"capacity":"String",
				"delta":true,
				"pool":"String",
				"shrink":true,
				"type":"String"
			},
			"revertDiskInternalSnapshot":{
				"pool":"String",
				"snapshotname":"String",
				"type":"String"
			},
			"revertDiskSnapshot":{"$ref":"$.spec.lifecycle.revertDiskInternalSnapshot"}
		},
		"versions":[],
		"volume":{
			"actual_size":"String",
			"backing_filename":"String",
			"backing_filename_format":"String",
			"cluster_size":"String",
			"current":"String",
			"dirty_flag":"String",
			"disk":"String",
			"disktype":"String",
			"filename":"String",
			"format":"String",
			"format_specific":{
				"data":{
					"compat":"String",
					"corrupt":true,
					"lazy_refcounts":true,
					"refcount_bits":"String"
				},
				"type":"String"
			},
			"full_backing_filename":"String",
			"pool":"String",
			"poolname":"String",
			"uni":"String",
			"virtual_size":"String"
		}
	}
}
```
# 4 VirtualMachineDiskImage

云盘模板，主要是指大小和文件格式等.VirtualMachineDiskImage所有操作的返回值一样，见**[返回值]**

## 4.1 CreateDiskImageFromDisk(从云盘创建云盘镜像)

**接口功能:**
	从云盘创建云盘镜像，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinediskimage.Lifecycle.CreateDiskImageFromDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createDiskImageFromDisk.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createDiskImageFromDisk | CreateDiskImageFromDisk | true | 从云盘创建云盘镜像 | 详细见下 |
| eventId | String | fasle | 事件ID | createDiskImageFromDisk.event.001 |

对象createDiskImageFromDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| targetPool|String|true|目标存储池名，用于存储创建的云盘镜像|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
| sourcePool|String|true|源存储池名，源云盘所在的存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool1|
| sourceVolume|String|true|源云盘名称，用于创建云盘镜像的云盘名称|由4-100位的数字和小写字母组成，已创建出的存储池|volume1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateDiskImageFromDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 4.2 CreateDiskImage(创建云盘镜像)

**接口功能:**
	创建云盘镜像，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinediskimage.Lifecycle.CreateDiskImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createDiskImage.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createDiskImage | CreateDiskImage | true | 创建云盘镜像 | 详细见下 |
| eventId | String | fasle | 事件ID | createDiskImage.event.001 |

对象createDiskImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| source|String|true|要转化为云盘镜像的源文件路径|路径必须在/var/lib/libvirt下，18-1024位，只允许小写、字母、中划线和圆点|/var/lib/libvirt/test.qcow2|
| targetPool|String|true|目标存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateDiskImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 4.3 DeleteDiskImage(删除云盘镜像)

**接口功能:**
	删除云盘镜像，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘镜像存在，即已调用过CreateDiskImage/ConvertDiskToDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinediskimage.Lifecycle.DeleteDiskImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteDiskImage.name.001|
| deleteDiskImage | DeleteDiskImage | true | 删除云盘镜像 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteDiskImage.event.001 |

对象deleteDiskImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| sourcePool|String|true|源存储池名，源云盘所在的存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteDiskImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## **返回值:**

```
{
	"kind":"VirtualMachineDiskImage",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"lifecycle":{
			"createDiskImage":{
				"source":"String",
				"targetPool":"String"
			},
			"createDiskImageFromDisk":{
				"sourcePool":"String",
				"sourceVolume":"String",
				"targetPool":"String"
			},
			"deleteDiskImage":{
				"sourcePool":"String"
			}
		},
		"versions":[],
		"volume":{
			
		}
	}
}
```
# 5 VirtualMachineDiskSnapshot

云盘快照是指云盘的外部快照，目前支持QCOW2格式.VirtualMachineDiskSnapshot所有操作的返回值一样，见**[返回值]**

## 5.1 CreateDiskExternalSnapshot(创建云盘外部快照)

**接口功能:**
	创建云盘外部快照，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘快照存在，即已调用过CreateDiskExternalSnapshot

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisksnapshot.Lifecycle.CreateDiskExternalSnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createDiskExternalSnapshot.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createDiskExternalSnapshot | CreateDiskExternalSnapshot | true | 创建云盘外部快照 | 详细见下 |
| eventId | String | fasle | 事件ID | createDiskExternalSnapshot.event.001 |

对象createDiskExternalSnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs，vdiskfs，nfs，glusterfs之一|localfs|
| pool|String|true|云盘所在的存储池名|由4-100位的数字和小写字母组成，已创建出的存储池，只支持localfs、nfs和glusterfs类型|pool2|
| format|String|true|云盘文件的类型|qcow2|qcow2|
| vol|String|true|云盘名|磁盘和快照|disk1|
| domain|String|false|若该云盘加载到虚拟机内（包括系统盘、数据盘），则需要填写该虚拟机名，否则将报错Write lock|已存在的虚拟机名，由4-100位的数字和小写字母组成|950646e8c17a49d0b83c1c797811e001|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateDiskExternalSnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 5.2 RevertDiskExternalSnapshot(从云盘外部快照恢复)

**接口功能:**
	从云盘外部快照恢复，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘快照存在，即已调用过CreateDiskExternalSnapshot

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisksnapshot.Lifecycle.RevertDiskExternalSnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | revertDiskExternalSnapshot.name.001|
| revertDiskExternalSnapshot | RevertDiskExternalSnapshot | true | 从云盘外部快照恢复 | 详细见下 |
| eventId | String | fasle | 事件ID | revertDiskExternalSnapshot.event.001 |

对象revertDiskExternalSnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs，vdiskfs，nfs，glusterfs之一|localfs|
| pool|String|true|云盘所在的存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
| vol|String|true|云盘名|磁盘和快照|disk1|
| format|String|true|云盘文件的类型|qcow2|qcow2|
| domain|String|false|若该云盘加载到虚拟机内（包括系统盘、数据盘），虚拟机需要处于关机状态，且需要填写该虚拟机名，否则将报错Write lock|已存在的虚拟机名，由4-100位的数字和小写字母组成|950646e8c17a49d0b83c1c797811e001|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看RevertDiskExternalSnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 5.3 DeleteDiskExternalSnapshot(删除云盘外部快照)

**接口功能:**
	删除云盘外部快照，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘快照存在，即已调用过CreateDiskExternalSnapshot

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinedisksnapshot.Lifecycle.DeleteDiskExternalSnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteDiskExternalSnapshot.name.001|
| deleteDiskExternalSnapshot | DeleteDiskExternalSnapshot | true | 删除云盘外部快照 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteDiskExternalSnapshot.event.001 |

对象deleteDiskExternalSnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs，vdiskfs，nfs，glusterfs之一|localfs|
| pool|String|true|云盘所在的存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
| vol|String|true|云盘名|磁盘和快照|disk1|
| domain|String|false|若该云盘加载到虚拟机内（包括系统盘、数据盘），则需要填写该虚拟机名，否则将报错Write lock|已存在的虚拟机名，由4-100位的数字和小写字母组成|950646e8c17a49d0b83c1c797811e001|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteDiskExternalSnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## **返回值:**

```
{
	"kind":"VirtualMachineDiskSnapshot",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"lifecycle":{
			"createDiskExternalSnapshot":{
				"domain":"String",
				"format":"String",
				"pool":"String",
				"type":"String",
				"vol":"String"
			},
			"deleteDiskExternalSnapshot":{
				"domain":"String",
				"pool":"String",
				"type":"String",
				"vol":"String"
			},
			"revertDiskExternalSnapshot":{
				"domain":"String",
				"format":"String",
				"pool":"String",
				"type":"String",
				"vol":"String"
			}
		},
		"versions":[],
		"volume":{
			"snapshot":"String"
		}
	}
}
```
# 6 VirtualMachineSnapshot

虚拟机/云盘快照.VirtualMachineSnapshot所有操作的返回值一样，见**[返回值]**

## 6.1 DeleteSnapshot(删除虚拟机和挂载到虚拟机的云盘快照)

**接口功能:**
	删除虚拟机和挂载到虚拟机的云盘快照，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机/云盘快照存在，即已调用过CreateSnapshot

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinesnapshot.Lifecycle.DeleteSnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteSnapshot.name.001|
| deleteSnapshot | DeleteSnapshot | true | 删除虚拟机和挂载到虚拟机的云盘快照 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteSnapshot.event.001 |

对象deleteSnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要删除快照的虚拟机名字|由4-100位的数字和小写字母组成，已存在的虚拟机名|centos1|
| isExternal|Boolean|false|是否为外部快照|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteSnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 6.2 CreateSnapshot(创建虚拟机快照和挂载到虚拟机的云盘快照)

**接口功能:**
	创建虚拟机快照和挂载到虚拟机的云盘快照，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinesnapshot.Lifecycle.CreateSnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createSnapshot.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createSnapshot | CreateSnapshot | true | 创建虚拟机快照和挂载到虚拟机的云盘快照 | 详细见下 |
| eventId | String | fasle | 事件ID | createSnapshot.event.001 |

对象createSnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| diskspec|String|true|虚拟机快照的设置|vda(对哪个磁盘做快照，多个请参考示例),snapshot=external/internal/no(快照类型，支持external：外部,internal:内部,no:不做快照),file=/var/lib/libvirt/snapshots/snapshot1(快照文件的存放路径),drvier=qcow2（只支持qcow2）|只对系统盘做快照示例：vda,snapshot=external,file=/var/lib/libvirt/snapshots/snapshot1,drvier=qcow2 --diskspec vdb,snapshot=no|
| domain|String|true|与快照关联的虚拟机名字|已存在的虚拟机名，由4-100位的数字和小写字母组成|950646e8c17a49d0b83c1c797811e001|
| isExternal|Boolean|false|是否为外部快照|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateSnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 6.3 RevertVirtualMachine(恢复成虚拟机和挂载到虚拟机的云盘快照)

**接口功能:**
	恢复成虚拟机和挂载到虚拟机的云盘快照，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机/云盘快照存在，即已调用过CreateSnapshot

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinesnapshot.Lifecycle.RevertVirtualMachine

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | revertVirtualMachine.name.001|
| revertVirtualMachine | RevertVirtualMachine | true | 恢复成虚拟机和挂载到虚拟机的云盘快照 | 详细见下 |
| eventId | String | fasle | 事件ID | revertVirtualMachine.event.001 |

对象revertVirtualMachine参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要恢复到快照状态的虚拟机name|由4-100位的数字和小写字母组成，已存在的虚拟机名|centos1|
| running|Boolean|false|恢复到快照的状态后，是否将虚拟机转换到开机状态|true或者false|true|
| isExternal|Boolean|false|是否为外部快照|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看RevertVirtualMachinespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 6.4 CopySnapshot(全拷贝快照到文件)

**接口功能:**
	全拷贝快照到文件，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinesnapshot.Lifecycle.CopySnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | copySnapshot.name.001|
| copySnapshot | CopySnapshot | true | 全拷贝快照到文件 | 详细见下 |
| eventId | String | fasle | 事件ID | copySnapshot.event.001 |

对象copySnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| isExternal|Boolean|false|是否为外部快照|true或者false|true|
| domain|String|true|对该虚拟机进行快照合并，合并到叶子节点。假设当前快照链为root->snapshot1->snapshot2->current，则mergeSnapshot(snapshot1)的结果为把snapshot1,snapshot2合并到current，快照链变为root->top|由4-100位的数字和小写字母组成，已存在的虚拟机名|centos1|
| isExternal|Boolean|false|是否为外部快照|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CopySnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 6.5 MergeSnapshot(合并快照到叶子节点)

**接口功能:**
	合并快照到叶子节点，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinesnapshot.Lifecycle.MergeSnapshot

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | mergeSnapshot.name.001|
| mergeSnapshot | MergeSnapshot | true | 合并快照到叶子节点 | 详细见下 |
| eventId | String | fasle | 事件ID | mergeSnapshot.event.001 |

对象mergeSnapshot参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|对该虚拟机进行快照合并，合并到叶子节点。假设当前快照链为root->snapshot1->snapshot2->current，则mergeSnapshot(snapshot1)的结果为把snapshot1,snapshot2合并到current，快照链变为root->top|由4-100位的数字和小写字母组成，已存在的虚拟机名|centos1|
| isExternal|Boolean|false|是否为外部快照|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看MergeSnapshotspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## **返回值:**

```
{
	"kind":"VirtualMachineSnapshot",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"domainsnapshot":{
			"active":{
				"text":"String"
			},
			"cookie":{
				"cpu":{
					"_check":"String",
					"_match":"String",
					"_mode":"String",
					"feature":[
						{
							"_name":"String",
							"_policy":"String"
						},
						{
							"_name":"String",
							"_policy":"String"
						}
					],
					"model":{
						"_fallback":"String",
						"text":"String"
					}
				}
			},
			"creationTime":{
				"text":"String"
			},
			"description":{
				"text":"String"
			},
			"disks":{
				"disk":[
					{
						"_name":"String",
						"_snapshot":"String",
						"_type":"String",
						"driver":{
							"_type":"String"
						},
						"source":{
							"_file":"String",
							"_index":"String",
							"_startupPolicy":"String",
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"reservations":{
								"_enabled":"String",
								"_managed":"String",
								"source":{
									"_dev":"String",
									"_mode":"String",
									"_path":"String",
									"_type":"String"
								}
							}
						}
					},
					{
						"_name":"String",
						"_snapshot":"String",
						"_type":"String",
						"driver":{
							"_type":"String"
						},
						"source":{
							"_file":"String",
							"_index":"String",
							"_startupPolicy":"String",
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"reservations":{
								"_enabled":"String",
								"_managed":"String",
								"source":{
									"_dev":"String",
									"_mode":"String",
									"_path":"String",
									"_type":"String"
								}
							}
						}
					}
				]
			},
			"domain":{
				"_id":"String",
				"_type":"String",
				"blkiotune":{
					"device":[
						{
							"path":{
								"text":"String"
							},
							"read_bytes_sec":{
								"text":"String"
							},
							"read_iops_sec":{
								"text":"String"
							},
							"weight":{
								"text":"String"
							},
							"write_bytes_sec":{
								"text":"String"
							},
							"write_iops_sec":{
								"text":"String"
							}
						},
						{
							"path":{
								"text":"String"
							},
							"read_bytes_sec":{
								"text":"String"
							},
							"read_iops_sec":{
								"text":"String"
							},
							"weight":{
								"text":"String"
							},
							"write_bytes_sec":{
								"text":"String"
							},
							"write_iops_sec":{
								"text":"String"
							}
						}
					],
					"weight":{
						"text":"String"
					}
				},
				"bootloader":{
					"text":"String"
				},
				"bootloader_args":{
					"text":"String"
				},
				"clock":{
					"_adjustment":"String",
					"_basis":"String",
					"_offset":"String",
					"_timezone":"String",
					"timer":[
						{
							"_frequency":"String",
							"_mode":"String",
							"_name":"String",
							"_present":"String",
							"_tickpolicy":"String",
							"_track":"String",
							"catchup":{
								"_limit":"String",
								"_slew":"String",
								"_threshold":"String"
							}
						},
						{
							"_frequency":"String",
							"_mode":"String",
							"_name":"String",
							"_present":"String",
							"_tickpolicy":"String",
							"_track":"String",
							"catchup":{
								"_limit":"String",
								"_slew":"String",
								"_threshold":"String"
							}
						}
					]
				},
				"cpu":{
					"_check":"String",
					"_match":"String",
					"_mode":"String",
					"cache":{
						"_level":"String",
						"_mode":"String"
					},
					"feature":[
						{
							"_name":"String",
							"_policy":"String"
						},
						{
							"_name":"String",
							"_policy":"String"
						}
					],
					"model":{
						"_fallback":"String",
						"_vendor_id":"String",
						"text":"String"
					},
					"numa":{
						"cell":[
							{
								"_cpus":"String",
								"_discard":"String",
								"_id":"String",
								"_memAccess":"String",
								"_memory":"String",
								"_unit":"String",
								"distances":{
									"sibling":[
										{
											"_id":"String",
											"_value":"String"
										},
										{
											"_id":"String",
											"_value":"String"
										}
									]
								}
							},
							{
								"_cpus":"String",
								"_discard":"String",
								"_id":"String",
								"_memAccess":"String",
								"_memory":"String",
								"_unit":"String",
								"distances":{
									"sibling":[
										{
											"_id":"String",
											"_value":"String"
										},
										{
											"_id":"String",
											"_value":"String"
										}
									]
								}
							}
						]
					},
					"topology":{
						"_cores":"String",
						"_sockets":"String",
						"_threads":"String"
					},
					"vendor":{
						"text":"String"
					}
				},
				"cputune":{
					"cachetune":[
						{
							"_vcpus":"String",
							"cache":[
								{
									"_id":"String",
									"_level":"String",
									"_size":"String",
									"_type":"String",
									"_unit":"String"
								},
								{
									"_id":"String",
									"_level":"String",
									"_size":"String",
									"_type":"String",
									"_unit":"String"
								}
							],
							"monitor":[
								{
									"_level":"String",
									"_vcpus":"String"
								},
								{
									"_level":"String",
									"_vcpus":"String"
								}
							]
						},
						{
							"_vcpus":"String",
							"cache":[
								{
									"_id":"String",
									"_level":"String",
									"_size":"String",
									"_type":"String",
									"_unit":"String"
								},
								{
									"_id":"String",
									"_level":"String",
									"_size":"String",
									"_type":"String",
									"_unit":"String"
								}
							],
							"monitor":[
								{
									"_level":"String",
									"_vcpus":"String"
								},
								{
									"_level":"String",
									"_vcpus":"String"
								}
							]
						}
					],
					"emulator_period":{
						"text":"String"
					},
					"emulator_quota":{
						"text":"String"
					},
					"emulatorpin":{
						"_cpuset":"String"
					},
					"global_period":{
						"text":"String"
					},
					"global_quota":{
						"text":"String"
					},
					"iothread_period":{
						"text":"String"
					},
					"iothread_quota":{
						"text":"String"
					},
					"iothreadpin":[
						{
							"_cpuset":"String",
							"_iothread":"String"
						},
						{
							"_cpuset":"String",
							"_iothread":"String"
						}
					],
					"iothreadsched":[
						{
							"_iothreads":"String",
							"_priority":"String",
							"_scheduler":"String"
						},
						{
							"_iothreads":"String",
							"_priority":"String",
							"_scheduler":"String"
						}
					],
					"memorytune":[
						{
							"_vcpus":"String",
							"node":[
								{
									"_bandwidth":"String",
									"_id":"String"
								},
								{
									"_bandwidth":"String",
									"_id":"String"
								}
							]
						},
						{
							"_vcpus":"String",
							"node":[
								{
									"_bandwidth":"String",
									"_id":"String"
								},
								{
									"_bandwidth":"String",
									"_id":"String"
								}
							]
						}
					],
					"period":{
						"text":"String"
					},
					"quota":{
						"text":"String"
					},
					"shares":{
						"text":"String"
					},
					"vcpupin":[
						{
							"_cpuset":"String",
							"_vcpu":"String"
						},
						{
							"_cpuset":"String",
							"_vcpu":"String"
						}
					],
					"vcpusched":[
						{
							"_priority":"String",
							"_scheduler":"String",
							"_vcpus":"String"
						},
						{
							"_priority":"String",
							"_scheduler":"String",
							"_vcpus":"String"
						}
					]
				},
				"currentMemory":{
					"_unit":"String",
					"text":"String"
				},
				"description":{
					"text":"String"
				},
				"devices":{
					"_interface":[
						{
							"_managed":"String",
							"_trustGuestRxFilters":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"backend":{
								"_tap":"String",
								"_vhost":"String"
							},
							"bandwidth":{
								"inbound":{
									"_average":"String",
									"_burst":"String",
									"_floor":"String",
									"_peak":"String"
								},
								"outbound":{
									"_average":"String",
									"_burst":"String",
									"_floor":"String",
									"_peak":"String"
								}
							},
							"boot":{
								"_loadparm":"String",
								"_order":"String"
							},
							"coalesce":{
								"rx":{
									"frames":{
										"_max":"String"
									}
								}
							},
							"driver":{
								"_ats":"String",
								"_event_idx":"String",
								"_ioeventfd":"String",
								"_iommu":"String",
								"_name":"String",
								"_queues":"String",
								"_rx_queue_size":"String",
								"_tx_queue_size":"String",
								"_txmode":"String",
								"guest":{
									"_csum":"String",
									"_ecn":"String",
									"_tso4":"String",
									"_tso6":"String",
									"_ufo":"String"
								},
								"host":{
									"_csum":"String",
									"_ecn":"String",
									"_gso":"String",
									"_mrg_rxbuf":"String",
									"_tso4":"String",
									"_tso6":"String",
									"_ufo":"String"
								}
							},
							"filterref":{
								"_filter":"String",
								"parameter":[
									{
										"_name":"String",
										"_value":"String"
									},
									{
										"_name":"String",
										"_value":"String"
									}
								]
							},
							"guest":{
								"_actual":"String",
								"_dev":"String"
							},
							"ip":[
								{
									"_address":"String",
									"_family":"String",
									"_peer":"String",
									"_prefix":"String"
								},
								{
									"_address":"String",
									"_family":"String",
									"_peer":"String",
									"_prefix":"String"
								}
							],
							"link":{
								"_state":"String"
							},
							"mac":{
								"_address":"String"
							},
							"model":{
								"_type":"String"
							},
							"mtu":{
								"_size":"String"
							},
							"rom":{
								"_bar":"String",
								"_enabled":"String",
								"_file":"String"
							},
							"route":[
								{
									"_address":"String",
									"_family":"String",
									"_gateway":"String",
									"_metric":"String",
									"_netmask":"String",
									"_prefix":"String"
								},
								{
									"_address":"String",
									"_family":"String",
									"_gateway":"String",
									"_metric":"String",
									"_netmask":"String",
									"_prefix":"String"
								}
							],
							"script":{
								"_path":"String"
							},
							"source":{
								"_bridge":"String",
								"_dev":"String",
								"_mode":"String",
								"_network":"String",
								"_path":"String",
								"_type":"String"
							},
							"target":{
								"_dev":"String"
							},
							"tune":{
								"sndbuf":{
									"text":"String"
								}
							},
							"virtualport":{
								"_type":"String",
								"parameters":{
									"__interfaceid":"String",
									"_profileid":"String"
								}
							},
							"vlan":{
								"_trunk":"String",
								"tag":[
									{
										"_id":"String",
										"_nativeMode":"String"
									},
									{
										"_id":"String",
										"_nativeMode":"String"
									}
								]
							}
						},
						{
							"_managed":"String",
							"_trustGuestRxFilters":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"backend":{
								"_tap":"String",
								"_vhost":"String"
							},
							"bandwidth":{
								"inbound":{
									"_average":"String",
									"_burst":"String",
									"_floor":"String",
									"_peak":"String"
								},
								"outbound":{
									"_average":"String",
									"_burst":"String",
									"_floor":"String",
									"_peak":"String"
								}
							},
							"boot":{
								"_loadparm":"String",
								"_order":"String"
							},
							"coalesce":{
								"rx":{
									"frames":{
										"_max":"String"
									}
								}
							},
							"driver":{
								"_ats":"String",
								"_event_idx":"String",
								"_ioeventfd":"String",
								"_iommu":"String",
								"_name":"String",
								"_queues":"String",
								"_rx_queue_size":"String",
								"_tx_queue_size":"String",
								"_txmode":"String",
								"guest":{
									"_csum":"String",
									"_ecn":"String",
									"_tso4":"String",
									"_tso6":"String",
									"_ufo":"String"
								},
								"host":{
									"_csum":"String",
									"_ecn":"String",
									"_gso":"String",
									"_mrg_rxbuf":"String",
									"_tso4":"String",
									"_tso6":"String",
									"_ufo":"String"
								}
							},
							"filterref":{
								"_filter":"String",
								"parameter":[
									{
										"_name":"String",
										"_value":"String"
									},
									{
										"_name":"String",
										"_value":"String"
									}
								]
							},
							"guest":{
								"_actual":"String",
								"_dev":"String"
							},
							"ip":[
								{
									"_address":"String",
									"_family":"String",
									"_peer":"String",
									"_prefix":"String"
								},
								{
									"_address":"String",
									"_family":"String",
									"_peer":"String",
									"_prefix":"String"
								}
							],
							"link":{
								"_state":"String"
							},
							"mac":{
								"_address":"String"
							},
							"model":{
								"_type":"String"
							},
							"mtu":{
								"_size":"String"
							},
							"rom":{
								"_bar":"String",
								"_enabled":"String",
								"_file":"String"
							},
							"route":[
								{
									"_address":"String",
									"_family":"String",
									"_gateway":"String",
									"_metric":"String",
									"_netmask":"String",
									"_prefix":"String"
								},
								{
									"_address":"String",
									"_family":"String",
									"_gateway":"String",
									"_metric":"String",
									"_netmask":"String",
									"_prefix":"String"
								}
							],
							"script":{
								"_path":"String"
							},
							"source":{
								"_bridge":"String",
								"_dev":"String",
								"_mode":"String",
								"_network":"String",
								"_path":"String",
								"_type":"String"
							},
							"target":{
								"_dev":"String"
							},
							"tune":{
								"sndbuf":{
									"text":"String"
								}
							},
							"virtualport":{
								"_type":"String",
								"parameters":{
									"__interfaceid":"String",
									"_profileid":"String"
								}
							},
							"vlan":{
								"_trunk":"String",
								"tag":[
									{
										"_id":"String",
										"_nativeMode":"String"
									},
									{
										"_id":"String",
										"_nativeMode":"String"
									}
								]
							}
						}
					],
					"channel":[
						{
							"_type":"String",
							"address":{
								"_bus":"String",
								"_controller":"String",
								"_port":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"log":{
								"_append":"String",
								"_file":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{
								"_mode":"String",
								"_path":"String"
							},
							"target":{
								"_name":"String",
								"_state":"String",
								"_type":"String"
							}
						},
						{
							"_type":"String",
							"address":{
								"_bus":"String",
								"_controller":"String",
								"_port":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"log":{
								"_append":"String",
								"_file":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{
								"_mode":"String",
								"_path":"String"
							},
							"target":{
								"_name":"String",
								"_state":"String",
								"_type":"String"
							}
						}
					],
					"console":[
						{
							"_tty":"String",
							"_type":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"log":{
								"_append":"String",
								"_file":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{
								"_path":"String"
							},
							"target":{
								"_port":"String",
								"_type":"String"
							}
						},
						{
							"_tty":"String",
							"_type":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"log":{
								"_append":"String",
								"_file":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{
								"_path":"String"
							},
							"target":{
								"_port":"String",
								"_type":"String"
							}
						}
					],
					"controller":[
						{
							"_index":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_multifunction":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"driver":{
								"_ats":"String",
								"_cmd_per_lun":"String",
								"_ioeventfd":"String",
								"_iommu":"String",
								"_iothread":"String",
								"_max_sectors":"String",
								"_queues":"String"
							},
							"master":{
								"_startport":"String"
							},
							"model":"String",
							"target":{
								"_chassis":"String",
								"_chassisNr":"String",
								"_port":"String"
							}
						},
						{
							"_index":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_multifunction":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"driver":{
								"_ats":"String",
								"_cmd_per_lun":"String",
								"_ioeventfd":"String",
								"_iommu":"String",
								"_iothread":"String",
								"_max_sectors":"String",
								"_queues":"String"
							},
							"master":{
								"_startport":"String"
							},
							"model":"String",
							"target":{
								"_chassis":"String",
								"_chassisNr":"String",
								"_port":"String"
							}
						}
					],
					"disk":[
						{
							"_device":"String",
							"_model":"String",
							"_rawio":"String",
							"_sgio":"String",
							"_snapshot":"String",
							"_transient":{},
							"_type":"String",
							"address":{
								"_bus":"String",
								"_controller":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_target":"String",
								"_type":"String",
								"_unit":"String"
							},
							"alias":{
								"_name":"String"
							},
							"auth":{
								"_username":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"backingStore":{
								"_file":"String",
								"_index":"String",
								"_type":"String",
								"format":{
									"_type":"String"
								},
								"source":{
									"_dev":"String",
									"_file":"String",
									"_index":"String",
									"_startupPolicy":"String",
									"encryption":{
										"_format":"String",
										"secret":{
											"_type":"String",
											"_usage":"String",
											"_uuid":"String"
										}
									},
									"reservations":{
										"_enabled":"String",
										"_managed":"String",
										"source":{
											"_dev":"String",
											"_mode":"String",
											"_path":"String",
											"_type":"String"
										}
									}
								}
							},
							"blockio":{
								"_logical_block_size":"String",
								"_physical_block_size":"String"
							},
							"boot":{
								"_loadparm":"String",
								"_order":"String"
							},
							"driver":{
								"_ats":"String",
								"_cache":"String",
								"_copy_on_read":"String",
								"_detect_zeroes":"String",
								"_discard":"String",
								"_error_policy":"String",
								"_event_idx":"String",
								"_io":"String",
								"_ioeventfd":"String",
								"_iommu":"String",
								"_iothread":"String",
								"_name":"String",
								"_queues":"String",
								"_rerror_policy":"String",
								"_type":"String"
							},
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"geometry":{
								"_cyls":"String",
								"_heads":"String",
								"_secs":"String",
								"_trans":"String"
							},
							"iotune":{
								"group_name":{
									"text":"String"
								},
								"read_bytes_sec":{
									"text":"String"
								},
								"read_bytes_sec_max":{
									"text":"String"
								},
								"read_bytes_sec_max_length":{
									"text":"String"
								},
								"read_iops_sec":{
									"text":"String"
								},
								"read_iops_sec_max":{
									"text":"String"
								},
								"read_iops_sec_max_length":{
									"text":"String"
								},
								"size_iops_sec":{
									"text":"String"
								},
								"total_bytes_sec":{
									"text":"String"
								},
								"total_bytes_sec_max":{
									"text":"String"
								},
								"total_bytes_sec_max_length":{
									"text":"String"
								},
								"total_iops_sec":{
									"text":"String"
								},
								"total_iops_sec_max":{
									"text":"String"
								},
								"total_iops_sec_max_length":{
									"text":"String"
								},
								"write_bytes_sec":{
									"text":"String"
								},
								"write_bytes_sec_max":{
									"text":"String"
								},
								"write_bytes_sec_max_length":{
									"text":"String"
								},
								"write_iops_sec":{
									"text":"String"
								},
								"write_iops_sec_max":{
									"text":"String"
								},
								"write_iops_sec_max_length":{
									"text":"String"
								}
							},
							"mirror":{
								"_job":"String",
								"_ready":"String",
								"format":{
									"_type":"String"
								},
								"source":{
									"_index":"String",
									"_startupPolicy":"String",
									"encryption":{
										"_format":"String",
										"secret":{
											"_type":"String",
											"_usage":"String",
											"_uuid":"String"
										}
									},
									"reservations":{
										"_enabled":"String",
										"_managed":"String",
										"source":{
											"_dev":"String",
											"_mode":"String",
											"_path":"String",
											"_type":"String"
										}
									}
								}
							},
							"product":{
								"text":"String"
							},
							"readonly":{},
							"serial":{
								"_type":"String",
								"text":"String"
							},
							"shareable":{},
							"source":{
								"_controller":"String",
								"_dev":"String",
								"_file":"String",
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							},
							"target":{
								"_bus":"String",
								"_dev":"String",
								"_removable":"String",
								"_tray":"String"
							},
							"vendor":{
								"text":"String"
							},
							"wwn":{
								"text":"String"
							}
						},
						{
							"_device":"String",
							"_model":"String",
							"_rawio":"String",
							"_sgio":"String",
							"_snapshot":"String",
							"_transient":{},
							"_type":"String",
							"address":{
								"_bus":"String",
								"_controller":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_target":"String",
								"_type":"String",
								"_unit":"String"
							},
							"alias":{
								"_name":"String"
							},
							"auth":{
								"_username":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"backingStore":{
								"_file":"String",
								"_index":"String",
								"_type":"String",
								"format":{
									"_type":"String"
								},
								"source":{
									"_dev":"String",
									"_file":"String",
									"_index":"String",
									"_startupPolicy":"String",
									"encryption":{
										"_format":"String",
										"secret":{
											"_type":"String",
											"_usage":"String",
											"_uuid":"String"
										}
									},
									"reservations":{
										"_enabled":"String",
										"_managed":"String",
										"source":{
											"_dev":"String",
											"_mode":"String",
											"_path":"String",
											"_type":"String"
										}
									}
								}
							},
							"blockio":{
								"_logical_block_size":"String",
								"_physical_block_size":"String"
							},
							"boot":{
								"_loadparm":"String",
								"_order":"String"
							},
							"driver":{
								"_ats":"String",
								"_cache":"String",
								"_copy_on_read":"String",
								"_detect_zeroes":"String",
								"_discard":"String",
								"_error_policy":"String",
								"_event_idx":"String",
								"_io":"String",
								"_ioeventfd":"String",
								"_iommu":"String",
								"_iothread":"String",
								"_name":"String",
								"_queues":"String",
								"_rerror_policy":"String",
								"_type":"String"
							},
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"geometry":{
								"_cyls":"String",
								"_heads":"String",
								"_secs":"String",
								"_trans":"String"
							},
							"iotune":{
								"group_name":{
									"text":"String"
								},
								"read_bytes_sec":{
									"text":"String"
								},
								"read_bytes_sec_max":{
									"text":"String"
								},
								"read_bytes_sec_max_length":{
									"text":"String"
								},
								"read_iops_sec":{
									"text":"String"
								},
								"read_iops_sec_max":{
									"text":"String"
								},
								"read_iops_sec_max_length":{
									"text":"String"
								},
								"size_iops_sec":{
									"text":"String"
								},
								"total_bytes_sec":{
									"text":"String"
								},
								"total_bytes_sec_max":{
									"text":"String"
								},
								"total_bytes_sec_max_length":{
									"text":"String"
								},
								"total_iops_sec":{
									"text":"String"
								},
								"total_iops_sec_max":{
									"text":"String"
								},
								"total_iops_sec_max_length":{
									"text":"String"
								},
								"write_bytes_sec":{
									"text":"String"
								},
								"write_bytes_sec_max":{
									"text":"String"
								},
								"write_bytes_sec_max_length":{
									"text":"String"
								},
								"write_iops_sec":{
									"text":"String"
								},
								"write_iops_sec_max":{
									"text":"String"
								},
								"write_iops_sec_max_length":{
									"text":"String"
								}
							},
							"mirror":{
								"_job":"String",
								"_ready":"String",
								"format":{
									"_type":"String"
								},
								"source":{
									"_index":"String",
									"_startupPolicy":"String",
									"encryption":{
										"_format":"String",
										"secret":{
											"_type":"String",
											"_usage":"String",
											"_uuid":"String"
										}
									},
									"reservations":{
										"_enabled":"String",
										"_managed":"String",
										"source":{
											"_dev":"String",
											"_mode":"String",
											"_path":"String",
											"_type":"String"
										}
									}
								}
							},
							"product":{
								"text":"String"
							},
							"readonly":{},
							"serial":{
								"_type":"String",
								"text":"String"
							},
							"shareable":{},
							"source":{
								"_controller":"String",
								"_dev":"String",
								"_file":"String",
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							},
							"target":{
								"_bus":"String",
								"_dev":"String",
								"_removable":"String",
								"_tray":"String"
							},
							"vendor":{
								"text":"String"
							},
							"wwn":{
								"text":"String"
							}
						}
					],
					"emulator":{
						"text":"String"
					},
					"filesystem":[
						{
							"_accessmode":"String",
							"_model":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"driver":{
								"_ats":"String",
								"_format":"String",
								"_iommu":"String",
								"_name":"String",
								"_type":"String",
								"_wrpolicy":"String"
							},
							"readonly":{},
							"source":{},
							"space_hard_limit":{
								"_unit":"String",
								"text":"String"
							},
							"space_soft_limit":{
								"_unit":"String",
								"text":"String"
							},
							"target":{
								"_dir":"String"
							}
						},
						{
							"_accessmode":"String",
							"_model":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"driver":{
								"_ats":"String",
								"_format":"String",
								"_iommu":"String",
								"_name":"String",
								"_type":"String",
								"_wrpolicy":"String"
							},
							"readonly":{},
							"source":{},
							"space_hard_limit":{
								"_unit":"String",
								"text":"String"
							},
							"space_soft_limit":{
								"_unit":"String",
								"text":"String"
							},
							"target":{
								"_dir":"String"
							}
						}
					],
					"graphics":[
						{
							"_autoport":"String",
							"_port":"String",
							"_type":"String",
							"image":{
								"_compression":"String"
							},
							"listen":"String"
						},
						{
							"_autoport":"String",
							"_port":"String",
							"_type":"String",
							"image":{
								"_compression":"String"
							},
							"listen":"String"
						}
					],
					"hostdev":[
						{
							"_managed":"String",
							"_mode":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_device":"String",
								"_domain":"String",
								"_function":"String",
								"_port":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"boot":{
								"_loadparm":"String",
								"_order":"String"
							},
							"driver":{
								"_name":"String"
							},
							"rom":{
								"_bar":"String",
								"_enabled":"String",
								"_file":"String"
							},
							"source":{
								"address":{
									"_bus":"String",
									"_device":"String",
									"_domain":"String",
									"_function":"String",
									"_slot":"String"
								}
							}
						},
						{
							"_managed":"String",
							"_mode":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_device":"String",
								"_domain":"String",
								"_function":"String",
								"_port":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"boot":{
								"_loadparm":"String",
								"_order":"String"
							},
							"driver":{
								"_name":"String"
							},
							"rom":{
								"_bar":"String",
								"_enabled":"String",
								"_file":"String"
							},
							"source":{
								"address":{
									"_bus":"String",
									"_device":"String",
									"_domain":"String",
									"_function":"String",
									"_slot":"String"
								}
							}
						}
					],
					"hub":[
						{
							"_type":"String",
							"address":{
								"_bus":"String",
								"_port":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							}
						},
						{
							"_type":"String",
							"address":{
								"_bus":"String",
								"_port":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							}
						}
					],
					"input":[
						{
							"_bus":"String",
							"_model":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_port":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"driver":{
								"_ats":"String",
								"_iommu":"String"
							},
							"source":{
								"_evdev":"String"
							}
						},
						{
							"_bus":"String",
							"_model":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_port":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"driver":{
								"_ats":"String",
								"_iommu":"String"
							},
							"source":{
								"_evdev":"String"
							}
						}
					],
					"iommu":{
						"_model":"String",
						"driver":{
							"_caching_mode":"String",
							"_eim":"String",
							"_intremap":"String",
							"_iotlb":"String"
						}
					},
					"lease":[
						{
							"key":{
								"text":"String"
							},
							"lockspace":{
								"text":"String"
							},
							"target":{
								"_offset":"String",
								"_path":"String"
							}
						},
						{
							"key":{
								"text":"String"
							},
							"lockspace":{
								"text":"String"
							},
							"target":{
								"_offset":"String",
								"_path":"String"
							}
						}
					],
					"memballoon":{
						"_autodeflate":"String",
						"_model":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"stats":{
							"_period":"String"
						}
					},
					"memory":[
						{
							"_access":"String",
							"_discard":"String",
							"_model":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"source":{
								"alignsize":{
									"_unit":"String",
									"text":"String"
								},
								"nodemask":{
									"text":"String"
								},
								"pagesize":{
									"_unit":"String",
									"text":"String"
								},
								"path":{
									"text":"String"
								},
								"pmem":{}
							},
							"target":{
								"label":{
									"size":{
										"_unit":"String",
										"text":"String"
									}
								},
								"node":{
									"text":"String"
								},
								"readonly":{},
								"size":{
									"_unit":"String",
									"text":"String"
								}
							}
						},
						{
							"_access":"String",
							"_discard":"String",
							"_model":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"source":{
								"alignsize":{
									"_unit":"String",
									"text":"String"
								},
								"nodemask":{
									"text":"String"
								},
								"pagesize":{
									"_unit":"String",
									"text":"String"
								},
								"path":{
									"text":"String"
								},
								"pmem":{}
							},
							"target":{
								"label":{
									"size":{
										"_unit":"String",
										"text":"String"
									}
								},
								"node":{
									"text":"String"
								},
								"readonly":{},
								"size":{
									"_unit":"String",
									"text":"String"
								}
							}
						}
					],
					"nvram":{
						"address":{},
						"alias":{
							"_name":"String"
						}
					},
					"panic":[
						{
							"_model":"String",
							"address":{},
							"alias":{
								"_name":"String"
							}
						},
						{
							"_model":"String",
							"address":{},
							"alias":{
								"_name":"String"
							}
						}
					],
					"parallel":[
						{
							"address":{},
							"alias":{
								"_name":"String"
							},
							"log":{
								"_append":"String",
								"_file":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{},
							"target":{
								"_port":"String",
								"_type":"String"
							}
						},
						{
							"address":{},
							"alias":{
								"_name":"String"
							},
							"log":{
								"_append":"String",
								"_file":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{},
							"target":{
								"_port":"String",
								"_type":"String"
							}
						}
					],
					"redirdev":[
						{
							"_bus":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_port":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"boot":{
								"_loadparm":"String",
								"_order":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{}
						},
						{
							"_bus":"String",
							"_type":"String",
							"address":{
								"_bus":"String",
								"_port":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"boot":{
								"_loadparm":"String",
								"_order":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{}
						}
					],
					"redirfilter":[
						{
							"usbdev":[
								{
									"_allow":"String",
									"_class":"String",
									"_product":"String",
									"_vendor":"String",
									"_version":"String"
								},
								{
									"_allow":"String",
									"_class":"String",
									"_product":"String",
									"_vendor":"String",
									"_version":"String"
								}
							]
						},
						{
							"usbdev":[
								{
									"_allow":"String",
									"_class":"String",
									"_product":"String",
									"_vendor":"String",
									"_version":"String"
								},
								{
									"_allow":"String",
									"_class":"String",
									"_product":"String",
									"_vendor":"String",
									"_version":"String"
								}
							]
						}
					],
					"rng":[
						{
							"_model":"String",
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"backend":{
								"_model":"String",
								"text":"String"
							},
							"driver":{
								"_ats":"String",
								"_iommu":"String"
							},
							"rate":{
								"_bytes":"String",
								"_period":"String"
							}
						},
						{
							"_model":"String",
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"backend":{
								"_model":"String",
								"text":"String"
							},
							"driver":{
								"_ats":"String",
								"_iommu":"String"
							},
							"rate":{
								"_bytes":"String",
								"_period":"String"
							}
						}
					],
					"serial":[
						{
							"_type":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"log":{
								"_append":"String",
								"_file":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{
								"_path":"String"
							},
							"target":{
								"_port":"String",
								"_type":"String",
								"model":{
									"_name":"String"
								}
							}
						},
						{
							"_type":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"log":{
								"_append":"String",
								"_file":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{
								"_path":"String"
							},
							"target":{
								"_port":"String",
								"_type":"String",
								"model":{
									"_name":"String"
								}
							}
						}
					],
					"shmem":[
						{
							"_name":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"model":{
								"_type":"String"
							},
							"msi":{
								"_enabled":"String",
								"_ioeventfd":"String",
								"_vectors":"String"
							},
							"server":{
								"_path":"String"
							},
							"size":{
								"_unit":"String",
								"text":"String"
							}
						},
						{
							"_name":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"model":{
								"_type":"String"
							},
							"msi":{
								"_enabled":"String",
								"_ioeventfd":"String",
								"_vectors":"String"
							},
							"server":{
								"_path":"String"
							},
							"size":{
								"_unit":"String",
								"text":"String"
							}
						}
					],
					"smartcard":[
						{
							"address":{},
							"alias":{
								"_name":"String"
							},
							"certificate":[
								{
									"text":"String"
								},
								{
									"text":"String"
								}
							],
							"database":{
								"text":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{}
						},
						{
							"address":{},
							"alias":{
								"_name":"String"
							},
							"certificate":[
								{
									"text":"String"
								},
								{
									"text":"String"
								}
							],
							"database":{
								"text":"String"
							},
							"protocol":{
								"_type":"String"
							},
							"source":{}
						}
					],
					"sound":[
						{
							"_model":"String",
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"codec":[
								{
									"_type":"String"
								},
								{
									"_type":"String"
								}
							]
						},
						{
							"_model":"String",
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"codec":[
								{
									"_type":"String"
								},
								{
									"_type":"String"
								}
							]
						}
					],
					"tpm":[
						{
							"_model":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"backend":{}
						},
						{
							"_model":"String",
							"address":{},
							"alias":{
								"_name":"String"
							},
							"backend":{}
						}
					],
					"video":[
						{
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"driver":{
								"_ats":"String",
								"_iommu":"String",
								"_vgaconf":"String"
							},
							"model":{
								"_heads":"String",
								"_primary":"String",
								"_ram":"String",
								"_type":"String",
								"_vgamem":"String",
								"_vram":"String",
								"_vram64":"String",
								"acceleration":{
									"_accel2d":"String",
									"_accel3d":"String"
								}
							}
						},
						{
							"address":{
								"_bus":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String",
								"_type":"String"
							},
							"alias":{
								"_name":"String"
							},
							"driver":{
								"_ats":"String",
								"_iommu":"String",
								"_vgaconf":"String"
							},
							"model":{
								"_heads":"String",
								"_primary":"String",
								"_ram":"String",
								"_type":"String",
								"_vgamem":"String",
								"_vram":"String",
								"_vram64":"String",
								"acceleration":{
									"_accel2d":"String",
									"_accel3d":"String"
								}
							}
						}
					],
					"vsock":{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"cid":{
							"_address":"String",
							"_auto":"String"
						}
					},
					"watchdog":{
						"_action":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						}
					}
				},
				"features":{
					"acpi":{},
					"apic":{
						"_eoi":"String"
					},
					"capabilities":{
						"_policy":"String",
						"audit_control":{
							"_state":"String"
						},
						"audit_write":{
							"_state":"String"
						},
						"block_suspend":{
							"_state":"String"
						},
						"chown":{
							"_state":"String"
						},
						"dac_override":{
							"_state":"String"
						},
						"dac_read_Search":{
							"_state":"String"
						},
						"fowner":{
							"_state":"String"
						},
						"fsetid":{
							"_state":"String"
						},
						"ipc_lock":{
							"_state":"String"
						},
						"ipc_owner":{
							"_state":"String"
						},
						"kill":{
							"_state":"String"
						},
						"lease":{
							"_state":"String"
						},
						"linux_immutable":{
							"_state":"String"
						},
						"mac_admin":{
							"_state":"String"
						},
						"mac_override":{
							"_state":"String"
						},
						"mknod":{
							"_state":"String"
						},
						"net_admin":{
							"_state":"String"
						},
						"net_bind_service":{
							"_state":"String"
						},
						"net_broadcast":{
							"_state":"String"
						},
						"net_raw":{
							"_state":"String"
						},
						"setfcap":{
							"_state":"String"
						},
						"setgid":{
							"_state":"String"
						},
						"setpcap":{
							"_state":"String"
						},
						"setuid":{
							"_state":"String"
						},
						"sys_admin":{
							"_state":"String"
						},
						"sys_boot":{
							"_state":"String"
						},
						"sys_chroot":{
							"_state":"String"
						},
						"sys_module":{
							"_state":"String"
						},
						"sys_nice":{
							"_state":"String"
						},
						"sys_pacct":{
							"_state":"String"
						},
						"sys_ptrace":{
							"_state":"String"
						},
						"sys_rawio":{
							"_state":"String"
						},
						"sys_resource":{
							"_state":"String"
						},
						"sys_time":{
							"_state":"String"
						},
						"sys_tty_config":{
							"_state":"String"
						},
						"syslog":{
							"_state":"String"
						},
						"wake_alarm":{
							"_state":"String"
						}
					},
					"gic":{
						"_version":"String"
					},
					"hap":{
						"_state":"String"
					},
					"hpt":{
						"_resizing":"String",
						"maxpagesize":{
							"_unit":"String",
							"text":"String"
						}
					},
					"htm":{
						"_state":"String"
					},
					"hyperv":{
						"evmcs":{
							"_state":"String"
						},
						"frequencies":{
							"_state":"String"
						},
						"ipi":{
							"_state":"String"
						},
						"reenlightenment":{
							"_state":"String"
						},
						"relaxed":{
							"_state":"String"
						},
						"reset":{
							"_state":"String"
						},
						"runtime":{
							"_state":"String"
						},
						"spinlocks":{
							"_retries":"String",
							"_state":"String"
						},
						"stimer":{
							"_state":"String"
						},
						"synic":{
							"_state":"String"
						},
						"tlbflush":{
							"_state":"String"
						},
						"vapic":{
							"_state":"String"
						},
						"vendor_id":{
							"_value":"String"
						},
						"vpindex":{
							"_state":"String"
						}
					},
					"ioapic":{
						"_driver":"String"
					},
					"kvm":{
						"hidden":{
							"_state":"String"
						}
					},
					"msrs":{
						"_unknown":"String"
					},
					"nested_hv":{
						"_state":"String"
					},
					"pae":{},
					"pmu":{
						"_state":"String"
					},
					"privnet":{},
					"pvspinlock":{
						"_state":"String"
					},
					"smm":{
						"_state":"String",
						"tseg":{
							"_unit":"String",
							"text":"String"
						}
					},
					"viridian":{},
					"vmcoreinfo":{
						"_state":"String"
					},
					"vmport":{
						"_state":"String"
					}
				},
				"genid":{
					"text":"String"
				},
				"idmap":{
					"gid":[
						{
							"_count":"String",
							"_start":"String",
							"_target":"String"
						},
						{
							"_count":"String",
							"_start":"String",
							"_target":"String"
						}
					],
					"uid":[
						{
							"_count":"String",
							"_start":"String",
							"_target":"String"
						},
						{
							"_count":"String",
							"_start":"String",
							"_target":"String"
						}
					]
				},
				"iothreadids":{
					"iothread":[
						{
							"_id":"String"
						},
						{
							"_id":"String"
						}
					]
				},
				"iothreads":{
					"text":"String"
				},
				"keywrap":{
					"cipher":[
						{
							"_name":"String",
							"_state":"String"
						},
						{
							"_name":"String",
							"_state":"String"
						}
					]
				},
				"launchSecurity":{},
				"maxMemory":{
					"_slots":"String",
					"_unit":"String",
					"text":"String"
				},
				"memory":{
					"_dumpCore":"String",
					"_unit":"String",
					"text":"String"
				},
				"memoryBacking":{
					"access":{
						"_mode":"String"
					},
					"allocation":{
						"_mode":"String"
					},
					"discard":{},
					"hugepages":{
						"page":[
							{
								"_nodeset":"String",
								"_size":"String",
								"_unit":"String"
							},
							{
								"_nodeset":"String",
								"_size":"String",
								"_unit":"String"
							}
						]
					},
					"locked":{},
					"nosharepages":{},
					"source":{
						"_type":"String"
					}
				},
				"memtune":{
					"hard_limit":{
						"_unit":"String",
						"text":"String"
					},
					"min_guarantee":{
						"_unit":"String",
						"text":"String"
					},
					"soft_limit":{
						"_unit":"String",
						"text":"String"
					},
					"swap_hard_limit":{
						"_unit":"String",
						"text":"String"
					}
				},
				"metadata":{},
				"name":{
					"text":"String"
				},
				"numatune":{
					"memnode":[
						{
							"_cellid":"String",
							"_mode":"String",
							"_nodeset":"String"
						},
						{
							"_cellid":"String",
							"_mode":"String",
							"_nodeset":"String"
						}
					],
					"memory":{
						"_mode":"String",
						"_nodeset":"String",
						"_placement":"String"
					}
				},
				"on_crash":{
					"text":"String"
				},
				"on_poweroff":{
					"text":"String"
				},
				"on_reboot":{
					"text":"String"
				},
				"os":{
					"acpi":{
						"table":[
							{
								"_type":"String",
								"text":"String"
							},
							{
								"_type":"String",
								"text":"String"
							}
						]
					},
					"bios":{
						"_rebootTimeout":"String",
						"_useserial":"String"
					},
					"boot":[
						{
							"_dev":"String"
						},
						{
							"_dev":"String"
						}
					],
					"bootmenu":{
						"_enable":"String",
						"_timeout":"String"
					},
					"cmdline":{
						"text":"String"
					},
					"dtb":{
						"text":"String"
					},
					"init":{
						"text":"String"
					},
					"initarg":{
						"text":"String"
					},
					"initdir":{
						"text":"String"
					},
					"initenv":[
						{
							"_name":"String",
							"text":"String"
						},
						{
							"_name":"String",
							"text":"String"
						}
					],
					"initgroup":{
						"text":"String"
					},
					"initrd":{
						"text":"String"
					},
					"inituser":{
						"text":"String"
					},
					"kernel":{
						"text":"String"
					},
					"loader":{
						"_readonly":"String",
						"_type":"String",
						"text":"String"
					},
					"nvram":{
						"text":"String"
					},
					"smbios":{
						"_mode":"String"
					},
					"type":{
						"_arch":"String",
						"_machine":"String",
						"text":"String"
					}
				},
				"perf":{
					"event":[
						{
							"_enabled":"String",
							"_name":"String"
						},
						{
							"_enabled":"String",
							"_name":"String"
						}
					]
				},
				"pm":{
					"suspend_to_disk":{
						"_enabled":"String"
					},
					"suspend_to_mem":{
						"_enabled":"String"
					}
				},
				"resource":{
					"partition":{
						"text":"String"
					}
				},
				"seclabel":[
					{
						"_model":"String",
						"_relabel":"String",
						"_type":"String",
						"baselabel":{
							"text":"String"
						},
						"imagelabel":{
							"text":"String"
						},
						"label":{
							"text":"String"
						}
					},
					{
						"_model":"String",
						"_relabel":"String",
						"_type":"String",
						"baselabel":{
							"text":"String"
						},
						"imagelabel":{
							"text":"String"
						},
						"label":{
							"text":"String"
						}
					}
				],
				"sysinfo":{
					"_type":"String",
					"baseBoard":[
						{
							"entry":[
								{
									"_name":"String",
									"text":"String"
								},
								{
									"_name":"String",
									"text":"String"
								}
							]
						},
						{
							"entry":[
								{
									"_name":"String",
									"text":"String"
								},
								{
									"_name":"String",
									"text":"String"
								}
							]
						}
					],
					"bios":{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					},
					"chassis":{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					},
					"memory":[
						{
							"entry":[
								{
									"_name":"String",
									"text":"String"
								},
								{
									"_name":"String",
									"text":"String"
								}
							]
						},
						{
							"entry":[
								{
									"_name":"String",
									"text":"String"
								},
								{
									"_name":"String",
									"text":"String"
								}
							]
						}
					],
					"oemStrings":{
						"entry":{
							"text":"String"
						}
					},
					"processor":[
						{
							"entry":[
								{
									"_name":"String",
									"text":"String"
								},
								{
									"_name":"String",
									"text":"String"
								}
							]
						},
						{
							"entry":[
								{
									"_name":"String",
									"text":"String"
								},
								{
									"_name":"String",
									"text":"String"
								}
							]
						}
					],
					"system":{
						"entry":[
							{
								"_name":"String",
								"text":"String"
							},
							{
								"_name":"String",
								"text":"String"
							}
						]
					}
				},
				"title":{
					"text":"String"
				},
				"uuid":{
					"text":"String"
				},
				"vcpu":{
					"_cpuset":"String",
					"_current":"String",
					"_placement":"String",
					"text":"String"
				},
				"vcpus":{
					"vcpu":[
						{
							"_enabled":"String",
							"_hotpluggable":"String",
							"_id":"String",
							"_order":"String"
						},
						{
							"_enabled":"String",
							"_hotpluggable":"String",
							"_id":"String",
							"_order":"String"
						}
					]
				}
			},
			"memory":{
				"_file":"String",
				"_snapshot":"String"
			},
			"name":{
				"text":"String"
			},
			"parent":{
				"name":{
					"text":"String"
				}
			},
			"state":{
				"text":"String"
			}
		},
		"lifecycle":{
			"copySnapshot":{
				"blockdev":true,
				"buf_size":"String",
				"dest":"String",
				"finish":true,
				"granularity":"String",
				"isExternal":true,
				"pivot":true,
				"reuse_external":true,
				"shallow":true,
				"transient_job":true
			},
			"createSnapshot":{
				"atomic":true,
				"description":"String",
				"disk_only":true,
				"diskspec":"String",
				"domain":"String",
				"halt":true,
				"isExternal":true,
				"live":true,
				"memspec":"String",
				"no_metadata":true,
				"quiesce":true,
				"reuse_external":true
			},
			"deleteSnapshot":{
				"children":true,
				"children_only":true,
				"domain":"String",
				"isExternal":true,
				"metadata":true
			},
			"mergeSnapshot":{
				"bandwidth":"String",
				"domain":"String",
				"isExternal":true
			},
			"revertVirtualMachine":{
				"domain":"String",
				"force":true,
				"isExternal":true,
				"paused":true,
				"running":true
			}
		},
		"versions":[]
	}
}
```
# 7 VirtualMachinePool

扩展支持各种存储后端.VirtualMachinePool所有操作的返回值一样，见**[返回值]**

## 7.1 AutoStartPool(开机启动存储池)

**接口功能:**
	开机启动存储池，否则开机该存储池会连接不上，导致不可用。适用libvirt指令创建存储池情况。只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存储池存在，即已调用过CreatePool

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.AutoStartPool

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | autoStartPool.name.001|
| autoStartPool | AutoStartPool | true | 开机启动存储池 | 详细见下 |
| eventId | String | fasle | 事件ID | autoStartPool.event.001 |

对象autoStartPool参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|false|存储池的类型|只能是localfs，vdiskfs, nfs，glusterfs之一|localfs|
| disable|Boolean|true|修改存储池autostart状态|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看AutoStartPoolspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.2 CreatePool(创建存储池)

**接口功能:**
	创建存储池，适用libvirt指令创建存储池情况。只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.CreatePool

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createPool.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createPool | CreatePool | true | 创建存储池 | 详细见下 |
| eventId | String | fasle | 事件ID | createPool.event.001 |

对象createPool参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|true|存储池的类型|只能是localfs，uus，nfs，glusterfs, vdiskfs之一|localfs|
| content|String|true|存储池的内容，用于标识存储池的用途|只能是vmd，vmdi，iso之一|vmd|
| url|String|true|创建云存储池时的url|建立云存储池时通过cstor-cli pool-list查询出的云存储池路径|uus-iscsi-independent://admin:admin@192.168.3.10:7000/p1/4/2/0/32/0/3|
| opt|String|false|nfs、gfs挂载参数或uus的创建选项，为存储类型为uus和nfs、gfs时必填，本地存储和vdiskfs不填|当type为nfs、gfs类型时，作为挂载参数|nolock|
| uuid|String|true|cstor存储池的名字，与挂载路径有关|对所有类型必填，由数字和字母组成|07098ca5fd174fccafed76b0d7fccde4|
| autostart|boolean|false|创建存储池后是否设置为自动打开|true或false|true|
| force|String|false|强力创建vdiskfs|True或False|True|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreatePoolspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.3 StartPool(启动存储池)

**接口功能:**
	启动存储池，如果存储池处于Inactive状态，可以启动。适用libvirt指令创建存储池情况。只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存储池存在，即已调用过CreatePool

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.StartPool

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | startPool.name.001|
| startPool | StartPool | true | 启动存储池 | 详细见下 |
| eventId | String | fasle | 事件ID | startPool.event.001 |

对象startPool参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|false|存储池的类型|只能是localfs，vdiskfs，nfs，glusterfs之一|localfs|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看StartPoolspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.4 StopPool(停止存储池)

**接口功能:**
	停止存储池，将存储池状态设置为Inactive，适用libvirt指令创建存储池情况。只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存储池存在，即已调用过CreatePool

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.StopPool

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | stopPool.name.001|
| stopPool | StopPool | true | 停止存储池 | 详细见下 |
| eventId | String | fasle | 事件ID | stopPool.event.001 |

对象stopPool参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|false|存储池的类型|只能是localfs，vdiskfs，nfs，glusterfs之一|localfs|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看StopPoolspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.5 DeletePool(删除存储池)

**接口功能:**
	删除存储池，适用libvirt指令创建存储池情况。只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存储池存在，即已调用过CreatePool

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.DeletePool

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deletePool.name.001|
| deletePool | DeletePool | true | 删除存储池 | 详细见下 |
| eventId | String | fasle | 事件ID | deletePool.event.001 |

对象deletePool参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|false|存储池的类型|只能是localfs，vdiskfs，uus，nfs，glusterfs, vdiskfs之一|localfs|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeletePoolspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.6 ShowPool(查询存储池)

**接口功能:**
	调用本接口后会同步存储池的当前状态并注册到k8s，再使用GetVMPool接口获得当前存储池状态，适用libvirt指令创建存储池情况。只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存储池存在，即已调用过CreatePool

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.ShowPool

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | showPool.name.001|
| showPool | ShowPool | true | 查询存储池 | 详细见下 |
| eventId | String | fasle | 事件ID | showPool.event.001 |

对象showPool参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| type|String|false|存储池的类型|只能是localfs，vdiskfs，uus，nfs，glusterfs, vdiskfs之一|localfs|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ShowPoolspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.7 RestoreVMBackup(恢复虚拟机)

**接口功能:**
	恢复虚拟机，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.RestoreVMBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | restoreVMBackup.name.001|
| restoreVMBackup | RestoreVMBackup | true | 恢复虚拟机 | 详细见下 |
| eventId | String | fasle | 事件ID | restoreVMBackup.event.001 |

对象restoreVMBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|备份时使用云主机|备份时使用云主机|a63dd73f92a24a9ab840492f0e538f2b|
| pool|String|true|备份主机使用的存储池|备份主机使用的存储池|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| all|boolean|false|备份虚拟机所有的盘，否则只备份系统盘，需要注意的是恢复带有数据云盘的记录时，数据云盘必须还挂载在该虚拟机上|备份虚拟机所有的盘，否则只备份系统盘，需要注意的是恢复带有数据云盘的记录时，数据云盘必须还挂载在该虚拟机上|true|
| newname|String|false|新建虚拟机的名字|新建虚拟机的名字|13024b305b5c463b80bceee066077079|
| target|String|false|新建虚拟机时所使用的存储池|新建虚拟机所使用的存储池|13024b305b5c463b80bceee066077079|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看RestoreVMBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.8 DeleteRemoteBackup(删除远程备份)

**接口功能:**
	删除远程备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.DeleteRemoteBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteRemoteBackup.name.001|
| deleteRemoteBackup | DeleteRemoteBackup | true | 删除远程备份 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteRemoteBackup.event.001 |

对象deleteRemoteBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要清理云主机或云盘的远程备份所在的云主机|要清理云主机或云盘的远程备份所在的云主机|a63dd73f92a24a9ab840492f0e538f2b|
| vol|String|false|仅删除该云主机的云盘备份|仅删除该云主机的云盘备份|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| remote|String|false|远程备份的ftp主机ip|远程备份的ftp主机ip|172.16.1.214|
| port|String|false|远程备份的ftp主机端口|远程备份的ftp主机端口|21|
| username|String|false|远程备份的ftp用户名|ftpuser|ftpuser|
| password|String|false|远程备份的ftp密码|ftpuser|ftpuser|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteRemoteBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.9 PullRemoteBackup(拉取远程备份)

**接口功能:**
	拉取远程备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.PullRemoteBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | pullRemoteBackup.name.001|
| pullRemoteBackup | PullRemoteBackup | true | 拉取远程备份 | 详细见下 |
| eventId | String | fasle | 事件ID | pullRemoteBackup.event.001 |

对象pullRemoteBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要拉取云盘或云主机的远程备份所在的云主机|要拉取云盘或云主机的远程备份所在的云主机|a63dd73f92a24a9ab840492f0e538f2b|
| pool|String|true|拉取备份后使用的存储池|拉取备份后使用的存储池|61024b305b5c463b80bceee066077079|
| vol|String|false|仅拉取该云主机的云盘备份|仅拉取云盘备份|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| remote|String|true|远程备份的ftp主机ip|远程备份的ftp主机ip|172.16.1.214|
| port|String|true|远程备份的ftp主机端口|远程备份的ftp主机端口|21|
| username|String|true|远程备份的ftp用户名|ftpuser|ftpuser|
| password|String|true|远程备份的ftp密码|ftpuser|ftpuser|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看PullRemoteBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.10 PushRemoteBackup(上传备份)

**接口功能:**
	上传备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.PushRemoteBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | pushRemoteBackup.name.001|
| pushRemoteBackup | PushRemoteBackup | true | 上传备份 | 详细见下 |
| eventId | String | fasle | 事件ID | pushRemoteBackup.event.001 |

对象pushRemoteBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要推送的云主机或云盘备份所在的云主机|要推送的云主机或云盘备份所在的云主机|a63dd73f92a24a9ab840492f0e538f2b|
| pool|String|true|备份使用的存储池|备份使用的存储池|61024b305b5c463b80bceee066077079|
| vol|String|false|仅上传该云主机的云盘备份|仅上传该云主机的云盘备份|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
| remote|String|true|远程备份的ftp主机ip|远程备份的ftp主机ip|172.16.1.214|
| port|String|true|远程备份的ftp主机端口|远程备份的ftp主机端口|21|
| username|String|true|远程备份的ftp用户名|ftpuser|ftpuser|
| password|String|true|远程备份的ftp密码|ftpuser|ftpuser|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看PushRemoteBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.11 DeleteVMBackup(删除本地备份)

**接口功能:**
	删除本地备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.DeleteVMBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteVMBackup.name.001|
| deleteVMBackup | DeleteVMBackup | true | 删除本地备份 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteVMBackup.event.001 |

对象deleteVMBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要删除备份记录所在的云主机|要删除备份记录所在的云主机|a63dd73f92a24a9ab840492f0e538f2b|
| pool|String|true|备份主机使用的存储池|备份主机使用的存储池|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteVMBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.12 CleanVMBackup(清理本地备份)

**接口功能:**
	清理本地备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.CleanVMBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | cleanVMBackup.name.001|
| cleanVMBackup | CleanVMBackup | true | 清理本地备份 | 详细见下 |
| eventId | String | fasle | 事件ID | cleanVMBackup.event.001 |

对象cleanVMBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要清理云盘或云主机备份所在的云主机|要清理云盘或云主机备份所在的云主机|a63dd73f92a24a9ab840492f0e538f2b|
| pool|String|true|云主机备份时使用的存储池|云主机备份时使用的存储池|61024b305b5c463b80bceee066077079|
| vol|String|false|仅清除该云主机的云盘备份|仅清除该云主机的云盘备份|61024b305b5c463b80bceee066077079|
| version|String|false|备份记录的版本号，多个版本号以逗号隔开|备份记录的版本号|13024b305b5c463b80bceee066077079|
| all|boolean|false|清除云主机或云盘所有备份|清除云主机或云盘所有备份|13024b305b5c463b80bceee066077079|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CleanVMBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.13 CleanVMRemoteBackup(清理远端备份)

**接口功能:**
	清理远端备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.CleanVMRemoteBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | cleanVMRemoteBackup.name.001|
| cleanVMRemoteBackup | CleanVMRemoteBackup | true | 清理远端备份 | 详细见下 |
| eventId | String | fasle | 事件ID | cleanVMRemoteBackup.event.001 |

对象cleanVMRemoteBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要清理云盘的远程备份所在的云主机|要清理云盘的远程备份所在的云主机|a63dd73f92a24a9ab840492f0e538f2b|
| vol|String|false|仅清除该云主机的云盘备份|仅清除该云主机的云盘备份|61024b305b5c463b80bceee066077079|
| version|String|false|备份记录的版本号，多个版本号以逗号隔开|备份记录的版本号|13024b305b5c463b80bceee066077079|
| all|boolean|false|清除云主机或云盘所有备份|清除云主机或云盘所有备份|13024b305b5c463b80bceee066077079|
| remote|String|true|远程备份的ftp主机ip|远程备份的ftp主机ip|172.16.1.214|
| port|String|true|远程备份的ftp主机端口|远程备份的ftp主机端口|21|
| username|String|true|远程备份的ftp用户名|ftpuser|ftpuser|
| password|String|true|远程备份的ftp密码|ftpuser|ftpuser|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CleanVMRemoteBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.14 ScanVMBackup(扫描本地备份)

**接口功能:**
	扫描本地备份，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机存在，即已调用过CreatePool, CreateSwitch, CreateDisk/CreateDiskImage, CreateAndStartVMFromISO/CreateAndStartVMFromImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.ScanVMBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | scanVMBackup.name.001|
| scanVMBackup | ScanVMBackup | true | 扫描本地备份 | 详细见下 |
| eventId | String | fasle | 事件ID | scanVMBackup.event.001 |

对象scanVMBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要扫描云盘的备份所在的云主机|要扫描云盘的备份所在的云主机|a63dd73f92a24a9ab840492f0e538f2b|
| pool|String|true|云主机备份时使用的存储池|云主机备份时使用的存储池|61024b305b5c463b80bceee066077079|
| vol|String|false|仅扫描该云主机的云盘备份|仅扫描该云主机的云盘备份|61024b305b5c463b80bceee066077079|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ScanVMBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.15 RestoreDisk(恢复云盘)

**接口功能:**
	从备份恢复云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.RestoreDisk

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | restoreDisk.name.001|
| restoreDisk | RestoreDisk | true | 恢复云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | restoreDisk.event.001 |

对象restoreDisk参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要恢复的云盘备份记录所在的云主机|要恢复的云盘备份记录所在的云主机|a63dd73f92a24a9ab840492f0e538f2b|
| pool|String|true|云盘备份所在的存储池|云盘备份所在的存储池|172.16.1.214|
| vol|String|true|云主机的云盘备份所使用的的云盘id|云主机的云盘备份所使用的的云盘id|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|172.16.1.214|
| newname|String|false|新建云盘的名字|新建云盘的名字|a63dd73f92a24a9ab840492f0e538f2b|
| target|String|false|根据备份记录新建云盘时使用的存储池|根据备份记录新建云盘时使用的存储池|pooltest|
| targetDomain|String|false|新建云盘要挂载到的虚拟机|新建云盘要挂载到的虚拟机|172.16.1.214|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看RestoreDiskspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 7.16 DeleteVMDiskBackup(删除本地云盘)

**接口功能:**
	删除本地云盘，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	云盘存在，即已调用过CreateDisk/CreateDiskFromDiskImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinepool.Lifecycle.DeleteVMDiskBackup

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteVMDiskBackup.name.001|
| deleteVMDiskBackup | DeleteVMDiskBackup | true | 删除本地云盘 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteVMDiskBackup.event.001 |

对象deleteVMDiskBackup参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| domain|String|true|要删除云盘的备份所在的云主机|要删除云盘的备份所在的云主机|a63dd73f92a24a9ab840492f0e538f2b|
| pool|String|true|备份主机云盘使用的存储池|备份主机云盘使用的存储池|61024b305b5c463b80bceee066077079|
| vol|String|true|云盘id|云盘id|61024b305b5c463b80bceee066077079|
| version|String|true|备份记录的版本号|备份记录的版本号|13024b305b5c463b80bceee066077079|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteVMDiskBackupspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## **返回值:**

```
{
	"kind":"VirtualMachinePool",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"lifecycle":{
			"autoStartPool":{
				"disable":true,
				"type":"String"
			},
			"cleanVMBackup":{
				"all":true,
				"domain":"String",
				"pool":"String",
				"version":"String",
				"vol":"String"
			},
			"cleanVMRemoteBackup":{
				"all":true,
				"domain":"String",
				"password":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"createPool":{
				"adapter_name":"String",
				"adapter_parent":"String",
				"adapter_parent_fabric_wwn":"String",
				"adapter_parent_wwnn":"String",
				"adapter_parent_wwpn":"String",
				"adapter_wwnn":"String",
				"adapter_wwpn":"String",
				"auth_type":"String",
				"auth_username":"String",
				"autostart":true,
				"build":true,
				"content":"String",
				"force":"String",
				"no_overwrite":true,
				"opt":"String",
				"overwrite":true,
				"secret_usage":"String",
				"secret_uuid":"String",
				"source_dev":"String",
				"source_format":"String",
				"source_host":"String",
				"source_name":"String",
				"source_path":"String",
				"type":"String",
				"url":"String",
				"uuid":"String"
			},
			"deletePool":{
				"type":"String"
			},
			"deleteRemoteBackup":{
				"domain":"String",
				"password":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"deleteVMBackup":{
				"domain":"String",
				"pool":"String",
				"version":"String"
			},
			"deleteVMDiskBackup":{
				"domain":"String",
				"pool":"String",
				"version":"String",
				"vol":"String"
			},
			"pullRemoteBackup":{
				"domain":"String",
				"password":"String",
				"pool":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"pushRemoteBackup":{
				"domain":"String",
				"password":"String",
				"pool":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"restoreDisk":{
				"domain":"String",
				"newname":"String",
				"pool":"String",
				"target":"String",
				"targetDomain":"String",
				"version":"String",
				"vol":"String"
			},
			"restoreVMBackup":{
				"all":true,
				"domain":"String",
				"newname":"String",
				"pool":"String",
				"target":"String",
				"version":"String"
			},
			"scanVMBackup":{
				"domain":"String",
				"pool":"String",
				"vol":"String"
			},
			"showPool":{
				"type":"String"
			},
			"startPool":{
				"build":true,
				"no_overwrite":true,
				"overwrite":true,
				"type":"String"
			},
			"stopPool":{
				"type":"String"
			}
		},
		"pool":{
			"_type":"String",
			"autostart":"String",
			"capacity":"String",
			"content":"String",
			"free":"String",
			"name":"String",
			"path":"String",
			"persistent":"String",
			"pool":"String",
			"poolname":"String",
			"pooltype":"String",
			"state":"String",
			"uuid":"String"
		},
		"versions":[]
	}
}
```
# 8 VirtualMachineNetwork

扩展支持OVN插件.VirtualMachineNetwork所有操作的返回值一样，见**[返回值]**

## 8.1 CreateBridge(创建二层桥接网络，用于vlan场景)

**接口功能:**
	创建二层桥接，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.CreateBridge

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createBridge.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createBridge | CreateBridge | true | 创建二层桥接网络，用于vlan场景 | 详细见下 |
| eventId | String | fasle | 事件ID | createBridge.event.001 |

对象createBridge参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| nic|String|true|被接管的网卡|名称是字符串类型，长度是3到12位，只允许数字、小写字母、中划线、以及圆点|l2bridge|
| name|String|true|桥接的名字|桥接名，3到12位，只允许数字、小写字母、中划线|l2bridge|
| vlan|String|false|vlan ID|0~4094|1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateBridgespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.2 DeleteBridge(删除二层桥接网络)

**接口功能:**
	删除二层桥接,只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机网络存在，即已调用过CreateSwitch

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.DeleteBridge

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteBridge.name.001|
| deleteBridge | DeleteBridge | true | 删除二层桥接网络 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteBridge.event.001 |

对象deleteBridge参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| nic|String|true|被接管的网卡|名称是字符串类型，长度是3到12位，只允许数字、小写字母、中划线、以及圆点|l2bridge|
| name|String|true|桥接的名字|桥接名，3到12位，只允许数字、小写字母、中划线|l2bridge|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteBridgespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.3 SetBridgeVlan(设置二层网桥的vlan ID)

**接口功能:**
	适用于OpenvSwitch二层网桥，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机网络存在，即已调用过CreateSwitch

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.SetBridgeVlan

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | setBridgeVlan.name.001|
| setBridgeVlan | SetBridgeVlan | true | 设置二层网桥的vlan ID | 详细见下 |
| eventId | String | fasle | 事件ID | setBridgeVlan.event.001 |

对象setBridgeVlan参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| vlan|String|true|vlan ID|0~4094|1|
| name|String|true|桥接的名字|桥接名，3到12位，只允许数字、小写字母、中划线|l2bridge|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看SetBridgeVlanspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.4 DelBridgeVlan(删除二层网桥的vlan ID)

**接口功能:**
	适用于OpenvSwitch二层网桥，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机网络存在，即已调用过CreateSwitch

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.DelBridgeVlan

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | delBridgeVlan.name.001|
| delBridgeVlan | DelBridgeVlan | true | 删除二层网桥的vlan ID | 详细见下 |
| eventId | String | fasle | 事件ID | delBridgeVlan.event.001 |

对象delBridgeVlan参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| vlan|String|true|vlan ID|0~4094|1|
| name|String|true|桥接的名字|桥接名，3到12位，只允许数字、小写字母、中划线|l2bridge|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DelBridgeVlanspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.5 BindPortVlan(给虚拟机绑定vlan ID)

**接口功能:**
	适用于OpenvSwitch二层网桥，更换虚拟机的vlan只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机网络存在，即已调用过CreateSwitch

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.BindPortVlan

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | bindPortVlan.name.001|
| bindPortVlan | BindPortVlan | true | 给虚拟机绑定vlan ID | 详细见下 |
| eventId | String | fasle | 事件ID | bindPortVlan.event.001 |

对象bindPortVlan参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| mac|String|true|mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
| domain|String|true|虚拟机名称|4-100位，包含小写字母，数字0-9，中划线，以及圆点|950646e8c17a49d0b83c1c797811e004|
| vlan|String|false|vlan ID|0~4094|1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看BindPortVlanspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.6 UnbindPortVlan(解除虚拟机的vlan ID)

**接口功能:**
	适用于OpenvSwitch二层网桥，更换虚拟机的vlan只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机网络存在，即已调用过CreateSwitch

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.UnbindPortVlan

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | unbindPortVlan.name.001|
| unbindPortVlan | UnbindPortVlan | true | 解除虚拟机的vlan ID | 详细见下 |
| eventId | String | fasle | 事件ID | unbindPortVlan.event.001 |

对象unbindPortVlan参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| mac|String|true|mac地址|mac地址不能以fe开头|7e:0c:b0:ef:6a:04|
| domain|String|true|虚拟机名称|4-100位，包含小写字母，数字0-9，中划线，以及圆点|950646e8c17a49d0b83c1c797811e004|
| vlan|String|false|vlan ID|0~4094|1|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看UnbindPortVlanspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.7 CreateSwitch(创建三层网络交换机)

**接口功能:**
	创建三层网络交换机，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.CreateSwitch

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createSwitch.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createSwitch | CreateSwitch | true | 创建三层网络交换机 | 详细见下 |
| eventId | String | fasle | 事件ID | createSwitch.event.001 |

对象createSwitch参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| subnet|String|true|网段，这里后台只会做形式，不会做逻辑判断，只要符合xx.xx.xx.xx/y形式即可，请确保传入正确的数值, y的取值必须是8,16,24之一|网段和掩码|192.168.5.1/24|
| dhcp|String|false|DHCP地址|IP|192.168.5.5|
| gateway|String|true|网关地址|IP|192.168.5.5|
| mtu|String|false|mtu|10-1000|1500|
| bridge|String|false|网桥名|网桥|br-ex|
| vlanId|String|false|vlanID|0-4094|br-ex|
| excludeIPs|String|false|IP列表黑名单|单个IP之间通过空格分开，IP范围使用..分开|192.168.5.2 192.168.5.10..192.168.5.100|
| dnsServer|String|false|域名服务器|IP地址，允许多个，以,号分开|192.168.5.5|
| ipv6|String|false|是否ipv6|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateSwitchspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.8 DeleteSwitch(删除三层网络交换机)

**接口功能:**
	删除三层网络交换机，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机网络存在，即已调用过CreateSwitch

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.DeleteSwitch

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteSwitch.name.001|
| deleteSwitch | DeleteSwitch | true | 删除三层网络交换机 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteSwitch.event.001 |

对象deleteSwitch参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| bridge|String|false|网桥名|网桥|br-ex|
| ipv6|String|false|是否ipv6|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteSwitchspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.9 ModifySwitch(修改三层网络交换机配置)

**接口功能:**
	修改三层网络交换机配置，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.ModifySwitch

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | modifySwitch.name.001|
| modifySwitch | ModifySwitch | true | 修改三层网络交换机配置 | 详细见下 |
| eventId | String | fasle | 事件ID | modifySwitch.event.001 |

对象modifySwitch参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| gateway|String|false|网关地址|IP|192.168.5.5|
| mtu|String|false|mtu|10-1000|1500|
| dnsServer|String|false|域名服务器|IP地址|192.168.5.5|
| dhcp|String|false|DHCP地址|IP|192.168.5.5|
| vlanId|String|false|vlanID|0-4094|br-ex|
| ipv6|String|false|是否ipv6|true或者false|true|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ModifySwitchspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.10 CreateAddress(创建地址列表)

**接口功能:**
	创建地址列表，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.CreateAddress

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | createAddress.name.001|
| nodeName | String | false | 选择部署的物理机，可以通过kubernetes.nodes().list进行查询 | node22 |
| createAddress | CreateAddress | true | 创建地址列表 | 详细见下 |
| eventId | String | fasle | 事件ID | createAddress.event.001 |

对象createAddress参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| address|String|true|地址列表|IP以,分割|192.168.1.1，192.168.1.2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateAddressspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.11 DeleteAddress(删除地址列表)

**接口功能:**
	删除地址列表，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机网络存在，即已调用过CreateSwitch

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.DeleteAddress

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteAddress.name.001|
| deleteAddress | DeleteAddress | true | 删除地址列表 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteAddress.event.001 |

对象deleteAddress参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteAddressspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 8.12 ModifyAddress(修改地址列表)

**接口功能:**
	修改地址列表，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachinenetwork.Lifecycle.ModifyAddress

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | modifyAddress.name.001|
| modifyAddress | ModifyAddress | true | 修改地址列表 | 详细见下 |
| eventId | String | fasle | 事件ID | modifyAddress.event.001 |

对象modifyAddress参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| address|String|true|地址列表|IP以,分割|192.168.1.1，192.168.1.2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ModifyAddressspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## **返回值:**

```
{
	"kind":"VirtualMachineNetwork",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"data":{
			"addressInfo":{
				"_uuid":"String",
				"addresses":"String",
				"external_ids":"String",
				"name":"String"
			},
			"bridgeInfo":{
				"name":"String",
				"ports":[
					{
						"interfaces":[
							{
								"mac":"String",
								"name":"String",
								"uuid":"String"
							},
							{
								"mac":"String",
								"name":"String",
								"uuid":"String"
							}
						],
						"name":"String",
						"uuid":"String",
						"vlan":"String"
					},
					{
						"interfaces":[
							{
								"mac":"String",
								"name":"String",
								"uuid":"String"
							},
							{
								"mac":"String",
								"name":"String",
								"uuid":"String"
							}
						],
						"name":"String",
						"uuid":"String",
						"vlan":"String"
					}
				],
				"uuid":"String"
			},
			"gatewayInfo":{
				"id":"String",
				"lease_time":"String",
				"router":"String",
				"server_id":"String",
				"server_mac":"String"
			},
			"routerInfo":{
				"id":"String",
				"name":"String",
				"nat":[
					{
						"externalIP":"String",
						"gateway":"String",
						"logicalIP":"String",
						"name":"String",
						"type":"String"
					},
					{
						"externalIP":"String",
						"gateway":"String",
						"logicalIP":"String",
						"name":"String",
						"type":"String"
					}
				],
				"ports":[
					{
						"gateway":"String",
						"mac":"String",
						"name":"String",
						"networks":"String"
					},
					{
						"gateway":"String",
						"mac":"String",
						"name":"String",
						"networks":"String"
					}
				]
			},
			"switchInfo":{
				"id":"String",
				"name":"String",
				"ports":[
					{
						"addresses":{},
						"name":"String",
						"router_port":"String",
						"tag":"String",
						"type":"String"
					},
					{
						"addresses":{},
						"name":"String",
						"router_port":"String",
						"tag":"String",
						"type":"String"
					}
				]
			}
		},
		"lifecycle":{
			"bindPortVlan":{
				"domain":"String",
				"mac":"String",
				"vlan":"String"
			},
			"createAddress":{
				"address":"String"
			},
			"createBridge":{
				"name":"String",
				"nic":"String",
				"vlan":"String"
			},
			"createSwitch":{
				"bridge":"String",
				"dhcp":"String",
				"dnsServer":"String",
				"excludeIPs":"String",
				"gateway":"String",
				"ipv6":"String",
				"mtu":"String",
				"subnet":"String",
				"vlanId":"String"
			},
			"delBridgeVlan":{
				
			},
			"deleteAddress":{},
			"deleteBridge":{
				"name":"String",
				"nic":"String"
			},
			"deleteSwitch":{
				"bridge":"String",
				"ipv6":"String"
			},
			"modifyAddress":{
				
			},
			"modifySwitch":{
				"dhcp":"String",
				"dnsServer":"String",
				"gateway":"String",
				"ipv6":"String",
				"mtu":"String",
				"vlanId":"String"
			},
			"setBridgeVlan":{
				"name":"String",
				"vlan":"String"
			},
			"unbindPortVlan":{
				
			}
		},
		"type":"String",
		"versions":[]
	}
}
```
# 9 VirtualMachineBackup

扩展支持各种容灾功能.VirtualMachineBackup所有操作的返回值一样，见**[返回值]**

## **返回值:**

```
{
	"kind":"VirtualMachineBackup",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"backup":{
			"disk":"String",
			"domain":"String",
			"full":"String",
			"pool":"String",
			"time":"String",
			"version":"String"
		},
		"lifecycle":{
			"autoStartPool":{
				"disable":true,
				"type":"String"
			},
			"cleanVMBackup":{
				"all":true,
				"domain":"String",
				"pool":"String",
				"version":"String",
				"vol":"String"
			},
			"cleanVMRemoteBackup":{
				"all":true,
				"domain":"String",
				"password":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"createPool":{
				"adapter_name":"String",
				"adapter_parent":"String",
				"adapter_parent_fabric_wwn":"String",
				"adapter_parent_wwnn":"String",
				"adapter_parent_wwpn":"String",
				"adapter_wwnn":"String",
				"adapter_wwpn":"String",
				"auth_type":"String",
				"auth_username":"String",
				"autostart":true,
				"build":true,
				"content":"String",
				"force":"String",
				"no_overwrite":true,
				"opt":"String",
				"overwrite":true,
				"secret_usage":"String",
				"secret_uuid":"String",
				"source_dev":"String",
				"source_format":"String",
				"source_host":"String",
				"source_name":"String",
				"source_path":"String",
				"type":"String",
				"url":"String",
				"uuid":"String"
			},
			"deletePool":{
				"type":"String"
			},
			"deleteRemoteBackup":{
				"domain":"String",
				"password":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"deleteVMBackup":{
				"domain":"String",
				"pool":"String",
				"version":"String"
			},
			"deleteVMDiskBackup":{
				"domain":"String",
				"pool":"String",
				"version":"String",
				"vol":"String"
			},
			"pullRemoteBackup":{
				"domain":"String",
				"password":"String",
				"pool":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"pushRemoteBackup":{
				"domain":"String",
				"password":"String",
				"pool":"String",
				"port":"String",
				"remote":"String",
				"username":"String",
				"version":"String",
				"vol":"String"
			},
			"restoreDisk":{
				"domain":"String",
				"newname":"String",
				"pool":"String",
				"target":"String",
				"targetDomain":"String",
				"version":"String",
				"vol":"String"
			},
			"restoreVMBackup":{
				"all":true,
				"domain":"String",
				"newname":"String",
				"pool":"String",
				"target":"String",
				"version":"String"
			},
			"scanVMBackup":{
				"domain":"String",
				"pool":"String",
				"vol":"String"
			},
			"showPool":{
				"type":"String"
			},
			"startPool":{
				"build":true,
				"no_overwrite":true,
				"overwrite":true,
				"type":"String"
			},
			"stopPool":{
				"type":"String"
			}
		},
		"versions":[]
	}
}
```

出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看CreateImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 2.2 DeleteImage(删除虚拟机镜像)

**接口功能:**
	删除虚拟机镜像，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机镜像存在，即已调用过CreateImage/ConvertVMToImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachineimage.Lifecycle.DeleteImage

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | deleteImage.name.001|
| deleteImage | DeleteImage | true | 删除虚拟机镜像 | 详细见下 |
| eventId | String | fasle | 事件ID | deleteImage.event.001 |

对象deleteImage参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看DeleteImagespec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## 2.3 ConvertImageToVM(将虚拟机镜像转化为虚拟机)

**接口功能:**
	将虚拟机镜像转化为虚拟机，只会返回True或者异常返回True意味着提交到Kubernetes成功，并不代表执行成功(异步设计)。开发人员需要通过监听Event和Watcher方法获取更详细信息；如果提交到Kubernetes后执行错误，请查看[接口异常]

**接口依赖:**
	虚拟机镜像存在，即已调用过CreateImage/ConvertVMToImage

**接口所属:**
	com.github.kubesys.kubernetes.api.model.virtualmachineimage.Lifecycle.ConvertImageToVM

**参数描述:**

| name | type | required | description | exampe |
| ----- | ------ | ------ | ------ | ------ |
| name | String | true | 资源名称 | convertImageToVM.name.001|
| convertImageToVM | ConvertImageToVM | true | 将虚拟机镜像转化为虚拟机 | 详细见下 |
| eventId | String | fasle | 事件ID | convertImageToVM.event.001 |

对象convertImageToVM参数说明:

| name | type | required | description | constraint | example |
| ----- | ------ | ------ | ------ | ------ | ------ |
| targetPool|String|true|目标存储池名|由4-100位的数字和小写字母组成，已创建出的存储池|pool2|
|  |  |  |  |  |

**接口异常:**

(1)在调用本方法抛出;

| name  | description | 
| ----- | ----- | 
| RuntimeException |  重名，或则资源(VirtualMachine, VirtualMachinePool等)不存在   |
| IllegalFormatException | 传递的参数不符合约束条件    |
| Exception    | 后台代码异常，比如未安装VM的Kubernets插件    |

(2)调用本方法返回True，因本API是异步处理，开发者需要进一步监听是否正确执行。本文考虑第(2)种情况请查看ConvertImageToVMspec下的status域，从message中获取详细异常信息

| name  | description | 
| ----- | ----- | 
| LibvirtError | 因传递错误参数，或者后台缺少软件包导致执行Libvirt命令出错   |
| VirtctlError | Libvirt不支持的生命周期    |
| VirtletError | Libvirt监听事件错误，比如绕开Kubernetes,后台执行操作  |
| Exception    | 后台代码异常退出,比如主机的hostname变化    |

## **返回值:**

```
{
	"kind":"VirtualMachineImage",
	"metadata":{
		"additionalProperties":{},
		"finalizers":[],
		"managedFields":[],
		"ownerReferences":[]
	},
	"spec":{
		"additionalPrinterColumns":[],
		"additionalProperties":{},
		"domain":{
			"_id":"String",
			"_type":"String",
			"blkiotune":{
				"device":[
					{
						"path":{
							"text":"String"
						},
						"read_bytes_sec":{
							"text":"String"
						},
						"read_iops_sec":{
							"text":"String"
						},
						"weight":{
							"text":"String"
						},
						"write_bytes_sec":{
							"text":"String"
						},
						"write_iops_sec":{
							"text":"String"
						}
					},
					{
						"path":{
							"text":"String"
						},
						"read_bytes_sec":{
							"text":"String"
						},
						"read_iops_sec":{
							"text":"String"
						},
						"weight":{
							"text":"String"
						},
						"write_bytes_sec":{
							"text":"String"
						},
						"write_iops_sec":{
							"text":"String"
						}
					}
				],
				"weight":{
					"text":"String"
				}
			},
			"bootloader":{
				"text":"String"
			},
			"bootloader_args":{
				"text":"String"
			},
			"clock":{
				"_adjustment":"String",
				"_basis":"String",
				"_offset":"String",
				"_timezone":"String",
				"timer":[
					{
						"_frequency":"String",
						"_mode":"String",
						"_name":"String",
						"_present":"String",
						"_tickpolicy":"String",
						"_track":"String",
						"catchup":{
							"_limit":"String",
							"_slew":"String",
							"_threshold":"String"
						}
					},
					{
						"_frequency":"String",
						"_mode":"String",
						"_name":"String",
						"_present":"String",
						"_tickpolicy":"String",
						"_track":"String",
						"catchup":{
							"_limit":"String",
							"_slew":"String",
							"_threshold":"String"
						}
					}
				]
			},
			"cpu":{
				"_check":"String",
				"_match":"String",
				"_mode":"String",
				"cache":{
					"_level":"String",
					"_mode":"String"
				},
				"feature":[
					{
						"_name":"String",
						"_policy":"String"
					},
					{
						"_name":"String",
						"_policy":"String"
					}
				],
				"model":{
					"_fallback":"String",
					"_vendor_id":"String",
					"text":"String"
				},
				"numa":{
					"cell":[
						{
							"_cpus":"String",
							"_discard":"String",
							"_id":"String",
							"_memAccess":"String",
							"_memory":"String",
							"_unit":"String",
							"distances":{
								"sibling":[
									{
										"_id":"String",
										"_value":"String"
									},
									{
										"_id":"String",
										"_value":"String"
									}
								]
							}
						},
						{
							"_cpus":"String",
							"_discard":"String",
							"_id":"String",
							"_memAccess":"String",
							"_memory":"String",
							"_unit":"String",
							"distances":{
								"sibling":[
									{
										"_id":"String",
										"_value":"String"
									},
									{
										"_id":"String",
										"_value":"String"
									}
								]
							}
						}
					]
				},
				"topology":{
					"_cores":"String",
					"_sockets":"String",
					"_threads":"String"
				},
				"vendor":{
					"text":"String"
				}
			},
			"cputune":{
				"cachetune":[
					{
						"_vcpus":"String",
						"cache":[
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							},
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							}
						],
						"monitor":[
							{
								"_level":"String",
								"_vcpus":"String"
							},
							{
								"_level":"String",
								"_vcpus":"String"
							}
						]
					},
					{
						"_vcpus":"String",
						"cache":[
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							},
							{
								"_id":"String",
								"_level":"String",
								"_size":"String",
								"_type":"String",
								"_unit":"String"
							}
						],
						"monitor":[
							{
								"_level":"String",
								"_vcpus":"String"
							},
							{
								"_level":"String",
								"_vcpus":"String"
							}
						]
					}
				],
				"emulator_period":{
					"text":"String"
				},
				"emulator_quota":{
					"text":"String"
				},
				"emulatorpin":{
					"_cpuset":"String"
				},
				"global_period":{
					"text":"String"
				},
				"global_quota":{
					"text":"String"
				},
				"iothread_period":{
					"text":"String"
				},
				"iothread_quota":{
					"text":"String"
				},
				"iothreadpin":[
					{
						"_cpuset":"String",
						"_iothread":"String"
					},
					{
						"_cpuset":"String",
						"_iothread":"String"
					}
				],
				"iothreadsched":[
					{
						"_iothreads":"String",
						"_priority":"String",
						"_scheduler":"String"
					},
					{
						"_iothreads":"String",
						"_priority":"String",
						"_scheduler":"String"
					}
				],
				"memorytune":[
					{
						"_vcpus":"String",
						"node":[
							{
								"_bandwidth":"String",
								"_id":"String"
							},
							{
								"_bandwidth":"String",
								"_id":"String"
							}
						]
					},
					{
						"_vcpus":"String",
						"node":[
							{
								"_bandwidth":"String",
								"_id":"String"
							},
							{
								"_bandwidth":"String",
								"_id":"String"
							}
						]
					}
				],
				"period":{
					"text":"String"
				},
				"quota":{
					"text":"String"
				},
				"shares":{
					"text":"String"
				},
				"vcpupin":[
					{
						"_cpuset":"String",
						"_vcpu":"String"
					},
					{
						"_cpuset":"String",
						"_vcpu":"String"
					}
				],
				"vcpusched":[
					{
						"_priority":"String",
						"_scheduler":"String",
						"_vcpus":"String"
					},
					{
						"_priority":"String",
						"_scheduler":"String",
						"_vcpus":"String"
					}
				]
			},
			"currentMemory":{
				"_unit":"String",
				"text":"String"
			},
			"description":{
				"text":"String"
			},
			"devices":{
				"_interface":[
					{
						"_managed":"String",
						"_trustGuestRxFilters":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_tap":"String",
							"_vhost":"String"
						},
						"bandwidth":{
							"inbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							},
							"outbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							}
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"coalesce":{
							"rx":{
								"frames":{
									"_max":"String"
								}
							}
						},
						"driver":{
							"_ats":"String",
							"_event_idx":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_name":"String",
							"_queues":"String",
							"_rx_queue_size":"String",
							"_tx_queue_size":"String",
							"_txmode":"String",
							"guest":{
								"_csum":"String",
								"_ecn":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							},
							"host":{
								"_csum":"String",
								"_ecn":"String",
								"_gso":"String",
								"_mrg_rxbuf":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							}
						},
						"filterref":{
							"_filter":"String",
							"parameter":[
								{
									"_name":"String",
									"_value":"String"
								},
								{
									"_name":"String",
									"_value":"String"
								}
							]
						},
						"guest":{
							"_actual":"String",
							"_dev":"String"
						},
						"ip":[
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							}
						],
						"link":{
							"_state":"String"
						},
						"mac":{
							"_address":"String"
						},
						"model":{
							"_type":"String"
						},
						"mtu":{
							"_size":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"route":[
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							}
						],
						"script":{
							"_path":"String"
						},
						"source":{
							"_bridge":"String",
							"_dev":"String",
							"_mode":"String",
							"_network":"String",
							"_path":"String",
							"_type":"String"
						},
						"target":{
							"_dev":"String"
						},
						"tune":{
							"sndbuf":{
								"text":"String"
							}
						},
						"virtualport":{
							"_type":"String",
							"parameters":{
								"__interfaceid":"String",
								"_profileid":"String"
							}
						},
						"vlan":{
							"_trunk":"String",
							"tag":[
								{
									"_id":"String",
									"_nativeMode":"String"
								},
								{
									"_id":"String",
									"_nativeMode":"String"
								}
							]
						}
					},
					{
						"_managed":"String",
						"_trustGuestRxFilters":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"backend":{
							"_tap":"String",
							"_vhost":"String"
						},
						"bandwidth":{
							"inbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							},
							"outbound":{
								"_average":"String",
								"_burst":"String",
								"_floor":"String",
								"_peak":"String"
							}
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"coalesce":{
							"rx":{
								"frames":{
									"_max":"String"
								}
							}
						},
						"driver":{
							"_ats":"String",
							"_event_idx":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_name":"String",
							"_queues":"String",
							"_rx_queue_size":"String",
							"_tx_queue_size":"String",
							"_txmode":"String",
							"guest":{
								"_csum":"String",
								"_ecn":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							},
							"host":{
								"_csum":"String",
								"_ecn":"String",
								"_gso":"String",
								"_mrg_rxbuf":"String",
								"_tso4":"String",
								"_tso6":"String",
								"_ufo":"String"
							}
						},
						"filterref":{
							"_filter":"String",
							"parameter":[
								{
									"_name":"String",
									"_value":"String"
								},
								{
									"_name":"String",
									"_value":"String"
								}
							]
						},
						"guest":{
							"_actual":"String",
							"_dev":"String"
						},
						"ip":[
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_peer":"String",
								"_prefix":"String"
							}
						],
						"link":{
							"_state":"String"
						},
						"mac":{
							"_address":"String"
						},
						"model":{
							"_type":"String"
						},
						"mtu":{
							"_size":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"route":[
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							},
							{
								"_address":"String",
								"_family":"String",
								"_gateway":"String",
								"_metric":"String",
								"_netmask":"String",
								"_prefix":"String"
							}
						],
						"script":{
							"_path":"String"
						},
						"source":{
							"_bridge":"String",
							"_dev":"String",
							"_mode":"String",
							"_network":"String",
							"_path":"String",
							"_type":"String"
						},
						"target":{
							"_dev":"String"
						},
						"tune":{
							"sndbuf":{
								"text":"String"
							}
						},
						"virtualport":{
							"_type":"String",
							"parameters":{
								"__interfaceid":"String",
								"_profileid":"String"
							}
						},
						"vlan":{
							"_trunk":"String",
							"tag":[
								{
									"_id":"String",
									"_nativeMode":"String"
								},
								{
									"_id":"String",
									"_nativeMode":"String"
								}
							]
						}
					}
				],
				"channel":[
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_mode":"String",
							"_path":"String"
						},
						"target":{
							"_name":"String",
							"_state":"String",
							"_type":"String"
						}
					},
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_mode":"String",
							"_path":"String"
						},
						"target":{
							"_name":"String",
							"_state":"String",
							"_type":"String"
						}
					}
				],
				"console":[
					{
						"_tty":"String",
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					},
					{
						"_tty":"String",
						"_type":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{
							"_path":"String"
						},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					}
				],
				"controller":[
					{
						"_index":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_multifunction":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_cmd_per_lun":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_max_sectors":"String",
							"_queues":"String"
						},
						"master":{
							"_startport":"String"
						},
						"model":"String",
						"target":{
							"_chassis":"String",
							"_chassisNr":"String",
							"_port":"String"
						}
					},
					{
						"_index":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_domain":"String",
							"_function":"String",
							"_multifunction":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_cmd_per_lun":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_max_sectors":"String",
							"_queues":"String"
						},
						"master":{
							"_startport":"String"
						},
						"model":"String",
						"target":{
							"_chassis":"String",
							"_chassisNr":"String",
							"_port":"String"
						}
					}
				],
				"disk":[
					{
						"_device":"String",
						"_model":"String",
						"_rawio":"String",
						"_sgio":"String",
						"_snapshot":"String",
						"_transient":{},
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_target":"String",
							"_type":"String",
							"_unit":"String"
						},
						"alias":{
							"_name":"String"
						},
						"auth":{
							"_username":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"backingStore":{
							"_file":"String",
							"_index":"String",
							"_type":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_dev":"String",
								"_file":"String",
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"blockio":{
							"_logical_block_size":"String",
							"_physical_block_size":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_ats":"String",
							"_cache":"String",
							"_copy_on_read":"String",
							"_detect_zeroes":"String",
							"_discard":"String",
							"_error_policy":"String",
							"_event_idx":"String",
							"_io":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_name":"String",
							"_queues":"String",
							"_rerror_policy":"String",
							"_type":"String"
						},
						"encryption":{
							"_format":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"geometry":{
							"_cyls":"String",
							"_heads":"String",
							"_secs":"String",
							"_trans":"String"
						},
						"iotune":{
							"group_name":{
								"text":"String"
							},
							"read_bytes_sec":{
								"text":"String"
							},
							"read_bytes_sec_max":{
								"text":"String"
							},
							"read_bytes_sec_max_length":{
								"text":"String"
							},
							"read_iops_sec":{
								"text":"String"
							},
							"read_iops_sec_max":{
								"text":"String"
							},
							"read_iops_sec_max_length":{
								"text":"String"
							},
							"size_iops_sec":{
								"text":"String"
							},
							"total_bytes_sec":{
								"text":"String"
							},
							"total_bytes_sec_max":{
								"text":"String"
							},
							"total_bytes_sec_max_length":{
								"text":"String"
							},
							"total_iops_sec":{
								"text":"String"
							},
							"total_iops_sec_max":{
								"text":"String"
							},
							"total_iops_sec_max_length":{
								"text":"String"
							},
							"write_bytes_sec":{
								"text":"String"
							},
							"write_bytes_sec_max":{
								"text":"String"
							},
							"write_bytes_sec_max_length":{
								"text":"String"
							},
							"write_iops_sec":{
								"text":"String"
							},
							"write_iops_sec_max":{
								"text":"String"
							},
							"write_iops_sec_max_length":{
								"text":"String"
							}
						},
						"mirror":{
							"_job":"String",
							"_ready":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"product":{
							"text":"String"
						},
						"readonly":{},
						"serial":{
							"_type":"String",
							"text":"String"
						},
						"shareable":{},
						"source":{
							"_controller":"String",
							"_dev":"String",
							"_file":"String",
							"_index":"String",
							"_startupPolicy":"String",
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"reservations":{
								"_enabled":"String",
								"_managed":"String",
								"source":{
									"_dev":"String",
									"_mode":"String",
									"_path":"String",
									"_type":"String"
								}
							}
						},
						"target":{
							"_bus":"String",
							"_dev":"String",
							"_removable":"String",
							"_tray":"String"
						},
						"vendor":{
							"text":"String"
						},
						"wwn":{
							"text":"String"
						}
					},
					{
						"_device":"String",
						"_model":"String",
						"_rawio":"String",
						"_sgio":"String",
						"_snapshot":"String",
						"_transient":{},
						"_type":"String",
						"address":{
							"_bus":"String",
							"_controller":"String",
							"_domain":"String",
							"_function":"String",
							"_slot":"String",
							"_target":"String",
							"_type":"String",
							"_unit":"String"
						},
						"alias":{
							"_name":"String"
						},
						"auth":{
							"_username":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"backingStore":{
							"_file":"String",
							"_index":"String",
							"_type":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_dev":"String",
								"_file":"String",
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"blockio":{
							"_logical_block_size":"String",
							"_physical_block_size":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_ats":"String",
							"_cache":"String",
							"_copy_on_read":"String",
							"_detect_zeroes":"String",
							"_discard":"String",
							"_error_policy":"String",
							"_event_idx":"String",
							"_io":"String",
							"_ioeventfd":"String",
							"_iommu":"String",
							"_iothread":"String",
							"_name":"String",
							"_queues":"String",
							"_rerror_policy":"String",
							"_type":"String"
						},
						"encryption":{
							"_format":"String",
							"secret":{
								"_type":"String",
								"_usage":"String",
								"_uuid":"String"
							}
						},
						"geometry":{
							"_cyls":"String",
							"_heads":"String",
							"_secs":"String",
							"_trans":"String"
						},
						"iotune":{
							"group_name":{
								"text":"String"
							},
							"read_bytes_sec":{
								"text":"String"
							},
							"read_bytes_sec_max":{
								"text":"String"
							},
							"read_bytes_sec_max_length":{
								"text":"String"
							},
							"read_iops_sec":{
								"text":"String"
							},
							"read_iops_sec_max":{
								"text":"String"
							},
							"read_iops_sec_max_length":{
								"text":"String"
							},
							"size_iops_sec":{
								"text":"String"
							},
							"total_bytes_sec":{
								"text":"String"
							},
							"total_bytes_sec_max":{
								"text":"String"
							},
							"total_bytes_sec_max_length":{
								"text":"String"
							},
							"total_iops_sec":{
								"text":"String"
							},
							"total_iops_sec_max":{
								"text":"String"
							},
							"total_iops_sec_max_length":{
								"text":"String"
							},
							"write_bytes_sec":{
								"text":"String"
							},
							"write_bytes_sec_max":{
								"text":"String"
							},
							"write_bytes_sec_max_length":{
								"text":"String"
							},
							"write_iops_sec":{
								"text":"String"
							},
							"write_iops_sec_max":{
								"text":"String"
							},
							"write_iops_sec_max_length":{
								"text":"String"
							}
						},
						"mirror":{
							"_job":"String",
							"_ready":"String",
							"format":{
								"_type":"String"
							},
							"source":{
								"_index":"String",
								"_startupPolicy":"String",
								"encryption":{
									"_format":"String",
									"secret":{
										"_type":"String",
										"_usage":"String",
										"_uuid":"String"
									}
								},
								"reservations":{
									"_enabled":"String",
									"_managed":"String",
									"source":{
										"_dev":"String",
										"_mode":"String",
										"_path":"String",
										"_type":"String"
									}
								}
							}
						},
						"product":{
							"text":"String"
						},
						"readonly":{},
						"serial":{
							"_type":"String",
							"text":"String"
						},
						"shareable":{},
						"source":{
							"_controller":"String",
							"_dev":"String",
							"_file":"String",
							"_index":"String",
							"_startupPolicy":"String",
							"encryption":{
								"_format":"String",
								"secret":{
									"_type":"String",
									"_usage":"String",
									"_uuid":"String"
								}
							},
							"reservations":{
								"_enabled":"String",
								"_managed":"String",
								"source":{
									"_dev":"String",
									"_mode":"String",
									"_path":"String",
									"_type":"String"
								}
							}
						},
						"target":{
							"_bus":"String",
							"_dev":"String",
							"_removable":"String",
							"_tray":"String"
						},
						"vendor":{
							"text":"String"
						},
						"wwn":{
							"text":"String"
						}
					}
				],
				"emulator":{
					"text":"String"
				},
				"filesystem":[
					{
						"_accessmode":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_format":"String",
							"_iommu":"String",
							"_name":"String",
							"_type":"String",
							"_wrpolicy":"String"
						},
						"readonly":{},
						"source":{},
						"space_hard_limit":{
							"_unit":"String",
							"text":"String"
						},
						"space_soft_limit":{
							"_unit":"String",
							"text":"String"
						},
						"target":{
							"_dir":"String"
						}
					},
					{
						"_accessmode":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_format":"String",
							"_iommu":"String",
							"_name":"String",
							"_type":"String",
							"_wrpolicy":"String"
						},
						"readonly":{},
						"source":{},
						"space_hard_limit":{
							"_unit":"String",
							"text":"String"
						},
						"space_soft_limit":{
							"_unit":"String",
							"text":"String"
						},
						"target":{
							"_dir":"String"
						}
					}
				],
				"graphics":[
					{
						"_autoport":"String",
						"_port":"String",
						"_type":"String",
						"image":{
							"_compression":"String"
						},
						"listen":{
							"_address":"String",
							"_type":"String"
						}
					},
					{
						"_autoport":"String",
						"_port":"String",
						"_type":"String",
						"image":{
							"_compression":"String"
						},
						"listen":{
							"_address":"String",
							"_type":"String"
						}
					}
				],
				"hostdev":[
					{
						"_managed":"String",
						"_mode":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_device":"String",
							"_domain":"String",
							"_function":"String",
							"_port":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_name":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"source":{
							"address":{
								"_bus":"String",
								"_device":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String"
							}
						}
					},
					{
						"_managed":"String",
						"_mode":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_device":"String",
							"_domain":"String",
							"_function":"String",
							"_port":"String",
							"_slot":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"driver":{
							"_name":"String"
						},
						"rom":{
							"_bar":"String",
							"_enabled":"String",
							"_file":"String"
						},
						"source":{
							"address":{
								"_bus":"String",
								"_device":"String",
								"_domain":"String",
								"_function":"String",
								"_slot":"String"
							}
						}
					}
				],
				"hub":[
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						}
					},
					{
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						}
					}
				],
				"input":[
					{
						"_bus":"String",
						"_model":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"source":{
							"_evdev":"String"
						}
					},
					{
						"_bus":"String",
						"_model":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"driver":{
							"_ats":"String",
							"_iommu":"String"
						},
						"source":{
							"_evdev":"String"
						}
					}
				],
				"iommu":{
					"_model":"String",
					"driver":{
						"_caching_mode":"String",
						"_eim":"String",
						"_intremap":"String",
						"_iotlb":"String"
					}
				},
				"lease":[
					{
						"key":{
							"text":"String"
						},
						"lockspace":{
							"text":"String"
						},
						"target":{
							"_offset":"String",
							"_path":"String"
						}
					},
					{
						"key":{
							"text":"String"
						},
						"lockspace":{
							"text":"String"
						},
						"target":{
							"_offset":"String",
							"_path":"String"
						}
					}
				],
				"memballoon":{
					"_autodeflate":"String",
					"_model":"String",
					"address":{
						"_bus":"String",
						"_domain":"String",
						"_function":"String",
						"_slot":"String",
						"_type":"String"
					},
					"alias":{
						"_name":"String"
					},
					"driver":{
						"_ats":"String",
						"_iommu":"String"
					},
					"stats":{
						"_period":"String"
					}
				},
				"memory":[
					{
						"_access":"String",
						"_discard":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"source":{
							"alignsize":{
								"_unit":"String",
								"text":"String"
							},
							"nodemask":{
								"text":"String"
							},
							"pagesize":{
								"_unit":"String",
								"text":"String"
							},
							"path":{
								"text":"String"
							},
							"pmem":{}
						},
						"target":{
							"label":{
								"size":{
									"_unit":"String",
									"text":"String"
								}
							},
							"node":{
								"text":"String"
							},
							"readonly":{},
							"size":{
								"_unit":"String",
								"text":"String"
							}
						}
					},
					{
						"_access":"String",
						"_discard":"String",
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						},
						"source":{
							"alignsize":{
								"_unit":"String",
								"text":"String"
							},
							"nodemask":{
								"text":"String"
							},
							"pagesize":{
								"_unit":"String",
								"text":"String"
							},
							"path":{
								"text":"String"
							},
							"pmem":{}
						},
						"target":{
							"label":{
								"size":{
									"_unit":"String",
									"text":"String"
								}
							},
							"node":{
								"text":"String"
							},
							"readonly":{},
							"size":{
								"_unit":"String",
								"text":"String"
							}
						}
					}
				],
				"nvram":{
					"address":{},
					"alias":{
						"_name":"String"
					}
				},
				"panic":[
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						}
					},
					{
						"_model":"String",
						"address":{},
						"alias":{
							"_name":"String"
						}
					}
				],
				"parallel":[
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					},
					{
						"address":{},
						"alias":{
							"_name":"String"
						},
						"log":{
							"_append":"String",
							"_file":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{},
						"target":{
							"_port":"String",
							"_type":"String"
						}
					}
				],
				"redirdev":[
					{
						"_bus":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						"boot":{
							"_loadparm":"String",
							"_order":"String"
						},
						"protocol":{
							"_type":"String"
						},
						"source":{}
					},
					{
						"_bus":"String",
						"_type":"String",
						"address":{
							"_bus":"String",
							"_port":"String",
							"_type":"String"
						},
						"alias":{
							"_name":"String"
						},
						
