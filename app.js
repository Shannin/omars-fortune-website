var bodyParser = require('body-parser')
var express = require('express')
var MailChimpAPI = require('mailchimp').MailChimpAPI
var path = require('path')
var validator = require('validator')
require('dotenv').config()

var server_port = process.env.PORT || 8080
var public_dir = './public/'

var app = express()
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/img', express.static(__dirname + '/img'))

var mailchimpKey = process.env.MAILCHIMP_API_KEY || 'a544f296627f3988d034230b76bba7bc-us11'
var mailchimp = MailChimpAPI(mailchimpKey, { version : '2.0' })

var sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

app.post('/api/newsletter', function(req, res) {
    var values = req.body

    if (values.emailList === '') {
        res.json({'success': false, 'message': 'Unknown email list'})
        return
    }

    if (values.email === '') {
        res.json({'success': false, 'message': 'Please enter an Email Address'})
        return
    }

    if (!validator.isEmail(values.email)) {
        res.json({'success': false, 'message': 'Please enter a valid Email Address'})
        return
    }

    if (!values.location) {
        values.location = ''
    }

    var params = {
        id: values.emailList,
        batch: [{
            email: {
                email: values.email,
            },
            merge_vars: {
                LOCATION: values.location,
            },
            email_type: 'html',
        }],
        double_optin: false, // dont send opt in email
    }

    mailchimp.call('lists', 'batch-subscribe', params, function (error, data) {
        if (error) {
            console.log(error)
            res.json({'success': false, 'message': 'Something went wrong'})
            return
        }

        res.json({'success': true, 'message': 'Successfully added to the email list'})
    })
})

app.post('/api/contact', function(req, res) {
    var values = req.body

    if (values.email === '') {
        res.json({'success': false, 'message': 'Please enter an Email Address'})
        return
    }

    if (!validator.isEmail(values.email)) {
        res.json({'success': false, 'message': 'Please enter a valid Email Address'})
        return
    }

    if (values.comment === '') {
        res.json({'success': false, 'message': 'Unknown email list'})
        return
    }

    if (values.name !== '') {
        var from = values.name + '<' + values.email + '>'
    } else {
        var from = values.email
    }

    var subject = 'Contact Form Submission: ' + values.email

    const msg = {
      to: 'omar@omarsfortune.com',
      from: from,
      replyTo: from,
      subject: subject,
      text: values.comment,
    }
    sendgrid.send(msg, function (error, result) {
        if(error){
            console.log(error)
            res.json({'success': false, 'message': 'Something went wrong.'})
            return
        }

        res.json({'success': true, 'message': 'Message sent successfully'})
    })
})


app.get('/', function(req, res) {
    res.sendfile(public_dir)
})


app.listen(server_port, function() {
  console.log("Listening on " + server_port)
})
