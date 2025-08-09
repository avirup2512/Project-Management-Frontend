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
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ConfirmationModal from "../../../shared/ConfirmationModal";
function ListItem({item,addList,properties,copyCard,provided})
{
    const { boardId } = useParams();
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
    const [lastPosition, setLastPosition] = useState(0);

    const [confirmationModalProp, setConfirmationProp] = useState({
        showModal: false,
        message: "",
        type:"",
        action: function (t) { onConfirm(t) },
        close: function () { closeModal() }
    });

    const [cardProperty, setCardProperty] = useState({
        completeCard:(id,value)=>{completeCard(id,value)}
    })
    const [menuProperties, setMenuProperties] = useState({
        items: [{ name: "Add Card", action: () => { addCard() } },
            { name: "Archive List", action: () => { archiveList() } }
        ],
        closeMenu:()=>{setMenuShow(false)}
    })
    const listService = new ListService();
    const cardService = new CardService();

    useEffect(() => {        
    }, [properties]);
    useEffect(() => {             
        if (!addList)
            setListName(item.name);
        if (item && item.cards)
        {
            setLastPosition(item.cards.length);
            setCards(item?.cards);
        }
        
    }, [item]);
    const enableEditMode = function ()
    {
        setEditMode(true)
    }
    const addListFunc = async (e) => {
        e.preventDefault();
        if (listName)
        {
            const list = await listService.createList({ boardId: properties.boardId, name: listName, position: properties.lastPosition+1 });
            if (list.status && list.status == 200)
            {                
                properties.listAdded(list.data?.insertId);
                setListName(" ");
            }
        }
    }
    const addCard = function (e)
    {        
        setCardEditMode(true)
    }
    const archiveList = async function ()
    {
        setMenuShow(false)
        setConfirmationProp((prevItem) => ({ ...prevItem, showModal: true, type:"List/Archive", message: "Are you sure want to archive the list?" }))
    }
    const addCardFunc = async function (e)
    {        
        e.preventDefault();
        e.stopPropagation();
        if (cardName)
        {
            const card = await cardService.createCard({ name: cardName, listId: item?.id, boardId: item?.board_id, position:lastPosition });
            if (card.status && card.status == 200) {
                const index = allList.findIndex(l => l.id === item.id);
                console.log(allList);
                
                const list = [...allList];
                const listObj = { ...list[index] };   
                console.log(listObj);
                
                console.log(listObj.cards);
                
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
        e.preventDefault();
        if (listName)
        {
            const list = await listService.editList({ name: listName, listId: item?.id, boardId: item?.board_id});
            if (list.status && list.status == 200)
            {
                seListEdit(false);
                setListName(listName);
                properties.listEdited();
                const listCopy = JSON.parse(JSON.stringify(allList));
                const listIndex = listCopy.findIndex((l) => l.id == item.id);
                listCopy[listIndex].name = listName;
                dispatch(setAllList(listCopy));
            }
        }
    }
    const openCard = (event, card) =>
    {
        dispatch(setCurrentCard(card));
        // setShowModal(true);
        navigate("./"+item.id+"/card/"+card.id)
    }
    const completeCard = (cardId,value) => {
        properties.completeCard(item.id,cardId,value);
    }
    const onDragEnd = async (evt) => {
        // If dropped outside any droppable
        const allCardCopy = JSON.parse(JSON.stringify(item?.cards));
        let oldCardItem = {};
        let newCardItem = {};
        allCardCopy.forEach((e) => {
            if (e.position == evt.newIndex) {
                newCardItem = e;
                newCardItem.position = evt.oldIndex 
            } else if (e.position == evt.oldIndex) {
                oldCardItem = e;
                oldCardItem.position = evt.newIndex;
            }
        });
        allCardCopy.sort((a, b) => {
            return a.position > b.position ? 1 : -1
        });
        if (Object.keys(oldCardItem).length > 0 && Object.keys(newCardItem).length > 0)
        {
            const allCard = await listService.updateCardPositionSameList({ boardId, cards: [oldCardItem, newCardItem] });        
            if(allCard.status && allCard.status == 200)
            {
                const index = allList.findIndex(l => l.id === item.id);
                const list = JSON.parse(JSON.stringify(allList));
                const listObj = { ...list[index] };                        
                listObj.cards = allCardCopy;
                list[index] = listObj;
                dispatch(setAllList(list));
                setCards(allCardCopy)
            }
        }
    }
    const onItemAdd = async (evt) => {
        const movedCard = await listService.updateCardPosition({ boardId, cardId: evt.clone.dataset.cardId, addedListId: evt.to.parentElement.dataset.listId, deletedListId: evt.clone.dataset.listId, position:evt.newIndex });
        if (movedCard.status && movedCard.status == 200)
        {
            const listFromDeletedIndex = allList.findIndex(l => l.id == evt.clone.dataset.listId);
            const listToAddedIndex = allList.findIndex(l => l.id == evt.to.parentElement.dataset.listId);
            const listCopy = JSON.parse(JSON.stringify(allList));
            const listFromDeleted = { ...listCopy[listFromDeletedIndex] };
            
            const listToAdded = { ...listCopy[listToAddedIndex] };
            
            const card = listFromDeleted.cards.find((e) => { return e.id == evt.clone.dataset.cardId });
            const nextAllCardPositionMinus = []
            const cardIndex = listFromDeleted.cards.findIndex(card => card.id == evt.clone.dataset.cardId);
            listFromDeleted.cards.splice(cardIndex, 1);
            listToAdded.cards.splice(evt.newIndex, 0, card);
            const nextAllCardPositionPlus = []
            listToAdded.cards.find((e, i) => {
                if (i > evt.newIndex)
                {
                    nextAllCardPositionPlus.push(e.id);
                }
            })
            listFromDeleted.cards.find((e, i) => {
                if (i >= cardIndex)
                {
                    nextAllCardPositionMinus.push(e.id);
                }
            })
            
            listCopy[listFromDeletedIndex] = listFromDeleted
            listCopy[listToAddedIndex] = listToAdded;
            const updateCardPosition = await listService.updateNextAllCardPosition({boardId,listId:item.id,cardsPositionToBePlus:nextAllCardPositionPlus, cardsPositionToBeMinus:nextAllCardPositionMinus})
            dispatch(setAllList(listCopy));
        }
    }
    const closeModal = () => {
        setConfirmationProp((prevItem) => ({ ...prevItem, showModal: false }));
    }
    const onConfirm = async (t) => {
        console.log(t);
        const type = t.split("/");
        if (type[0] == "List")
        {
            if (type[1] == "Archive")
            {
                const archiveList = await listService.archiveList({ boardId, listId: item.id, archived:1 });
                console.log(archiveList);
                
            }
        }
        // const params = { boardId, listId, cardId: item?.id };
        // const deletedCard = await cardService.deleteCard(params);
        // if (deletedCard.status && deletedCard.status == 200)
        // {
        //     let list = JSON.parse(JSON.stringify(allList))
        //     let index = list.findIndex(l => l.id === listId);
        //     list[index].cards = list[index].cards.filter((e) => { return e.id != item?.id });
        //     dispatch(setAllList(list))
        //     setMenuShow(false);
        // }
    }
    return (
        <>
            <div className={addList ? "cursor-pointer listItem margin-left-auto" : "listItem"} data-id={item?.id} data-boardid={item?.board_id}
            data-name={item?.name}>
                {
                    !addList &&
                    <div className="fetchedList">
                            <div className="" {...provided.dragHandleProps}>
                                <div className="d-flex align-center justify-content-space-between">
                                        <div className="width-100">
                                            {
                                                !listEdit &&
                                                <p onClick={() => { seListEdit(true) }} className="mb-0 p-1 name handle">{item?.name}</p>
                                                ||
                                                listEdit && 
                                                <Form onSubmit={nameChange}>
                                                    <Form.Group>
                                                        <Form.Control autoFocus={true} className="listName"
                                                        value={listName} type="input" onInput={(e) => { setListName(e.target.value) }}
                                                        onBlurCapture={nameChange}></Form.Control>
                                                    </Form.Group>
                                                </Form>
                                            }
                                        </div>
                                    <i onClick={(e) => { setMenuShow(true)}} className="bi bi-three-dots cursor-pointer"></i>
                                    <Menu properties={menuProperties} show={menuShow}></Menu>
                                </div>
                            </div>
                            <hr></hr>
                            <div className="scroll" data-list-id={item?.id}>
                                
                                { item.hasOwnProperty("cards") &&  <ReactSortable className="mb-2 ss" list={item?.cards.map(item => ({ ...item }))} sort={true} setList={(newState) => {                                        
                                       // onDragEnd(newState)
                                    setCards(newState); 
                                        properties.updateCards(item.id, newState);
                                    }} animation={150} group={'shared'} onAdd={onItemAdd} onUpdate={onDragEnd} >
                                    {
                                        item.cards.map((e,i) => (
                                            <Card onClick={(event)=>openCard(event,e)} item={e} listId={item.id} copyCardProps={(e) => {copyCard({...e,listId:item.id})}} key={e.id}></Card>
                                        ))
                                    }
                                </ReactSortable>}
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
                                <Form onSubmit={addCardFunc}>
                                    <Form.Group>
                                    <Form.Control type="text" onChange={(e)=>{setCardName(e.target.value)}}></Form.Control>
                                    <Button className="mt-2" variant="primary" onClick={addCardFunc}  size="sm">Add Card</Button>
                                    <i onClick={()=>{setCardEditMode(false)}} className="bi bi-plus primary d-inline-block crossButton"></i>
                                </Form.Group>
                                </Form>
                                
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
                    <Form onSubmit={addListFunc}>
                    <Form.Group>
                        <Form.Control type="text" onChange={(e)=>{setListName(e.target.value)}}></Form.Control>
                        <Button className="mt-2" variant="primary" onClick={addListFunc} size="sm">Add List</Button>
                        <i onClick={()=>{setEditMode(false)}} className="bi bi-plus primary d-inline-block crossButton"></i>
                    </Form.Group>
                    </Form>
                }
                {showModal && <CardModal boardId={item.board_id} listId={item.id} closeCall={() => setShowModal(false)} />}
            </div>
                <ConfirmationModal onConfirm={onConfirm} properties={confirmationModalProp}/>
        </>
    )
}

export default ListItem;