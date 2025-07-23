import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import "./Card.css"
import { useCallback, useEffect, useRef, useState } from "react";
import CardService from "../service/CardService";
import { useDispatch, useSelector } from "react-redux";
import { setAllList, setCurrentCard } from "../list/ListSlice";
import { setAllTag,setCurrentCard as setCurrCard } from "./CardSlice";
import FloatingForm from "../../shared/FloatingForm";
import debounce from "lodash.debounce";
import BoardService from "../service/BoardService";
import { useParams } from "react-router-dom";
import { setUserList } from "../userProfile/UserSlice";
import { setAllRoles } from "../DashboardSlice";
import ConfirmationModal from "../../shared/ConfirmationModal";
import CheckList from "./CheckList";

function CardDetails({closeCall})
{
    const { listId } = useParams();
    const { boardId } = useParams();
    const { cardId } = useParams();
    const currentCard = useSelector((s) => s.card.card);
    const allTag = useSelector((s) => s.card.allTag);
    const allList = useSelector((e) => e.list.allList);
    const user = useSelector((e) => e.user.allUserList);
    const roles = useSelector((e) => e.dashboard.allRoles);
    useEffect(() => {
        console.log(currentCard);
        if (!currentCard || Object.keys(currentCard).length == 0)
        {
            getCurrentCard();
        }
    },[currentCard])
    useEffect(() => {
        setSerachedUser(user);
    }, [user]);
    useEffect(() => {
        if(roles.length == 0)
        {
            getRoles()
        }
    }, [roles])
    useEffect(() => {
        setSerachedTag(allTag);
    },[allTag])
    const dispatch = useDispatch();
    const cardService = new CardService();
    const [cardNameEdit, setCardNamEdit] = useState(false);
    const [canDescriptionEdit, setCanDescriptionEdit] = useState(false);
    const [searchedUser, setSerachedUser] = useState([]);
    const [searchedTag, setSerachedTag] = useState([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [inputLabel, setInputLabel] = useState("");
    const [confirmationModalProp, setConfirmationProp] = useState({
        showModal: false,
        message: "",
        action: function (t) { onConfirm(t) },
        close: function () { closeModal() }
    });
    const [checkList, setCheckList] = useState([]);
    const boardService = new BoardService();
    const currentTagIdRef = useRef(null);

    const getRoles = async () => {
        const roles = await boardService.getAllRoles();
        if (roles.status && roles.status == 200) {
            dispatch(setAllRoles(roles.data));
        }
    }
    const getCurrentCard = async () => {
        const card = await cardService.getCardById(boardId, cardId);
        console.log(card);
        
        if (card.status && card.status == 200)
        {
            // dispatch(setCurrentCard(card.data[Object.keys(card.data)[0]]));
            dispatch(setCurrCard(card.data[Object.keys(card.data)[0]]));
        }
    }
    const cardNameChange = (evt) => {
        let curCard = { ...currentCard };
        curCard.name = evt.target.value;
        dispatch(setCurrCard(curCard));
        let list = JSON.parse(JSON.stringify(allList));        
        list.forEach((e) => {
            if (e.id == listId)
            {
                e.cards.forEach((card) => {
                    if (card.id == currentCard.id)
                    {
                        card.name = evt.target.value;
                    }
                })
            }
        })        
        dispatch(setAllList(list));
    }
    const cardDescriptionChange = (evt) => {
        let curCard = { ...currentCard };
        curCard.description = evt.target.value;
        dispatch(setCurrCard(curCard));
        let list = JSON.parse(JSON.stringify(allList));        
        list.forEach((e) => {
            if (e.id == listId)
            {
                e.cards.forEach((card) => {
                    if (card.id == currentCard.id)
                    {
                        card.description = evt.target.value;
                    }
                })
            }
        })        
        dispatch(setAllList(list));
    }
    const setCardName = async (e) => {
        setCardNamEdit(false);
        const card = await cardService.editCard({ name: e.target.value, cardId: currentCard.id, listId, boardId });
        if (card.status && card.status == 200)
        {

        }
    }
    const setCardDescription = async (e) => {
        setCanDescriptionEdit(false);
        const card = await cardService.editCard({ name: currentCard.name,description:e.target.value, cardId: currentCard.id, listId, boardId });
        if (card.status && card.status == 200)
        {

        }
    }
    const completeCard = async (evt) => {
        console.log(evt.target.checked);
        
        const card = await cardService.setStatus({ boardId, listId, cardId: currentCard.id, isComplete: evt.target.checked });
        if (card.status && card.status == 200)
        {
            let curCard = { ...currentCard };
            console.log(curCard);
            
            curCard.complete = !evt.target.checked;
            dispatch(setCurrCard(curCard));
            let list = JSON.parse(JSON.stringify(allList));
            list.forEach((e) => {
                if (e.id == listId) {
                    e.cards.forEach((card) => {
                        if (card.id == currentCard.id) {
                            card.complete = !evt.target.checked;
                        }
                    })
                }
            });
            dispatch(setAllList(list));
        }
    }
    const fetchUsers = async (params) => {            
        const user = await boardService.searchBoardUser(params,boardId);
        if (user.status && user.status == 200)
        {
            setSerachedUser(user.data);
            dispatch(setUserList(user.data));
        } else {
            dispatch(setUserList([]));
        }
    }
    const fetchTags = async (key) => {   
        let params = {key,boardId}
        console.log(params);
        params.boardId = boardId;
        const tags = await cardService.getTagBySearchKey(params);
        if (tags.status && tags.status == 200)
        {
            setSerachedTag(tags.data);
            dispatch(setAllTag(tags.data));
        } else {
            dispatch(setAllTag([]));
        }
    }
    const debouncedFetchUsers = useCallback(debounce(fetchUsers, 400), []);
    const debouncedFetchedTags = useCallback(debounce(fetchTags, 400), []);
    const searchMember = (name, value) => {
        if (value.length >= 2) {
            debouncedFetchUsers(value);
        } else if (value.length == 0)
        {
            dispatch(setUserList([]));
        }
    }
    const searchTags = (_,value) => {
        console.log(value);
        
        if (value.length >= 2) {
            debouncedFetchedTags(value);
        } else if (value.length == 0)
        {
            dispatch(setUserList([]));
        }
    }
    const userAdd = (user) => {
        const currentCardCopy = { ...currentCard };
        const users = [...currentCardCopy.users]
        user.role = roles[0].id;
        users.push({...user,id:user.id});
        currentCardCopy.users = users;
        // currentCard = ;
        console.log(currentCardCopy.users);
        dispatch(setCurrCard(currentCardCopy));
    }
    const userRemove = (id) => {
        // const index = currentCard.users.filter((e) => e.id != id);
        const obj = JSON.parse(JSON.stringify(currentCard));
        obj.users = obj.users.filter((e)=> (e.id != id))
        console.log(obj.users);
        dispatch(setCurrCard(obj));
    }
    const roleChange = function (id, role)
    {
        let obj = JSON.parse(JSON.stringify(currentCard))
        obj.users.forEach((e) => {
            if (e.id == id)
            {
                e.role = role
            }
        })
        dispatch(setCurrCard(obj))
    }
    const saveAction = async () => {
        const users = currentCard.users;
        const card = await cardService.addUsers({ cardId, boardId, users });
        console.log(card);
        if (card.status && card.status == 200)
        {
            setShowModal(false);
        }
        
    }
    const onConfirm = async () => {      
        const card = await cardService.deleteTag({ cardId, boardId, tagId:currentTagIdRef.current  });
        if (card.status && card.status == 200)
        {
            let card = JSON.parse(JSON.stringify(currentCard));
            card.tags = card.tags.filter((e) => e.tagId != currentTagIdRef.current);            
            dispatch(setCurrCard(card));
        }
    }
    const closeModal = () => {
        setConfirmationProp((prevItem)=>({...prevItem,showModal:false}))
    }
    const deleteTag = (id) => {
        console.log(id);
        
        currentTagIdRef.current = id;
        setConfirmationProp((prevItem) => ({ ...prevItem, showModal: true, message: "Are you sure want to delete tag?" }))
    }
    const addTag = async (tag) => {
        console.log(tag);
        let params = { tag, boardId, cardId };
        const addedTag = await cardService.addTag(params);
        if (addedTag .status && addedTag .status == 200)
        {
            let currTag = JSON.parse(JSON.stringify(currentCard));
            currTag.tags.push({ tagId: addedTag.data.insertId, tagName: tag });
            dispatch(setCurrCard(currTag));
            setShowModal(false);
        }
        console.log(addedTag);
    }
    const addCheckList = async () => {
        const params = { cardId, boardId, name:"New CheckList",isChecked:0, position:0 }
        const addedCheckList = await cardService.addCheckListItem(params);
        if (addedCheckList.status && addedCheckList.status == 200) {
            let currCard = JSON.parse(JSON.stringify(currentCard));
            if (currCard.hasOwnProperty("checkList") && currCard.checkList)
                currCard.checkList.push({ cliId: addedCheckList.data.insertId, cliIsChecked: 0, cliName: "New CheckList", cliPosition: 0 });
            dispatch(setCurrCard(currCard))
        }
    }
    return (
        <>
            <Container>
                <Row>
                    <div className="col-md-12">
                        <div className="d-flex align-center justify-content-space-between">
                        <Form>
                            <Form.Check isValid={true} type="checkbox"
                                checked={currentCard?.complete == true} onChange={completeCard} className="checkBox"></Form.Check>
                        </Form>
                        {
                        !cardNameEdit &&
                        <p onClick={() => { setCardNamEdit(true) }} className="mb-0 p-1 name width-100">{currentCard?.name}</p>
                        ||
                        cardNameEdit && 
                        <Form.Group className="width-100">
                            <Form.Control autoFocus={true} className="listName width-100"
                                value={currentCard?.name} type="input" onChange={cardNameChange}
                                onBlurCapture={setCardName}></Form.Control>
                        </Form.Group>
                        }
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="width-100 pe-2">
                            <div className="members mb-3">
                                <div className="d-flex align-center justify-content-space-between">
                                    <p className="mb-0">Member</p>
                                    <Button onClick={() => { setInputLabel("User"); setShowModal(true)}} size="sm">Add member</Button>
                                </div>
                            <hr className="mt-2"></hr>
                            {
                                currentCard?.users?.map((e,i) => (
                                    <span key={i} className="user">{ e.name[0]}</span>
                                ))    
                            }
                            </div>
                            <div className="tags mb-3">
                                <div className="d-flex align-center justify-content-space-between">
                                    <p className="mb-0">Tags</p>
                                    <Button onClick={() => { setInputLabel("Tags"); setShowModal(true)}} size="sm">Add Tag</Button>
                                </div>
                                <hr className="mt-2"></hr>
                                {
                                currentCard?.tags?.map((e,i) => (
                                    <span key={i} className="tagItem">{e.tagName}
                                        <i onClick={()=>{ deleteTag(e.tagId)}}  className="ms-4 cursor-pointer bi bi-x-circle"></i>
                                    </span>
                                ))    
                            }
                                {
                                    (currentCard?.tags && currentCard?.tags.length == 0) && 
                                    <p className="text-center">No Tags.</p>
                            }
                            </div>
                            <div className="description">
                                <p className="mb-0">Description</p>
                                <hr></hr>
                                {
                                    !currentCard?.description && <p onClick={() => { setCanDescriptionEdit(true) }}>No Description..</p>
                                }
                                    {
                                !canDescriptionEdit &&
                                    <p onClick={() => { setCanDescriptionEdit(true) }} className="mb-0 p-1 name width-100">
                                            {currentCard?.description}
                                    </p>
                                ||
                                canDescriptionEdit && 
                                <Form>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" value={currentCard?.description} type="input" onChange={cardDescriptionChange}
                                        onBlurCapture={setCardDescription}></Form.Control>
                                </Form>
                                }
                            </div>
                            
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="width-100 pe-2">
                            <div className="members mb-3">
                                <div className="d-flex align-center justify-content-space-between">
                                    <p className="mb-0">CheckList</p>
                                    <Button onClick={() => { addCheckList()}} size="sm">Add checkList</Button>
                                </div>
                            <hr className="mt-2"></hr>
                                {
                                    currentCard.hasOwnProperty("checkList") && currentCard.checkList.length > 0
                                    && currentCard.checkList.map((e) => {
                                        return<> <CheckList i={e}></CheckList> </>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
            {
                showModal && <FloatingForm saveAction={saveAction} roleChange={roleChange} allRoles={roles} onItemSelect={userAdd} onItemRemove={deleteTag} inputLabel={inputLabel} close={() => { setShowModal(false) }} onSearch={inputLabel == "Tags" ? searchTags: searchMember} searchedList={inputLabel == "Tags" ? searchedTag : searchedUser} selectedList={inputLabel == "Tags" ? currentCard?.tags : currentCard?.users} showModal={showModal} addTag={addTag} />
            }
            <ConfirmationModal onConfirm={onConfirm} properties={confirmationModalProp}/>
        </>
    )
}

export default CardDetails;