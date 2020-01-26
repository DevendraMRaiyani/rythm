const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const geturl=require('url')



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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4201');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/adminlogin',(req,res)=>{
  var url_parts = geturl.parse(req.url, true);
  var query = url_parts.query;
  var unm=query.uname;
  var pass=query.pass;
  var data = { 
        "UserName":unm, 
        "Password":pass
    } 

    db.collection('AdminUsers').find(data).toArray(function(err, result){ 
        
        if (err) throw err;
                res.json(result);
    });
});

app.get('/checkCatagory',(req,res)=>{
    var url_parts = geturl.parse(req.url, true);
    var query = url_parts.query;
    var cname=query.cname;
    var data = { 
        "Catagory": cname
      } 
      
      db.collection('Catagories').find(data).toArray(function(err, result){ 
          
        if (err) throw err;
                res.json(result);
    });			
  });

  app.get('/loadSongs',(req,res)=>{
    MongoClient.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true
      }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mmusic");
      //Find the first document in the customers collection:
      dbo.collection("songs").find({}).toArray( function(err, result) {
        if (err) throw err;
        //console.log("catagories ok");
        res.json(result);
        db.close();
      });
  });
  })

  app.get('/loadCata',(req,res)=>{
    MongoClient.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true
      }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mmusic");
      //Find the first document in the customers collection:
      dbo.collection("Catagories").find({}).toArray( function(err, result) {
        if (err) throw err;
        //console.log("catagories ok");
        res.json(result);
        db.close();
      });
  });
  })

  app.get('/loadPlaylists',(req,res)=>{
    MongoClient.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true
      }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mmusic");
      //Find the first document in the customers collection:
      dbo.collection("playlists").find({}).toArray( function(err, result) {
        if (err) throw err;
        //console.log("catagories ok");
        res.json(result);
        db.close();
      });
  });
  })

  app.get('/removePlaylist',(req,res)=>{
    var url_parts = geturl.parse(req.url, true);
    var query = url_parts.query;
    var name=query.name;
    var data = {  
        "name":name
      } 
      console.log("deleted : "+data.name);
    db.collection('playlists').deleteOne(data,function(err, result){ 
      if (err) throw err;
      res.json(result.result);
    });	  
  });

app.get('/addCatagory',(req,res)=>{
    var url_parts = geturl.parse(req.url, true);
    var query = url_parts.query;
    var cname=query.cname;
    var data = { 
        "Catagory": cname
      } 
      
      db.collection('Catagories').insertOne(data,function(err, result){ 
          if (err) throw err;  
            res.json(result.result);
      });			
  });

  app.get('/renameCatagory',(req,res)=>{
      var url_parts = geturl.parse(req.url, true);
      var query = url_parts.query;
      var cnewname=query.cnewname;
      var coldname=query.coldname;
      var myquery = { "Catagory": coldname };
      var data = { 
          "Catagory": cnewname
        } 
      var newvalues = { $set: data };
      db.collection("Catagories").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
         
      });	
      res.json("{n:1,ok:1}");		
  });


const prt = 8080;
app.listen(prt,function(){
	console.log("server listening at port "+prt);
})