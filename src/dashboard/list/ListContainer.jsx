import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ListItem from "./listItem/ListItem";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./List.css"
import ListService from "../service/ListService";

function ListContainer({ onTrigger }) {

    const listService = new ListService();
    const navigate = useNavigate();
    const {boardId} = useParams();
    const [listItem, setListItem] = useState([5]);
    const [listProperty, setListProperties] = useState({
        boardId,
        listAdded:function () { getList() },
    })
    useEffect(() => {
        getList();
    },[])
    const getList = async () => {
        console.log(boardId);
        const list = await listService.getAllList(boardId);
        if (list.status && list.status == 200)
        {
            setListItem(list.data);
        }        
    }
    const addList = async function ()
    {
        setListItem((p) => {
            let arr = [...p];
            arr.push(1);
            return arr;
        })
        
    }
    return (
        <>
            <div >
                {/* <div>
                    <Button variant="primary" onClick={() => addList(false)}>Add List</Button>
                </div> */}
                <>
                <div className="listContainer d-flex">
                    {listItem.map((e,i) => (
                        <ListItem addList={false} item={e}  key={i} />
                    ))}
                    <ListItem properties={listProperty} addList={true} />
                </div>
                </>
            </div>
        </>
    )
}

export default ListContainer;