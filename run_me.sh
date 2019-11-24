#!/bin/bash
docker build -t nodejs-arch:latest .;
mkdir $HOME/Videos
echo "place videos you want to watch in the Videos folder in  your home directory..";
docker run -d -i -v $HOME/Videos:/mnt/videos -p 3001:3000 --name=homeflix -t nodejs-arch:latest;
docker ps -a;
echo "open your favorite internet browser use url: http://localhost:3001 to view homeflix";
echo "enjoy";
