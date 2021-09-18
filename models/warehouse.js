const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WarehouseSchema = new Schema({
	name: String,
	image: String,
	brand: String,
	reference: String,
	unitPrice: Number,
	quantity: Number,
	category: String,
	shelf: String,
	bin: Number
})

module.exports = mongoose.model('Warehouse', WarehouseSchema);
