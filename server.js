const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { exec } = require("child_process");
const io = require("socket.io")(server, {
    cors: {
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});


let isVol = undefined;

function setVolume(vol){
    exec(`adb connect 192.168.1.100`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
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
            return;
        }
        console.log(`stderr: ${stderr}`);
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
}

getVolume();





app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

setInterval(()=>{
    console.log(new Date().getMinutes())
    if(new Date().getHours() == 5){
        let alarm = "Alarm Clock Sound Effect Ringtone (Analog)";
        io.emit("song request", alarm);
    }
}, 1000 * 60 * 60);

io.on('connection', (socket) => {
    console.log('a user connected', socket.client.id);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('song data', (msg)=>{
<<<<<<< Updated upstream
        
        console.log("sending song info");
        // console.log(msg);
        msg.isVol = isVol; 
=======
        msg.thumbnail = msg.thumbnail.split("=")[0] + "=w175-h175-l90-rj"
        // console.log("sending song info");
        msg.isVol = isVol;
>>>>>>> Stashed changes
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
    socket.on("web request", (song)=>{
        console.log("song sended");
        io.emit("song request", song);
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

