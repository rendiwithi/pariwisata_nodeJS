const path = require("path");
const express = require("express");
const hbs = require("hbs");
const http = require("http");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const port = process.env.PORT || 8000;
const app = express();

//koneksi ke sql
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "destinasi_batu",
});

//connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log("Database connect");
});

app.set("views", path.join(__dirname, "views"));
// tempalte engine
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// menampilkan gambar
app.use(express.static("public"));
app.use("/assets", express.static(__dirname + "/public"));

// untuk index
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/destinasi", (req, res) => {
  res.render("destinasi");
});
app.get("/mapbatu", (req, res) => {
  res.render("mapbatu");
});

//route halaman depan admin destinasi
app.get("/admin", (req, res) => {
  let sql = "SELECT * FROM destinasi";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.render("admin", {
      results: results,
    });
  });
});

//untuk tambah data destinasi
app.post("/save", (req, res) => {
  let data = {
    id_des: req.body.id_des,
    nama: req.body.nama,
    deskripsi: req.body.deskripsi,
    image: req.body.image,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  };
  let sql = "INSERT INTO destinasi SET ?";
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/admin");
  });
});

//untuk update data destinasi
app.post("/update", (req, res) => {
  let sql =
    "UPDATE destinasi set nama ='" +
    req.body.nama +
    "',deskripsi='" +
    req.body.deskripsi +
    "', image ='" +
    req.body.image +
    "',latitude = '" +
    req.body.latitude +
    "',longitude = '" +
    req.body.longitude +
  "' WHERE id_des =" + 
    req.body.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/admin");
  });
});
//untuk hapus data destinasi
app.post("/delete", (req, res) => {
  let sql = "DELETE FROM destinasi WHERE id_des=" + req.body.id_des + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/admin");
  });
});

//server jagan dihapus
app.listen(port, () => {
  console.log("Server berjalan di port 8000");
});
