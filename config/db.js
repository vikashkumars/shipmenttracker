const mongoose = require('mongoose');
const dbConnect = async() =>{
    const mongodb = 'mongodb://localhost:27017/training_db';
    await mongoose.connect(mongodb,{useNewUrlParser: true,  
         useUnifiedTopology: true, 
         useCreateIndex: true, 
         useFindAndModify: false
    });
const connection = mongoose.connection;
connection.on('error',()=>{
    console.log("Connection DB failed");
})

}
module.exports = dbConnect;