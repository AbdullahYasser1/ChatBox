let express = require("express");
let obj = require("mongoose");
let url = "mongodb://localhost:27017/mern"
let cors = require("cors");
let app = express();
app.use(cors());

let options ={
    useNewUrlParser: true,
    useUnifiedTopology: true

}
obj.connect(url,options).then(res=>console.log("connected")).catch(error=>console.log(error));
let db = obj.connection; 

// http connected with app express reference. 
// because socket.io internal logic written using 
// http module 
let http = require("http").Server(app);
// creating socket.io reference with help of http module 
let io = require("socket.io")(http);

let MessageSchema = obj.Schema({
    _id:Number,
    messageUser:String,
});
let MessageModel = obj.model("",MessageSchema, "Message")

// http://localhost:9090/first
app.get("/first",(req,res)=> {
    res.sendFile(__dirname+"/index.html");
})
// http://localhost:9090/second
app.get("/second",(req,res)=> {
    res.sendFile(__dirname+"/index2.html");
})


// This function execute when client send the request. 


io.on("connection",(socket)=> {
    socket.on("obj" ,(msg)=> {
        console.log(msg);      
        let storeMessage=MessageModel ({messageUser:msg });
        MessageModel.insertMany( storeMessage , (err , result) =>{
            if(err){
                console.log(err);
            } 
        })
    })
})


// run the server on port number using http reference. 
http.listen(9090,()=>console.log("Server running on port number 9090"))
