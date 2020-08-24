//jshint esversion:6

// Load Packages
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

// Initial setting
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// Connect cloud database
mongoose.connect("mongodb+srv://admin-bluegene:Bluegenie1@3@cluster0.mbvwo.mongodb.net/userDB", { useNewUrlParser: true });

const userSchema = {
  email: String,
  password: String,
  percent:Number
};

const User = new mongoose.model("User", userSchema);



//get the a specific value
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin-bluegene:Bluegenie1@3@cluster0.mbvwo.mongodb.net";

app.post("/login/balance",function(req,res){

  const queryname = req.body.Username;
  const querypassword = req.body.Password;

 MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("userDB")
  dbo.collection("users")
  .find({email: {$in:[queryname,"host@gmail.com"] }})//如果需要修改管理员邮箱，只需要修改host@gmail.com的address
  .toArray(function(err, result) {
    if (err) throw err;
    // console.log(result.length)
    if (result.length == 2 && querypassword == result[1].password) {
    // console.log(result)
    const percent = result[1].percent
    const balance = result[0].balance//总的balance
    const date = result[0].Date
    const comment = result[0].Comment

          const cashbalance = balance*percent
          //显示日期、用户余额和comment
          res.write("<h1>Date:" + date + ".</h1>")
          res.write("<h1>The current balance is " + cashbalance + ".</h1>")
          res.write("<h1>" + comment + "</h1>")

          res.send();
        } else{
          res.redirect("/login/balance");
        }
  });
});
});






//进入home page后会返回 home.ejs 显示界面
app.get("/",function(req,res){
  res.render("home");
});
//进入Login界面后返回 login.ejs 显示界面
app.get("/login", function(req,res){
  res.render("login");
});
//进入Register界面后返回 register.ejs 显示界面
app.get("/register", function(req,res){
  res.render("register");
});



// 点击Logout会跳转回login界面
app.get("/logout", function(req, res){
  res.redirect("/");
});

//点击login里的balance的button会返回用户再次登录界面（index.html)
app.get("/login/balance",function(req,res){

  res.sendFile(__dirname + "/index.html");

});




//以下code可帮助我们通过API取到TD Ameritrade网站的balance
// app.post("/login/balance",function(req,res){
//
//   const query = req.body.stockname
//   //UvNmbLrAg/2TRg4XRF+GgwZCQKUL6KOmzGZxxOh3X0XdsSUD7JupHFg3X6sMqzwRnLhn60gHogfDVD7a1e5/1n7JShs6Wrxp215Tzm5a25jvmFyb+i/FqXCL9vm6jxA0lOVdULyZnfqsXiwcXBLd8FTCs27SHEP1KhmIQ3YDOpyGlBjG1qzkuWw9TTB6Edv7NbD82rHYAynlqscu+BFq0jsh1r6MkWaOb7byRLeFgEeFI1gn94uVpbZQIo0/fE0ZrS20t6ers9FLvam5M7RC0FQLboDOOIKd294wJrrHjYkT+N0hRLHNtVHzxKDw+n6htqK1iOjNPvvo+EP0N7M71q0d44xS0091OJWEqE2eyTom1nQ+b/dRhoiXsU7hFUMMD5eLidORie2O6Yf1dvfa8JEr+kNy6taEKyzXDj1j8XWOf50T0hnRsWlH7keSGIkc89/BvL4dj2OLkCtMuJkxfAmdc4GxdlcML38A2ubx8jcFNHTu28gutpK83oIw/ujFb14AkWUNi7sME/1n4kb6Doi59/3bWiBTuOQTUT8Yo/EEiiXlSZHYfojNZHOAlDAW/4EvX100MQuG4LYrgoVi/JHHvlL00FPZX70BRR/M3k979w2/Op1aIUcSNOfuizMHPkvND4Pqj5Gy4CPgkk22Mr1SXpdjfzDqu7PiI//lNLlqjwGCTOyslhqEOl15Xdg7KE5SAdlfQnproqYO8pMvFZJgo3FXrhE3zsrBnX50C3Ov3FZWVqVtw9gd1w7RBBlZ9DUXZZUUK5LTlBKVFTkeTQUn+MbLSmiSjnn92osD+srGd/gu1snrIPMqKRQsau5tLAAf8a3S1a0/qwpmMAD/MixtSGBECPCJ9bTkh2vfmr4YkKLkUnrpoYoRMhORFkTsqC/V7joD+eapljxBpv5aq9iU/rZbrD3XF7En3tYHr3fskkQ+vP2NN7S3+HtwO+dVuz8N2K/t+rnBRgE8tSVd7w60l82Q0M0xh1dyUgE0ohrnTGiHy2N0pEPOjSaa87ie1z3K6kZmK2LKt26/KHzQCds67Z6aFcN4XbT/Wn6GC5a3wesjb0QKgo8NmAgVYrRz8/X+B1W0s87DsiyDY0mFKORMIr5o4nK70WJIda+CqcMzMkXyMLuungXrRp5ihR/3dpices5oBRzl2f0b7bL1SMCmc/PUCVEb212FD3x19z9sWBHDJACbC00B75E"
//   const url5 = "https://api.tdameritrade.com/v1/accounts?fields=positions"
//   const options = {
//     headers: {
//       Authorization: "Bearer " + query
//     }
//   };
//
//   https.get(url5,options ,function(response) {
//     console.log(response.statusCode);
//
//     response.on("data", function(data) {
//       console.log(data)
//       const stockdata = JSON.parse(data)
//       console.log(stockdata[0].securitiesAccount.currentBalances.cashBalance)
//       //
//       const cashbalance = stockdata[0].securitiesAccount.currentBalances.cashBalance
//       res.write("<h1>The current balance is " + cashbalance + ".</h1>")
//       // // res.write("<h1>The open price is " + openstockdata1 + ".</h1>")
//       res.send();
//     })
//
//   })
// });

//


//Register 我们目前无需用，但后续如果需要可用以下的code
app.post("/register",function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets");
    }
    });
  })

  //loign界面验证用户账号密码是否输入正确
  app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username}, function(err, foundUser){

      if (err) throw err;

        if (foundUser != null ){
          if (foundUser.password === password){
            res.render("secrets")
          } else{
            res.redirect("/login");
          }
        } else {
          res.redirect("/login");

      }
    })
  })






//响应的Port。process.env.PORT这个是为了能在Heroku云端显示网站。3000表示本地的Port 300可显示

app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000.");
});
