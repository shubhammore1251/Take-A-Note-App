const { db } = require("../firebase/firebase");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
// const { v4: uuidv4 } = require("uuid");

exports.addNote = catchAsyncErrors(async (req, res, next) => {
  const { title, text, createdAt, id } = req.body;

  console.log(req.body);

  if (!title || !text) {
    return next(new ErrorHandler("Missing required fields", 400));
  }

  // if (userId !== req.user.id) {
  //   return next(
  //     new ErrorHandler("You are not allowed to perform this operation", 401)
  //   );
  // }

  const noteData = {
    id: id,
    userid: req.user.id,
    uname: req.user.name || "",
    title,
    text,
    createdAt,
  };

  console.log(noteData);

  await db.collection("notes").doc(id).set(noteData);

  return res.status(201).json({
    succes: true,
    message: "Note added!",
  });
});

exports.getNotes = catchAsyncErrors(async (req, res, next) => {
  const notesSnapshot = await db
    .collection("notes")
    .where("userid", "==", req.user.id)
    .orderBy("createdAt", "desc")
    .get();

  const notes = notesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
});

exports.updateNote = catchAsyncErrors(async (req, res, next) => {
  const { title, text } = req.body;
  const { noteId } = req.params;

  if (!noteId) {
    return next(new ErrorHandler("noteId is required", 400));
  }

  const noteRef = db.collection("notes").doc(noteId);
  const noteSnap = await noteRef.get();

  if (!noteSnap.exists) {
    return next(new ErrorHandler("Note not found", 404));
  }

  const noteData = noteSnap.data();

  if (noteData.userid !== req.user.id) {
    return next(
      new ErrorHandler("You are not allowed to perform this operation", 401)
    );
  }

  await noteRef.update({
    title: title !== undefined ? title : noteData.title,
    text: text !== undefined ? text : noteData.text,
  });

  return res.status(200).json({
    success: true,
    message: "Note Updated successfully",
  });
});

exports.deleteNote = catchAsyncErrors(async (req, res, next) => {
  const { noteId } = req.params;

  if (!noteId) {
    return next(new ErrorHandler("noteId is required", 400));
  }

  const noteRef = db.collection("notes").doc(noteId);
  const noteSnap = await noteRef.get();

  if (!noteSnap.exists) {
    return next(new ErrorHandler("Note not found", 404));
  }

  const noteData = noteSnap.data();

  if (noteData.userid !== req.user.id) {
    return next(new ErrorHandler("Unauthorized to delete this note", 403));
  }

  await noteRef.delete();

  return res.status(200).json({
    success: true,
    message: "Note Deleted successfully",
  });
});
