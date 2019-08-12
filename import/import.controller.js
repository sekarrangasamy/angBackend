
var mongoose = require('mongoose');
var personalModel = require('../personal');
var header = require('./header');
var _ = require('lodash');
var XLSX = require('xlsx')
var fs = require('fs')
var path = require('path')

exports.ImportControl = function(req, res) {
	var uploadFile = req.files.file.data;
	var workbook = XLSX.read(uploadFile,{type:'buffer'});
	var wsname;
	var ws;

	wsname = workbook.SheetNames[0];
	ws = workbook.Sheets[wsname];

	const data = XLSX.utils.sheet_to_json(ws, {
			header: 1,
			range: 0
	});
	var obj = {};
	data.forEach(function(row, i) {
		if (i != 0) {
			const headers = header["headers"];
				if (_.isArray(row)) {
					for (let index = 0; index < row.length; index++) {
						const element = row[index];
							if (headers[index] != undefined)
								obj[headers[index]] = element;
					}
				}
			var create = personalModel.create(obj, function(err) {
				if (err) {
					res.send("err");
				}
			})
		}
	})
res.send("success")
}

exports.exportController = function(req,res){
	
}
