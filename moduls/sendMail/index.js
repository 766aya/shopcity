var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config')

smtpTransport = nodemailer.createTransport(smtpTransport({
	service: config.email.service,
	port: 587,
	secureConnection: true,
	auth: {
		user: config.email.user,
		pass: config.email.pass
	}
}))

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html, cb) {

	smtpTransport.sendMail({

		from: config.email.user,
		to: recipient,
		subject: subject,
		html: html

	}, function (err, response) {
		if (err) {
			cb(err);
		}else{
			cb(null, 1);
		}
	});
}

module.exports = sendMail;