const express = require("express");
const app = express();
const port = 8000 || process.env.PORT;


app.listen(port, () => {
    console.log("Server started at: "+port);
});