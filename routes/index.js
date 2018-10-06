const express = require('express');
const router = express.Router();
const fs = require('fs');
const mime = require('mime-types')
const PATH = process.env.PATH_TO_VIDEOS;
let file_list = fs.readdirSync(PATH);
let videos_list = [];

function findVideos(){
	//file_list = file_list.filter(video => fs.lstatSync(PATH+"/"+video).isFile() == true && fs.lstatSync(PATH+"/"+video).isDirectory() == false && (mime.lookup(PATH+"/"+video) == "video/mp4" || mime.lookup(PATH+"/"+video) == "video/x-matroska" || mime.lookup(PATH+"/"+video) == "video/x-msvideo") );
	file_list = file_list.filter(video => fs.lstatSync(PATH+"/"+video).isFile() == true && fs.lstatSync(PATH+"/"+video).isDirectory() == false && mime.lookup(PATH+"/"+video) == "video/mp4");
	for(var i=0; i < file_list.length; i++)
	{
		//Trying to decide how best to return an array with path, filename, etc. Object may be it!
		videos_list.push({path: file_list[i], name: file_list[i].split('/').pop().split('.').unshift(), mime:mime.lookup(PATH+"/"+file_list[i]) });
	}
}

findVideos();

//Mongo would be ideal for storing information about videos!
//const mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HomeFlix' });
});

router.get('/config', function(req, res, next) {
  res.render('config', { title: 'HomeFlix' });
});

router.get('/contact', function(req, res, next) {
	res.render('contact', { title: 'HomeFlix' });
  });

  router.post('/contact', function(req, res, next) {

	//Handle all of the Post Requests for the config module here

  res.render('contact', { title: 'HomeFlix' });
});

router.post('/config', function(req, res, next) {

	//Handle all of the Post Requests for the config module here

  res.render('config', { title: 'HomeFlix' });
});

router.get('/video-list', function(req, res, next){
	res.render('video-list', { title: "Master Video List", "list": videos_list });
});

router.get('/video-play/:id', function(req,res,next){
	res.render('video-player', { title: 'HomeFlix', id: req.params.id });
});

router.get('/serve-video/:id', function(req, res, next){

	const path = PATH+"/"+videos_list[req.params.id].path;
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