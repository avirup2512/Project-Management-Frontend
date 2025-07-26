import { Button, Form } from "react-bootstrap";
import "./ListItem.css"
import { useEffect, useState } from "react";
import ListService from "../../service/ListService";
import CardService from "../../service/CardService";
import { ReactSortable } from "react-sortablejs";
import Card from "../../card/Card";
import Menu from "../../../shared/Menu";
import { useDispatch, useSelector } from "react-redux";
import { setAllList, setCurrentCard } from "../ListSlice";
import CardModal from "../../card/CardDetails";
import { useNavigate } from "react-router-dom";
function ListItem({item,addList,properties})
{
    const navigate = useNavigate();
    const allList = useSelector((e) => e.list.allList);
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [cardEditMode, setCardEditMode] = useState(false);
    const [cardName, setCardName] = useState([]);
    const [listName, setListName] = useState("");
    const [cards, setCards] = useState([]);
    const [listEdit, seListEdit] = useState(false);
    const [menuShow, setMenuShow] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [cardProperty, setCardProperty] = useState({
        completeCard:(id,value)=>{completeCard(id,value)}
    })
    const [menuProperties, setMenuProperties] = useState({
        items: [{ name: "Add Card", action: () => { addCard() } }],
        closeMenu:()=>{setMenuShow(false)}
    })
    const listService = new ListService();
    const cardService = new CardService();

    useEffect(() => {
    }, []);
    useEffect(() => {   
        if (!addList)
        setListName(item.name);
    }, [item]);
    const enableEditMode = function ()
    {
        setEditMode(true)
    }
    const addListFunc = async() => {
        if (listName)
        {
            const list = await listService.createList({ boardId: properties.boardId, name: listName, position: properties.lastPosition+1 });
            if (list.status && list.status == 200)
            {
                console.log(list);
                
                properties.listAdded(list.data?.insertId);
            }
        }
    }
    const addCard = function (e)
    {        
        setCardEditMode(true)
    }
    const addCardFunc = async function (e)
    {        
        if (cardName)
        {
            const card = await cardService.createCard({ name: cardName, listId: item?.id, boardId: item?.board_id });
            if (card.status && card.status == 200) {
                const index = allList.findIndex(l => l.id === item.id);
                const list = [...allList];
                const listObj = { ...list[index] };
                console.log(list);
                
                const cardArr = [...listObj.cards]
                cardArr.push({ complete: 0, description: null, id: card.data.insertId, name: cardName });
                listObj.cards = cardArr;
                list[index] = listObj;
                dispatch(setAllList(list));
                setCardEditMode(false);
            }
        }
    }
    const nameChange = async function (e)
    {
        if (listName)
        {
            const list = await listService.editList({ name: listName, listId: item?.id, boardId: item?.board_id});
            if (list.status && list.status == 200)
            {
                seListEdit(false);
                setListName(listName);
                properties.listEdited();                
            }
        }
    }
    const openCard = (event, card) =>
    {
        // console.log(card);
        dispatch(setCurrentCard(card));
        // setShowModal(true);
        navigate("./"+item.id+"/card/"+card.id)
    }
    const completeCard = (cardId,value) => {
        properties.completeCard(item.id,cardId,value);
    }
    return (
        <>
            <div className={addList ? "cursor-pointer listItem" : "listItem"} data-id={item?.id} data-boardid={item?.board_id}
            data-name={item?.name}>
                {
                    !addList &&
                    <div className="fetchedList">
                            <div className="">
                                <div className="d-flex align-center justify-content-space-between">
                                        <div className="width-100">
                                            {
                                                !listEdit &&
                                                <p onClick={() => { seListEdit(true) }} className="mb-0 p-1 name handle">{item?.name}</p>
                                                ||
                                                listEdit && 
                                                <Form.Group>
                                                    <Form.Control autoFocus={true} className="listName"
                                                        value={listName} type="input" onInput={(e) => { setListName(e.target.value) }}
                                                        onBlurCapture={nameChange}></Form.Control>
                                                </Form.Group>
                                            }
                                        </div>
                                    <i onClick={(e) => { setMenuShow(true)}} className="bi bi-three-dots cursor-pointer"></i>
                                    <Menu properties={menuProperties} show={menuShow}></Menu>
                                </div>
                            </div>
                            <hr></hr>
                            <div className="scroll">
                                <ReactSortable className="mb-2" list={item.cards.map(item => ({ ...item }))} sort={true} setList={(newState) => {    
                                        
                                    setCards(newState); 
                                        properties.updateCards(item.id, newState);
                                    }} >
                                    {
                                        item.cards.map((e,i) => (
                                            <Card onClick={(event)=>openCard(event,e)} item={e} listId={item.id} key={e.id}></Card>
                                        ))
                                    }
                                </ReactSortable>
                            </div>
                            {
                                !cardEditMode &&
                                <div className="addCard" onClick={addCard} onMouseDown={addCard}>
                                <i className="bi bi-plus primary d-inline-block"></i>
                                <span>Add Card </span>
                                </div>
                            }
                            {
                                cardEditMode &&
                                <Form.Group>
                                    <Form.Control type="text" onChange={(e)=>{setCardName(e.target.value)}}></Form.Control>
                                    <Button className="mt-2" variant="primary" onClick={addCardFunc}  size="sm">Add Card</Button>
                                    <i onClick={()=>{setCardEditMode(false)}} className="bi bi-plus primary d-inline-block crossButton"></i>
                                </Form.Group>
                            }
                            
                    </div>
                }
                
                {
                    addList && !editMode &&
                    <div className="addListSection" onClick={enableEditMode}>
                        <i className="bi bi-plus primary d-inline-block"></i>
                        <span className="d-inline-block">Add List</span>
                    </div>
                }
                {
                    editMode &&
                    <Form.Group>
                        <Form.Control type="text" onChange={(e)=>{setListName(e.target.value)}}></Form.Control>
                        <Button className="mt-2" variant="primary" onClick={addListFunc} size="sm">Add List</Button>
                        <i onClick={()=>{setEditMode(false)}} className="bi bi-plus primary d-inline-block crossButton"></i>
                    </Form.Group>
                }
                {showModal && <CardModal boardId={item.board_id} listId={item.id} closeCall={()=> setShowModal(false) } />}
            </div>
        </>
    )
}

export default ListItem;