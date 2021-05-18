FROM nginx
MAINTAINER ISCAS {lichengzhi99,tangting17,wuheng}@otcaix.iscas.ac.cn
COPY dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
