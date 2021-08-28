var express = require('express');
var router = express.Router();
const Mongoose = require('mongoose');
const carrierObj = require('../model/carrierschema');
const { productObj, orderObj } = require('../model/productschema');
const { shipmentObj, deliveryObj } = require('../model/shipmentschema');
const warehouseObj = require('../model/warehouseschema');
const sendMail = require("../model/shipmailer");
const url = require('url');
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// importing user context 
const User = require("../model/customer");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
// Register 
router.post("/register", async (req, res) => {

  try {
    //Get user input 
    const { cust_fname, cust_lname, cust_email, password, address1, address2, address3, phoneno } = req.body;
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
      "_id": new Mongoose.Types.ObjectId(),
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
  }
});

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
  }
});

router.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome ?? ");
});
/**
 * API1 creation for shipment tracking 
 * Input:orderId, customerId, carrierID, warehouseId
 * Output:shipmentId,carrierID, expectedDeliveryDate and orderId.
 * 
 * Todo's API2 implementation ?
 */

router.post('/addshipmentstatus', auth, async function (req, res) {
  //shipmentObj, deliveryObj
  const query = url.parse(req.url, true);
  var qdata = query.query;
  const deliveryData = new deliveryObj({ "_id": new Mongoose.Types.ObjectId(), "idrefcarrier": qdata.carrierID, "idreforder": qdata.orderId, "idrefwarehouse": qdata.warehouseId, "reasonofdelay": { "desc": "ready", "date": "2021-10-21" }, "expectedDeliveryDate": new Date() });
  const shipmentData = new shipmentObj({ "_id": new Mongoose.Types.ObjectId(), "idrefcustomer": qdata.customerId, "idreforder": qdata.orderId, "idrefdelivery": deliveryData._id, "status": [{ "type": "procession", "date": "2021-10-21" }], "deliveryotp": "11231" });

  let dlvRes = await deliveryData.save();
  let shpRes = await shipmentData.save();
  console.log("dlvRes " + dlvRes + "shpRes " + shpRes);
  /*
  Expected ouput
  shipmentId,carrierID, expectedDeliveryDate and orderId
  */
  await sendMail();

  var result = { "shipmentId": shipmentData._id, "carrierID": deliveryData.idrefcarrier, "expectedDeliveryDate": deliveryData.expectedDeliveryDate, "orderId": shipmentData.idreforder };
  res.send(result);
});
/**
 * API3: Shipment status update whenever status is changing 
 * Input:orderId, customerId, carrierID, ShipmentID, statusType
 * Output:successfully updated.
 */
router.put('/updateshipmentstatus', auth, function (req, res) {
  const query = url.parse(req.url, true);
  var qdata = query.query;
  console.log(" idreforder " + qdata.orderId + " idrefcustomer " + qdata.customerId);

  shipmentObj.find({ "idrefcustomer": qdata.customerId }).exec(function (err, data) {
    var obj = JSON.stringify(data);
    var parseObj = JSON.parse(obj);

    console.log('The author is %s', parseObj[0].status.length);
    var statusArr = [];
    var statusprepartion;
    var tryone = [];
    parseObj.forEach((val, i) => {
      //statusArr.push(val.status.toString());
      tryone = val.status;
    });
    statusprepartion = { type: qdata.statusType, date: new Date() };
    tryone.push(statusprepartion);
    console.log("statusprepartion  ====    " + JSON.stringify(tryone));


    if (err) return handleError(err);

    // res.send(data);
    //Prepare status object
    //console.log("print   "+data);
    /**
     * Update the status whenever status is getting changed.
     */
    //  statusArr.forEach((statusVal, i) => {
    //   statusprepartion = "{type:"+statusVal.type+",date:"+statusVal.date
    // });
    // statusprepartion = statusprepartion + "type:"+qdata.statusType+",date:"+ new Date()+"}"


    shipmentObj.findOneAndUpdate({ "idreforder": qdata.orderId, "idrefcustomer": qdata.customerId }, { "status": tryone }, (err, data) => {

      if (err) {
        console.log("error" + err);
      } else {
        res.send(data);
      }
    })
  });

});

/**
* Warehouse Master data creation 
*/
router.post('/saveWarehouse', auth, function (req, res) {
  const warehouseData = new warehouseObj({ "_id": new Mongoose.Types.ObjectId(), "name": "Whitefield", "inchargename": "vikash", "phoneno": "8908908907", "address1": "bokaro", "address2": "bokaro" });
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
router.post('/saveCarrier', auth, function (req, res, next) {
  const carrierData = new carrierObj({ "_id": new Mongoose.Types.ObjectId(), "carrier_name": "blue-dart", "description": "courier services", "phoneno": "8908908907", "address": "bokaro" });
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
router.post('/saveProduct', auth, function (req, res, next) {
  const productData = new productObj({ "_id": new Mongoose.Types.ObjectId(), "name": "Liril-soap", "description": "bath soap1", "phoneno": "8080808080", "address": "bihar", "availableqty": "50" });
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
router.post('/saveOrder', auth, function (req, res, next) {
  const productData = new productObj({ "_id": new Mongoose.Types.ObjectId(), "name": "test", "description": "test", "phoneno": "7676567", "address": "test", "availableqty": "9" });
  const orderData = new orderObj({ "idref": productData._id, "orderprice": "231.2", "orderqty": "2" });
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

