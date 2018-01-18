
var request = require('request');
var querystring = require('querystring');
var http = require('http');
//var async = require('async');

//module.exports.getLuis = function () {

//	request('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f6182bb8-713e-4c03-a412-47217bb22e19?subscription-key=0054d78d200e49a1b26f10c8e9887027&verbose=true&timezoneOffset=0&q=18인치휠', { json: true }, (err, res, body) => {
//		if (err) { return console.log(err); }
//		console.log(body);
//		console.log(body.url);
//		console.log(body.explanation);
//		return body;
//	});
	
//}


function getLuisResult(query, callback) {

	var endPoint = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/';
	var luisAppId = 'f6182bb8-713e-4c03-a412-47217bb22e19';
	var queryParams = {

		"subscription-key": "0054d78d200e49a1b26f10c8e9887027",
		"timezoneOffset": "0",
		"verbose": false,
		"q": query

	}

	var luisRequest = endPoint + luisAppId + '?' + querystring.stringify(queryParams);

	request(luisRequest, function (err, response, body) {

		if (err) {
			console.log(err);
		}
		else {

			var data = JSON.parse(body);

			console.log(`Query:${data.query}`);
			console.log(`Top Intent: ${data.topScoringIntent.intent}`);
			

			for (var i = 0; i < data.entities.length; i++) {
				console.log("Entities [" + i + "] : " + data.entities[i]["entity"]);
				console.log("Entities [" + i + "] : " + data.entities[i]["type"]);
				console.log("Entities [" + i + "] : " + data.entities[i]["score"]);
			}

			callback(data.topScoringIntent.intent);
		}

	})

}


//function getLuis(url, callback) {
//	request({
//		method: 'POST',
//		url: url,
//		mutipart: [{
//			'content-type': 'text/html;charset=utf-8'
//		}],

//		headers: { 'User-Agent': "Mozilla/5.0" }
//	}, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log("request url : " + url);
//			console.log("DDDDDDDDDDDDDD : " + body);
//			//console.log("DDDDDDDDDDDDDD : " + JSON.stringify(body));
//			callback(JSON.stringify(body.topScoringIntent.score)); //인자로 받은 callback() 호출 
//		}
//	});


//	//request(url, { json: true }, function (error, response, body) {
//	//	if (!error && response.statusCode == 200) {
//	//		console.log("request url : " + url);
//	//		console.log("DDDDDDDDDDDDDD : " + JSON.stringify(body));
//	//		callback(JSON.stringify(body.topScoringIntent.score)); //인자로 받은 callback() 호출 
//	//	}
//	//});
//}


//const getLuis1 = function (url) {
//	// return new pending promise
//	return new Promise((resolve, reject) => {
//		// select http or https module, depending on reqested url
//		const lib = url.startsWith('https') ? require('https') : require('http');
//		const request = lib.get(url, (response) => {
//			// handle http errors
//			if (response.statusCode < 200 || response.statusCode > 299) {
//				reject(new Error('Failed to load page, status code: ' + response.statusCode));
//			}
//			// temporary data holder
//			const body = [];
//			// on every content chunk, push it to the data array
//			response.on('data', (chunk) => body.push(chunk));
//			// we are done, resolve promise with those joined chunks
//			response.on('end', () => resolve(body.join('')));
//		});
//		// handle connection errors of the request
//		request.on('error', (err) => reject(err))
//	})
//};


//function getLuis1() {
//	var options = {
//		host: 'https://westus.api.cognitive.microsoft.com/',
//		port
//	}
//	request(url, { json: true }, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log("DDDDDDDDDDDDDD : " + JSON.stringify(body));
//			callback(JSON.stringify(body)); //인자로 받은 callback() 호출 
//		}
//	});

//}

//exports.getLuis = getLuis;

exports.getLuisResult = getLuisResult;
