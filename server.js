const express=require("express");
const app=express();
const http=require("http").createServer(app);
const users = [];

app.use(express.static("public"));

app.get("/",function (req,res) {
	res.sendFile(__dirname+"/index.html");
});

http.listen(3000,function() {
	console.log("server is running on port 3000");
});

const io=require("socket.io")(http);

io.on("connection",function(socket){
	socket.on("data",function(msg1) {
		socket.broadcast.emit("data",msg1);
	});

	socket.on("New-user-joined",function(name) {
		users[socket.id]=name;
		socket.broadcast.emit("user-joined",name);
	});

	socket.on("disconnect", function(){
        socket.broadcast.emit("left", users[socket.id]);
    });

});