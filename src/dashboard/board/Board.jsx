import { useCallback, useContext, useEffect, useRef, useState } from "react";
import BoardService from "../service/BoardService";
import { Button, Dropdown, Form, Modal, Tab, Tabs } from "react-bootstrap";
import ListComponent from "../../shared/List";
import debounce from "lodash.debounce";
import SearchBox from "../../shared/SerachBox";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedBoard, selectAllBoard, setActiveBoardList, setArchivedBoardList, setBoard, setBoardList } from "./BoardSlice";
import { setUserList } from "../userProfile/UserSlice";
import { setAllRoles, setBoardPaginationDefault, setBoardPaginationObject, setPage, setPaginateHappen } from "../DashboardSlice";
import "./Board.css";
import { motion } from "framer-motion";

function Board({ paginate }) {
    const hasMounted = useRef(false);
    const { projectId } = useParams();
    const userState = useSelector((state) => state.auth.user);
    const boardSelector = useSelector((state) => state.board);
    const selectedBoard = useSelector((state) => state.board.selectedBoard);
    const selectedBoardRef = useRef(selectedBoard);
    const projectSelector = useSelector((state) => state.project);
    const boardList = useSelector((state) => state.board.boardList);
    const activeBoardList = useSelector((state) => state.board.activeBoardList);
    const archivedBoardList = useSelector((state) => state.board.archivedBoardList);
    const allRoles = useSelector((e) => e.dashboard.allRoles);
    const projectList = useSelector((e) => e.project.projectList);
    const paginateHappen = useSelector((p) => p.dashboard.paginateHappen);
    const paginationObject = useSelector((e) => e.dashboard.boardPaginationObject);
    const defaultPaginationObject = useSelector((e) => e.dashboard.defaultPaginationObject);
    const [activeTabKey, setActiveTabKey] = useState("activeBoard");
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
        isPublic: null
    })
    let selectedUser = [];
    let selectedUserMap = new Map();
    let [multiSearchProperties, setSerachProperties] = useState({
        inputLabel: "Add User",
        selectedUser: [],
        result: [],
        roles: [],
        onSearch: function (e) { searchUser(e) },
        onItemSelect: function (i, property) { onUserSelect(i, property) },
        onItemRemove: function (id, property) { onUserRemoved(id, property) },
        onRoleUpdate: function (role, property, id) { onRoleUpdate(role, property, id) },
    });
    const [confirmationModalProp, setConfirmationProp] = useState({
        showModal: false,
        message: "",
        action: function (t) { onConfirm(t) },
        close: function () { closeModal() },
        selectedItem: {},
        type:""
    })
    const [listProperties, setListProperties] = useState({
        users: [],
        edit: function () { editBoard() },
        delete: function (id) { deleteBoard(id, false) },
        archive: function (id) { archiveBoard(id, false) },
        archiveRestore: function (id) { archiveRestore(id, false) },
        open: function (id) { openBoard(id) }
    })
    useEffect(() => {
        dispatch(resetSelectedBoard({}));
    }, [])
    useEffect(() => {
        console.log(selectedBoard);
        
        selectedBoardRef.current = selectedBoard;
    },[selectedBoard])
    useEffect(() => {
        dispatch(setPage("board"));
        dispatch(setBoardPaginationDefault(defaultPaginationObject));
        dispatch(setPaginateHappen(!paginateHappen));
        return () => {
            console.log('Component unmounted');
        };
    }, [projectId])
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true; // ✅ skip first run
            return;
        }        
        getBoard(projectId);
        getRoles();

    }, [paginateHappen]);
    const getBoard = async function (projectId) {
        const board = await boardService.getAllBoards(localStorage.getItem("token"), projectId, paginationObject.itemPerPage, paginationObject.currentOffset);
        if (board.status && board.status == 200) {

            dispatch(setBoardList(board.data));
            const activeList = [];
            const archivedList = [];
            console.log(board.data);
            
            for (var x in board.data)
            {
                if (board.data[x].is_archived)
                {
                    archivedList.push(board.data[x]);
                }
                if (board.data[x].is_active || board.data[x].is_active == null && !board.data[x].is_archived)
                {
                    activeList.push(board.data[x]);
                }
            }
            console.log(activeList);
            console.log(archivedList);
            
            dispatch(setActiveBoardList(activeList));
            dispatch(setArchivedBoardList(archivedList));
            const { itemPerPage } = paginationObject;
            const items = { items: Math.ceil(board?.totalCount / itemPerPage), totalCount: board?.totalCount };
            dispatch(setBoardPaginationObject({ ...paginationObject, ...items }))
            setEmpty(false);
        }
    }
    const getRoles = async function () {
        const roles = await boardService.getAllRoles();
        if (roles.status && roles.status == 200) {
            setRoles(roles.data);
            dispatch(setAllRoles(roles.data));
            setSerachProperties((prevItem) => ({ ...prevItem, roles: roles.data }));
        }
    }
    const addBoard = async function () {
        let user = [];        
        if (boardSelector.board.name) {
            if (!boardSelector.board.id) {
                if (boardSelector.board.user && boardSelector.board.user.length > 0) {
                    boardSelector.board.user.forEach((e) => {
                        if (!e.creator)
                            user.push({ user_id: e.id, role: e.role_id })
                    })
                }
                const board = await boardService.createBoard({ projectId: projectId, name: boardSelector.board.name, isPublic: boardSelector.board.isPublic ? 1 : 0, users: user });
                if (board.status && board.status == 200) {
                    setModalShow(false);
                    getBoard(projectId);
                }
            } else {
                if (boardSelector.board.user && boardSelector.board.user.length > 0) {
                    boardSelector.board.user.forEach((e) => {
                        if (!e.creator)
                            user.push({ user_id: e.id, role: e.role_id })
                    })
                }
                const board = await boardService.editBoard({ boardId: boardSelector.board.id, name: boardSelector.board.name, isPublic: boardSelector.board.isPublic ? 1 : 0, users: user });
                if (board.status && board.status == 200) {
                    setModalShow(false);
                    getBoard(projectId);
                } else {
                    setModalShow(false);
                    getBoard(projectId);
                }
            }
        }
    }
    const deleteBoard = async function (id, t) {
        console.log(t);
        
        currentId = id;
        if (!t) {
            setConfirmationProp((prevItem) => ({ ...prevItem, showModal: true, message: "Are you sure want to delete board?" }));
        } else {
            const board = await boardService.deleteBoard(id);
            if (board.status && board.status == 200) {
                getBoard(projectId);
            }
        }
    }
    const archiveBoard = async function (id, t) {
        console.log(id);
        currentId = id;
        setConfirmationProp((prevItem) => ({ ...prevItem, showModal: true, type:"archive", message: "Are you sure want to archive board?" }));
    }
    const archiveRestore = async function (id, t) {
        console.log(id);
        currentId = id;
        setConfirmationProp((prevItem) => ({ ...prevItem, showModal: true, type:"archiveRestore", message: "Are you sure want to restore the board?" }));
    }
    const editBoard = async function () {
        setModalShow(true);
    }
    const fetchUsers = async (params) => {
        const user = await boardService.searchUser(params, projectId);
        if (user.status && user.status == 200) {
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
    const onUserSelect = function (i, property) {
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

        // setSerachProperties((prevItem) => ({ ...prevItem, property }));
    }
    const onUserRemoved = function (id, property) {
        property.result.forEach((e) => {
            if (e.id == id)
                e.selected = false;
        })
        property.selectedUser = property.selectedUser.filter((e) => (e.id != id));
        selectedUserMap.delete(id);
        setSerachProperties({ ...property });
        setSelectedBoards((p) => ({ ...p, users: property.selectedUser }))
    }
    const onRoleUpdate = function (role, property, id) {
        property.selectedUser.forEach((e) => {
            if (e.id == id)
                e.role_id = role;
        })
        setSerachProperties({ ...property });
    }
    const closeModal = function () {
        currentId = "";
        setConfirmationProp((prevItem) => ({ ...prevItem, showModal: false }))
    }
    const onConfirm = async function (t) {
        console.log(t);
        console.log(currentId);
        
        if (t == "archive")
        {
            const seletedList = [];
            if (currentId)
            {
                seletedList.push(currentId);
            } else {
                for (var x in selectedBoardRef.current)
                {
                    seletedList.push(x)
                }
            }
            const board = await boardService.archivedBoard({ boardIds: seletedList, archive: 1 });
            if (board.status && board.status == 200)
            {
                
            }
        } else if ( t == "archiveRestore")
        {
            const seletedList = [];
            if (currentId)
            {
                seletedList.push(currentId);
            } else {
                for (var x in selectedBoardRef.current)
                {
                    seletedList.push(x)
                }
            }
            const board = await boardService.archivedBoard({ boardIds: seletedList, archive: 0 });
        }
        else if (t === true) {
            deleteBoard(currentId, true)
        }
    }
    const openBoard = function (id) {
        navigate("../list/"+projectId+"/" + id)
    }
    const addAllProjectMember = () => {
        const projectList = JSON.parse(JSON.stringify(projectSelector.projectList));
        const users = projectList[projectId].user;
        const updatedBoard = {
            ...boardSelector.board,
            user: users,
        };
        dispatch(setBoard(updatedBoard));
    }
    const selectBoard = (e) => {
        if(e.target.checked)
            dispatch(selectAllBoard())
        else
            dispatch(resetSelectedBoard())
    }
    const openAction = (e) => {
        console.log(e);
        
        setConfirmationProp((prevItem) => ({ ...prevItem, showModal: true, type:e, message: `Are you sure want to `+e+` board?` }));
    }
    const tabSelection = (k) => {
        dispatch(resetSelectedBoard({}));
        setActiveTabKey(k);
    }
    return (
        <>
            <div className="header d-flex align-center justify-content-space-between">
                <h3 className="float-start">
                    Boards
                </h3>
                <Form.Select className="select custom-select" onChange={(e) => { navigate("../board/" + e.target.value + "") }}>
                    {
                        Object.entries(projectList).map(([index, item]) => {
                            return <option value={item.id}> {item.name}</option>
                        })
                    }
                </Form.Select>
                <button className="btn btn-primary   button-primary btn-sm float-end" onClick={() => setModalShow(true)}>Add Board</button>
            </div>
            <div className="clearfix"></div>
            <hr></hr>
            <Tabs id="list-container-tab"
                activeKey={activeTabKey}
                onSelect={(k) => tabSelection(k)}
            >
                <Tab eventKey="activeBoard" title="Active">
                    {
                    isEmpty ?
                        <>
                            <p>No Board</p>
                        </> :
                        <>
                            {
                                Object.keys(selectedBoard).length > 0 &&
                                <motion.section className="actionMenu mb-3 p-2">
                                <Button className="ms-0 button-primary" onClick={()=>{openAction("archive")}} size="sm">Archive</Button>
                                <Button className="ms-2 button-primary" onClick={()=>{openAction("activate")}} size="sm">Activate</Button>
                                <Button className="ms-2 button-primary" onClick={()=>{openAction("deactivate")}} size="sm">De Activate</Button>
                                </motion.section>
                            }
                            <section className="tableHeader d-flex align-center d-none-medium">
                                <section className="headerItem">
                                    <Form.Group className="" onChange={selectBoard} controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" />
                                    </Form.Group>
                                </section>
                                <section className="headerItem">
                                    Name
                                </section>
                                <section className="headerItem">
                                    Assignee
                                </section>
                                <section className="headerItem">
                                    Status
                                </section>
                                <section className="headerItem">
                                    Card Stautus
                                </section>
                                <section className="headerItem">
                                    Created At
                                </section>
                                <section className="headerItem">
                                    Action
                                </section>
                            </section>
                            <section className=" height-100 padding-bottom-50-percent">
                                    {
                                    activeBoardList.length > 0 &&   activeBoardList.map((item,index) => {
                                    return <ListComponent type="board" isArchive={false} key={index} item={item} properties={listProperties} users={item.user} loggedInUser={userState} />
                                })}

                            </section>
                        </>
                    }
                </Tab>
                <Tab eventKey="archivedBoard" title="Archived">
                        {
                    isEmpty ?
                        <>
                            <p>No Board</p>
                        </> :
                        <>
                            {
                                Object.keys(selectedBoard).length > 0 &&
                                <motion.section className="actionMenu mb-3 p-2">
                                <Button className="ms-0 button-primary" size="sm">Delete</Button>
                                <Button className="ms-2 button-primary" size="sm">Restore</Button>
                                </motion.section>
                            }
                            <section className="tableHeader d-flex align-center">
                                <section className="headerItem">
                                    <Form.Group className="" onChange={selectBoard} controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" />
                                    </Form.Group>
                                </section>
                                <section className="headerItem">
                                    Name
                                </section>
                                <section className="headerItem">
                                    Assignee
                                </section>
                                <section className="headerItem">
                                    Status
                                </section>
                                <section className="headerItem">
                                    Card Stautus
                                </section>
                                <section className="headerItem">
                                    Created At
                                </section>
                                <section className="headerItem">
                                    Action
                                </section>

                            </section>
                            <section className=" height-100 padding-bottom-50-percent">
                                    {
                                    archivedBoardList.length > 0 && archivedBoardList.map((item,index) => {
                                    return <ListComponent type="board" isArchive={true} key={index} item={item} properties={listProperties} users={item.user} loggedInUser={userState} />
                                })}

                            </section>
                        </>
                    }
                </Tab>
            </Tabs>
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
                                    <Form.Control type="input" value={boardSelector.board.name} onChange={(e) => dispatch(setBoard({ ...boardSelector.board, name: e.target.value }))} required></Form.Control>
                                </Form.Group>
                                <SearchBox properties={multiSearchProperties} addAllProjectMember={addAllProjectMember} type="board"></SearchBox>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check onChange={(e) => setPublic(e.target.value)} type="checkbox" label="is Public" />
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