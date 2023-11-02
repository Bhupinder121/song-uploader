const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
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
        
        // console.log("sending song info");
        console.log(msg);
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
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
});



server.listen(3000, ()=>{
    console.log("Listening on port: 3000");
});

