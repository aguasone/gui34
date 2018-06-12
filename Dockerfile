
# LoopBack App Base Image
# Installs StrongLoop and Git
FROM node:latest

# install required debian packages
# add any package that is required after `python-dev`, end the line with \
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils\
    build-essential

# Setup Git
RUN git config --global user.name "aguasone" && \
    git config --global user.email "alessandro.guasone@gmail.com"

# Create App Directory and CD into it
WORKDIR /app

# Clone Master and Install dependencies
RUN git clone https://github.com/aguasone/gui34

# Run App
WORKDIR /app/gui34
RUN npm install
EXPOSE 3000
CMD node server/server.js
