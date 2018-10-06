# HomeFlix
An at home video streaming webserver built with Node.js and Express. Giving you full control of your media!

## PATH_TO_VIDEOS
This project heavily relies on the environmental variable PATH_TO_VIDEOS. Setting this to the directoy where your video files are is required for HomeFlix to find your media to be able to serve them!

## How to Setup
You will need npm and Node in order to get this project to run.

1 ) git clone https://github.com/criticalfault/HomeFlix.git
2 ) cd Homeflix
3 ) npm install
4 ) PATH_TO_VIDEOS={{Your full path here}} node bin/www
5 ) open your web browser localhost:3000