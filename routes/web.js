'use strict';
var express = require('express');
var router = express.Router();
//var RiveScript = require('rivescript');

const sql = require('mssql');

var luis = require('../modules/LUIS/Luis');
var DBUtil = require('../modules/DB/DBUtil');

//var request = require('request');
//var async = require('async');

//var bot = new RiveScript({ utf8: true, debug: false });
//bot.unicodePunctuation = new RegExp(/[.,!?;:]/g);
//bot.loadFile("brain/welcome.rive", loading_done, loading_error);

//WEB
router.get('/', function (req, res) {
	
    res.render('index');
});


router.post('/input', function (req, res) {
	console.log("req.body.message : " + req.body.message);

	DBUtil.Start("Test",req.body.message, function (err, rs) {

		if (err) { console.log("index error : " + err); }
		else {

			console.log("WEB : " + rs[0]["ANSWER"]);
			
		}
		res.send('{"type": "text", "contents": [{"text": "'+ rs[0]["ANSWER"] +'"}]}');
	});

	//DBUtil.Start("Read");
	/*
	DBUtil.Start("Read", function (err, rs) {

		if (err) { console.log("index error : " + err); }
		else {

			console.log("제발 : " + rs[0]["CNF_VALUE"]);
			
		}

	});
	*/

	//async () => {

	//	try {
	//		const pool = await sql.connect('mssql://taihoinst:taiho9788!@taiholab.database.windows.net/taiholab_2?encrypt=true')
	//		const result = await sql.query` SELECT TOP 10 CNF_TYPE FROM TBL_CHATBOT_CONF `
	//		console.dir(result);
	//	}
	//	catch (err) {
	//		console.dir(err);
	//	}


	//}


	//luis.getLuisResult(req.body.message, function (result) { res.send(JSON.stringify({ "type": "text", "contents": [{ "text": result }] })); });





	//var reply = bot.reply("local-user", req.body.message);
	//reply = { "type": "text", "contents": [{ "text": "--텍스트내용--" }] };
	/*{"type": "text", "contents": [{"text": "--텍스트내용--"}]}*/
	//console.log("reply : " + reply);

	//requestify.get('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f6182bb8-713e-4c03-a412-47217bb22e19?subscription-key=0054d78d200e49a1b26f10c8e9887027&verbose=true&timezoneOffset=0&q=18인치휠')
	//.then(function (response) {


	//for (var i = 0; i < luisUrls.length; i++) {
	//	(function (URLIndex) {

	//		luisLoaderQueue.push(function (callback) {
	//			request(luisUrls[URLIndex], function (error, response, json) {

	//				console.log("[" + i + "] : " + json);

	//				callback(error, json);
	//			});
	//		});
	//	})(i)
	//}
	//async.parallel(queue, function (err, results) { });

	//	console.log("response.getBody : " + response.getBody());
	//})

	//request('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f6182bb8-713e-4c03-a412-47217bb22e19?subscription-key=0054d78d200e49a1b26f10c8e9887027&verbose=true&timezoneOffset=0&q=18인치휠', { json: true }, (err, res, body) => {
	//	if (err) { return console.log(err); }
	//	console.log(body);
	//	console.log(body.url);
	//	console.log(body.explanation);
	//});

	//var result = luis.getLuis();
	//console.log("luis result : " + result);

	//var result = luis.getLuis('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f6182bb8-713e-4c03-a412-47217bb22e19?subscription-key=0054d78d200e49a1b26f10c8e9887027&verbose=true&timezoneOffset=0&q=18인치휠');

	//luis.getLuis("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/3d1138b1-a63b-4b75-99c8-3949021b1af6?subscription-key=0054d78d200e49a1b26f10c8e9887027&verbose=false&timezoneOffset=0&q=" + req.body.message, function (result) {

	//	//var jsonContent = JSON.stringify(data); 

	//	//console.log("luis result : " + util.inspect(result, false, null));
	//	res.send(JSON.stringify({ "type": "text", "contents": [{ "text": result }] }));

	//});
	//res.send(JSON.stringify({ "type": "text", "contents": [{ "text": "테스트 중임당." }] }));
});

module.exports = router;

function loading_done(batch_num) {
    bot.sortReplies();
}

function loading_error(error) {
    console.log("Error when loading files: " + error);
}