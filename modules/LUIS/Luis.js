
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


function getLuisResult(query, luisApp) {

	var endPoint = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/';
	var luisAppId = 'f6182bb8-713e-4c03-a412-47217bb22e19';
    var queryParams = {

        "subscription-key": "0054d78d200e49a1b26f10c8e9887027",
        "timezoneOffset": "0",
        "verbose": false,
        "q": query

    };
    var topIntent = '';
    var topScore = 0;
    for (var i = 0; i < luisApp.length; i++) {
        var luisRequest = endPoint + luisAppId + '?' + querystring.stringify(queryParams);
        request(luisRequest, function (err, response, body) {
            if (err) {
                console.log(err);
            }
            else {
                
                var data = JSON.parse(body);
                //console.log(body);
                //console.log(`Query:${data.query}`);
                console.log(`Top Intent: ${data.topScoringIntent.intent}`);
                if (data.topScoringIntent.score > topScore) {
                    topIntent = data.topScoringIntent.intent;
                    topScore = data.topScoringIntent.score;
                }
                /*
                for (var i = 0; i < data.entities.length; i++) {
                    console.log("Entities [" + i + "] : " + data.entities[i]["entity"]);
                    console.log("Entities [" + i + "] : " + data.entities[i]["type"]);
                    console.log("Entities [" + i + "] : " + data.entities[i]["score"]);
                }
                
                callback(data.topScoringIntent.intent);
                */
            }

        })
    }
    return topIntent;
}

exports.getLuisResult = getLuisResult;
