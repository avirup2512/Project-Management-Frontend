import { Button, Form } from "react-bootstrap";
import "./Card.css"
import { useEffect, useState } from "react";
import CardService from "../service/CardService";
import { useDispatch, useSelector } from "react-redux";
import { setAllList } from "../list/ListSlice";
import Menu from "../../shared/Menu";
import { useParams } from "react-router-dom";
import ConfirmationModal from "../../shared/ConfirmationModal";
// import ListService from "../../service/ListService";
function Card({item,listId,copyCardProps,onClick})
{
    const { boardId } = useParams();
    const allList = useSelector((e) => e.list.allList);
    const dispatch = useDispatch();
    const cardService = new CardService();
    const [menuShow, setMenuShow] = useState(false);
    const [menuProperties, setMenuProperties] = useState({
        items: [{ name: "Copy Card", action: () => { setMenuShow(false), copyCardProps() } },
            { name: "Delete Card", action: () => { deleteCard() } }
        ],
        closeMenu: () => { setMenuShow(false) }
    });
    const [confirmationModalProp, setConfirmationProp] = useState({
        showModal: false,
        message: "",
        type:"",
        action: function (t) { onConfirm(t) },
        close: function () { closeModal() }
    });
    const completeCard = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = await cardService.setStatus({ boardId, listId, cardId: item.id, isComplete: e.target.checked });
        if (card.status && card.status == 200)
        {
            let list = JSON.parse(JSON.stringify(allList))
            let index = list.findIndex(l => l.id === listId);
            const cardIndex = list[index].cards.findIndex(elem => elem.id == item.id);
            let cardObject = JSON.parse(JSON.stringify(list[index].cards[cardIndex]));
            cardObject.complete = !e.target.checked;
            list[index].cards[cardIndex] = cardObject;
            dispatch(setAllList(list))
        }
    }
    const deleteCard = async () => {
        setMenuShow(false);
        setConfirmationProp((prevItem) => ({ ...prevItem, showModal: true, type:"tag", message: "Are you sure want to delete Card?" }))
    }
    const copyCard = async () => {
        console.log("HI");
        copyCardProps();
        // const copiedCard = await cardService.copyCard({boardId,listId,cardId:item.id, listIds:[58,56]});
    }
    const onConfirm = async () => {
        const params = { boardId, listId, cardId: item?.id };
        const deletedCard = await cardService.deleteCard(params);
        if (deletedCard.status && deletedCard.status == 200)
        {
            let list = JSON.parse(JSON.stringify(allList))
            let index = list.findIndex(l => l.id === listId);
            list[index].cards = list[index].cards.filter((e) => { return e.id != item?.id });
            console.log(list[index].cards);
            dispatch(setAllList(list))
            setMenuShow(false);
        }
    }
    const closeModal = () => {
        setConfirmationProp((prevItem) => ({ ...prevItem, showModal: false }));
    }
    return (
        <>
            <div className="cardItem" onClick={onClick} data-card-id={item.id} data-list-id={listId}>
                <div className="d-flex align-center justify-content-flex-start">
                    <Form>
                        <Form.Check isValid={true} type="checkbox"
                            checked={item.complete == true} onClick={(e)=>{e.preventDefault();
                                e.stopPropagation();}} onChange={completeCard} className="checkBox"></Form.Check>
                    </Form>
                    <p className="mb-0 ms-2">{item.name}</p>
                    <i onClick={(e) => { e.stopPropagation(); setMenuShow(true)}} className="bi bi-three-dots cursor-pointer menuIcon"></i>
                    <Menu properties={menuProperties} show={menuShow}></Menu>
                </div>
                <div className="">
                    <p className="font-12">{ item?.description}</p>
                </div>
                {
                    item && item.hasOwnProperty("users") &&
                    <div className="users mt-2">
                        {
                        item?.users.map((e,i) => {
                                return <>
                                    {
                                        e.name  && <span key={i} className="user">{ e.name[0]}</span>}
                                </>
                            })
                        }
                </div>
                }
                {
                    item && item.hasOwnProperty("tags") &&
                    <div className="tags mt-2">
                        {
                        item?.tags.map((e) => {
                                return <>
                                    {
                                        e.tagName  && <span className="tagItem"><span className="align-text-bottom">{e.tagName}</span> </span>}
                                </>
                            })
                        }
                </div>
                }
            </div>
            <ConfirmationModal onConfirm={onConfirm} properties={confirmationModalProp} />
        </>
    )
}

export default Card;