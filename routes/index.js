const express = require('express');
const router = express.Router();
const fs = require('fs');

const PATH = process.env.PATH_TO_VIDEOS;

//Mongo would be ideal for storing information about videos!
//const mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homeflix' });
});


router.get('/video-list', function(req, res, next)
{
	let file_list = fs.readdirSync(PATH);
	file_list.filter(video => fs.lstatSync(video).isFile());
	let video_list = [];

	for(var i=0; i < videos_list.length; i++)
	{
		//Trying to decide how best to return an array with path, filename, etc. Object may be it!
		video_list.push({path: file_list[i], name: file_list[i].split('/').pop() });
	}


	res.render('video-list', { "list": videos_list, title: "Master Video List" });
});


router.get('/video-play/:id', function(req,res,next)
{

	res.render('video-player', {id:req.params.id})

});

router.get('/serve-video/:id', function(req, res, next)
{

	//use req.params.id to find stuff in our DB or against our JSON object...


	// This will need the logic 
	//var path = PATH_TO_VIDEO_SELECTED;
	
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range
	
	if (range) 
	{
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
	} else {
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
