const mongoose = require("mongoose"); 
mongoose.pluralize(null);// s coolection issues 

const schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const carrierschema = new mongoose.Schema({ 
  _id: schema.Types.ObjectId,
  carrier_name: { type: String, default: null }, 
  address: { type: String, default: null }, 
  phoneno: { type: String, default: null },
  description: { type: String, default: null },
  
}); 
carrierschema.plugin(
  autoIncrement, {
   inc_field: "carrier_id"
})
const carrierObj = mongoose.model("carrierscollections", carrierschema); 
//var dataSchema = new Schema(carrierschema, { collection: 'data' })
module.exports = carrierObj;