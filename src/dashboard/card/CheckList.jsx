import { Button, Form } from "react-bootstrap";
import "./Card.css"
import { useEffect, useState } from "react";
import CardService from "../service/CardService";
import { useDispatch, useSelector } from "react-redux";
import { setAllList } from "../list/ListSlice";
import { useParams } from "react-router-dom";
import { setCheckList } from "./CardSlice";
function CheckList({i,deleteChckList})
{
    const { listId } = useParams();
    const { boardId } = useParams();
    const { cardId } = useParams();
    useEffect(() => {
        console.log(i);
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
    const completeCheckList = async (e) => {
        // e.preventDefault();
        // e.stopPropagation();
        console.log(e.target.checked);
        
        const item2 = JSON.parse(JSON.stringify(item));
        item2.cliIsChecked = e.target.checked ? 1 : 0;
        setItem(item2);
        dispatch(setCheckList(item2))
        const params = { name: item2.cliName, isChecked: item2.cliIsChecked, position: item2.cliPosition, id: item2.cliId , cardId,boardId};        
        const editedCheckList = await cardService.editCheckListItem(params);
    }
    const nameChange = async (evt) => {
        const curCard = JSON.parse(JSON.stringify(currentCard));
        const item2 = JSON.parse(JSON.stringify(item));
        item2.cliName = evt.target.value;
        setItem(item2);
    }
    const nameChangeCall = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        const params = { name: item.cliName, isChecked: item.cliIsChecked, position: item.cliPosition, id: item.cliId , cardId,boardId};        
        const editedCheckList = await cardService.editCheckListItem(params);
        setCanNameEdit(false);
    }
    const deleteCheckList =  () => {
        deleteChckList(item.cliId);
    }
    return (
        <>
            <div className="checkListItem">
                <div className="d-flex align-center justify-content-flex-start">
                    <Form>
                        <Form.Check isValid={true} type="checkbox"
                            checked={item.cliIsChecked == 1} onChange={completeCheckList} className="checkBox">
                            </Form.Check>
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
                    <Form className="width-100 ms-2" onSubmit={nameChangeCall}>
                        {/* <Form.Label>Name</Form.Label> */}
                        <Form.Control as="input" value={item?.cliName} type="input" onChange={nameChange}
                            onBlurCapture={nameChangeCall}></Form.Control>
                    </Form>
                    }
                    <i onClick={()=>{ deleteCheckList()}}  className="ms-4 cursor-pointer bi bi-x-circle"></i>
                </div>
            </div>
        </>
    )
}

export default CheckList;