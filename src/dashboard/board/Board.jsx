import { useCallback, useContext, useEffect, useState } from "react";
import BoardService from "../service/BoardService";
import { Button, Form, Modal } from "react-bootstrap";
import ListComponent from "../../shared/List";
import debounce from "lodash.debounce";
import SearchBox from "../../shared/SerachBox";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBoard, setBoardList } from "./BoardSlice";
import { setUserList } from "../userProfile/UserSlice";
import { setAllRoles } from "../DashboardSlice";

function Board({onTrigger})
{
    const userState = useSelector((state) => state.auth.user);
    const boardSelector = useSelector((state) => state.board);
    const allRoles = useSelector((e) => e.dashboard.allRoles);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let currentId = '';
    const [query, setQuery] = useState('');
    const boardService = new BoardService();
    const [isEmpty, setEmpty] = useState(true);
    const [showAddModal, setModalShow] = useState(false);
    const [boardName, setName] = useState("");
    const [isPublic, setPublic] = useState(true);
    const [users, setUser] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedBoards, setSelectedBoards] = useState({
        name: "",
        id: "",
        users: [],
        isPublic:null
    })
    let selectedUser = [];
    let selectedUserMap = new Map();
    let [multiSearchProperties, setSerachProperties] = useState({
        inputLabel: "Add User",
        selectedUser: [],
        result: [],
        roles:[],
        onSearch: function (e) { searchUser(e) },
        onItemSelect: function (i, property) { onUserSelect(i, property) },
        onItemRemove: function (id, property) { onUserRemoved(id, property) },
        onRoleUpdate: function(role,property,id) { onRoleUpdate(role, property,id) }
    });
    const [confirmationModalProp, setConfirmationProp] = useState({
        showModal: false,
        message: "",
        action: function (t) { onConfirm(t) },
        close:function(){closeModal()}
    })
    const [listProperties, setListProperties] = useState({
        users:[],
        edit: function () { editBoard() },
        delete: function (id) { deleteBoard(id, false) },
        open: function(id) { openBoard(id) }
    })
    
    useEffect(() => {
        getBoard();
        getRoles();
    }, []);
    useEffect(() => {
        // if (boardSelector.board && boardSelector.board.edit)
        // {
        //     editBoard()
        // }
    }, [boardSelector])
    const getBoard = async function ()
    {
        const board = await boardService.getAllBoards(localStorage.getItem("token"));        
        if(board.status && board.status == 200)
        {
            dispatch(setBoardList(board.data));
            setEmpty(false)
        } 
    }
    const getRoles = async function ()
    {
        const roles = await boardService.getAllRoles();
        if(roles.status && roles.status == 200)
        {            
            setRoles(roles.data);
            dispatch(setAllRoles(roles.data));
            setSerachProperties((prevItem) => ({ ...prevItem, roles: roles.data }));
        } 
    }
    const addBoard = async function ()
    {        
        let user = [];
        if (boardSelector.board.name) {
            if (!boardSelector.board.id)
            {
                if (boardSelector.board.user && boardSelector.board.user.length > 0)
                {
                    boardSelector.board.user.forEach((e) => {                            
                        if(!e.creator)
                        user.push({user_id:e.id,role:e.role_id})
                    })
                }
                const board = await boardService.createBoard({ name: boardSelector.board.name, isPublic: boardSelector.board.isPublic ? 1 : 0, users: user});
                if (board.status && board.status == 200)
                {
                    setModalShow(false);
                    getBoard();
                }
            } else {
                console.log(boardSelector.board);
                
                if (boardSelector.board.user && boardSelector.board.user.length > 0)
                {
                    boardSelector.board.user.forEach((e) => {                            
                        if(!e.creator)
                            user.push({user_id:e.id,role:e.role_id})
                    })
                }
                const board = await boardService.editBoard({boardId:boardSelector.board.id, name: boardSelector.board.name, isPublic: boardSelector.board.isPublic ? 1 : 0, users: user});
                if (board.status && board.status == 200)
                {
                    setModalShow(false);
                    getBoard();
                } else {
                    setModalShow(false);
                    getBoard();
                }
            }
        }
    }
    const deleteBoard = async function (id,t)
    {
        currentId = id;
        if (!t)
        {
            setConfirmationProp((prevItem) => ({ ...prevItem, showModal: true, message: "Are you sure want to delete board?" }));
        } else {
            const board = await boardService.deleteBoard(id);
            if (board.status && board.status == 200)
            {
                getBoard();
            }
            
        }
    }
    const editBoard = async function ()
    {
        console.log(boardSelector);
        
        // item.user.forEach((e) => {
        //     e.selected = true;
        // })
        setModalShow(true);
        
        // setSelectedBoards((p)=>({...p,}))
        // setSerachProperties((prevItem) => ({ ...prevItem, selectedUser: item.user }));
    }
    const fetchUsers = async (params) => {
        console.log(params);
        
        const user = await boardService.searchUser(params);
        if (user.status && user.status == 200)
        {
            setUser(user.data);
            dispatch(setUserList(user.data));
        }
    }
    const debouncedFetchUsers = useCallback(debounce(fetchUsers, 400), []);
    const searchUser = (e) => {
        const value = e.target.value;
        if (value == null)
            setSerachProperties((prevItem) => ({ ...prevItem, result: [] }));
        setQuery(value);
        if (value.length >= 2) {
            debouncedFetchUsers(value);
        } else {
            setSerachProperties((prevItem) => ({ ...prevItem, result: [] }));
        }
    };
    const onUserSelect = function (i,property)
    {
        // property.result[i].selected = !property.result[i].selected;        
        // if(property.result[i].selected == true)
        // {
        //     property.result[i].role_id = property.result[i].role;
        //     property.selectedUser.push(property.result[i]);
        //     selectedUserMap.set(property.result[i].id, property.result[i]);
        //     property.onRoleUpdate(1, property, property.result[i].id);
        // } else {
        //     selectedUser = property.selectedUser.filter((e) => (e.id != property.result[i].id));
        //     selectedUserMap.delete(property.result[i].id);
        // }       
        // console.log(property);
        
        // setSerachProperties((prevItem) => ({ ...prevItem, property }));
    }
    const onUserRemoved = function (id,property)
    {
        property.result.forEach((e) => {
            if (e.id == id)
                e.selected = false;
        })       
        property.selectedUser = property.selectedUser.filter((e) => (e.id != id));
        selectedUserMap.delete(id);
        setSerachProperties({ ...property });
        setSelectedBoards((p)=>({...p,users:property.selectedUser}))
    }
    const onRoleUpdate = function (role,property,id)
    {
        property.selectedUser.forEach((e) => {
            console.log(e);
            
            if (e.id == id)
                e.role_id = role;
        })
        setSerachProperties({ ...property});
    }
    const closeModal = function ()
    {
        currentId = "";
        setConfirmationProp((prevItem)=>({...prevItem,showModal:false}))
    }
    const onConfirm = function (t)
    {
        if (t)
        {
            deleteBoard(currentId, true)
        }
    }
    const openBoard = function (id)
    {
        navigate("../list/"+id)
    }
    return (
        <>
            <div className="header">
                <h3 className="float-start">
                Boards
                </h3>
                <button className="btn btn-primary btn-sm float-end" onClick={() => setModalShow(true)}>Add Board</button>
            </div>
            <div className="clearfix"></div>
            <hr></hr>
            {
                isEmpty ?
                <>
                    <p>No Board</p>
                </> :
                    <>
                    { Object.entries(boardSelector.boardList).map(([index, item])=>{
                        return <ListComponent key={index} item={item} properties={listProperties} users={item.user} loggedInUser={userState} />
                    }) }
                </>
            }
            {showAddModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <Modal show={showAddModal} size="lg">
                        <Modal.Header closeButton onClick={() => setModalShow(false)}>
                        <Modal.Title>Add Board</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form onSubmit={addBoard}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="input" value={boardSelector.board.name} onChange={(e)=>dispatch(setBoard({...boardSelector.board,name:e.target.value}))} required></Form.Control>
                                </Form.Group>
                                <SearchBox properties={multiSearchProperties}></SearchBox>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check onChange={(e)=>setPublic(e.target.value)} type="checkbox" label="is Public" />
                                </Form.Group>
                            </Form>
                        </Modal.Body>

                        <Modal.Footer>
                        <Button variant="danger" onClick={() => setModalShow(false)}>Close</Button>
                        <Button variant="primary" onClick={() => addBoard()}>Submit</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
            <ConfirmationModal properties={confirmationModalProp}></ConfirmationModal>
        </>
    )
}

export default Board;