const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const client = new MongoClient(uri);

let db_name = "";
let col_name = "";

let setup = (db, col) => {
    db_name = db;
    col_name = col;
}

let registData = async (username, email, password) => {
    try {
        await client.connect();

        console.log("connect success");

        const database = client.db(db_name);
        const collection = database.collection(col_name);

        const insertData = await collection.insertOne({
            "username": username,
            "email": email,
            "password": password,
            "timestamp": Date.now()
        });

        console.log("data registered");
        
    } catch(e) {
        console.error(e);
    } finally {
        client.close()
    }
}

let loginData = async (data) => {
    try {
        await client.connect();

        console.log("connect success");

        const database = client.db(db_name);
        const collection = database.collection(col_name);

        const findRes = await collection.find(data);

        console.log("data found");
        
    } catch(e) {
        console.error(e);
    } finally {
        client.close()
    }
}
