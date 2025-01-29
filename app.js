const express = require("express")
const env = require("dotenv").config().parsed
const fs = require('fs')
const path = require('path')
const app = express()
const host = env.HOST
const port = env.PORT


// media file
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

const childDirectory = []
const storage = env.DST_PATH
const lookup = async (params) => {
    if(!fs.existsSync(params)) {
        return console.error('error: ' + params)
    } else {
        const directoryPath = path.join(__dirname, params)
        fs.readdir(directoryPath, (err,files) => {
            if(err) {
                return console.log(`unable to scan directory: ${err}`);
            } 
            console.log('read directory ok: ' + params);
            if(files.length) {
                files.forEach((file) => {
                    childDirectory.push(file);
                    console.log('directory child: ' + childDirectory);
                })
            }
        })
    }
}

lookup(storage);





app.get("/", (req,res) => {
    res.render('pages/videos',{
        "tagline": "videos",
        "files": childDirectory
    })
})



app.get("/videos", (req,res) => {
    res.render('pages/videos',{
        "tagline": "videos",
        "files": childDirectory
    })
})

app.get("/videos/:id", (req,res) => {
    res.render('pages/play-video',{
        "id" : req.params.id
    })
})


app.listen(port,host, () => {
    console.log(`app run on  ${host}:${port}`);
})