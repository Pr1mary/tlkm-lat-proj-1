const { Pool } = require("pg");

// sql query using pool

const pool = new Pool({
    user: 'postgres', // insert db user here
    host: 'localhost', // insert db host url here
    database: 'proddb',
    password: 'pass', // insert db password here
    port: 5432, // insert db port here
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

        const insertquery = "INSERT INTO "+tablename+"(prodname, descr, qty, first_stamp, last_stamp) VALUES($1, $2, $3, $4, $5) RETURNING id";
        dataid = await client.query(insertquery, [name, desc, qty, new Date(), new Date()]);

        await client.query("COMMIT");
    }catch(e){
        await client.query("ROLLBACK");
        throw e;
    }finally{
        client.release;
    }

    return dataid.rows[0];
};

// update product data from database, return promise of product id:integer
const editProduct = async (id, name, desc, qty) => {

    const client = await pool.connect();

    // let msg = ["","",""];
    let msg;

    try {
        await client.query("BEGIN");

        // check if data is available on database
        const checkquery = "SELECT * FROM "+tablename+" WHERE id="+id;
        const data = await client.query(checkquery);

        if(data.rowCount == 0) throw "item not available";

        // start process of updating data
        if(name != null){
            const editquery = "UPDATE "+tablename+" SET prodname='"+name+"' WHERE id="+id;
            await client.query(editquery);
        }

        if(desc != null){
            const editquery = "UPDATE "+tablename+" SET descr='"+desc+"' WHERE id="+id;
            await client.query(editquery);
        }

        if(qty != null){
            const editquery = "UPDATE "+tablename+" SET qty='"+qty+"' WHERE id="+id;
            await client.query(editquery);
        }

        // const date = new Date();

        // const editquery = "UPDATE "+tablename+" SET last_stamp='"+date.getTime()+"'::timestamp WHERE id=$2::text";
        // msg = await client.query(editquery, [id]);

        await client.query("COMMIT");
        
        msg = "SUCCESS: successfully update the data";

    } catch (e) {
        await client.query("ROLLBACK");
        msg = "FAILED: "+e;
    } finally {
        client.release;
    }

    return msg;

};

// delete product data from database, return promise of integer
// 1 if data is available and 0 if data is not available
const delProduct = async (id) => {

    const client = await pool.connect();
    let msg;

    try {
        await client.query("BEGIN");

        const delquery = "DELETE FROM "+tablename+" WHERE id="+id;
        msg = await client.query(delquery);

        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK")
    } finally {
        client.release;
    }

    return msg.rowCount;

};


module.exports = {
    setTable,
    getProduct,
    addProduct,
    delProduct,
    editProduct
}