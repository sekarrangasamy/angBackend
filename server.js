var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');
var fileupload = require('express-fileupload');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path');

var app = express();
app.use(fileupload());

var Personal = require('./personal.js');
const SwaggerUI = require('swagger-ui-express');
var swaggerDocument = require('./swagger.js');
app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use('/', require('./import'));

//connection for Database
mongoose.connect('mongodb://192.168.2.30/sekar-crud', {
	useNewUrlParser: true
}).then(() => {
	console.log("Successfully connected to the database");
}).catch(err => {
	console.log('Could not connect to the database. Exiting now...');
	process.exit();
});
const fields = ['_id','name','phone','email','address','dob','qualification', 'college', 'university', 'type', 'company'];

//crud for personal
app.get('/personal', (req, res) => {
	var query = {};
	//this query for filter date wise users
	if (req.query.from && req.query.to) {
		query.createdAt = {
			$gte: moment(new Date(req.query.from)).startOf('day').format(),
			$lte: moment(new Date(req.query.to)).endOf('day').format()
		}
	}
	Personal.find(query).then((data) => {
		res.send(data);
	}).catch((err) => {
		res.send(err)
	})
});
app.post('/personal', (req, res) => {
	var getInfo = {};
		getInfo.name = req.body.name,
		getInfo.phone = req.body.phone,
		getInfo.email = req.body.email,
		getInfo.address = req.body.address,
		getInfo.dob = req.body.dob,
		getInfo.qualification = req.body.qualification,
		getInfo.college = req.body.college,
		getInfo.university = req.body.university,
		getInfo.type = req.body.type,
		getInfo.company = req.body.company
	Personal.create(getInfo).then((data) => {
		res.send(data);
	}).catch((err) => {
		res.send(err)
	})
});

app.post('/personal', (req, res) => {
	Personal.create(req.body).then((data) => {
		res.send(data);
	}).catch((err) => {
		res.send(err)
	})
});

app.put('/personal/:id', (req, res) => {
	var getInfo = {};
		getInfo.name = req.body.name,
		getInfo.phone = req.body.phone,
		getInfo.email = req.body.email,
		getInfo.address = req.body.address,
		getInfo.dob = req.body.dob,
		getInfo.qualification = req.body.qualification,
		getInfo.college = req.body.college,
		getInfo.university = req.body.university,
		getInfo.type = req.body.type,
		getInfo.company = req.body.company
	Personal.update({
		_id: req.params.id
	}, getInfo).then((data) => {
		res.send(data,200,"updated");
	}).catch((err) => {
		res.send(err)
	})
});


app.get('/personal/:id', (req, res) => {
	Personal.findById(req.params.id).then((data) => {
		res.send(data);
	}).catch((err) => {
		res.send(err)
	})
});

app.delete('/personal/:id', (req, res) => {
	Personal.findByIdAndRemove(req.params.id).then((data) => {
		res.send(data);
	}).catch((err) => {
		res.send(err)
	})
});





// app.get('/export', (req,res) => {
// 	var csv;
// 	try {
// 		Personal.find({}, function (err, data) {
// 			if (err) {
// 				return res.status(500).json({ err });
// 			}
// 			else {			
// 				csv = json2csv(data, { fields });			                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
// 				const dateTime = moment().format('YYYYMMDDhhmmss');
// 				const filePath = path.join(__dirname, ".", "file-" + dateTime + ".xlsx")
// 				fs.writeFile(filePath, csv, function (err) {
// 					if (err) {
// 						console.log('error', err);
// 						return res.json(err).status(500);
// 					}
// 					else {
// 						console.log('File Exported Successfully');
// 						return res.status(200).send({
// 							message:  "File Exported Successfully"
// 						});
// 					}
// 				});
// 			}
// 		})
// 	} catch(error) {
// 		return res.status(500).json({ err });
// 	}

// });


/*exports.sendOtp = async function(req, res) {
	try {
		var findMail = await User.findOne({
			email: req.body.email
		})
		if (!findMail) {
			return sendRsp(res, 404, "email not found");
		} else {
			var otpGenrate = Math.floor(1000 + Math.random() * 9000)
			var Message = config.email_msg.html
			Message = Message.replace('%OTP%', otpGenrate);
			Message = Message.replace('%NAME%', findMail.name);
			var emailObj = {
				html: Message,
				createTextFromHtml: true,
				from: config.email_config.SMTP_FROM,
				to: req.body.email,
				subject: config.email_msg.sub
			};
			agenda.now(config.jobs.emailNotifications, {
				"email": emailObj
			})
			findMail.otp = otpGenrate;
			findMail.otp_verified = false;
			var saveData = await findMail.save();
			return sendRsp(res, status.OK, "Email send");
		}

	} catch (err) {
		console.log("errrr", err)
		sendRsp(res, status.INTERNAL_SERVER_ERROR, msg.err, err)
	}
}


exports.verifyOtp = function(req, res) {

	User.findOne({
			email: req.body.email
		}).populate(references['users'])
		.exec()
		.then(findUser => {
			if (!findUser) {
				return sendRsp(res, 404, "User not found");
			} else {
				if (findUser.otp === req.body.otp) {
					findUser.otp_verified = true
					findUser.otp_verified_token_generated = new Date();
					findUser.save();
					return sendRsp(res, status.OK, msg.get, findUser)
				} else {
					return sendRsp(res, 404, "OTP MISSMATCH");
				}
			}
		}).catch(err => {
			console.log("err", err)
			sendRsp(res, status.INTERNAL_SERVER_ERROR, msg.err, err);
		})
}


exports.resendOtp = async function(req, res) {
	try {
		var findUser = await User.findOne({
			email: req.body.email
		})
		if (!findUser) {
			return sendRsp(res, 404, "user not found");
		} else {
			var otpGenrate = Math.floor(1000 + Math.random() * 9000)
			var Message = config.email_msg.html
			Message = Message.replace('%OTP%', otpGenrate);
			Message = Message.replace('%NAME%', findUser.name);
			var emailObj = {
				html: Message,
				createTextFromHtml: true,
				from: config.email_config.SMTP_FROM,
				to: req.body.email,
				subject: config.email_msg.sub2
			};
			agenda.now(config.jobs.emailNotifications, {
				"email": emailObj
			})
			findUser.otp = otpGenrate;
			findUser.otp_verified = false;
			findUser.otp_verified_token_generated = new Date();
			var saveData = await findUser.save();
			return sendRsp(res, status.OK, "Email Re-send");
		}

	} catch (err) {
		console.log("err", err)
		sendRsp(res, status.INTERNAL_SERVER_ERROR, msg.err, err);
	}
}

```*/



app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});