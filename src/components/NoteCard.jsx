import React from "react";
import moment from "moment";
import { decryptText } from "../utils/cryptoHash";

const NoteCard = ({ note, editNote, notify, handleDelete}) => {

  const {title,text,createdAt} = note;

  const time = moment(createdAt).fromNow();

  const heading = title.length>30? `${title.slice(0,30)}...` :title

  // const decryptedText = decryptText(text);

  const bodytext = text.length>200? `${text.slice(0,200)} ...` : text

  return (
    <div className="card text-dark mb-3">
      <div className="card-header">{heading}</div>
    
      <div className="card-body">
        <p className="card-text">{`* * * * * * * * * `}</p>
      </div>

      <div className="d-flex card-footer justify-content-between">
        <div className="footer-left">
          <i
            className="fi fi-br-eye me-3"
            onClick={() => editNote(note)}
          ></i>
          <i
            className="fi fi-br-trash"
            onClick={()=> handleDelete(note)}
          ></i>
        </div>

        <div className="footer-right">
          <p className="mt-2"><span className="me-3 fw-bold">Created:</span>{time}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
