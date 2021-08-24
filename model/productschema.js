const mongoose = require("mongoose"); 
const schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const productschema = new mongoose.Schema({ 
  _id: schema.Types.ObjectId,
  name: { type: String, default: null }, 
  address: { type: String, default: null }, 
  phoneno: { type: String, unique: true },
  description: { type: String, unique: true },
  availableqty: { type: String, unique: true },
  expdate: {
    type: schema.Types.Date,
    default: Date.now()
    },
mandate: {
    type: schema.Types.Date,
    default: Date.now()+3
},
createdate: {
    type: schema.Types.Date,
    default: Date.now()
},
updatedate: {
    type: schema.Types.Date,
    default: Date.now()
}
  
}); 
productschema.plugin(
  autoIncrement, {
   inc_field: "product_id"
})
//order
const orderschema = new mongoose.Schema({ 
  idref: {
    type: schema.Types.ObjectId,ref:"productcollections"
    },
  orderprice: { type: String, default: null }, 
  orderqty: { type: String, default: null }, 
  orderdate: {
    type: schema.Types.Date,
    default: Date.now()+3
},
createdate: {
    type: schema.Types.Date,
    default: Date.now()
},
updatedate: {
    type: schema.Types.Date,
    default: Date.now()
}
 
  
}); 
orderschema.plugin(
  autoIncrement, {
   inc_field: "order_id"
})
const orderObj = module.exports = mongoose.model("ordercollections", orderschema); 
const productObj = module.exports = mongoose.model("productcollections", productschema); 
module.exports = {orderObj,productObj};