const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const port = 8000 || process.env.PORT;

const userroutes = require("./user_mod/user_routes.js");
const prodroutes = require("./product_mod/product_routes.js");

app.use(bodyparser.json());

app.use(userroutes);
app.use(prodroutes);

app.listen(port, () => {
    console.log("Server started at: "+port);
});