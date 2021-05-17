FROM node:14.16.1
MAINTAINER ISCAS {lichengzhi99,tangting17,wuheng}@otcaix.iscas.ac.cn
COPY . /home/kubernetes-admin
WORKDIR /home/kubernetes-admin
RUN npm install --registry=https://registry.npm.taobao.org
CMD ["npm", "run", "dev"]
