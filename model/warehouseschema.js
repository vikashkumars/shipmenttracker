const mongoose = require("mongoose"); 
const schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const warehousechema = new mongoose.Schema({ 
  _id: schema.Types.ObjectId,
  name: { type: String, default: null }, 
  inchargename: { type: String, default: null }, 
  address1: { type: String, default: null }, 
  address2: { type: String, default: null }, 
  phoneno: { type: String, default: null }
  
}); 
warehousechema.plugin(
  autoIncrement, {
   inc_field: "warehouse_id"
})
const warehouseObj =  mongoose.model("warehousecollections", warehousechema); 
module.exports = warehouseObj;