import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "./FloatingForm.css";
function FloatingForm({ saveAction,roleChange,searchedList,selectedList,name,onSearch,onItemSelect,onItemRemove,showModal,inputLabel,close, allRoles }) {
    
    useEffect(() => {
        console.log(selectedList);
    })
    const [isOpen, toggleShow] = useState(false);
    // const [selectedItem, setSelectedItem] = useState([]);
    let selectedItemMap = useMemo(() => {
        const map = new Map();
        console.log(selectedList);
        
        for (let key in selectedList) {
            map.set(selectedList[key].id, selectedList[key]);
        };
        return map;
    });
    console.log(selectedItemMap

    );
    
    useEffect((e) => {
        
    })
const search = function (e)
{        
    onSearch(name,e.target.value);
    }
    const itemSelect = function (item)
    {
        const i = { ...item };
        i.name = item.first_name + " " + item.last_name;
        selectedItemMap.set(item.id, item);
        onItemSelect(i);
    }
    const itemRemove = function (item)
    {
        selectedItemMap.has(item.id);
        onItemRemove(item.id);
    }
    const closeModal = function ()
    {
        close();  
    }
    const roleEdit = (e,id) => {
        roleChange(id,e.target.value)
    }
  return (
      <>
        {
            showModal &&
            <div className="modal show d-block" tabIndex="-1">
                <Modal show={showModal} size="lg">
                    <Modal.Header closeButton onClick={() => closeModal()}>
                        <Modal.Title>Add { inputLabel}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className='parentWrapper position-relative'>
                        <label>{inputLabel}</label>
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
                                searchedList.map((item, index) => {                          
                                    return <p className={`${selectedItemMap.has(parseInt(item.id)) ? "disabled" : ""} ${true ? "item" : ""}`}
                                        onClick={itemSelect.bind(null, item)} key={index}>
                                        <span className='float-start'>{item.email}</span>
                                        {
                                            selectedItemMap.has(item.id) && <span className='float-end'><i className="bi bi-x"></i></span>}
                                        <span className='clearfix'></span>
                                    </p>
                                })
                            }
                            {
                                searchedList.length == 0 && 
                                <p className='m-0 p-3 text-center'>Type user name or email</p>
                                    }
                            </div>
                            </div>
                                }
                                <div className="">
                                    {
                                        selectedList.map((sl,i) => {
                                            return <><div key={i} className="d-flex align-center justify-content-space-between">
                                                <p className="mb-1">{sl.name}</p>
                                                
                                                {/* <span>{e.role_name}{ e.role}</span> */}
                                                <span>
                                                    <Form>
                                                        <Form.Select disabled={sl.creator} size="sm" value={sl.role} onChange={(e) => { roleEdit(e, sl.id) }}>
                                                            {allRoles.map(roles => (
                                                                <option key={roles.id} value={roles.id}>
                                                                    {roles.role}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form>
                                                </span>
                                                {
                                                    !sl.creator && <i onClick={(e)=>{itemRemove(sl)}}  className="cursor-pointer bi bi-x-circle-fill red"></i>
                                                }
                                                {sl.creator && <span>Creator</span>}
                                            </div>
                                                <hr></hr>
                                            </>
                                        })
                                    }
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="danger" onClick={() => closeModal(false)}>Close</Button>
                    <Button variant="primary" onClick={() => saveAction(true)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </div>
          }
      </>
);
}

export default FloatingForm;