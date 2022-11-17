import axios from "axios";

var express = require("express");
var app = express();
app.get("/", function (req, res){
  res.send("hello world!!");
});
axios.get('https://api.github.com/users/mapbox')
  .then((response) => {
    console.log('response.data', response.data);
    console.log('response.status', response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
module.exports = {
  path: "/api/",
  handler: app
}
