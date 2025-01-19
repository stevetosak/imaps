FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./ssl_cert/fullchain.pem /etc/nginx/ssl/
COPY ./ssl_cert/privkey.pem /etc/nginx/ssl/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

