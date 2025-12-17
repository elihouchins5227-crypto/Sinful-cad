require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

app.get('/api/calls', (req,res)=>{
  db.query('SELECT * FROM cad_calls ORDER BY id DESC',(e,r)=>{
    if(e) return res.status(500).send(e)
    res.json(r)
  })
})

app.post('/api/911',(req,res)=>{
  db.query(
    'INSERT INTO cad_calls (info) VALUES (?)',
    [req.body.info]
  )
  res.sendStatus(200)
})

app.listen(process.env.PORT || 3000)
