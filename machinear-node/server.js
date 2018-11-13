// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

// DATABASE SETUP
var mongoose   = require('mongoose');
mongoose.connect('mongodb://dgiral58:eafit.2018@ds055699.mlab.com:55699/machinear'); // connect to our database

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("DB connection alive");
});

// Variable models lives here
var Variables     = require('./app/models/variables');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'jelou' });	
});

// on routes that end in /variables
// ----------------------------------------------------
router.route('/variables')

	// create a variable (accessed at POST http://localhost:8080/variables)
	.post(function(req, res) {
		
		var variables = new Variables();		// create a new instance of the Report model
		variables.x = req.body.x;
		variables.y = req.body.y;
		variables.corriente = req.body.corriente;
		variables.voltaje = req.body.voltaje;
		
		variables.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Variables created' });
		});

		
	})

	// get all the variables (accessed at GET http://localhost:8080/api/variables)
	.get(function(req, res) {
		Variables.find({}).sort({_id:-1}).limit(10).exec(function(err, variables) {
			if (err)
				res.send(err);
			res.json(variables[0]);
		});
	});

// on routes that end in /variables/:variable_id
// ----------------------------------------------------
router.route('/variables/:variables_id')

	// get the variable with that id
	.get(function(req, res) {
		Variables.findById(req.params.variables_id, function(err, variable) {
			if (err)
				res.send(err);
			res.json(variable);
		});
	})

	// delete the variable with this id
	.delete(function(req, res) {
		Varialbles.remove({
			_id: req.params.variables_id
		}, function(err, variable) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Puerto que funciona: ' + port);
