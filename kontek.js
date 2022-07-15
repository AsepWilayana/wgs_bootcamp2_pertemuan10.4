const fs = require ("fs")

const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json','utf8');

    const contacts = JSON.parse(file);
    return contacts;
}

module.exports = {loadContact}