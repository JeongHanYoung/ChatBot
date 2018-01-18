
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');
var dbConfig = require('./dbConfig').dbConfig;
//const sql = require('mssql');
//var connPoolPromise = null;

var conn ;
var request ;

var jsonArray = [];


function Start(query,message,callback) {
	console.log('Starting...');
	var message = message;
	jsonArray = [];
	conn = new Connection(dbConfig);
	conn.on('connect', function (err) {

		if (err) { console.log(err); }
		else {
			console.log('Connected');

			async.waterfall(eval(query), function (err) {
				if (err) { console.log(err); }
				else {
					console.log("done");
					callback(null, jsonArray);
				}
			})
		}
	})
}

var Test = [
	function (callback) {
		console.log('testing rows from the Table...');

		// Read all rows from table
		
        var testQueryString = 'SELECT QUESTION , ANSWER FROM CB_COMMON;';
		var request = new Request(testQueryString, function (err, rowCount, rows) {
			if (err) {
				console.log(err);
			} else {
				console.log(rowCount + ' row(s) returned');
				//callback(null);
			}

			// Print the rows read
			var result = "";
			var rowObject = {};
			for (var i = 0; i < rowCount; i++) {
				var singleRowData = rows[i];
				console.log(singleRowData.length);
				for (var j = 0; j < singleRowData.length; j++) {
					var tempColName = singleRowData[j].metadata.colName;
					var tempColData = singleRowData[j].value;
					console.log("tempColName : " + tempColName + " || tempColData : " + tempColData);
					rowObject[tempColName] = tempColData;
				}
				jsonArray.push(rowObject);
			}
			console.log("jsonArray : " + jsonArray);
			callback(null, jsonArray);
		});

		// Execute SQL statement
		conn.execSql(request);
	}
];

module.exports = {
	Start
}