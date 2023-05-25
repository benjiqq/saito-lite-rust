# Start with Ubuntu 20.04
FROM ubuntu:20.04

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl python2.7 
RUN apt-get install -y build-essential
RUN apt-get install -y libsqlite3-dev
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g node-gyp

RUN ln -s /usr/bin/python2.7 /usr/bin/python

# Copy your package.json and package-lock.json (if available)
COPY package*.json ./

# Install sqlite3 with unsafe-perm flag and then rest of the dependencies
RUN npm install sqlite3 --unsafe-perm && npm install

# Copy your source code into the Docker container
COPY . .

# Expose the port your app runs on
EXPOSE 3000
EXPOSE 12101


# Define the command to run your app using CMD which defines your runtime
#CMD [ "npm", "start" ]
#CMD pwd && ls && npm run start
CMD ["/bin/sh", "-c", "pwd && ls && npm run start"]


