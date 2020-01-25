const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const geturl=require('url')
const app = express()
//const mongoose = require('mongodb').MongoClient; 

var transporter = nodemailer.createTransport({
	service: 'gmail',
	secure:false,
	port:25,
	auth: {
	  user: 'devendraraiyani2852000@gmail.com',
	  pass: 'Devendra@285'
	}
  });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/rythm',{
	useNewUrlParser: true,
	useUnifiedTopology: true
  }); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
	console.log("connection succeeded"); 
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 
	extended: true
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/searchsong',(req,res)=>{
  var url_parts = geturl.parse(req.url, true);
  var query = url_parts.query;
  var ssong='/'+query.ssong+'/';
  console.log(ssong);
  var data={"name":{$regex:ssong,$options:"si"}}
  db.collection('users').find(data).toArray(function(err, result){ 
		
		if (err) throw err;
				console.log(result);
	});
});

app.get('/loadsongs',(req,res)=>{
  var response;
  var url_parts = geturl.parse(req.url, true);
  var query = url_parts.query;
  MongoClient.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
    }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("rythm");
    //Find the first document in the customers collection:
    dbo.collection(query.pname).aggregate([
      { $lookup:
        {
          from: 'songs',
          localField: 'song_id',
          foreignField: 'song_id',
          as: 'plsongs'
        }
      }
    ]).toArray(function(err, result) {
      if (err) throw err;
     response=result;
     console.log("songs of "+query.pname+" ok");     
     res.json(response);
    db.close();
    });  
});   
})

app.get('/login',(req,res)=>{
  var url_parts = geturl.parse(req.url, true);
  var query = url_parts.query;
  var unm=query.uname;
  var pass=query.pass;
  var data = { 
		"email": unm, 
		"password":pass
	} 

	db.collection('users').find(data).toArray(function(err, result){ 
		
		if (err) throw err;
				res.json(result);
	});
});

app.get('/signup',(req,res)=>{
  var url_parts = geturl.parse(req.url, true);
  var query = url_parts.query;
  var unm=query.uname;
  var uemail=query.uemail;
  var pass=query.pass;
  var data = { 
		"name":unm,
		"email": uemail, 
		"password":pass
	} 
	
	var data1 = { 
		"email": uemail 
	}
	db.collection('users').insertOne(data,function(err, result){ 
		if (err) throw err;  
	  	res.json(result.result);
	});			
});

app.get('/checkac',(req,res)=>{
  var url_parts = geturl.parse(req.url, true);
  var query = url_parts.query;
  var unm=query.umail; 
	
	var data1 = { 
		"email": unm 
	} 
	db.collection('users').find(data1).toArray(function(err, result){ 
		
		if (err) throw err;
		if(result.length!=0){
			res.json("{n:1,ok:1}");
		}
		else{
			res.json("")		
		}
	});
});

app.get('/forgotmail',(req,res)=>{
  var url_parts = geturl.parse(req.url, true);
  var query = url_parts.query;
  var unm=query.umail; 
	
	var data1 = { 
		"email": unm 
	} 
	db.collection('users').find(data1).toArray(function(err, result){ 
		
		if (err) throw err;
		
		if(result.length!=0){
			res.json("{n:0,ok:0}");
		}
		else{
			res.json("")		
		}
	});
});

app.get('/changepass',(req,res)=>{
  var url_parts = geturl.parse(req.url, true);
  var query = url_parts.query;
  var unm=query.pass;
  var umail=query.mail;
	var myquery = { email: umail };
	var newvalues = { $set: {password: unm} };
	db.collection("users").updateOne(myquery, newvalues, function(err, res) {
	  if (err) throw err;
	  else res.json("{n:1,ok:1}");
	});
	
});

app.get('/otp',(req,res)=>{
	var url_parts = geturl.parse(req.url, true);
	var query = url_parts.query;
  var otp=Math.floor(Math.random() * 10000);
  //console.log(query.forwhat);
  if(query.forwhat=="forgot")
  {
    var mailOptions = {
      from: 'devendraraiyani2852000@gmail.com',
      to: query.umail,
      subject: 'OTP to change password in rythm account',
      html: '<h1>Welcome '+query.umail+',</h1><p><b>OTP is '+otp+'</b> to change your rythm account password.Please do not share it with anyone.</p><br><p>Thank you for choosing us as your primary entertainer.</p><br><p>Best Regards,rythm team</p>'
    };   
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email for forgot is sent: ' + info.response);
      }
      }); 
      res.json(otp);
  }
  if(query.forwhat=="sign")
  {
    var mailOptions = {
      from: 'devendraraiyani2852000@gmail.com',
      to: query.umail,
      subject: 'OTP to sign up in rythm account',
      html: '<h1>Welcome '+query.umail+',</h1><p><b>OTP is '+otp+'</b> to varify your email for rythm account.Please do not share it with anyone.</p><br><p>Thank you for choosing us as your primary entertainer.</p><br><p>Best Regards,rythm team</p>'
      };   
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email for signup is sent: ' + info.response);
      }
      }); 
      res.json(otp);
  }
	
});

app.get('/loadplaylist',(req,res)=>{
  MongoClient.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
    }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("rythm");
    //Find the first document in the customers collection:
    dbo.collection("playlists").find({}).toArray( function(err, result) {
      if (err) throw err;
      console.log("loadplaylists ok");
      res.json(result);
      db.close();
    });
});
})


app.listen(3000,'localhost',function(){
	console.log("server listening at port 3000");
})