
const mongoose = require('mongoose');
const products = require('./products'); 
const {shelf, bin} = require('./location');
const db = mongoose.connection;
const Warehouse = require('../models/warehouse')

mongoose.connect('mongodb://localhost:27017/warehouse', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.on("error", console.error.bind(
    console, "Connection error:"));

db.once("open", () => {
    console.log("Database connected");
})   

const sample = array => array[
    Math.floor(Math.random() * array.length)
];

const seedDB = async () => {
    await Warehouse.deleteMany({});
    
    for(let i = 0; i < 50; i++){
        const prodware = new Warehouse({
             name: products[i].name,
             image: products[i].image,
             brand: products[i].brand,
             reference: products[i].reference,
             unitPrice: products[i].unitPrice,
             quantity: products[i].quantity,
             category: products[i].category,
             shelf: sample(shelf),
             bin: sample(bin)
        })
        await prodware.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
});

