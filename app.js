const path = require('path');
const fs = require('fs')
const express = require("express")
const app = express()
const host = '192.168.1.6'
const port = 3000


// media file
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')



const fileNames = [];
const directoryPath = path.join(__dirname, 'public/videos')
fs.readdir(directoryPath, (err,files) => {
    if(err) {
        return console.log(`Unable to scan directory: ${err}`);
    }
    files.forEach((file) => {
        fileNames.push(file);
    })
})


app.get("/", (req,res) => {
    res.render('pages/videos',{
        "tagline": "videos",
        "files": fileNames
    })
    // res.sendFile(path.join(__dirname,'public', 'index.html'))
})



app.get("/videos", (req,res) => {
    res.render('pages/videos',{
        "tagline": "videos",
        "files": fileNames
    })
})

app.get("/videos/:id", (req,res) => {
    // res.send(req.params.id)
    res.render('pages/play-video',{
        "id" : req.params.id
    })
})


app.listen(port,host, () => {
    console.log(`Example app listening on  ${host}:${port}`);
})