const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqjj7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic')
        const servicesCollection = database.collection('services')
        //Get Api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        });
        //get Single id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result);
        })

        //post Api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit hte post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        //Delete APi
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.get('/hello', (req, res) => {
    res.send('hello updated here')
})

app.listen(port, () => {
    console.log('On Port', port);
})