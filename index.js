const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f6j7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {
        await client.connect();
        const database = client.db('superEx');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        });

        //GET Single Service

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            //console.log('getting specific service id :', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })


        //POST API
        app.post('/services', async (req, res) => {


            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result);
            // res.json(result);


        });

        // POST Order Data 
        app.post('/orders', async (req, res) => {
            // console.log('hit the order Post Api');
            // res.send('order post hitted')

            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // get My Order 

        app.get("/myOrders/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        // Delete My Order

        app.delete("/myOrders/:id", async (req, res) => {
            console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });

        //Admin  get all Order & and Order Management 

        app.get('/allOrders', async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);
            // console.log(result);
        })
        // Admin Delet Order

        app.delete("/allOrders/:id", async (req, res) => {
            //console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });


        // DELETE API
        // app.delete('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await servicesCollection.deleteOne(query);
        //     res.json(result);
        // })

    }

    finally {
        // await client.close();
    }

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running superEx  okkkkk');
})

app.listen(port, () => {
    console.log('Running superEx Server on Port', port);
})