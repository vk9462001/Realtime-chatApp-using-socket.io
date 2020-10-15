const socket = io();

var textbox=document.querySelector("#textInput");
var button=document.querySelector('button');
var messageArea=document.querySelector(".message_area");

let name;

do{
	name=prompt("Please enter your name");
}while(!name);

button.addEventListener('click',function() {
	if(textbox.value==="")
	{
	   //Nothing done
	}
	else{
		sendMessage(textbox.value);
	}
});

textbox.addEventListener('keyup',function(event) {
	if(event.key==="Enter")
	{
		if(event.target.value==="")
		{
			//Nothing done
		}
		else{
			sendMessage(event.target.value);
		}
		
	}
});

function sendMessage(msg)
{
	let msg1={
		user:name,
		message:msg
	}

	//Appending message
	appendMessage(msg1,"outgoing");
	textbox.value="";
	scrollTobottom();

	//send to server
	socket.emit("data",msg1);
}

function appendMessage(msg1,type) {

	var maindiv=document.createElement("div");
	messageArea.appendChild(maindiv);

	var usernamediv=document.createElement("div");
	if(type==="outgoing"){
		usernamediv.classList.add("heading");
	}
	else{
		usernamediv.classList.add("heading-incoming");
	}
	maindiv.appendChild(usernamediv);

	if(type==="outgoing"){
		usernamediv.innerHTML=`<p>You</p>`;
	}
	else{
		usernamediv.innerHTML=`<p>${msg1.user}</p>`;
	}

	var messagediv=document.createElement("div");
	messagediv.classList.add(type,"message");
	maindiv.appendChild(messagediv);
	let markup=`
	<p>${msg1.message}</p>`;
	messagediv.innerHTML=markup;
}

function UserConnectOrleft(user,type) {
	let maindiv=document.createElement("div");
	maindiv.classList.add("userconnectOrleft");

	let markup1=`
	<p>${user} connected...</p>`;

	let markup2=`
	<p>${user} left the chat...</p>`;

	if(type==="connected")
	{
		maindiv.innerHTML=markup1;
	}
	else{
		maindiv.innerHTML=markup2;
	}
	messageArea.appendChild(maindiv);
}

socket.emit("New-user-joined",name);

//Recieving message
socket.on("data",function(msg1){
	appendMessage(msg1,"incoming");
	scrollTobottom();
})
socket.on("user-joined",function(name){
	UserConnectOrleft(name,"connected");
	scrollTobottom();
});
socket.on("left",function(name){
	UserConnectOrleft(name,"left");
	scrollTobottom();
});

function scrollTobottom()
{
	messageArea.scrollTop=messageArea.scrollHeight;
}