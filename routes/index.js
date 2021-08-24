var express = require('express');
var router = express.Router();
const Mongoose  = require('mongoose');
const carrierObj = require('../model/carrierschema');
const {productObj,orderObj} = require('../model/productschema');
const warehouseObj = require('../model/warehouseschema');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

require("dotenv").config(); 

const auth = require("../middleware/auth"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// importing user context 
const User = require("../model/customer"); 
 
// Register 
router.post("/register", async (req, res) => { 

    try { 
        //Get user input 
        const { cust_fname,cust_lname, cust_email, password,address1,address2,address3,phoneno } = req.body; 
        // Validate user input 
        if (!(cust_email && password && cust_fname && cust_lname)) { 
          res.status(400).send("All input is required"); 
        } 
        // check if user already exist 
        const oldUser = await User.findOne({ cust_email }); 
        if (oldUser) { 
          return res.status(409).send("User Already Exist. Please Login"); 
        } 
        //Encrypt user password 
        encryptedPassword = await bcrypt.hash(password, 10); 
        // Create user in our database 
        const user = await User.create({ 
          "_id":new Mongoose.Types.ObjectId(),
          cust_fname, 
          cust_lname, 
          cust_email: cust_email.toLowerCase(), // sanitize: convert email to lowercase 
          password: encryptedPassword, 
          address1,
          address2,
          address3,
          phoneno
        }); 
        // Create token 
        const token = jwt.sign( 
          { user_id: user._id, cust_email }, 
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
      const { cust_email, password } = req.body; 
   
      // Validate user input 
      if (!(cust_email && password)) { 
        res.status(400).send("All input is required"); 
      } 
      // Validate if user exist in our database 
      const user = await User.findOne({ cust_email }); 
   
      if (user && (await bcrypt.compare(password, user.password))) { 
        // Create token 
        const token = jwt.sign( 
          { user_id: user._id, cust_email }, 
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
    /**
   * Warehouse Master data creation 
   */
   router.post('/saveWarehouse', function (req, res, next) {
    const warehouseData = new warehouseObj({"_id":new Mongoose.Types.ObjectId(),"name": "Whitefield","inchargename":"vikash", "phoneno": "8908908907","address1":"bokaro","address2":"bokaro"});
    warehouseData.save((err, data) => {
       if (err) {
         console.log("error" + err);
       } else {
   
        // res.send(data);
       }
     })
     res.send("data save sucessfully");
   });
  /**
   * Carrier Master data creation 
   */
   router.post('/saveCarrier', function (req, res, next) {
    const carrierData = new carrierObj({"_id":new Mongoose.Types.ObjectId(),"carrier_name": "blue-dart","description":"courier services", "phoneno": "8908908907","address":"bokaro"});
    carrierData.save((err, data) => {
       if (err) {
         console.log("error" + err);
       } else {
   
        // res.send(data);
       }
     })
     res.send("data save sucessfully");
   });
/**
   * Product Master data creation 
   */
 router.post('/saveProduct', function (req, res, next) {
  const productData = new productObj({"_id":new Mongoose.Types.ObjectId(),"name": "Liril-soap","description":"bath soap1", "phoneno": "8080808080","address":"bihar","availableqty":"50"});
  productData.save((err, data) => {
     if (err) {
       console.log("error" + err);
     } else {
 
      // res.send(data);
     }
   })
   res.send("data save sucessfully");
 });
 /**
   * Order Master data creation plus product refernece
   */
  router.post('/saveOrder', function (req, res, next) {
    const productData = new productObj({"_id":new Mongoose.Types.ObjectId(),"name": "test","description":"test", "phoneno": "7676567","address":"test","availableqty":"9"});
    const orderData = new orderObj({"idref": productData._id,"orderprice": "231.2", "orderqty": "2"});
    productData.save((err, data) => {
       if (err) {
         console.log("error" + err);
       } else {
   
        // res.send(data);
       }
     })
     orderData.save((err, data) => {
       if (err) {
         console.log("error" + err);
       } else {
         
        // res.send(data);
       }
     })
     res.send("data save sucessfully");
   });
//module.exports = app; 
module.exports = router;

