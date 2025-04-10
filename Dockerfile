# Stage 1
FROM node:20-alpine as build

# Set environment variables during the build process
ENV VITE_REACT_APP_MODE="PRODUCTION"
ENV VITE_API="http://31.59.129.144:5001"

# Install & Build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm i -g serve
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "serve", "-s", "dist" ]
# COPY . .
# RUN npm install --silent
# #RUN npm run build
# EXPOSE 3000
# CMD ["npm", "run", "dev"]

# production environment
#FROM nginx:stable-alpine
#COPY --from=build /app/dist /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 3000
#CMD ["nginx", "-g", "daemon off;"]
