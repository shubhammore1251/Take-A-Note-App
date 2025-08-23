const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { addNote, getNotes, updateNote, deleteNote } = require("../controllers/notesController");
const { notifyUser } = require("../middleware/notifyUser");

const router = express.Router();

router.route('/addnote').post(isAuthenticatedUser, addNote);

router.route('/get-notes').get(isAuthenticatedUser, getNotes, notifyUser);

router.route('/update-note/:noteId').put(isAuthenticatedUser, updateNote, notifyUser);

router.route('/delete-note/:noteId').delete(isAuthenticatedUser, deleteNote, notifyUser);


module.exports = router;