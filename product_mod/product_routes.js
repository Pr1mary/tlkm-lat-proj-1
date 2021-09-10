const express = require("express");
const router = express.Router();

const proddb = require("./product_data.js");

proddb.setTable("prodtb");

// addProduct("fork","fork for eating",5)
// .then(id => {
//     console.log("Current product id: "+id);
// })
// .catch(err => console.log(err.stack));

router
.route("/product")
.get(async (req, res, next) => {

    let product;

    await proddb.getProduct()
    .then(datapool => {
        datapool.forEach(data => {
            console.log(data.prodname);
        });
        product = datapool;
    })
    .catch(err => console.log(err.stack));

    res.send(product);

})

router
.route("/product/add")
.post(async (req, res, next) => {
    
});

module.exports = router;