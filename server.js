import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { db } from "./db.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));

// LOGIN
app.post("/login", async (req,res)=>{
  const { username, password } = req.body;

  const user = await db.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  if(user.rowCount === 0) return res.json({success:false});

  const pass = await bcrypt.compare(password, user.rows[0].password);

  if(!pass) return res.json({success:false});

  res.cookie("user", user.rows[0].id);
  res.json({success:true, role:user.rows[0].role});
});

// CREATE ACCOUNT
app.post("/register", async(req,res)=>{
  const { username,password,role,key } = req.body;

  if(role === "admin" && key !== "sinfuladmin24")
    return res.json({success:false});

  const hash = await bcrypt.hash(password,10);

  await db.query(
    "INSERT INTO users(username,password,role) VALUES($1,$2,$3)",
    [username,hash,role]
  );

  res.json({success:true});
});

// GET USERS
app.get("/whoami", async(req,res)=>{
  if(!req.cookies.user) return res.json({});
  
  const u = await db.query(
    "SELECT * FROM users WHERE id=$1",
    [req.cookies.user]
  );

  res.json(u.rows[0]);
});

// SOCKET EVENTS
io.on("connection", socket => {

  // CHAT
  socket.on("chatMessage", async data=>{
    await db.query(
      "INSERT INTO chat(sender,dept,message) VALUES($1,$2,$3)",
      [data.sender,data.dept,data.message]
    );

    io.emit("chatUpdate", data);
  });

  // NEW CALL
  socket.on("newCall", async data=>{
    await db.query(
      "INSERT INTO calls(type,status,notes,units) VALUES($1,'NEW','', '')",
      [data]
    );
    io.emit("callUpdate");
  });

});

server.listen(process.env.PORT || 3000);
