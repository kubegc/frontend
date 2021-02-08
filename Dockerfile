FROM node:12.18.2
MAINTAINER ISCAS {lichengzhi99,tangting17,xuyuanjia2017,yangchen19,huyi19,wuheng}@otcaix.iscas.ac.cn
COPY . /home/kubernetes-admin
WORKDIR /home/kubernetes-admin
ENV adminPort=9538
EXPOSE $adminPort
RUN npm install --registry=https://registry.npm.taobao.org
CMD ["npm", "run", "dev"]
