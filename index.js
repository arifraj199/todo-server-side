const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n6reu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const todoCollection = client.db("todo_task").collection("tasks");

        app.post("/addtask",async(req,res)=>{
            const task = req.body;
            const result = await todoCollection.insertOne(task);
            res.send(result);

        })

        app.get("/mytask",async(req,res)=>{
            const query = {};
            const cursor = todoCollection.find(query);
            const result = await cursor.toArray(cursor);
            res.send(result);
        })

        app.delete("/mytask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally{}
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('app is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})