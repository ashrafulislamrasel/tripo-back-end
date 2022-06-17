const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const { get } = require('express/lib/response');

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.boglx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const database = client.db('placesDB');
        const placeCollections = database.collection('places');
        const allorderCollections = database.collection('All-Order');
        
        // Get Places API
        app.get('/places', async (req, res) => {
            const cursor = placeCollections.find({});
            const places = await cursor.toArray();
            console.log("Hit Form Add Service Page");
            res.send(places);
        })
        // Add a Service Api 
        app.post('/places', async (req, res) => {
            const place = req.body;
            const result = await placeCollections.insertOne(place)
            console.log(result);
            res.json(result);
        })

        // Get Single Places API
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const place = await placeCollections.findOne(quary);
            res.json(place);

        })
         // All Orders API
        app.post('/allorders', async (req, res) => {
            const allOrder = req.body;
            allOrder.createdAt = new Date();
            const result = await allorderCollections.insertOne(allOrder);
            res.json(result)
        })

        // Get All Ordered Product API
        app.get('/all-orders', async (req, res) => {
            let query = {};
            const email = req.query.email;
            if (email) {
                query = {email: email}
            }
            const cursor = allorderCollections.find(query);
            const allOrders = await cursor.toArray();
            res.send(allOrders);
        })

         // Get Single Order Item API
        app.get('/all-orders/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const place = await allorderCollections.findOne(quary);
            res.json(place);

        })

         // Delete Item Api
         app.delete('/all-orders/:id', async (req, res) => {
             const id = req.params.id;
             const query = { _id: ObjectId(id) };
             const result = await allorderCollections.deleteOne(query)
             res.json(result)
         })
        console.log("database connected");
    }
    finally {
        
    }
}

run().catch(console.dir);

console.log(uri);

app.get('/', (req, res) => {
    res.send('EMA JON SERVER IS RUNNING')
})

app.get('/hello', (req, res) => {
    res.send("HELLO FROM HERUKO")
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})