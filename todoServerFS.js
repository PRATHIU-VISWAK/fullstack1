const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs')
const app = express();

app.use(bodyParser.json());
let todo = []


function findIndex(arr, id){
  for(let i=0;i < arr.length ; i++){
    if(arr[i].id == id )
    { 
      console.log(arr[i])
      return i
    }  
  }
  return -1;
}

function removeAtIndex(arr , index){
  let newArray = []
  for(let i=0;i < arr.length ; i++){
    if(i != index ){
      newArray.push(arr[i])
    }
  }
  return newArray
}

app.get("/todo",(req,res) => {
  fs.readFile("todo.json","utf-8",(err , data) => {
    if(err) throw err;

  })  
  res.json(JSON.parse(data))
})

let x = 1
app.post('/todo',(req,res) =>{
  const newtodo = {
    id : x,
    title : req.body.title
  }
  x = x+1
  todo.push(newtodo)
  res.json(todo)
})

app.delete("/todo/:id",(req,res) => {
  let todoIndex = findIndex(todo , parseInt(req.params.id))
  if(todoIndex === -1){
    res.status(404).send("index not found");
  }
  else{
    todo = removeAtIndex(todo , todoIndex)
    res.send(todo)
  }
})

app.use((req,res,next)=>{
  res.status(404).send()
})

app.listen(3000)
module.exports = app;