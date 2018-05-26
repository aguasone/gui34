'use strict';
var app = require('../../server/server');

module.exports = function(Photo) {
	Photo.on('dataSourceAttached', function(obj){
		var find = Photo.findOne;
		Photo.findOne = function(filter, cb) {
			console.log(arguments);
			app.dataSources.mongo.connector.connect(function(err,db){
				db.collection('fs.files').findOne({},function(err,doc){
					console.log(doc)
				});
			});
			return find.apply(this, arguments);
		};
	});

	app.dataSources.mongo.connector.connect(function(err,db){
		db.collection('fs.files').findOne({},function(err,doc){
			console.log(doc)
		});
	});

};
