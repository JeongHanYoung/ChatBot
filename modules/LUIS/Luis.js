'use strict';
var querystring = require('querystring');
var client = require('sync-rest-client');


function getLuisResult(query, luisRows) {
    var subscriptionKey;
    var luisAppId = [];
    var topIntent;
    var topScore = 0;

    for (var i = 0; i < luisRows.length; i++) {
        switch (luisRows[i].CNF_TYPE) {
            case "LUIS_APP_ID":
                luisAppId.push(luisRows[i].CNF_VALUE);
                break;
            case "LUIS_SUBSCRIPTION":
                subscriptionKey = luisRows[i].CNF_VALUE;
                break;
            case "BOT_ID":
                break;
            case "MicrosoftAppId":
                break;
            case "MicrosoftAppPassword":
                break;
            case "QUOTE":
                break;
            case "TESTDRIVE":
                break;
            case "LUIS_SCORE_LIMIT":
                break;
            case "LUIS_TIME_LIMIT":
                break;
            default:
                break;
        }
    }

    for (var i = 0; i < luisAppId.length; i++) {
        var endPoint = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/';
        var queryParams = {

            "subscription-key": subscriptionKey,
            "timezoneOffset": "0",
            "verbose": false,
            "q": query

        };
        var intentName;
        var luisRequest = endPoint + luisAppId[i] + '?' + querystring.stringify(queryParams);

        var response = client.get(luisRequest);
        //console.log(response.body);
        if (response.body.topScoringIntent.score > topScore) {
            topIntent = response.body.topScoringIntent.intent;
            topScore = response.body.topScoringIntent.score;
        }
    }

    return topIntent;
}

exports.getLuisResult = getLuisResult;