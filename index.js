
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const db = mongoose.connection;
const Warehouse = require('./models/warehouse');
const {shelf, bin} = require('./seeds/location')

mongoose.connect('mongodb://localhost:27017/warehouse', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.on("error", console.error.bind(
    console, "Connection error:"));

db.once("open", () => {
    console.log("Database connected");
})   

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);

const shelves = [...shelf];
const bins = [...bin];

app.get('/', (req, res) => {
	res.render('home');
})

app.get('/warehouses', catchAsync(async (req, res) => {
	const warehouses = await Warehouse.find({});
	res.render('warehouses/index', {warehouses});
}))

app.get('/warehouses/contacts', async (req, res) => {
	res.render('warehouses/contacts');
})

app.get('/warehouses/product', (req, res) => {
	res.render('warehouses/product', {shelves, bins});
})

app.post('/warehouses', catchAsync(async(req, res) => {
	if(!req.body.warehouse) throw new ExpressError('Invalid Warehouse Data', 400);
	const warehouse = new Warehouse(req.body.warehouse);
	await warehouse.save();
	res.redirect(`/warehouses/${warehouse._id}`);
}))

app.get('/warehouses/:id', catchAsync(async (req, res) => {
	const warehouse = await Warehouse.findById(req.params.id);
	res.render('warehouses/details', {warehouse});
}))

app.get('/warehouses/:id/edit', catchAsync(async(req, res) => {
	const warehouse = await Warehouse.findById(req.params.id);
	res.render('warehouses/edit', {warehouse, shelves, bins}) 
}))

app.put('/warehouses/:id', catchAsync(async(req, res) => {
	const {id} = req.params;
	const warehouse = await Warehouse.findByIdAndUpdate(
		id, {...req.body.warehouse});
	res.redirect(`/warehouses/${warehouse._id}`)
}))


app.all('*', (req, res, next) => {
	next((new ExpressError('Page Not Found', 404)));
})

app.use((err, req, res, next) => {
	const { statusCode = 500} = err;
	if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', {err});		
})

app.listen(8081, () => {
	console.log('Serving on port 8081');
})