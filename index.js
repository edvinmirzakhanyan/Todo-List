import express from "express";
import mongodb, { ObjectId } from "mongodb";
import bodyParser from "body-parser";

const port = 3000;
const jsonParser = bodyParser.json();
const client = new mongodb.MongoClient("mongodb://localhost:27017");

const app = express();

(async () => {
    await client.connect();

    const db = client.db("Persons");
    const collection = db.collection("users");

    app.get('/search', async (req, res) => {
        let usersFound = await collection.find(req.query).toArray();
        res.send(usersFound);
    });

    app.get('/', async (req, res) => {
        let usersFound = await collection.find().toArray();
        res.send(usersFound);
    });
    app.delete('/del/:id', async (req, res) => {
        await collection.deleteOne({_id: new ObjectId(req.params.id)});
        res.status(200).json({
            status: true
        });
    });

    app.post('/post', jsonParser, async (req, res) => {
        await collection.insertOne(req.body);
        res.status(200).json({
            success: true
        });
    });

    app.put('/upd/:id', jsonParser, async (req, res) => {
        let upid = req.params.id;
        await collection.updateOne({_id: new ObjectId(upid)},
                                   {$set: req.body});
        res.status(200).json({
            success: true
        });
    });

    app.listen(port);
})();