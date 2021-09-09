const e = require("express");
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const client = new MongoClient(uri);

let db_name = "";
let col_name = "";

// setup db
// make sure to use this method first before using the database
let setupDB = (db, col) => {
    db_name = db;
    col_name = col;
}

// insert account data to database
let addAccount = async (username, email, password) => {

    try {
        // connect to db
        await client.connect();

        console.log("connect success");

        const database = client.db(db_name);
        const collection = database.collection(col_name);

        // check if username is available
        const checkUsrnm = await collection.findOne({
            "username": username
        });

        // return false if username is not available
        if(checkUsrnm != null) return false; 

        // insert data to database
        const insertData = await collection.insertOne({
            "username": username,
            "email": email,
            "password": password,
            "timestamp": Date.now()
        });

        console.log("data registered");

        // return true if data successfully registered
        return true;

    } catch(e) {
        // if error, close connection
        console.error(e);
        client.close()
    }
}

// check account data to database for login use
let loginAccount = async (username, password) => {

    try {
        // connect to db
        await client.connect();

        console.log("connect success");

        const database = client.db(db_name);
        const collection = database.collection(col_name);

        // find data in database
        const findRes = await collection.findOne({
            "username": username,
            "password": password,
        });
        
        // return true if data is found, false if data is not found
        if(findRes == null) console.log("data not found");
        
        if(findRes == null) return false;
        else return true;
        
    } catch (e) {
        // if error, close connection
        console.log(e);
        client.close();
    }
}

// let editAccount = async (data) => {

// }

// let deleteAccount = async (data) => {
//     try {
//         await client.connect();

//         console.log("connect success");

//         const database = client.db(db_name);
//         const collection = database.collection(col_name);

//         const findRes = await collection.find(data);

//         console.log("data found");
        
//     } catch(e) {
//         console.error(e);
//     } finally {
//         client.close()
//     }
// }

module.exports = {
    client,
    setupDB,
    addAccount,
    loginAccount
}