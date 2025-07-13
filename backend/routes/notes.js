const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { addNote, getNotes, updateNote, deleteNote } = require("../controllers/notesController");

const router = express.Router();

router.route('/addnote').post(isAuthenticatedUser, addNote);

router.route('/get-notes').get(isAuthenticatedUser, getNotes);

router.route('/update-note/:noteId').put(isAuthenticatedUser, updateNote);

router.route('/delete-note/:noteId').delete(isAuthenticatedUser, deleteNote);


module.exports = router;