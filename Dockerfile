FROM nginx
MAINTAINER ISCAS {lichengzhi99,tangting17,wuheng}@otcaix.iscas.ac.cn
COPY dist /user/share/nginx/html
CMD ["nginx"]
