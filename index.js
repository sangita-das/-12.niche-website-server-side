const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyeto.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
  try {
    await client.connect();
    console.log('database connected successfully');

    const database = client.db('bicycle_protal');

    const productsCollection = database.collection('products');
    const usersCollection = database.collection('users');
    const itemsCollection = database.collection('items');
    const reviewsCollection = database.collection('reviews');



    // all reviews get

    app.get('/reviews', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });


    // reviews post
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      console.log('Hit the api', review);

      const result = await reviewsCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });




    // all items get

    app.get('/items', async (req, res) => {
      const cursor = itemsCollection.find({});
      const items = await cursor.toArray();
      res.send(items);
    });




    // items post
    app.post('/items', async (req, res) => {
      const item = req.body;
      console.log('Hit the api', item);

      const result = await itemsCollection.insertOne(item);
      console.log(result);
      res.json(result);
    });


    // GET Single item
    app.get('/items/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific item', id);
      const query = { _id: ObjectId(id) };
      const item = await itemsCollection.findOne(query);
      console.log(item);
      res.json(item);
    });


    // DELETE item
    app.delete('/items/:id', async (req, res) => {
      const id = req.params.id;
      console.log('delete specific item', id);

      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.json(result);

    })



    // All order product display 'GET'
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });


    // products GET by orderd product user
    app.get('/products', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.json(products);
    })



    // products post
    app.post('/products', async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productsCollection.insertOne(product);
      console.log(result);
      // res.json({ message: 'hello' })
      res.json(result)
    });



    // Products DELETE
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log('delete specific item', id);

      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);

    })



    // admin user get
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin })
    })



    // users post
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });



    // put user
    app.put('/users', async (req, res) => {
      const user = req.body;
      // console.log('put', user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })


    // users admin put
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      console.log('put', user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } }
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })


  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Bicycle World!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})