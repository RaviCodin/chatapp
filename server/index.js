const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port =  process.env.PORT;

const users = [{}];

app.use(cors());
app.get("/",(req,resp)=>{
    resp.send("Hi NODE-JS")
})

const server = http.createServer(app);

const io= socketIO(server);

io.on("connection", (socket)=>{
    console.log("New connection");

    
    

    socket.on('joined', ({user})=>{
        users[socket.id] =  user;        
        if(users[socket.id] !== undefined){ 
            // console.log(`${users[socket.id]} has joined`)
            socket.emit('welcome', {user:"Admin", message:`Welcome  ${users[socket.id]}`,id:''})
            socket.broadcast.emit('userJoined', {user:"Admin", message:`${users[socket.id]} has joined` ,id:'' })
        }
    })

    // socket.on('cheack', (id)=> {
    //     if(users[id] === undefined  ){
    //         console.log("true")
    //         socket.emit('valid', {isValid : false} )
    //     }
    // })

    socket.on('message', ({message,id})=>{
        // console.log(message)
        // it send all sercit ...you and your friends
        io.emit('sendMessage',{user: users[id] , message, id})
    })

  socket.on('disconnect', ()=>{
    if(users[socket.id] !== undefined){ 
     socket.broadcast.emit('leave', {user:"Admin", message:`${users[socket.id]} has left`,id:''})
    //  console.log(`${users[socket.id]} user left`) 
    }
 })

})


server.listen(port,()=>{
    console.log(`server os working on http://localhost:${port}`);
})