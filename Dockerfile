# Use a base image with Node.js
FROM node:18-alpine

# Install necessary packages
RUN apk update && \
    apk add --no-cache \
    g++ \
    gcc \
    python3 \
    python3-dev \
    py3-pip \
    openjdk11-jdk

# Create app directory at root
WORKDIR /app

# Copy whole backend
COPY . .

# Install app dependencies
RUN npm install

# expose the port 8000
EXPOSE 8080

# Command to run the app
CMD [ "npm", "run","dev" ]
