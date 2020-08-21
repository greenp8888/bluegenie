const express = require("express");
const https = require("https");

const bodyParser = require("body-parser");

const app = express();



app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",function(req,res){

  res.sendFile(__dirname + "/index.html");

});

app.post("/",function(req,res){



  const query = req.body.stockname
  const url1 = "https://api.tdameritrade.com/v1/marketdata/"+ query +"/pricehistory?apikey=D5KDFKNCJ0ETA9JDABECNG2X3SGHRDAC&periodType=month&frequencyType=daily&startDate=1588459870000&endDate=1593730270000"

  const today_time = Date.now()
  //if you want 30 min stock info, you can use the API below
  // const url = "https://api.tdameritrade.com/v1/marketdata/"+ query +"/pricehistory?periodType=day&period=1&frequencyType=minute&frequency=30&endDate="+ today_time + "&apikey=D5KDFKNCJ0ETA9JDABECNG2X3SGHRDAC"

  const url = "https://api.tdameritrade.com/v1/marketdata/"+ query +"/pricehistory?periodType=month&frequencyType=daily&endDate="+today_time+"&apikey=D5KDFKNCJ0ETA9JDABECNG2X3SGHRDAC"

  https.get(url, function(response) {


    response.on("data", function(data) {
      if (data.length > 200) {
      const stockdata = JSON.parse(data)
      console.log(stockdata.candles[stockdata.candles.length-1])

      res.write("<h1>Yesterday's stock information</h1>")
      res.write("<h1>The open price " + stockdata.candles[stockdata.candles.length-1].open + ".</h1>")
      res.write("<h1>The high price is " + stockdata.candles[stockdata.candles.length-1].high + ".</h1>")
      res.write("<h1>The low price is " + stockdata.candles[stockdata.candles.length-1].low + ".</h1>")
      res.write("<h1>The close price is " + stockdata.candles[stockdata.candles.length-1].close + ".</h1>")
      res.write("<h1>The volume is " + stockdata.candles[stockdata.candles.length-1].volume + ".</h1>")
      res.send();
    } else {
      res.redirect("/")
    }

    })



  })

});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
