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
             
                if (row.DLG_TYPE == textDlg) { //초기 텍스트 다이얼로그
                    let result = await pool.request()
                        .input('dlgId', sql.Int, row.DLG_ID)
                        .input('useYn', sql.NVarChar, 'Y')
                        .query(queryConfig.selectTextDlgQuery)

                    let rows = result.recordset;
                    item = json.textParse(rows[0]);

                } else if (row.DLG_TYPE == cardDlg) { //초기 카드 다이얼로그
                    /*미구현*/
                } else if (row.DLG_TYPE == mediaDlg) { //초기 미디어 다이얼로그
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

// 질문 입력시
router.post('/input', function (req, res) {
    var message = req.body.message;
    var sorryFlag = false;

    (async () => {
        try {
            let pool = await sql.connect(dbConfig)
            var returnData = [];

            //금칙어 체크
            let result = await pool.request()
                .input('message', sql.NVarChar, message)
                .query(queryConfig.bannedMsgQuery)
            let bannedRows = result.recordset;

            if (bannedRows.length > 0) { // 금칙어 OK
                res.send(json.textParse(bannedRows[0]));
            } else { // 금칙어 NO

                //캐시 체크
                var cashMsg = message.replace(/[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]/gi, '').replace(/(\s*)/g, "");
                result = await pool.request()
                    .input('message', sql.NVarChar, cashMsg)
                    .input('result', sql.NVarChar, 'H')
                    .query(queryConfig.cashMsgQuery)
                let cashRows = result.recordset;

                var intentName;
                if (cashRows.length == 0) { // 캐시NO
                    result = await pool.request()
                        .query(queryConfig.selectLuisQuery)
                    let luisRows = result.recordset;

                    //LUIS API 호출 (sync call)
                    intentName = luis.getLuisResult(message, luisRows);
                } else { // 캐시YES
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

                //엔티티 추출
                result = await pool.request()
                    .input('message', sql.NVarChar, cashMsg)
                    .query(queryConfig.entityOrderByAddQuery)
                let entitiesRows = result.recordset[0];

                let relationRows;

                //릴레이션 테이블 조회
                if (entitiesRows.ENTITIES.length > 0) { // 엔티티 추출 OK

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
                } else { // 엔티티 추출 NO
                    if (cashRows.length > 0) {
                        if (apiFlag == 'COMMON') {
                            result = await pool.request()
                                .input('entities', sql.NVarChar, cashRows[0].LUIS_ENTITIES)
                                .query(queryConfig.defineTypeChkSpareQuery)
                            relationRows = result.recordset;
                        }
                        else {
                            relationRows = null;
                        }
                    } else {
                        sorryFlag = true;
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

                //타입 별 다이얼로그 조회
                if (apiFlag == "COMMON" && relationRows.length > 0) {
                    for (var i = 0; i < relationRows.length; i++) {
                        result = await pool.request()
                            .input('dlgId', sql.Int, relationRows[i].DLG_ID)
                            .input('useYn', sql.NVarChar, 'Y')
                            .query(queryConfig.selectDigQuery)
                        let dlgRows = result.recordset;

                        var item = {};

                        if (dlgRows[0].DLG_TYPE == textDlg) { // 텍스트
                            result = await pool.request()
                                .input('dlgId', sql.Int, dlgRows[0].DLG_ID)
                                .input('useYn', sql.NVarChar, 'Y')
                                .query(queryConfig.selectTextDlgQuery)

                            let textRows = result.recordset;
                            item = json.textParse(textRows[0]);

                        } else if (dlgRows[0].DLG_TYPE == cardDlg) { //카드
                            result = await pool.request()
                                .input('dlgId', sql.Int, dlgRows[0].DLG_ID)
                                .input('useYn', sql.NVarChar, 'Y')
                                .query(queryConfig.selectCardDlgQuery)

                            let cardRows = result.recordset;
                            item = json.cardParse(cardRows);

                        } else if (dlgRows[0].DLG_TYPE == mediaDlg) { // 미디어
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

            // sorry 메시지 확인
            if (sorryFlag || returnData.length == 0) {
                returnData = [];
                result = await pool.request()
                    .input('dlgGroup', sql.Int, '5')
                    .input('useYn', sql.NVarChar, 'Y')
                    .query(queryConfig.selectSorryDlgText)

                let sorryRows = result.recordset;

                returnData.push(json.textParse(sorryRows[0]));
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