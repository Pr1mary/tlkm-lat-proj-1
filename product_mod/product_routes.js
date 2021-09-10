const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const signkey = "secretkey";

const proddb = require("./product_data.js");

// setup table first
proddb.setTable("prodtb");

// route for get product
router
.route("/product")
.get(async (req, res, next) => {

    let product;

    // get all data from database
    await proddb.getProduct()
    .then(datapool => {
        product = datapool;

        res.send(product);
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            "err": err
        });
    });

})

// route to add new product, require token
router
.route("/product/add")
.post(async (req, res, next) => {

    const token = req.body.token;
    const reqdata = req.body.data;

    try {
        // verify token
        await jwt.verify(token, signkey,(err, res) => {
            if(res == undefined) throw "token authorization failed";
        });
    
        // insert data process
        await proddb.addProduct(reqdata.name,reqdata.desc,reqdata.qty)
        .then(resData => {
            res.status(201).send(resData);
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                "err": err
            });
        });

    } catch (err) {
        // token unauthorized
        console.log(err)
        res.status(401).send({
            "err": err
        });
    }

});

// route to edit existing product, require token
router
.route("/product/update/:id")
.patch(async (req, res, next) => {

    const id = Number(req.params.id);
    const token = req.body.token
    const reqdata = req.body.data;
    let msg;
    let statuscode;

    try {
        // verify token
        await jwt.verify(token, signkey,(err, res) => {
            if(res == undefined) throw "token authorization failed";
        });

        // proddb.editProduct(id, reqdata.name, reqdata.desc, reqdata.qty)
        // .then(resdata => {
        //     res.send(resdata);
        // })
        // .catch(err => {
        //     console.log(err)
        //     res.status(500).send({
        //         "err": err
        //     });
        // });

    } catch (err) {
        // token unauthorized
        res.status(401).send({
            "err": err
        });
    }

});

// route to delete existing product, require token
router
.route("/product/delete/:id")
.delete(async (req, res, next) => {

    const id = Number(req.params.id);
    const reqdata = req.body;
    let msg;
    let statuscode;

    try {
        // verify token
        await jwt.verify(reqdata.token, signkey,(err, res) => {
            if(res == undefined) throw "token authorization failed";
        });
    
        // delete data process
        await proddb.delProduct(id)
        .then(check => {
            if(check == 1){
                statuscode = 200;
                msg = "SUCCESS: data deleted";
            }else{
                statuscode = 404;
                msg = "FAILED: data not found";
            } 
            
            res.status(statuscode).send({
                "msg": msg
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                "err": err
            });
        });

    } catch (err) {
        // token unauthorized
        res.status(401).send({
            "err": err
        });
    }

});

module.exports = router;