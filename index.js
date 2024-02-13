const express = require("express");
const app = express();
const port = 3000;

function middleware1(req,res,next){
  console.log(req.headers.counter)
  res.send("some error")
  next()
}

app.use(middleware1)
app.get("/hello", (req, res) => {
  res.send("Hello, Express!");
});

function cal(num) {
  return num * num;
}

app.post("/math", (req, res) => {
  var counter = req.headers.counter;
  let val = cal(counter);
  let ans = "square of 10 : " + val;
  res.send(ans);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});