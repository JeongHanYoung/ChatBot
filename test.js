const sql = require('mssql')

var config = {
	server: "taiholab.database.windows.net",
	user: "taihoinst",
	password: "taiho9788!",
	database: "taiholab_2",
	options: {
		encrypt: true,
		
	}
}

//sql.connect(config, err => {
//	// ... error checks

//	// Query

//	new sql.Request().query('select cnf_NM from TBL_CHATBOT_CONF where sid = 1', (err, result) => {
//		// ... error checks

//		console.log(result)
//	})

//	// Stored Procedure

//	//new sql.Request()
//	//	.input('input_parameter', sql.Int, value)
//	//	.output('output_parameter', sql.VarChar(50))
//	//	.execute('procedure_name', (err, result) => {
//	//		// ... error checks

//	//		console.dir(result)
//	//	})
//})

//sql.on('error', err => {
//	// ... error handler
//})

	(async function () {
		try {
			let pool = await sql.connect(config)
			let result1 = await pool.request()
				.input('input_parameter', sql.Int, 2)
				.query('select CNF_NM from TBL_CHATBOT_CONF where sid = @input_parameter')

			console.dir(result1)

			// Stored procedure

			//let result2 = await pool.request()
			//	.input('input_parameter', sql.Int, value)
			//	.output('output_parameter', sql.VarChar(50))
			//	.execute('procedure_name')

			//console.dir(result2)
		} catch (err) {
			// ... error checks
		}
	})()

sql.on('error', err => {
	// ... error handler
})


//sql.connect(config).then(pool => {
//	// Query

//	return pool.request()
//		.input('input_parameter', sql.Int, 2)
//		.query('select CNF_NM from TBL_CHATBOT_CONF where sid = @input_parameter')
//}).then(result => {
//	console.log(result)

//	// Stored procedure

////	return pool.request()
////		.input('input_parameter', sql.Int, 1)
////		.output('output_parameter', sql.VarChar(50))
////		.execute('procedure_name')
////}).then(result => {
////	console.log(result)
//}).catch(err => {
//	// ... error checks
//})

//sql.on('error', err => {
//	// ... error handler
//})