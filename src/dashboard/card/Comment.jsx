import { Button, Form } from "react-bootstrap";
import "./Card.css"
import { useContext, useEffect, useState } from "react";
import CardService from "../service/CardService";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setCheckList } from "./CardSlice";
import DOMPurify from 'dompurify';
import { UserContext } from "../UserContext";
import CommentWindow from "./CommentWindow";
import { stateToHTML } from "draft-js-export-html";

function Comment({i})
{
    const {loggedInUser} = useContext(UserContext);
    const { boardId } = useParams();
    const { cardId } = useParams();
    const { listId } = useParams();
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
    const [showModal, setShowModal] = useState(false);
    const editComment = () => {
        setShowModal(true);
    }
    const editCommentCall = (e) => {
        const comment = stateToHTML(e.getCurrentContent());
        const params = { cardId, boardId, listId, id: i?.id, comment };
        const editedComment = cardService.editComment(params);
    }
    const cleanCommentHTML = DOMPurify.sanitize(item?.comment);
    return (
        <>
            <div className="comment">
                <div className="">
                <>
                        <p>{item?.user} added a comment - {item?.date}</p>
                        <p dangerouslySetInnerHTML={{ __html: cleanCommentHTML }}></p>
                        {
                            (loggedInUser?.data?.id == item?.userId) && 
                            <Button size="sm" onClick={editComment}>Edit</Button>
                        }
                    <hr></hr>
                </>
                </div>
            </div>
            <CommentWindow i={ item} showModal={showModal} editComment={editCommentCall} close={()=>{setShowModal(false)}} />
        </>
    )
}

export default Comment;