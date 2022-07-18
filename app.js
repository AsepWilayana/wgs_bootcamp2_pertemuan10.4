const http = require("http");
const fs = require("fs");
const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
var morgan = require("morgan");
const {
  loadContact,
  save_context,
  validateAdd,
  validateUpdate,
  Deletedata,
  Updatedata,
} = require("./kontek");

const { urlencoded } = require("express");

// create "middleware"
app.use(morgan("dev"));

app.set("view engine", "ejs");

// untuk membuka/akses image
app.use(express.static("assets/"));
// app.use('/img', express.static((__dirname, 'assets/img')))

app.use(expressLayouts);
app.set("layout", "layout/layout");

app.use(express.urlencoded({ extended: true }));

// halaman home
app.get("/", (req, res) => {
  const nama = "Asep Wilayana";
  const title = "Web Server EJS";

  const cont = loadContact();

  res.render("index", { nama: nama, title: title, cont });
});

// halaman contact
// get semua contact
app.get("/contact", (req, res) => {
  const title = "Web Server EJS";
  const cont = loadContact();
  let respone = "";
  if (req.query.deleted) respone = "Delete data berhasil";
  if (req.query.updated) respone = "Updated data berhasil";
  res.render("contact", { title: title, cont, respone });
});

// halaman add contact
app.get("/contact/add", (req, res) => {
  const title = "Web Server EJS";
  errors = "";
  Errorname = "";
  Erroremail = "";
  Errormobile = "";

  res.render("addContact", {
    title: title,
    errors,
    Errorname,
    Erroremail,
    Errormobile,
  });
});

// fungsi tambah contact
app.post("/contact", validateAdd, (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.body.mobile;
  save_context(name, email, mobile);

  const title = "Web Server EJS";
  const cont = loadContact();
  const respone = "Data berhasil ditambahkan";

  res.render("contact", { title: title, cont, respone });
});

// fungsi delete contact
app.get("/delete/:id", (req, res) => {
  const name = req.params.id;
  Deletedata(name);

  const title = "Web Server EJS";
  const cont = loadContact();
  const respone = "data berhasil dihapus";

  res.redirect("/contact?deleted=success");
});

//halaman update contact
app.get("/update/:id", (req, res) => {
  const title = "Web Server EJS";
  const name = req.params.id;
  const contacts = loadContact();
  const contact = contacts.find((item) => item.name == name);

  errors = "";
  Errorname = "";
  Erroremail = "";
  Errormobile = "";

  res.render("updateContact", {
    title: title,
    contact,
    errors,
    Errorname,
    Erroremail,
    Errormobile,
  });
});

// fungsi update
app.post("/:id", validateUpdate, (req, res) => {
  const name = req.params.id;
  const Newname = req.body.name;
  const Newemail = req.body.email;
  const Newmobile = req.body.mobile;

  Updatedata(name, Newname, Newemail, Newmobile);
  const title = "Web Server EJS";
  const cont = loadContact();
  const respone = "data berhasil diupdate";
  // res.render("contact", { title: title, cont, respone });
  res.redirect("/contact?updated=success");
});

// get contact by id (detail)
app.get("/contact/:id", (req, res) => {
  const title = "Web Server EJS";
  const name = req.params.id;
  const contacts = loadContact();
  const contact = contacts.find((item) => item.name == name);
  if (!contact) {
    res.status(404).send("page not found : 404");
  }
  res.render("detail", { title: title, contact });
});

// halaman about
app.get("/about", (req, res) => {
  const title = "Web Server EJS";
  res.render("about", { title: title });
});

app.get("/product/:id", (req, res) => {
  res.send(
    "product id :" +
      req.params.id +
      "<br/>" +
      "category id :" +
      req.query.category
  );
});
app
  .use("/", (req, res) => {
    res.status(404).send("page not found : 404");
  })

  .listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
