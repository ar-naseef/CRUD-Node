var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/applercrud";

// setting up hadlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// setting up bodyparser for post requesrts
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// root
app.get('/', function(req, res) {
	res.render('home');
});

var collection;
MongoClient.connect(url, function (err, db) {
	if(err) throw err;

	collection = db.collection("vehicles");
});

// create data form
app.get('/createdata', function(req, res) {
	res.render('create');

});

// create data
app.post('/createdata', function(req, res) {
	var numberplate = req.body.numberplate;
	var type = req.body.type;
	var color = req.body.color;
	var dbobj = {
		"numberplate": numberplate,
		"type": type,
		"color": color
	};
	// insert to DB
	collection.insertOne(dbobj, function(err, result) {
		if(err) throw err;
	});
	res.end("data sent to server");
});

// search input interface
app.get('/getdata', function(req, res) {
	res.render('search');
});
// search results
app.get('/getdata/:plate', function(req, res) {
	var plate = req.params.plate;
	// search for plate in db and return results
	collection.findOne({"numberplate": plate}, function(err, result) {
		if(err) throw err;
		if(result) {
			res.send(result);
		} else {
			res.send("data not found in DB");
		}
	});
});

// update data interface
app.get('/updatedata', function(req, res) {
	res.render('update');
});
// update data in DB
app.post('/updatedata', function(req, res) {
	var numberplate = req.body.numberplate;
	var type = req.body.type;
	var color = req.body.color;
	// find for numberplate
	
	var filter = {"numberplate": numberplate};
	var newvalues = {"numberplate": numberplate, "type": type, "color": color};
	
	collection.updateOne(filter, newvalues, function(err, result) {
		if (err) throw err;
		
		if (result.matchedCount == 1) {
			res.end("data updated");
		} else {
			res.end("data not found in DB");
		}
	});
});

// delete data interface
app.get('/deletedata', function(req, res) {
	res.render('delete');
});
// delete data from databse
app.get('/deletedata/:plate', function(req, res) {
	var plate = req.params.plate;
	// delete plate form the DB
	collection.deleteOne({"numberplate": plate}, function(err, reslt) {
		if(err) throw err;
		if(reslt.deletedCount == 1) {
			res.end("deleted");
		} else {
			res.end("data not found to delete");
		}
	});
});


app.listen('3012', function (err) {
	if (err) throw err

	console.log('server running on 3012');
});