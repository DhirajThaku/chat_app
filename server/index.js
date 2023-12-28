const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes=require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");

const app = express();
const socket = require("socket.io");

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoute);


mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB connection successful");
}).catch((err)=>{
    console.log(err.message);
});

const server= app.listen(process.env.PORT ,()=>{
    console.log(`server started on Port ${process.env.PORT}`);   //we used here backticks
});

const io = socket(server,{
    cors :{
        origin:"http://localhost:3000",
        credentials:true,
    },
});

global.onlineUsers = new Map();

io.on("connection",(socket) =>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=> {
        onlineUsers.set(userId,socket.id);
    });

    socket.on("send-msg",(data) =>{
        ///this to reciev to real time the message when send to the reciever
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message);
        }
    });
});