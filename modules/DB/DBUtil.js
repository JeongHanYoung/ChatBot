
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');
//const sql = require('mssql');
//var connPoolPromise = null;

var conn ;
var request ;

var dbConfig = {
	server: "taiholab.database.windows.net",
	userName: "taihoinst",
	password: "taiho9788!",
	options: {
		encrypt: true,
		database: "taiholab_2",
		rowCollectionOnRequestCompletion: true
	}
};

var jsonArray = [];
//function getQuery(query) {

//	sql.connect(dbConfig).then(pool => {

//		return pool.request()
//		.input

//	})

//}


//function getQuery(query) {
	// Create connection instance



function Start(query,callback) {
	console.log('Starting...');
	jsonArray = [];
	conn = new Connection(dbConfig);
	//callback(null, 'Jake', 'United States');
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

var Read = [
	function (callback) {
		console.log('Reading rows from the Table...');

		// Read all rows from table
		
		var request = new Request('SELECT * FROM TBL_CHATBOT_CONF;', function (err, rowCount, rows) {
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

//function Read(callback) {
//	console.log('Reading rows from the Table...');

//	// Read all rows from table
//	var jsonArray = [];
//	var request = new Request('SELECT * FROM TBL_CHATBOT_CONF;', function (err, rowCount, rows) {
//		if (err) {
//			console.log(err);
//		} else {
//			console.log(rowCount + ' row(s) returned');
//			//callback(null);
//		}

//		// Print the rows read
//		var result = "";
//		var rowObject = {};
//		for (var i = 0; i < rowCount; i++) {
//			var singleRowData = rows[i];
//			console.log(singleRowData.length);
//			for (var j = 0; j < singleRowData.length; j++) {
//				var tempColName = singleRowData[j].metadata.colName;
//				var tempColData = singleRowData[j].value;
//				console.log("tempColName : " + tempColName + " || tempColData : " + tempColData);
//				rowObject[tempColName] = tempColData;
//			}
//			jsonArray.push(rowObject);
//		}
//		console.log("jsonArray : " + jsonArray);
//		callback(null,jsonArray);
//	});
	
//	// Execute SQL statement
//	conn.execSql(request);
	
	
//}

//function Complete(err, result) {
//	if (err) {
//		console.log("Complete error : " + err);
//	} else {
//		console.log("Complete Done!");
//	}
//}

//conn.on('connect', function (err) {

//	if (err) { console.log(err); }
//	else {
//		console.log('Connected');

//		async.waterfall([
//			Start
//		], Complete)
//	}
//})

	//conn.on('connect', function (err) {
	//	console.log("connect success : " + conn);
	//	var jsonArray = [];
	//	var request = new Request("SELECT TOP 10 CNF_TYPE FROM TBL_CHATBOT_CONF ", function (err, rowCount, rows) {
	//		console.log(jsonArray);
	//	});
	//	request.on("row", function (columns) {
	//		var rowObject = {};
	//		columns.forEach(function (column) {
	//			console.log("column.value : " + column.value);
	//			rowObject[column.metadata.colName] = column.value;
	//		});
	//		jsonArray.push(rowObject);
	//	});
			

	//	//	rows.forEach(function (columns) {
	//	//		columns.forEach(function (column) {
	//	//			rowObject[column.metadata.colName] = column.value;
	//	//		});
	//	//		jsonArray.push(rowObject);
	//	//	});
	//	//	return callback(null, rowCount, jsonArray);
	//	//console.log(jsonArray);
		
	//})
//}


//getQuery('SELECT TOP 10 CNF_TYPE AS CNF_NAME FROM TBL_CHATBOT_CONF');


//function getQuery(query) {
//	// Create connection instance
//	var conn = new Connection(dbConfig);

//	conn.on('connect', function (err) {

//		//if (err) {
//		//	console.log("connect error : " + err);
//		//}
//		//else {

//		console.log("connect success : " + conn);

//		var request = new Request(query, function (err, rowCount, rows) {
//			if (err) {
//				console.log("request error :" + err);
//			}
//			else {
//				console.log(rowCount + "Rows...");
//			}

//			console.log(rows);

//			rows.forEach(function (columns) {
//				columns.forEach(function (column) {
//					rowObject[column.metadata.colName] = column.value;
//				});
//				jsonArray.push(rowObject);
//			});
//			return callback(null, rowCount, jsonArray);
//			console.log(jsonArray);
//		});

//		//request.on('row', function (columns) {
//		//	columns.forEach(function (column) {
//		//		console.log(column.value);
//		//	});
//		//});
//		//conn.execSql(request);
//		//}
//	})

//}

//var request = new Request("SELECT TOP 5 * FROM tableName", function (err, rowCounts, rows) {
//	if (err) {
//		console.log(err);
//	}
//	else {
//		console.log(rowCounts + " rows returned");
//	}


//	//Now parse the data from each of the row and populate the array. 
//	for (var i = 0; i < rowCounts; i++) {
//		var singleRowData = rows[i];
//		//console.log(singleRowData.length);
//		for (var j = 0; j < singleRowData.length; j++) {
//			var tempColName = singleRowData[j].metadata.colName;
//			var tempColData = singleRowData[j].value;
//			rowObject[tempColName] = tempColData;
//		}
//		jsonArray.push(rowObject);
//	}
//	//This line will print the array of JSON object.  
//	console.log(jsonArray);
//}
//function getQuery(query) {
//	// Create connection instance
//	var conn = new Connection(dbConfig);

//	conn.connect()
//		// Successfull connection
//		.then(function () {

//			// Create request instance, passing in connection instance
//			var req = new sql.Request(conn);

//			// Call mssql's query method passing in params
//			req.query(query)
//				.then(function (recordset) {
//					console.log(recordset);
//					conn.close();
//				})
//				// Handle sql statement execution errors
//				.catch(function (err) {
//					console.log(err);
//					conn.close();
//				})

//		})
//		// Handle connection errors
//		.catch(function (err) {
//			console.log(err);
//			conn.close();
//		});
//}



//function getConnectionPoolPromise() {

//	if (connPoolPromise) return connPoolPromise;
	
//	connPoolPromise = new Promise(function (resolve, reject) {
//		var conn = new sql.Connection(require(dbConfig));

//		conn.on('close', function () {
//			connPoolPromise = null;
//		});

//		conn.connect().then(function (connPool) {
//			return resolve(connPool);
//		}).catch(function (err) {
//			connPoolPromise = null;
//			return reject(err);
//		});
//	});

//	return connPoolPromise;
//}

//function  getQuery(sqlQuery, callback) {

//	getConnectionPoolPromise().then(function (connPool) {

//		var sqlRequest = new sql.Request(sqlQuery);
//		return sqlRequest.query(sqlQuery);

//	}).then(function (result) {
//		callback(null, result);
//	}).catch(function (err) {
//		callback(err);
//	});
//};

//string connStr = "Data Source=taiholab.database.windows.net;Initial Catalog=taihoLab_2;User ID=taihoinst;Password=taiho9788!;";

//var config = {

//	userName: 'taihoinst',
//	password: 'taiho9788!',
//	server: 'taiholab.database.windows.net',
//	options: {
//		database: 'taihoLab_2',
//		encrypt: true
//	}
//}

//var connection = new Connection(config);

//connection.on('connect', function (err) {

//	if (err) {
//		console.log(err)
//	}
//	else {

//		queryDatabase();

//	}

//});


//function queryDatabase() {

//	console.log('queryDatabase start');

//	request = new Request("SELECT TOP 10 CNF_TYPE AS CNF_NAME FROM TBL_CHATBOT_CONF ",
//		function (err, rowCount, rows) {

//			console.log(rowCount + 'row(s) returned...');
//			process.exit();
//		});

//	request.on('row', function (columns) {
//		columns.forEach(function (column) {
//			console.log("%s\t%s", column.metadata.colName, column.value);
//		});
//	});
//	connection.execSql(request);
//}

module.exports = {
	Start
}