const dotenv = require('dotenv');
dotenv.config();

var tty = process.env.TTY || '/dev/pts/0'
  SerialPort = require("serialport")
  Readline = require('@serialport/parser-readline')
  express = require('express')
  timeout = require('express-timeout-handler')
  bodyParser = require("body-parser")
  app = express(),
  port = process.env.PORT || 8080
  RelayStatus = require('./api/dto/RelayStatus');

var { handleError, ErrorHandler } = require('./helpers/error')

// Open serial connection
var portObj = new SerialPort(tty, {
  baudRate: 19200
}, false);

// Create parser
var ttyParser = portObj.pipe(new Readline({
  delimiter: '\n\r'
}));

// Log serial data
portObj.on('data', function(data){
  console.log('Data Returned by the device');
  console.log('--------------------');
  console.log(String(data));
  console.log('--------------------');
});

// Serial error terminate app
portObj.on('error', function(error) {
  console.log('Serial error: ', error.message)
  process.exit(1);
})

// Load parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set app params
app.set('ttyOut', portObj);
app.set('ttyIn', ttyParser);

// Timeout after 5 sec
app.use(timeout.handler({
  timeout: 5000,
  onTimeout: function(req, res) {
    res.status(503).send('Service timeout. Please retry.');
  },
  onDelayedResponse: function(req, method, args, requestTime) {
    console.log(`Attempted to call ${method} after timeout`);
  },
  disable: ['write', 'setHeaders', 'send', 'json', 'end']
}));

// Load routes
var routes = require('./api/routes/relaysRoutes');
routes(app);

// 404 middleware
app.use(function(req, res) {
  throw new ErrorHandler(404, 'URL ' + req.originalUrl + ' not found');
});

// Error handler middleware
app.use(function(err, req, res, next) {
  handleError(err, res);
});

// Start app
console.log('Starting application.');
app.listen(port);
console.log('Numato RESTful API server started on port: ' + port);