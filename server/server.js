'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myfacerecognitiondb';


// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
	assert.equal(null, err);
	console.log("Connected successfully to server");

	const db = client.db(dbName);

	// client.close();

	function findDoc() {
		return db.collection('face').mapReduce(
			function() { test = new Date(NumberLong(this.date).valueOf().toString().replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, '$1-$2-$3T$4:$5:$6-05:00'))
				if (test >= new Date(ISODate().getTime() - 1000 * 60 * 60 * 24))
					emit('customers',1); },
			function(key,results) {
				return Array.sum(results);
			},
			{ "out": { "inline": 1 } }		)
	}
	function findDoc2() {
		return db.collection('face').count({})
	}
 
async	function allQueries() {
var a = await findDoc()
if (a.length === 0) a = [{'_id': 'customers', value: 0}]
var b = await findDoc2()
var total = {total: b}
a.push(total)
console.log(a)
return a;
}


	app.start = function() {
		return app.listen(function() {
			app.emit('started');
			console.log('Web server listening at: %s', app.get('url'));
		});
	};

	// Bootstrap the application, configure models, datasources and middleware.
	// Sub-apps like REST API are mounted via boot scripts.
	boot(app, __dirname, function(err) {
		if (err) throw err;

		if (require.main === module)

			//	var db = app.dataSources.mongoDs;
			//var face = app.models.face;

			app.io = require('socket.io')(app.start());
		console.log('io started');
		app.io.on('connection', function(socket){
			console.log('a user connected');
			socket.on('disconnect', function(){
				console.log('user disconnected');
			});
			socket.on('new', function(){
				console.log('new');
				socket.emit ('newSuccess');
				allQueries().then( result => {
					socket.emit ('reload',result);
					socket.broadcast.emit('reload', result)
					})
			});
			socket.on('add', function(customer){
				socket.broadcast.emit('face', customer)
				console.log('add', customer);
			});
			socket.on('debug', function(customer){
				socket.emit('toggleDebug')
				socket.broadcast.emit('toggleDebug')
				console.log('debug');
			});
			socket.on('update', function(customer){
				socket.broadcast.emit('update', customer)
				console.log('update', customer);
			});
			socket.on('edit', function(customer){
				socket.broadcast.emit('edit', customer)
				console.log('edit', customer);
			});

		});
	});
});

