import { Button, Form } from "react-bootstrap";
import "./ListItem.css"
import { useState } from "react";
import ListService from "../../service/ListService";
function ListItem({item,addList,properties})
{
    const [editMode, setEditMode] = useState(false);
    const [listName, setListName] = useState([5]);
    const listService = new ListService();
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
                properties.listAdded();
            }
        }
    }
    const addCard = function ()
    {
        
    }
    return (
        <>
            <div className={addList ? "cursor-pointer listItem" : "listItem"} data-id={item?.id} data-boardId={item?.boardId}
            data-name={item?.name}>
                {
                    !addList &&
                    <div className="fetchedList">
                        <p className="mb-2 ps-1 name">{item &&  item.name }</p>
                        <div className="addCard" onClick={addCard}>
                            <i className="bi bi-plus primary d-inline-block"></i>
                            <span>Add Card </span>
                        </div>
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
            </div>
        </>
    )
}

export default ListItem;