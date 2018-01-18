'use strict';
var express = require('express');

var sql = require('mssql');
var dbConfig = require('../modules/DB/dbConfig');

var luis = require('../modules/LUIS/Luis');

var router = express.Router();

//WEB
router.get('/', function (req, res) {
	
    res.render('index');
});


router.post('/input', function (req, res) {
	console.log("[WEB]req.body.message : " + req.body.message);

    (async () => {
        try {
            var textQueryString = "SELECT question, answer FROM cb_common WHERE question = @message";

            let pool = await sql.connect(dbConfig)
            let result1 = await pool.request()
                .input('message', sql.NVarChar, req.body.message)
                .query(textQueryString)
            let rows = result1.recordset;

            let result = {
                "type": "text",
                "contents": [
                    { "text": rows[0].answer }
                ]
            };
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