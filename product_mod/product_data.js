const { Pool, Client } = require("pg");

// sql query using pool

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'proddb',
    password: 'Raflis2001',
    port: 5432,
});

let tablename = "";

pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

// set table name
const setTable = newname => tablename = newname;

// get product from database, return promise of result array
const getProduct = async () => {

    const dbdata = [];
    const client = await pool.connect();
    
    try {
        const res = await client.query("SELECT * FROM "+tablename);
        for(let i=0; i<res.rowCount; i++){
            dbdata.push(res.rows[i]);
        }
    }finally{
        client.release();
    }

    return dbdata;
};

// add product to database, return promise of product id:integer
const addProduct = async (name, desc, qty) => {

    const client = await pool.connect();
    let dataid;

    if(!((typeof name == "string") && (typeof desc == "string"))) throw "name and/or desc must be string";
    if(typeof qty != "number") throw "qty must be number";
    
    try{
        await client.query("BEGIN");

        const insertquery = "INSERT INTO "+tablename+"(prodname, descr, qty, stamp) VALUES($1, $2, $3, $4) RETURNING id";
        dataid = await client.query(insertquery, [name, desc, qty, new Date()]);

        await client.query("COMMIT");
    }catch(e){
        await client.query("ROLLBACK");
        throw e;
    }finally{
        client.release;
    }

    return dataid.rows[0].id;
};




module.exports = {
    setTable,
    getProduct,
    addProduct,
}