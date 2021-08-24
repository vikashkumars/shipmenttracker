const mongoose = require("mongoose"); 
const schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const carrierschema = new mongoose.Schema({ 
  _id: schema.Types.ObjectId,
  carrier_name: { type: String, default: null }, 
  address: { type: String, default: null }, 
  phoneno: { type: String, unique: true },
  description: { type: String, unique: true },
  
}); 
carrierschema.plugin(
  autoIncrement, {
   inc_field: "carrier_id"
})
const carrierObj = module.exports = mongoose.model("carrierscollections", carrierschema); 
module.exports = carrierObj;