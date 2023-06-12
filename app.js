const express = require('express');
const njwt = require('njwt');
var CryptoJS = require("crypto-js");
const routes = require("./routes");
// var os = require('os');
// var fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/', routes);
// app.use('/api/module/', moduleRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
