const express = require('express')
const app = express()
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000


app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


// Socket server for client A
const io = require('socket.io')(http)

//socket client for server B
var ioClient = require('socket.io-client');


var username;
var user_message;


// connect to server B using socket
var sockett = ioClient.connect("http://localhost:9001");


// create connection for client A
io.on('connection', (socket) => {
    console.log('A user connected')

    // Event handle coming from Client A
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)


   // print the message coming from client A       
   console.log(msg);


  // Saving the message
   username = msg.user;
   user_message = msg.message;
  

     // Emiting the message to Server B came from Client A
     sockett.emit('message2', { name: username, message: user_message});
 
  

    })

})


http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
