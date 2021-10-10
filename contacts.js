const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

const microID = list => Math.max(...list.map(({ id }) => Number(id))) + 1;

const listContacts = async () => {
  try {
    const result = await fs.readFile(contactsPath, 'utf8');
    const contacts = JSON.parse(result);

    return contacts;
  } catch (error) {
    throw new Error(error);
  }
};

const getContactById = async contactId => {
  try {
    const contacts = await listContacts();
    const contact =
      contacts.find(({ id }) => String(id) === String(contactId)) || null;

    return contact;
  } catch (error) {
    throw new Error(error);
  }
};

const removeContact = async contactId => {
  try {
    const contacts = await listContacts();
    const updatedContacts = contacts.filter(
      ({ id }) => String(id) !== String(contactId),
    );

    if (contacts.length === updatedContacts.length) return null;

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));

    return updatedContacts;
  } catch (error) {
    throw new Error(error);
  }
};

const addContact = async (name, email, phone) => {
  try {
    const contacts = await listContacts();
    const newID = microID(contacts);
    const newContact = { id: newID, name, email, phone };
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return [newContact, contacts];
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { listContacts, getContactById, removeContact, addContact };
