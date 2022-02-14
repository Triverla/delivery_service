FROM node:latest

# Create app directory
RUN mkdir -p /usr/api
WORKDIR /usr/api

# Copy package.json
COPY package.json /usr/api

# Install node_modules
RUN npm install

# Copy files
COPY . /usr/app
