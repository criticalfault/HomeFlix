# HomeFlix
An at home video streaming webserver built with Node.js and Express. Giving you full control of your media!

## Videos Path
Located in `config.json` is a property called `pathToVideos`. This path is vital to the running of this application and it will not start until it is configured. To configure, simply place in the full path to the directory housing your video files and save it before running. 


## How to Setup
You will need npm and Node in order to get this project to run.

1. git clone https://github.com/criticalfault/HomeFlix.git
2. cd Homeflix
3. npm install
4. Make sure you added the path to your videos in `config.json`
4. npm start
5. open your web browser localhost:3000