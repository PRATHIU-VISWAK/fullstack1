const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

app.use(bodyParser.json());

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == id) {
      console.log(arr[i]);
      return i;
    }
  }
  return -1;
}

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i != index) {
      newArray.push(arr[i]);
    }
    else{
      console.log(arr[i]);
    }
  }
  return newArray;
}

app.get("/todo", (req, res) => {
  fs.readFile("todo.json", "utf-8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

let x = 1;
app.post("/todo", (req, res) => {
  fs.readFile("todo.json", "utf-8", (err, data) => {
    if (err) throw err;
    const todo = JSON.parse(data);
    let len = todo.length;
    if (len != 0) {
      x = todo[len - 1].id;
      x = x + 1;
    }
    const newtodo = {
      id: x,
      title: req.body.title,
    };
    todo.push(newtodo);

    fs.writeFile("todo.json", JSON.stringify(todo), (err) => {
      if (err) throw err;
    });
    res.json(todo);
  });
});

app.delete("/todo/:id", (req, res) => {
  fs.readFile("todo.json", "utf8", (err, data) => {
    if (err) throw err;
    let todo = JSON.parse(data);
    let todoIndex = findIndex(todo, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send("index not found");
    } else {
      todo = removeAtIndex(todo, todoIndex);
      res.send(todo);
    }
    fs.writeFile("todo.json", JSON.stringify(todo),(err) => {
      if (err) throw err
    })
  });
});

app.use((req, res, next) => {
  res.status(404).send();
});

app.listen(3000);
module.exports = app;
