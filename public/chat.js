const socket = io();

socket.on("chatUpdate", data=>{
  let d = document.createElement("p");
  d.innerHTML = `<b>${data.sender}</b>: ${data.message}`;
  chatBox.appendChild(d);
});

async function sendMsg(){
  socket.emit("chatMessage",{
    sender:"User",
    dept:"GEN",
    message:msg.value
  });
  msg.value="";
}
