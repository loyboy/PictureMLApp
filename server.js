// Require Express , Cookie Parser, Session
const express = require('express')
var path = require('path')
var testjson = require('./test')
var ImageCropper = require('./imgcropper/index')
var axios = require('axios')

const PORT = process.env.PORT || 5000

//Instantiating our App
const app = express()

app.get('/', async function (req, res) {
  
 /* axios.get('http://13.236.186.168/node/getTest?key=4092518425775707').then(function(resp) { 
    
  });*/
   var imgcropper = new ImageCropper(testjson)
    var writedirectory = "var/www/html/croppedimages"
    var writedir = path.resolve(__dirname, `${writedirectory}`) //The write dirctory of the Cropped Files
    var readdir = path.resolve(__dirname) //Read directory of Where the Photos are.....(Use the root directory, I will concatenate the rest)
    imgcropper.SendToDirectory(writedir, readdir)
    
    res.send("OK");
})

// Server Port
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))