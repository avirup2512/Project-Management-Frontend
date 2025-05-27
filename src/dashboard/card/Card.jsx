import { Button, Form } from "react-bootstrap";
import "./Card.css"
import { useEffect, useState } from "react";
import CardService from "../service/CardService";
import { useDispatch, useSelector } from "react-redux";
import { setAllList } from "../list/ListSlice";
// import ListService from "../../service/ListService";
function Card({item,boardId,listId,onClick})
{
    const allList = useSelector((e) => e.list.allList);
    const dispatch = useDispatch();
    const cardService = new CardService();

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
    return (
        <>
            <div className="cardItem" onClick={onClick}>
                <div className="d-flex align-center justify-content-flex-start">
                    <Form>
                        <Form.Check isValid={true} type="checkbox"
                            checked={item.complete == true} onClick={(e)=>{e.preventDefault();
                                e.stopPropagation();}} onChange={completeCard} className="checkBox"></Form.Check>
                    </Form>
                    <p className="mb-0 ms-2">{item.name}</p>
                </div>
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
            </div>
        </>
    )
}

export default Card;