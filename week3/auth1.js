const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "viswak";

const generateJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "1hr" });
};

const AuthenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  let adminsignup = req.body;
  const existingadmin = ADMINS.find((a) => a.username === adminsignup.username);
  if (existingadmin) {
    res.status(403).json({ message: "admin already present" });
  } else {
    ADMINS.push(adminsignup);
    const token = generateJwt(adminsignup);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", AuthenticateJwt, (req, res) => {
  // logic to log in admin
  res.send("admin logged in");
});

app.post("/admin/courses", AuthenticateJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now();
  const existingcourse = COURSES.find((a) => a.title === course.title);
  console.log(existingcourse);
  if (existingcourse) {
    res.status(403).json({ message: "course already present" });
  } else {
    COURSES.push(course);
    res.json({ message: "course created successfully", courseId: course.id });
  }
});

app.put("/admin/courses/:courseId", AuthenticateJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  let course = req.body;
  const updatingcourse = COURSES.find((a) => a.id === courseId);
  if (updatingcourse) {
    Object.assign(updatingcourse, course);
    res.send("course updated");
  } else {
    res.status(403).json({ message: "course not present" });
  }
});

app.get("/admin/courses", AuthenticateJwt, (req, res) => {
  // logic to get all courses
  res.json(COURSES).send();
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  let usersignup = req.body;
  usersignup.purchasedCourses = [];
  const existinguser = USERS.find((a) => a.username === usersignup.username);
  if (existinguser) {
    res.status(403).json({ message: "user already present" });
  } else {
    USERS.push(usersignup);
    res.json({ message: "user created successfully" });
  }
});

app.post("/users/login", AuthenticateJwt, (req, res) => {
  // logic to log in user
  res.send("user logged in");
});

app.get("/users/courses", AuthenticateJwt, (req, res) => {
  // logic to list all courses
  res.json({ course: COURSES.filter((a) => a.published) }).send();
});

app.post("/users/courses/:courseId", AuthenticateJwt, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  let course = COURSES.find((c) => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not found or not available" });
  }
});

app.get("/users/purchasedCourses", AuthenticateJwt, (req, res) => {
  // logic to view purchased courses
  // const purchasedCourses = COURSES.filter(c =>curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | sudo gpg --yes  req.user.purchasedCourses.includes(c.id));
  var purchasedCourseIds = req.user.purchasedCourses;
  var purchasedCourses = [];
  for (let i = 0; i < COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {});
