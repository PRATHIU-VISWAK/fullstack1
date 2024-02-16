const express = require("express");
let bodyParser = require("body-parser")
const app = express();
const port = 3000;
// let numberofrequests = 0
// function middleware1(req,res,next){
//   numberofrequests = numberofrequests + 1
//   console.log(numberofrequests)
//   console.log(req.headers.counter)
//   //res.send("some error")
//   next()
// }


app.use(bodyParser.json())
//app.use(middleware1)



app.get("/hello", (req, res) => {
  res.send("Hello, Express!");
});

function cal(num) {
  return num * num;
}

app.post("/math", (req, res) => {
  //var counter = req.headers.counter;
  var counter = req.body.counter
  if(counter <= 100){
    let val = cal(counter);
    let ans = "square of 10 : " + val;
    res.send(ans);
  }
  else{
    res.status(400).send("input exceeds 100")
  }
  
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});