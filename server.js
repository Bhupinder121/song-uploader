const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { exec } = require("child_process");

let isVol = undefined;

function connectToPhone(mycallback){
    exec(`adb connect 192.168.1.100`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);

            return mycallback();
        }
        console.log(`stdout ${stdout}`);
        return mycallback();
    });
}

function setVolume(vol){
    connectToPhone(()=>{
        exec(`adb -s 192.168.1.100:5555 shell media volume --set ${vol}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            isVol = vol > 0;
        });
    });
    
    
}

function getVolume(){
    connectToPhone(()=>{
        exec(`adb -s 192.168.1.100:5555 shell media volume --get`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr.split("\n")[2].split(" ")[3]}`);
                return;
            }
            let vol = +stdout.split("\n")[2].split(" ")[3]
            isVol = vol > 0;
        });
    });
   
}

getVolume();

const io = require("socket.io")(server, {
    cors: {
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});;



app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    console.log('a user connected', socket.client.id);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('song data', (msg)=>{
        
        console.log("sending song info");
        // resizeImage(msg.thumbnail);
        // console.log(msg);
        msg.isVol = isVol; 
        io.emit("song", msg);
    });
    socket.on("play", (msg)=>{
        io.emit("play song", "please");
    });
    socket.on("pause", (msg)=>{
        io.emit("pause song", "please");
    });
    socket.on("next", (msg)=>{
        io.emit("next song", "please");
    });
    socket.on("previous", (msg)=>{
        io.emit("previous song", "please");
    });
    socket.on("mute", (mes)=>{
        setVolume(0);
    });
    socket.on("unmute", (mes)=>{
        setVolume(15);
    });
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
});



server.listen(3000, ()=>{
    console.log("Listening on port: 3000");
});

