const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.opwfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
async function run() {
	try {
		await client.connect();
		const database = await client.db('allproducts');
		const productsCollections = database.collection('products');
		const ordersCollection = database.collection('orders');
		// orders manage
		app.post('/orders', async (req, res) => {
			const order = req.body;
			const orders = await ordersCollection.insertOne(order);
			res.send(orders);
		});
		app.get('/orders', async (req, res) => {
			const wholeOrders = ordersCollection.find({});
			const result = await wholeOrders.toArray();
			res.send(result);
		});
		// get data limit from database
		app.get('/products', async (req, res) => {
			const products = productsCollections.find().limit(12);
			const results = await products.toArray();
			res.send(results);
		});
		// get all data from database
		app.get('/allproducts', async (req, res) => {
			const wholeProducts = productsCollections.find({});
			const result = await wholeProducts.toArray();
			res.send(result);
		});

		// get all ids from database
		app.get('/allproducts/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await productsCollections.findOne(query);
			res.send(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
