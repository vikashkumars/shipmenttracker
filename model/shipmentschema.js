/**
 * •	ShipmentId will be generated randomely.
•	This API will update shimentStaus collection with below data:
orderId, deliveryId , customerId , shipmentId , status [ ] , creationDate, orderDate ,  updatedDate
•	creationDate will be system time while first entry
•	This API will update Deliver collection with below data:
Delivery Collections: carrierId, expectedDeliveryDate , pickupDate , orderId , warehouseId , reasonOfDelay [desc : " " , date : " " ]
status
*/
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const shipmentschema = new mongoose.Schema({
    _id: schema.Types.ObjectId,
    deliveryotp: { type: String, default: null },
    status: [{ type: Object }],
    createdate: {
        type: schema.Types.Date,
        default: Date.now()
    },
    updatedate: {
        type: schema.Types.Date,
        default: Date.now()
    },
    idreforder: {
        type: schema.Types.ObjectId, ref: "ordercollections"
    },
    idrefcustomer: {
        type: schema.Types.ObjectId, ref: "customer"
    },
    idrefdelivery: {
        type: schema.Types.ObjectId, ref: "deliverycollections"
    }

});
shipmentschema.plugin(
    autoIncrement, {
    inc_field: "shipment_id"
})
//delivery
const deliveryschema = new mongoose.Schema({
    _id: schema.Types.ObjectId,
    idrefcarrier: {
        type: schema.Types.ObjectId, ref: "carrierscollections"
    },
    idreforder: {
        type: schema.Types.ObjectId, ref: "ordercollections"
    },
    idrefwarehouse: {
        type: schema.Types.ObjectId, ref: "warehousecollections"
    },
    // idrefshipment: {
    //     type: schema.Types.ObjectId, ref: "shipmentschema"
    // },
    reasonofdelay: { type: Object },
    expecteddeliverydate: {
        type: schema.Types.Date,
        default: Date.now()
    },
    pickupdate: {
        type: schema.Types.Date,
        default: Date.now()
    }
});
deliveryschema.plugin(
    autoIncrement, {
    inc_field: "delivery_id"
})
const shipmentObj = mongoose.model("shipmentcollections", shipmentschema);
const deliveryObj = mongoose.model("deliverycollections", deliveryschema);
module.exports = { shipmentObj, deliveryObj };