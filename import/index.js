'use strict';

var express = require('express');
var controller = require('./import.controller');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/import', controller.ImportControl);
router.get('/export', controller.exportController);

module.exports = router;


