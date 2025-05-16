import { Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
function SearchBox({ properties }) {
    useEffect(() => {
        console.log(properties);
        
    },[properties])
    const [isOpen, toggleShow] = useState(false);
    const search = function (e)
    {        
        properties.onSearch(e);
    }
    const onItemSelect = function (i)
    {
        properties.onItemSelect(i,properties);
    }
    const onItemRemove = function (id)
    {
        properties.onItemRemove(id,properties);
    }
    const getUserInfo = function (e)
    {
        return e.first_name +" "+ e.last_name   
    }
    const roleChange = function (event, id)
    {
        if (properties.selectedUser.length > 0)
        {
            properties.onRoleUpdate(event.target.value,properties,id);
        }   
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
                            properties.result.map((item, index) => {                          
                                return <p className={`${item.selected ? "disabled" : ""} ${true ? "item" : ""}`} onClick={onItemSelect.bind(null, index)} key={index}>
                                    <span className='float-start'>{item.email}</span>
                                    {item.selected && <span className='float-end'><i className="bi bi-x"></i></span>}
                                    <span className='clearfix'></span>
                                </p>
                            })
                        }
                        {
                            properties.result.length == 0 && 
                            <p className='m-0 p-3 text-center'>Type user name or email</p>
                        }
                    </div>
                </div>
            }
            </div>
            </div>
                <div className='col-md-6'>
                    <p className='m-0'>Selected User</p>
                    <hr className='mt-1'></hr>
                    { properties.selectedUser.length == 0 ? <p className='text-center'>No user is selected.</p>:""}
                    <div className='users pt-1'>
                            {properties.selectedUser.map((su,index) => su.selected ? (
                                <div className='selectedItem row p-2 mb-0' key={index} title={su.email}>
                                    <span className='col-md-5 p-0'>
                                        {getUserInfo(su)}
                                    </span>
                                    <span className='col-md-5 p-0'>
                                        <Form.Group>
                                            <Form.Select disabled={su.creator} size="sm" value={su.role_id} onChange={(e)=>{roleChange(e,su.id)}}>
                                            { properties.roles.map(roles => (
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
                                    
                                </div>
                            ):"")}
                    </div>
            </div>
            </div>
        
    </>
);
}

export default SearchBox;