const express = require("express");
const formidable = require('formidable');
const fs = require('fs');

const app = express()



app.get("/file",  (req, res)=>{
    console.log("connected");
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload" multiple><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

app.post("/fileupload", (req, res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        if(files.filetoupload == undefined){
            res.write("file not uploaded");
            res.end();
        }
        
        for(let i = 0; i < files.filetoupload.length; i++){
            
            let oldpath = files.filetoupload[i].filepath;
            
            fs.readFile(oldpath, async function (err, data) {
                if (err) throw err;
                console.log('File read!');
                let newpath = '/sdcard/Download/' + files.filetoupload[i].originalFilename;

                // Write the file
                fs.writeFile(newpath, data, function (err) {
                    if (err) throw err;

                    console.log('File written!');
                });
            });;
        }
        res.write('File uploaded and moved!');
        res.end();
    });
});


app.listen(3000, ()=>{
    console.log("started listening at 3000");
});