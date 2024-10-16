const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  let { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createUser = await userModel.create({
        username,
        email,
        password: hash,
        age,
      });

      let token = jwt.sign({ email }, "secretKey");

      res.cookie("teken", token);

      res.redirect('/dashboard')
    //   res.send(createUser);
    });
  });
});

app.get('/dashboard', (req, res)=>{
    res.render("dashboard");
})

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.send("Something went Wrong");

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result) return res.redirect('/dashboard')
    else return res.send("Something went wrong");
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.listen(8000);
