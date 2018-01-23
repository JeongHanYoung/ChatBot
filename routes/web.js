'use strict';
var express = require('express');

var sql = require('mssql');
var dbConfig = require('../modules/DB/dbConfig');
var queryConfig = require('../modules/DB/queryConfig');
var DBUtil = require('../modules/DB/DBUtil');
var querystr = require('querystring');

var luis = require('../modules/LUIS/Luis');

var json = require('../modules/Util/JsonUtil');

const textDlg = '2';
const cardDlg = '3';
const mediaDlg = '4';

var router = express.Router();

//WEB
router.get('/', function (req, res) {
    res.render('index');
});


//초기 다이얼로그 
router.post('/init', function (req, res) {
    (async () => {
        try {
            var returnData = [];

            // TBL_DLG 테이블 초기다이얼로그 조회
            let pool = await sql.connect(dbConfig)
            let result = await pool.request()
                .input('dlgGroup', sql.NVarChar, '1')
                .input('useYn', sql.NVarChar, 'Y')
                .query(queryConfig.initQuery)

            let rows = result.recordset;

            // 다이얼로그 타입별 테이블 조회
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var item = {};

                if (row.DLG_TYPE == textDlg) {
                    let result = await pool.request()
                        .input('dlgId', sql.Int, row.DLG_ID)
                        .input('useYn', sql.NVarChar, 'Y')
                        .query(queryConfig.selectTextDlgQuery)

                    let rows = result.recordset;
                    item = json.textParse(rows[0]);

                } else if (row.DLG_TYPE == cardDlg) {
                    /*미구현*/
                } else if (row.DLG_TYPE == mediaDlg) {
                    let result = await pool.request()
                        .input('dlgId', sql.Int, row.DLG_ID)
                        .input('useYn', sql.NVarChar, 'Y')
                        .query(queryConfig.selectMediaDlgQuery)

                    let rows = result.recordset;
                    item = json.mediaParse(rows[0]);

                } else {
                }

                returnData.push(item);
            }
            res.send(returnData);

        } catch (err) {
            console.log(err);

        } finally {
            sql.close();
        }
    })()
});

