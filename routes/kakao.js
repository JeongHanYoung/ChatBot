'use strict';
var express = require('express');

var sql = require('mssql');
var dbConfig = require('../modules/DB/dbConfig');

var luis = require('../modules/LUIS/Luis');

var router = express.Router();

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

    (async () => {
        try {
            var textQueryString = "SELECT question, answer FROM cb_common WHERE question = @message";

            let pool = await sql.connect(dbConfig)
            let result1 = await pool.request()
                .input('message', sql.NVarChar, content)
                .query(textQueryString)
            let rows = result1.recordset;

            let result = {
                "message": {
                    "text": rows[0].answer
                }
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

});

module.exports = router;

function loading_done(batch_num) {
    bot.sortReplies();
}

function loading_error(error) {
    console.log("Error when loading files: " + error);
}