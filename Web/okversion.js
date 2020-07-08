const express = require("express");
const https = require("https");

// 千万要记住我这边还没Install package

const bodyParser = require("body-parser");

const app = express();



app.use(bodyParser.urlencoded({
  extended: true
}));
//
app.get("/",function(req,res){

  res.sendFile(__dirname + "/index.html");

});

app.post("/",function(req,res){


  // const query = req.body.stockNAme;
  const query = req.body.stockname
  const url = "https://api.tdameritrade.com/v1/marketdata/"+ query +"/pricehistory?apikey=D5KDFKNCJ0ETA9JDABECNG2X3SGHRDAC&periodType=month&frequencyType=daily&startDate=1588459870000&endDate=1593730270000"
  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const stockdata = JSON.parse(data)
      const openstockdata = stockdata.candles[0].open
      const openstockdata1 = stockdata.candles[1].open
      res.write("<h1>The open price is " + openstockdata + ".</h1>")
      res.write("<h1>The open price is " + openstockdata1 + ".</h1>")
      res.send();
    })



  })
});












app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
