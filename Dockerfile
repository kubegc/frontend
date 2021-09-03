MAINTAINER ISCAS {lichengzhi99,tangting17,wuheng}@otcaix.iscas.ac.cn
FROM node:14.15.0 as build
COPY . /k8s-frontend
RUN cd /k8s-frontend \
    && npm install \
    && npm run build:prod

FROM nginx
COPY --from=build /k8s-frontend/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
