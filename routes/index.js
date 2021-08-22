var express = require('express');
var router = express.Router();
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

require("dotenv").config(); 
//require("../config/db.js").connect(); 
//const express = require("express"); 
const auth = require("../middleware/auth"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const app = express(); 
//app.use(express.json()); 
// Logic goes here 
// importing user context 
const User = require("../model/user"); 
 
// Register 
router.post("/register", async (req, res) => { 

    try { 
        //Get user input 
        const { first_name, last_name, email, password } = req.body; 
        // Validate user input 
        if (!(email && password && first_name && last_name)) { 
          res.status(400).send("All input is required"); 
        } 
        // check if user already exist 
        const oldUser = await User.findOne({ email }); 
        if (oldUser) { 
          return res.status(409).send("User Already Exist. Please Login"); 
        } 
        //Encrypt user password 
        encryptedPassword = await bcrypt.hash(password, 10); 
        // Create user in our database 
        const user = await User.create({ 
          first_name, 
          last_name, 
          email: email.toLowerCase(), // sanitize: convert email to lowercase 
          password: encryptedPassword, 
        }); 
        // Create token 
        const token = jwt.sign( 
          { user_id: user._id, email }, 
          process.env.TOKEN_KEY, 
          { 
            expiresIn: "2h", 
          } 
        ); 
        user.token = token; res.status(201).json(user); 
  } catch (err) { 
    console.log(err); 
  }}); 

    
    
 
// Login 
router.post("/login", async (req, res) => { 
 
    // Our login logic starts here 
    try { 
      // Get user input 
      const { email, password } = req.body; 
   
      // Validate user input 
      if (!(email && password)) { 
        res.status(400).send("All input is required"); 
      } 
      // Validate if user exist in our database 
      const user = await User.findOne({ email }); 
   
      if (user && (await bcrypt.compare(password, user.password))) { 
        // Create token 
        const token = jwt.sign( 
          { user_id: user._id, email }, 
          process.env.TOKEN_KEY, 
          { 
            expiresIn: "2h", 
          } 
        ); 
   
        // save user token 
        user.token = token; 
   
        // user 
        res.status(200).json(user); 
      } 
      res.status(400).send("Invalid Credentials"); 
    } catch (err) { 
      console.log(err); 
    } });
    
    
    router.post("/welcome", auth, (req, res) => {
      res.status(200).send("Welcome ?? ");
    });
    

//module.exports = app; 
module.exports = router;

