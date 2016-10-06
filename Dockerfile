# Base to build from
FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/uq-parking-scraper
WORKDIR /usr/src/uq-parking-scraper

# Install dependencies
COPY package.json /usr/src/uq-parking-scraper
RUN npm install

# Bundle app source
COPY . /usr/src/uq-parking-scraper

CMD ["npm", "start"]
