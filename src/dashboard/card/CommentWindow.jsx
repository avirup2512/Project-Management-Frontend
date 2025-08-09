import { Button, Form, Modal } from "react-bootstrap";
import "./Card.css"
import { useContext, useEffect, useState } from "react";
import CardService from "../service/CardService";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setCheckList } from "./CardSlice";
import DOMPurify from 'dompurify';
import { UserContext } from "../UserContext";
import TextEditorComponent from "../../shared/TextEditor";
import { Editor, EditorState } from "draft-js";

function CommentWindow({i,showModal,close, editComment})
{
    const {loggedInUser} = useContext(UserContext);
    const { boardId } = useParams();
    const { cardId } = useParams();
    useEffect(() => {
        if (i)
        {
            setItem(i);
        }
    },[i])
    const allList = useSelector((e) => e.list.allList);
    const currentCard = useSelector((e) => e.card.card);
    const dispatch = useDispatch();
    const cardService = new CardService();
    const [canNameEdit, setCanNameEdit] = useState(false);
    const [item, setItem] = useState(false);
    const closeModal = function ()
    {
        close();
    }
    const cleanCommentHTML = DOMPurify.sanitize(item?.comment);
    return (
        <>
            {
                showModal &&
                <div className="modal show d-block" tabIndex="-1">
                <Modal show={showModal} size="lg">
                    <Modal.Header closeButton onClick={() => closeModal()}>
                        <Modal.Title>Edit Comment</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className='parentWrapper position-relative'>
                        <hr className='mt-1'></hr>
                            <TextEditorComponent hasValue={true} value={i?.comment } onSubmit={editComment}></TextEditorComponent>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="danger" onClick={() => closeModal(false)}>Close</Button>
                    <Button variant="primary" onClick={() => saveAction(true)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            }
        </>
    )
}

export default CommentWindow;