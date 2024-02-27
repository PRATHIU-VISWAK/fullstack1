const express = require("express");
const app = express();
const fs = require("fs");
const jwt = require("jsonwebtoken");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

try {
  ADMINS = JSON.parse(fs.readFileSync("ADMINS.json", "utf8"));
  USERS = JSON.parse(fs.readFileSync("USERS.json", "utf8"));
  COURSES = JSON.parse(fs.readFileSync("COURSES.json", "utf8"));
} catch {
  ADMINS = [];
  USERS = [];
  COURSES = [];
}

const secretKey = "valorant";
const generateJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1HR" });
};

const authenticateJwt = (req, res, next) => {
  let token = req.headers.authorization;
  //console.log(token)
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, secretKey, (err , user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next()
    });
  }else{
    res.sendStatus(401);
  }
};
// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const adminsignup = req.body;
  const adminpresent = ADMINS.find((a) => a.username === adminsignup.username);
  if (adminpresent) {
    res.json({ message: "admin already present " });
  } else {
    ADMINS.push(adminsignup);
    fs.writeFile("ADMINS.json", JSON.stringify(ADMINS), (err) => {
      if (err) throw err;
      res.json({ message: "admin signed up sucessfully " });
    });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  let adminlogin = req.headers.username;
  const adminpresent = ADMINS.find((a) => a.username === adminlogin);
  if (adminpresent) {
    const token = generateJwt(adminlogin);
    res.json({ message: "login successfull", token: token });
  } else {
    res.json({ message: "complete signup" });
  }
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  // logic to create a course
  const course = req.body
  course.id = COURSES.length+1
  let coursepresent = COURSES.find(a => a.title === course.title)
  if(coursepresent){
    res.json({course : "course present"});
  }else{
    COURSES.push(course)
    fs.writeFile("COURSES.json",JSON.stringify(COURSES),(err)=>{
      if (err) throw err;
      res.json({course : "course successfully created"}) 
    })
  }
});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
});

app.post("/users/login", (req, res) => {
  // logic to log in user
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
