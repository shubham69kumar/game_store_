var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const app = express()
var objectId = require('mongodb').ObjectID


mongoose.connect("mongodb://localhost:27017/game_store",{ useNewUrlParser: true ,  useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },(error)=>{
});
 
var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))




app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.post("/sign_up",(req,res)=>{
	bcrypt.hash(req.body.password,10,function(err,hashedPass){
		if(err){
			throw err;
		}
    var name = req.body.name;
    var email = req.body.email;
    var password = hashedPass;

    var data = {
        "name": name,
        "email" : email,
        "password" : password
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('index.html')
    })

})

app.post("/login",(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    db.collection('users').findOne({$or:[{email:req.body.username},{name:req.body.username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password,user.password,function(err,result){
                if(err){
                    res.json({
                        error:err
                    })
                }
                if(result){
                    let token = jwt.sign({name:user.name},'verySecretValue',{expiresIn:'1h'})
                    return res.redirect('home.html')
                }else{
                    res.json({
                        message:'password does not matched !!'
                    })
                }
            })
        }else{
            res.json({
                message:'no user found !!'
            })
        }
    })
 
})


app.get('/logout',function(req,res){
  try{
    res.clearCookie("jwt");
    console.log("logout Successfully")
    return res.redirect('index.html')
  } catch(error){
    res.status(500).send(error);
  }
});





app.set('view engine','ejs');



app.set('view options', {
    layout: false
});

app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3000);


console.log("Listening on PORT 3000");


app.post("/bill",(req,res)=>{
    
    var name = req.body.name;
    var email = req.body.email;
    var address = req.body.address;
    var city= req.body.city;
    var state = req.body.state;
    var zip= req.body.zip;
    var cname = req.body.cname;
    var cardnum=req.body.cardnum;
    var expmonth = req.body.expmonth;
    var expyear=req.body.expyear;
    var cvv = req.body.cvv;


    var data = {
        "name": name,
        "email" : email,
        "address":address,
        "city":city,
        "state":state,
        "zip":zip,
        "cname":cname,
        "cardnum":cardnum,
        "expmonth":expmonth,
        "expyear":expyear,
        "cvv":cvv
    }

    db.collection('bill').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Data Inserted Successfully");

        db.collection('bill').findOne( {'_id':data._id},(err,users) =>{
            if (err) throw err;
             res.render(__dirname+'/views/bill.ejs',{userbill:users});

            
        
        })
         
    })
  

    });


 app.get('/del', (req, res) => {
   return res.redirect('delete.html');
   });
    
   
app.post('/delete', function(req, res, next){
 var id = req.body.orderId;
 
 console.log('order with id: '+ id +' delete')
 db.collection('bill').deleteOne({"_id":objectId(id)} , (err,result)=>{
    if(err) throw err;
    res.redirect('home.html')

 })


  })
 app.get('/home', (req, res) => {
   return res.redirect('home.html');
   });


