const fs = require("fs");
var validator = require("validator");
const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const app = express();

const loadContact = () => {
  const file = fs.readFileSync("data/contacts.json", "utf8");

  const contacts = JSON.parse(file);
  return contacts;
};

function validateName(name) {
  const contacts = loadContact();
  let findData = contacts.findIndex(
    (item) => item.name.toLowerCase() == name.toLowerCase()
  );
  //console.log(findData)
  if (findData >= 0) {
    const inputan = name;
    const msg = "nama sudah ada, silahkan gunakan nama lain";
    Errorname = {
      inputan,
      msg,
    };
    errors.push(Errorname);
  }
}

function validateEmail(email) {
  validemail = validator.isEmail(email);
  if (validemail === false) {
    const inputan = email;
    const msg = "pengisian email tidak sesuai dengan format";
    Erroremail = {
      inputan,
      msg,
    };
    errors.push(Erroremail);
  }
}

function validateMobile(mobile) {
  validphone = validator.isMobilePhone(mobile, "id-ID");
  if (validphone === false) {
    const inputan = mobile;
    const msg = "pengisian nomor hp tidak sesuai";
    Errormobile = {
      inputan,
      msg,
    };
    errors.push(Errormobile);
  }
}

const validateAdd = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.body.mobile;
  errors = [];
  const title = "Web Server EJS";
  const contacts = loadContact();

  validateName(name);
  validateEmail(email);
  validateMobile(mobile);

  const jumlah = errors.length;
  const id = req.params.id;
  const contact = contacts.find((item) => item.name == id);

  console.log(errors);
  //res.render("updateContact", { title: title, msg, inputan, contact });
  if (jumlah > 0) {
    res.render("addContact", {
      title: title,
      errors,
      Errorname,
      Erroremail,
      Errormobile,
    });
    return;
  }
  next();
};

const validateUpdate = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.body.mobile;

  errors = [];
  const title = "Web Server EJS";

  const contacts = loadContact();
  validateName(name);
  validateEmail(email);
  validateMobile(mobile);

  const jumlah = errors.length;
  const id = req.params.id;
  const contact = contacts.find((item) => item.name == id);

  if (jumlah > 0 && id !== name) {
    res.render("updateContact", {
      title: title,
      errors,
      Errorname,
      Erroremail,
      Errormobile,
      contact,
    });
    return;
  }
  next();
};

const save_context = (name, email, mobile) => {
  //data yg akan di masukan file contact
  const contact = {
    name,
    email,
    mobile,
  };
  const contacts = loadContact();

  contacts.push(contact);

  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));

  //tambhakan ke file
  //rl.close();
};

const Deletedata = (name) => {
  const contacts = loadContact();
  const findData = contacts.find((item) => item.name == name);

  if (findData !== undefined) {
    const deletedData = contacts.filter((item) => item.name !== name);

    fs.writeFileSync("data/contacts.json", JSON.stringify(deletedData));
  }
};

const Updatedata = (name, newname, newemail, newmobile) => {
  const contacts = loadContact();
  const findData = contacts.find((item) => item.name == name);
  if (findData !== undefined) {
    //dihapus dulu data yg sudah ketemmu
    const updateData = contacts.filter((item) => item.name !== name);

    // buat objek baru
    const contact = {
      name: newname || findData.name,
      email: newemail || findData.email,
      mobile: newmobile || findData.mobile,
    };

    updateData.push(contact);

    fs.writeFileSync("data/contacts.json", JSON.stringify(updateData));
    // console.log(updateData);
    // console.log('ada');
  } else {
    console.log("data tidak ada");
    return;
  }
};

module.exports = {
  loadContact,
  save_context,
  validateAdd,
  validateUpdate,
  Deletedata,
  Updatedata,
};
