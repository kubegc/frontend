# kubernetes-admin

# Authors

- lichengzhi99@otcaix.iscas.ac.cn
- xuyuanjia2017@otcaix.iscas.ac.cn
- tangting18@otcaix.iscass.ac.cn
- yangchen19@otcaix.iscas.ac.cn
- huyi19@otcaix.iscas.ac.cn
- wuheng@otcaix.iscas.ac.cn


# Coomands

```
npm install
npm run build:prod
```


# Plugins

- 镜像插件
  - [镜像存储仓库]: docker run -d --restart=always -p 5000:5000 -v /var/lib/registry:/var/lib/registry registry.cn-beijing.aliyuncs.com/dosproj/distribution:v2.7.1-amd64
  - [镜像冗余分析]：docker run -d --restart=always -v /var/run/docker.sock:/var/run/docker.sock -p 5002:7001 registry.cn-beijing.aliyuncs.com/dosproj/dive:v0.9.2-amd64
- Web控制台
  - [物理机web访问]：docker run -d --restart=always -p 31051:2222 registry.cn-beijing.aliyuncs.com/dosproj/webssh2:v0.3.1-amd64
  - [容器Web访问]: docker run -d --restart=always -p 31052:31052 -e "host=39.106.40.190:" -e "token=xxx" registry.cn-beijing.aliyuncs.com/dosproj/container-terminal:v1.1.0-amd64

# RoadMap

- 2021.3: Support Table and Blcok
- 2021.4：Support Wizard
- 2021.5：Support Template

# Others

- http://39.106.40.190:5002/?image=tomcat