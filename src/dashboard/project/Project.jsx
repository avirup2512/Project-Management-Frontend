import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ListComponent from "../../shared/List";
import debounce from "lodash.debounce";
import SearchBox from "../../shared/SerachBox";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProject, setProjectList } from "./ProjectSlice";
import { setUserList } from "../userProfile/UserSlice";
import { setAllRoles } from "../DashboardSlice";
import ProjectService from "../service/ProjectService";
import BoardService from "../service/BoardService";

function Project()
{
    const userState = useSelector((state) => state.auth.user);
    const projectSelector = useSelector((state) => state.project);
    const allRoles = useSelector((e) => e.dashboard.allRoles);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let currentId = '';
    const [query, setQuery] = useState('');
    const projectService = new ProjectService();
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
        edit: function () { editProject() },
        delete: function (id) { deleteBoard(id, false) },
        open: function(id) { openProject(id) }
    })
    
    useEffect(() => {
        getAllProject();
        getRoles();
    }, []);
    const getAllProject = async function ()
    {
        const project = await projectService.getAllProject(localStorage.getItem("token"));        
        if(project.status && project.status == 200)
        {
            dispatch(setProjectList(project.data));
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
    const addProject = async function ()
    {        
        let user = [];
        if (projectSelector.project.name) {
            if (!projectSelector.project.id)
            {
                if (projectSelector.project.user && projectSelector.project.user.length > 0)
                {
                    projectSelector.project.user.forEach((e) => {                            
                        if(!e.creator)
                        user.push({user_id:e.id,role:e.role_id})
                    })
                }
                const project = await projectService.createProject({ name: projectSelector.project.name, isPublic: projectSelector.project.isPublic ? 1 : 0, users: user});
                if (project.status && project.status == 200)
                {
                    setModalShow(false);
                    getAllProject();
                }
            } else {
                console.log(projectSelector.project);
                
                if (projectSelector.project.user && projectSelector.project.user.length > 0)
                {
                    projectSelector.project.user.forEach((e) => {                            
                        if(!e.creator)
                            user.push({user_id:e.id,role:e.role_id})
                    })
                }
                const project = await projectService.editProject({projectId:projectSelector.board.id, name: projectSelector.project.name, isPublic: projectSelector.project.isPublic ? 1 : 0, users: user});
                if (project.status && project.status == 200)
                {
                    setModalShow(false);
                    getAllProject();
                } else {
                    setModalShow(false);
                    getAllProject();
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
    const editProject = async function ()
    {
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
    const openProject = function (id)
    {
        console.log(id);
        
        navigate("../board/"+id)
    }
    return (
        <>
            <div className="header">
                <h3 className="float-start">
                Project
                </h3>
                <button className="btn btn-primary btn-sm float-end" onClick={() => setModalShow(true)}>Add Project</button>
            </div>
            <div className="clearfix"></div>
            <hr></hr>
            {
                isEmpty ?
                <>
                    <p>No Project</p>
                </> :
                    <>
                    { Object.entries(projectSelector.projectList).map(([index, item])=>{
                        return <ListComponent  key={index} item={item} properties={listProperties} users={item.user} loggedInUser={userState} />
                    }) }
                </>
            }
            {showAddModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <Modal show={showAddModal} size="lg">
                        <Modal.Header closeButton onClick={() => setModalShow(false)}>
                        <Modal.Title>Add Project</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form onSubmit={addProject}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="input" value={projectSelector.project.name} onChange={(e)=>dispatch(setProject({...projectSelector.project,name:e.target.value}))} required></Form.Control>
                                </Form.Group>
                                <SearchBox properties={multiSearchProperties}></SearchBox>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check onChange={(e)=>setPublic(e.target.value)} type="checkbox" label="is Public" />
                                </Form.Group>
                            </Form>
                        </Modal.Body>

                        <Modal.Footer>
                        <Button variant="danger" onClick={() => setModalShow(false)}>Close</Button>
                        <Button variant="primary" onClick={() => addProject()}>Submit</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
            <ConfirmationModal properties={confirmationModalProp}></ConfirmationModal>
        </>
    )
}

export default Project;