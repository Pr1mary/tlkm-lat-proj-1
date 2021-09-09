const express = require("express");
const router = express.Router();

const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const signkey = "asdfasdf";

const userData = require("./user_data.js");

userData.setupDB("user_db", "user_account");

// route for user account registration
router
.route("/user/register")
.post(async (req, res, next) => {

    const reqdata = req.body;
    let msg = false;
    let status = "";

    reqdata.password = await crypto.createHash("sha256").update(reqdata.password).digest("base64");
    
    try {
        await userData.addAccount(reqdata.username, reqdata.email, reqdata.password)
        .then(ack => {
            status = ack
            if(ack) msg = "SUCCESS: user account registered";
            else msg = "FAILED: username is not available";
        });
    } catch (e) {
        console.log(e);
        msg = e;
    }
    res.send({
        "status": status,
        "msg": msg
    });
});

// route for user account login, will return a token
router
.route("/user/login")
.post(async (req, res, next) => {

    const reqdata = req.body;
    let msg = "";
    let status = false;
    let token = null;

    reqdata.password = await crypto.createHash("sha256").update(reqdata.password).digest("base64");
    
    try {
        await userData.loginAccount(reqdata.username, reqdata.password)
        .then(ack => {
            if(ack) token = jwt.sign({
                "status": "SUCCESS",
                "username": reqdata.username,
                "timestamp": Date.now()
            }, signkey);

            status = ack;
        });
    } catch (e) {
        console.log(e);
        msg = e;
    }
    
    res.send({
        "status": status,
        "msg": msg,
        "token": token
    });

});

// route to verify user token
router
.route("/user/auth")
.post(async (req, res, next) => {

    const reqdata = req.body;
    let msg = "FAILED: invalid token";
    let status = false;

    await jwt.verify(reqdata.token, signkey, (err, data) => {
        if(data != undefined){
            status = true;
            msg = "SUCCESS: token authorized"
        }
    });

    res.send({
        "status": status,
        "msg": msg
    });

});

module.exports = router;