import { Form } from 'react-bootstrap';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBoard } from '../dashboard/board/BoardSlice';
function SearchBox({ properties }) {
    const boardSelector = useSelector((state) => state.board);
    const allUserList = useSelector((state) => state.user.allUserList);
    const dispatch = useDispatch();
    const [allUser, setAllUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    let selectedUserMap = useMemo(() => {
        const map = new Map();
        for (let key in boardSelector.board.user)
        {
            map.set(boardSelector.board.user[key].id, boardSelector.board.user[key]);
        };
        return map;
    })
    useEffect(() => {
        setSelectedUser(boardSelector.board.user);
    }, [boardSelector])
    useEffect(() => {
        setAllUser(allUserList)
        console.log(allUserList);
    },[allUserList])
    const [isOpen, toggleShow] = useState(false);
    const search = function (e)
    {        
        properties.onSearch(e);
    }
    const onItemSelect = function (item)
    {
        if (selectedUserMap.has(item.id))
        {
            onItemRemove(item.id)
        } else {
            setSelectedUser((p) => ([...p, item]));
            let obj = JSON.stringify(boardSelector.board);
            let obj2 = JSON.parse(obj);
            obj2.user.push(JSON.parse(JSON.stringify(item)));
            obj2.user[obj2.user.length-1].role_id = properties.roles[0].id
            dispatch(setBoard(obj2));
        }
    }
    const onItemRemove = function (id)
    {
        setSelectedUser((p) => { p = p.filter((e) => (e.id != id)); return p });
        let obj = JSON.stringify(boardSelector.board);
        let obj2 = JSON.parse(obj);
        obj2.user = obj2.user.filter((e) => (e.id != id));        
        dispatch(setBoard(obj2));
        selectedUserMap.delete(id);
    }
    const getUserInfo = function (e)
    {
        return e.first_name +" "+ e.last_name   
    }
    const roleChange = function (event, id)
    {
        // if (properties.selectedUser.length > 0)
        // {
        //     properties.onRoleUpdate(event.target.value,properties,id);
        // }  
        let obj = JSON.stringify(boardSelector.board);
        let obj2 = JSON.parse(obj);
        obj2.user.forEach((e) => {
            if (e.id == id)
            {
                e.role_id = event.target.value
            }
        })
        dispatch(setBoard(obj2))
    }
    return (
        <>
            <div className='row'>
            <div className='col-md-6'>
                <div className='parentWrapper position-relative'>
                        <label>{properties.inputLabel}</label>
                        <hr className='mt-1'></hr>
                    <div className='selector'>
                        <Form.Group onClick={() => toggleShow(!isOpen)}>
                            <Form.Control type="input" onChange={search}></Form.Control>
                            <span className='arrow'>{!isOpen && <i className="bi bi-caret-down-fill"></i>}{isOpen && <i className="bi bi-caret-up-fill"></i> }</span>
                        </Form.Group>
                    </div>
            { isOpen &&
                <div className='input'>
                    
                    <div className='result'>
                        {
                            allUser.map((item, index) => {                          
                                return <p className={`${selectedUserMap.has(parseInt(item.id)) ? "disabled" : ""} ${true ? "item" : ""}`}
                                    onClick={onItemSelect.bind(null, item)} key={index}>
                                    <span className='float-start'>{item.email}</span>
                                    {
                                        selectedUserMap.has(item.id) && <span className='float-end'><i className="bi bi-x"></i></span>}
                                    <span className='clearfix'></span>
                                </p>
                            })
                        }
                        {
                            allUser.length == 0 && 
                            <p className='m-0 p-3 text-center'>Type user name or email</p>
                        }
                    </div>
                </div>
            }
            </div>
            </div>
                <div className='col-md-6'>
                    <p className='m-0'>Selected User { selectedUser.length}</p>
                    <hr className='mt-1'></hr>
                    { selectedUser.length == 0 ? <p className='text-center'>No user is selected.</p>:""}
                    <div className='users pt-1'>
                        {
                            selectedUser.map((su, index) => (
                                <div className='selectedItem row p-2 mb-0' key={index} title={su.email}>
                                <span className='col-md-5 p-0'>
                                    {getUserInfo(su)}
                                </span>
                                <span className='col-md-5 p-0'>
                                    <Form.Group>
                                        <Form.Select disabled={su.creator} size="sm" value={su.role_id} onChange={(e) => { roleChange(e, su.id) }}>
                                            {properties.roles.map(roles => (
                                                <option key={roles.id} value={roles.id}>
                                                    {roles.role}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </span>
                                <span className='col-md-2 p-0 text-center text-danger'>
                                    {
                                        !su.creator && <i onClick={onItemRemove.bind(null, su.id)} className="bi bi-x-circle-fill red"></i>
                                    }
                                    {
                                        su.creator && <span>Creator</span>
                                    }
                                </span>
                            </div>))
                        }
                    </div>
            </div>
            </div>
        
    </>
);
}

export default SearchBox;