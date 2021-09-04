FROM node:14.15.0 as build
MAINTAINER ISCAS {lichengzhi99,tangting17,wuheng}@otcaix.iscas.ac.cn
COPY . /kube-frontend
RUN cd /kube-frontend \
    && npm install \
    && npm run build:prod
FROM nginx as nginx
COPY --from=build /kube-frontend/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
