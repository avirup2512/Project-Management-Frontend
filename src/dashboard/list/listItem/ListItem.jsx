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
        console.log("JI");
        setEditMode(true)
        // properties.addList()
    }
    const addListFunc = async() => {
        if (listName)
        {
            const list = await listService.createList({ boardId: properties.boardId, name: listName, position: 1 });
            if (list.status && list.status == 200)
            {
                properties.listAdded();
            }
        }
    }
    return (
        <>
            <div className="listItem">
            <p className="mb-0">{item &&  item.name }</p>
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