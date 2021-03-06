const express = require('express');
const router = express.Router();
const fs = require('fs');
const mime = require('mime-types')
const path = require('path');
const PATH = require('../modules/config/main').pathToVideos;
const walk = require('fs-walk');
const VideosFilesPath = __dirname+"/../modules/config/videos.json";
var videos_list = [];

function is_file(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isFile();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

function findVideos()
{
	let file_list = [];
	
	walk.walkSync(PATH, function(basedir, filename, stat) 
	{
	   	file_list.push(basedir+"/"+filename);
	});

	file_list = file_list.filter(video => fs.lstatSync(video).isFile() == true && mime.lookup(video) == "video/mp4" && fs.lstatSync(video).isDirectory() == false);
	for(var i=0; i < file_list.length; i++)
	{
		let list_name = file_list[i].replace(PATH,'');
		list_name = list_name.replace(new RegExp('/', 'g'),"");
		videos_list.push({path: file_list[i], list_name: list_name, name: file_list[i].split('/').pop().split('.').splice(0,1), mime:mime.lookup(PATH+"/"+file_list[i]) });
	}
}


//Mongo would be ideal for storing information about videos!
//const mongoose = require('mongoose');




/* GET home page. */
router.get('/', function(req, res, next) {

	videos_list = [];
	if(is_file(VideosFilesPath))
	{
		let rawData = fs.readFileSync(VideosFilesPath)
		var videos_list = JSON.parse(rawData);
	}else{
		findVideos();
		let data = JSON.stringify(videos_list);
		fs.appendFile(VideosFilesPath, data, 'utf-8');
	}
	
	res.render('index', { title: "HomeFlix", "list": videos_list});
});

router.get('/config', function(req, res, next) {
  res.render('config', { title: 'HomeFlix', header: 'fixHeader' });
});

router.post('/config', function(req, res, next) 
{
	videos_list = [];
	var msg = ""
	if(req.body.config_options == "video_list_rebuild")
	{
		fs.unlinkSync(VideosFilesPath);
		findVideos();
		let data = JSON.stringify(videos_list);
		fs.appendFile(VideosFilesPath, data, 'utf-8');
		msg = "Videos Rebuilt";
	}
	else if(req.body.config_options == "video_list_empty")
	{
		fs.unlinkSync(VideosFilesPath);
		msg = "Videos Emptied. Will be rebuilt when you go back to the index.";
	}
	//Handle all of the Post Requests for the config module here

  res.render('config', { title: 'HomeFlix', header: 'fixHeader', msg:msg });
});

router.get('/video-play/:id', function(req,res,next){


	//Per say, if we wanted multiple players for different kinds of videos, this could be pretty easy to do here.
	//Just would need to case out the mime types against the players that will run it. Might be an idea!


	let movie_name = videos_list[req.params.id].name;
	res.render('video-player', { title: 'HomeFlix - '+ movie_name, movie_name: movie_name, id: req.params.id, header: 'fixHeader', background: 'solid' });
});

router.get('/serve-video/:id', function(req, res, next){

	const path = videos_list[req.params.id].path;
	const stat = fs.statSync(path)
	const fileSize = stat.size;
	const range = req.headers.range;
	
	if (range) {

		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})
		
		const head = 
		{
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}

		res.writeHead(206, head);
		file.pipe(res);

	}else{

		const head = 
		{
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
});

module.exports = router;
