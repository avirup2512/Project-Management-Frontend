import { Button, Form } from "react-bootstrap";
import "./Card.css"
import { useEffect, useState } from "react";
import CardService from "../service/CardService";
import { useDispatch, useSelector } from "react-redux";
import { setAllList } from "../list/ListSlice";
function CheckList({i})
{
    useEffect(() => {
        console.log(i);
        if (i)
        {
            setItem(i);
        }
    },[i])
    const allList = useSelector((e) => e.list.allList);
    const dispatch = useDispatch();
    const cardService = new CardService();
    const [canNameEdit, setCanNameEdit] = useState(false);
    const [item, setItem] = useState(false);
    const completeCheckList = async (e) => {
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
    const nameChange = (evt) => {
        
        const item2 = JSON.parse(JSON.stringify(item));
        item2.cliName = evt.target.value;
        setItem(item2);
    }
    return (
        <>
            <div className="checkListItem">
                <div className="d-flex align-center justify-content-flex-start">
                    <Form>
                        <Form.Check isValid={true} type="checkbox"
                            checked={item.cliIsChecked == 1} onClick={(e)=>{e.preventDefault();
                                e.stopPropagation();}} onChange={completeCheckList} className="checkBox"></Form.Check>
                    </Form>
                    {/* <p className="mb-0 ms-2">{item.cliName}</p> */}
                    {
                        !item?.cliName && <p onClick={() => { setCanNameEdit(true) }}>No Description..</p>
                    }
                    {
                    !canNameEdit &&
                        <p onClick={() => { setCanNameEdit(true) }} className="mb-0 p-1 name width-100">
                                {item?.cliName}
                        </p>
                    ||
                    canNameEdit && 
                    <Form>
                        {/* <Form.Label>Name</Form.Label> */}
                        <Form.Control as="input" value={item?.cliName} type="input" onChange={nameChange}
                            onBlurCapture={nameChange}></Form.Control>
                    </Form>
                    }
                </div>
            </div>
        </>
    )
}

export default CheckList;