const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require ('bcrypt');
const jwt = require("jsonwebtoken");
var route = express.Router();

const dirPath = path.join(__dirname, "samples");
const filePath = `${dirPath}/users.json`;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let users = require("./samples/users");

const port = 4200;
app.listen(port, () => console.log(`listening on port ${port}!`));

const ErrorHandler = (err, req, res, next) => {
  const errStatus = 401;
  if(errStatus == 401){
    const errMsg = 'Unauthorized Access';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg
    })
  }else{
    const errMsg = 'Unable to fetch other user profile';
    res.status(errStatus).json({
        success: false,
        status: 403,
        message: errMsg
    })
  }
  next();
}

function generateAccessToken(name) {
  return jwt.sign(name, "3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e", { expiresIn: '1800s' });
}

route.post("/users/login", async (req,res) => {
  const token = generateAccessToken({ name: req.body.name });
  res.json(token);
})

app.get("/users", (req, res) => {
  let jsonString = JSON.stringify(users);
  res.send(jsonString);
});

route.get("/users/:id", (req, res) => {
  let foundUser = users.find((x) => x.id === parseInt(req.params.id));
  if(foundUser){
    let jsonString = JSON.stringify(foundUser);
    res.send(jsonString);
  }else{
    res.send(error)
  }

});

route.post("/users", (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;
  let uposts = 
    {
      id: id,
      name: name,
      username: username,
      email: email,
    };
  if(id == 1){
    fs.readFile(filePath, function (err, data) {
      let readusers = JSON.parse(data);
      readusers.unshift(uposts);
  
      fs.writeFile(filePath, JSON.stringify(readusers), function (err) {
        if (err) {
          console.log(err);
        } else {
        }
      });
    });
    res.send("New User Added with id 1");
  }else{
    res.send(error)
  }
  
});

route.use(ErrorHandler)


app.use("/", route);