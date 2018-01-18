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

//KAKAO
router.get('/keyboard',function(req, res){
    let keyboard = {
      "type" : "text"
    };

    res.send(keyboard);
});

router.post('/message', function (req, res) {
    let user_key = decodeURIComponent(req.body.user_key);
    let type = decodeURIComponent(req.body.type); 
    let content = decodeURIComponent(req.body.content); // 질문

    DBUtil.Start("Test", content, function (err, rs) {

		if (err) { console.log("index error : " + err); }
		else {

			console.log("KAKAO : " + rs[0]["ANSWER"]);
			
		}
		let answer = {
			"message": {
				"text": rs[0]["ANSWER"]
			}
		}
	
		res.send(answer);
	});
});

module.exports = router;

function loading_done(batch_num) {
    bot.sortReplies();
}

function loading_error(error) {
    console.log("Error when loading files: " + error);
}