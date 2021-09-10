const express = require("express");
const router = express.Router();

const crypto = require("crypto");

const fs = require("fs");

const jwt = require("jsonwebtoken");
const signkey = "secretkey";
// const signkey = fs.readFileSync()
const userData = require("./user_data");

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

    await jwt.verify(reqdata.token, signkey,(err, data) => {
        if(data != undefined){
            status = true;
            msg = "SUCCESS: token authorized"
        }else{
            msg = "FAILED: "+err;
        }
    });

    res.send({
        "status": status,
        "msg": msg
    });

});

// route to update user data
router
.route("/user/update")
.patch(async (req, res, next) => {

    const reqdata = req.body;
    let msg = "";
    let status = false;
    let username = "";
    
    await jwt.verify(reqdata.token, signkey, (err, data) => username = data.username);

    reqdata.password = await crypto.createHash("sha256").update(reqdata.password).digest("base64");
    
    try {
        await userData.editAccount(username, reqdata.email, reqdata.password)
        .then(ack => {
            if(ack) msg = "SUCCESS: data has been updated";
            else msg = "FAILED: data failed to update";

            status = ack
        })
    } catch (e) {
        console.log(e);
        msg = e;
    }

    res.send({
        "status": status,
        "msg": msg
    });

});

module.exports = router;