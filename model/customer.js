const mongoose = require("mongoose"); 
const schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const userSchema = new mongoose.Schema({ 
  _id: schema.Types.ObjectId,
  cust_fname: { type: String, default: null }, 
  cust_lname: { type: String, default: null },
  address1: { type: String, default: null }, 
  address2: { type: String, unique: true }, 
  address3: { type: String, unique: true },
  phoneno: { type: String, unique: true },
  cust_email: { type: String, unique: true },
  password: { type: String }, 
  token: { type: String }, 
  createdate: {
        type: schema.Types.Date,
        default: Date.now()
    },
    updatedate: {
        type: schema.Types.Date,
        default: Date.now()
    }
}); 
userSchema.plugin(
  autoIncrement, {
   inc_field: "cust_id"
})
module.exports = mongoose.model("customer", userSchema); 
