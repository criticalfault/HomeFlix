const express = require('express');
const router = express.Router();
const fs = require('fs');
const mime = require('mime-types')
const path = require('path');
const PATH = require('../modules/config/main').pathToVideos;
const walk = require('fs-walk');
const ExifTool = require('exiftool-kit')
const exiftool = new ExifTool()
var file_list = [];
var videos_list = [];

function findVideos()
{
	walk.walkSync(PATH, function(basedir, filename, stat) 
	{
	   	file_list.push(basedir+"/"+filename);
	});

	file_list = file_list.filter(video => fs.lstatSync(video).isFile() == true && mime.lookup(video) == "video/mp4" && fs.lstatSync(video).isDirectory() == false);
	for(var i=0; i < file_list.length; i++)
	{
		let list_name = file_list[i].replace(PATH,'');
		list_name = list_name.replace(new RegExp('/', 'g')," > ");
		(() => {
			return Promise.all([ 
				exiftool.getTags(
				{
			    	source: file_list[i]
			   	 
			    })
			    ]).then( function(value) 
			    {
			    	//console.log(value[0]);

			    	var video = {	"path": value[0].SourceFile,
		    						"duration": value[0].Duration, 
		    						"list_name": list_name, 
		    						"name": value[0].FileName, 
		    						"mime":value[0].MIMEType }

		    		if(value[0].Genre)		{ video.genre = value[0].Genre; 		}
		    		if(value[0].Title)		{ video.name = value[0].Title; 			}
		    		if(value[0].Langauge)	{ video.langauge = value[0].Langauge; 	}

			    	videos_list.push(video);
			    })
	  			.catch(console.error)
			    
		})()
	}
}
findVideos()

//Mongo would be ideal for storing information about videos!
//const mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HomeFlix' });
});

router.get('/config', function(req, res, next) {
  res.render('config', { title: 'HomeFlix', header: 'fixHeader' });
});

router.get('/contact', function(req, res, next) {
	res.render('contact', { title: 'HomeFlix', header: 'fixHeader' });
});

router.post('/contact', function(req, res, next) {

	//Handle all of the Post Requests for the config module here

  res.render('contact', { title: 'HomeFlix', header: 'fixHeader' });
});

router.post('/config', function(req, res, next) {

	//Handle all of the Post Requests for the config module here

  res.render('config', { title: 'HomeFlix', header: 'fixHeader' });
});

router.get('/video-list', function(req, res, next){
	console.log(videos_list);
	res.render('video-list', { title: "Master Video List", "list": videos_list, header: 'fixHeader' });
});

router.get('/video-play/:id', function(req,res,next){

	let movie_name = videos_list[req.params.id].name;
	//Per say, if we wanted multiple players for different kinds of videos, this could be pretty easy to do here.
	//Just would need to case out the mime types against the players that will run it. Might be an idea!
	
	res.render('video-player', { title: 'HomeFlix - '+ movie_name, movie_name: movie_name, id: req.params.id, header: 'fixHeader', background: 'solid' });
});

router.get('/download-video/:id', function(req, res, next){

	var file = '/Users/deanpetty/Desktop/HomeFlix/public/videos/test.mp4';
	console.log(file);
  	res.sendFile(file); // Set disposition and send it.res.download()
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