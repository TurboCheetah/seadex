FROM node:16

EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

LABEL org.opencontainers.image.vendor="/r/animepiracy" \
      org.opencontainers.image.url="https://releases.moe" \
      org.opencontainers.image.description="Webserver of releases.moe SeaDex" \
      org.opencontainers.image.title="SeaDex" \
      maintainer="Community of /r/animepiracy"

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# install the dependencies
COPY package.json .
COPY package-lock.json .

# we want curl for the healthcheck
RUN apt update -y && \
    apt install --no-install-recommends -y curl && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    npm ci

# build the web app
COPY . .

# start the node server
CMD npm run dev