router.post('/input', function (req, res) {
	//console.log("[WEB]req.body.message : " + req.body.message);
    var message = req.body.message;

    (async () => {
        try {
            let pool = await sql.connect(dbConfig)
            var returnData = [];

            //금칙어 체크
            let result = await pool.request()
                .input('message', sql.NVarChar, message)
                .query(queryConfig.bannedMsgQuery)
            let bannedRows = result.recordset;

            if (bannedRows.length > 0) {// 금칙어 OK
                res.send(json.textParse(bannedRows[0]));
            } else {// 금칙어 NO

                //캐시 체크
                var cashMsg = message.replace(/[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]/gi, '').replace(/(\s*)/g, "");
                result = await pool.request()
                    .input('message', sql.NVarChar, cashMsg)
                    .input('result', sql.NVarChar, 'H')
                    .query(queryConfig.cashMsgQuery)
                let cashRows = result.recordset;

                var intentName;
                if (cashRows.length == 0) { // 캐시NO
                    console.log('캐시가 없는 경우');
                    result = await pool.request()
                        .query(queryConfig.selectLuisQuery)
                    let luisRows = result.recordset;

                    intentName = luis.getLuisResult(message, luisRows);
                } else {
                    intentName = cashRows[0].LUIS_INTENT;
                }

                //LUIS INTENT 이름 체크
                var apiFlag;
                if (intentName.indexOf('testdrive') == -1 &&
                    intentName.indexOf('branch') == -1 &&
                    intentName.indexOf('quot') == -1 &&
                    intentName.indexOf('recommend') == -1) { // COMMON OK
                    apiFlag = 'COMMON';
                }

                result = await pool.request()
                    .input('message', sql.NVarChar, cashMsg)
                    .query(queryConfig.entityOrderByAddQuery)
                let entitiesRows = result.recordset[0];

                let relationRows;
                if (entitiesRows.ENTITIES.length > 0) {

                    if (cashRows.length > 0) {

                        result = await pool.request()
                            .input('entities', sql.NVarChar,
                            (entitiesRows.ENTITIES.length > cashRows[0].LUIS_ENTITIES.length ||
                                intentName == null || intentName == '') ? entitiesRows.ENTITIES : cashRows[0].LUIS_ENTITIES)
                            .query(queryConfig.defineTypeChkSpareQuery)
                        relationRows = result.recordset;

                    } else {

                        result = await pool.request()
                            .input('entities', sql.NVarChar, entitiesRows.ENTITIES)
                            .query(queryConfig.defineTypeChkSpareQuery)
                        relationRows = result.recordset;
                    }
                } else {
                    if (apiFlag == 'COMMON') {
                        result = await pool.request()
                            .input('entities', sql.NVarChar, cashRows[0].LUIS_ENTITIES)
                            .query(queryConfig.defineTypeChkSpareQuery)
                        relationRows = result.recordset;
                    }
                    else {
                        relationRows = null;
                    }
                }

                if (relationRows != null) {
                    if (relationRows.length > 0 && relationRows[0].DLG_API_DEFINE != null) {
                        if (relationRows[0].DLG_API_DEFINE == 'D') {
                            apiFlag = 'COMMON';
                        }
                    }
                } else {
                    if (intentName == null || apiFlag == 'COMMON') {
                        apiFlag = '';
                    }
                }

                if (apiFlag == "COMMON" && relationRows.length > 0) { // 1325줄
                    for (var i = 0; i < relationRows.length; i++) {
                        result = await pool.request()
                            .input('dlgId', sql.Int, relationRows[i].DLG_ID)
                            .input('useYn', sql.NVarChar, 'Y')
                            .query(queryConfig.selectDigQuery)
                        let dlgRows = result.recordset;

                        var item = {};

                        if (dlgRows[0].DLG_TYPE == textDlg) {
                            result = await pool.request()
                                .input('dlgId', sql.Int, dlgRows[0].DLG_ID)
                                .input('useYn', sql.NVarChar, 'Y')
                                .query(queryConfig.selectTextDlgQuery)

                            let textRows = result.recordset;
                            item = json.textParse(textRows[0]);

                        } else if (dlgRows[0].DLG_TYPE == cardDlg) {
                            result = await pool.request()
                                .input('dlgId', sql.Int, dlgRows[0].DLG_ID)
                                .input('useYn', sql.NVarChar, 'Y')
                                .query(queryConfig.selectCardDlgQuery)

                            let cardRows = result.recordset;
                            item = json.cardParse(cardRows);

                        } else if (dlgRows[0].DLG_TYPE == mediaDlg) {
                            result = await pool.request()
                                .input('dlgId', sql.Int, dlgRows[0].DLG_ID)
                                .input('useYn', sql.NVarChar, 'Y')
                                .query(queryConfig.selectMediaDlgQuery)

                            let mediaRows = result.recordset;
                            item = json.mediaParse(mediaRows[0]);
                        }
                        returnData.push(item);
                    }
                }
            
            }

            res.send(returnData);
        } catch (err) {
            console.log(err);

        } finally {
            sql.close();
        }
    })()

    sql.on('error', err => {
    })

});

module.exports = router;

function loading_done(batch_num) {
    bot.sortReplies();
}

function loading_error(error) {
    console.log("Error when loading files: " + error);
}

/*db 조회 샘플

(async () => {
        try {
            var textQueryString = "SELECT question, answer FROM cb_common WHERE question = @message";

            let pool = await sql.connect(dbConfig)
            let result1 = await pool.request()
                .input('message', sql.NVarChar, req.body.message)
                .query(textQueryString)
            let rows = result1.recordset;
            let result;
            if (rows.length > 0) {
                result = {
                    "type": "text",
                    "contents": [
                        { "text": rows[0].answer }
                    ]
                };
            } else {
                result = {
                    "type": "text",
                    "contents": [
                        { "text": "아직 답변이 준비되어 있지 않습니다." }
                    ]
                };
            }
            res.send(result);

        } catch (err) {
            console.log(err)

        } finally {
            sql.close();
        }
    })()

    sql.on('error', err => {
    })

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