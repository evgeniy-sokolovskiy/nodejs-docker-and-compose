FROM node:16-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit --no-fund

COPY . ./

RUN npm run build

FROM nginx:latest as runner

WORKDIR /app

COPY --from=builder /app/build /usr/share/nginx/html

RUN sed -i '10 i \        try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
