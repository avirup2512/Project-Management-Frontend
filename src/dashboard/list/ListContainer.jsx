import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ListItem from "./listItem/ListItem";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./List.css"
import ListService from "../service/ListService";
import { ReactSortable , Swap} from "react-sortablejs";

function ListContainer({ onTrigger }) {

    const listService = new ListService();
    const navigate = useNavigate();
    const {boardId} = useParams();
    const [listItem, setListItem] = useState([]);
    const [lastPosition, setLastPosition] = useState(0);
    const [listProperty, setListProperties] = useState({
        boardId,
        listAdded: function () { getList() },
        lastPosition:null
    })
    useEffect(() => {
        getList();
    },[])
    const getList = async () => {
        console.log(boardId);
        const list = await listService.getAllList(boardId);
        if (list.status && list.status == 200)
        {
            list.data.sort((a, b) => {
                return a.position > b.position ? 1 : -1
            })
            setListItem(list.data);
            if (list.data.length > 0)
            {
                setLastPosition(list.data[list.data.length - 1].position);
                setListProperties((p)=>({...p,lastPosition:list.data[list.data.length - 1].position}))
            }
            else
            {
                setListProperties((p)=>({...p,lastPosition:0}))
            }
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
    const changePosition = async (evt) => {
        console.log(evt);
        
        console.log(listItem);
        
        let oldListItem = {};
        let newListItem = {};
        listItem.forEach((e) => {
            if (e.position == evt.oldIndex)
            {
                newListItem = e;
            } else if (e.position == evt.newIndex)
            {
                oldListItem = e
            }
        })
        console.log(evt.to.hasChildNodes(), evt.to.childNodes);
        const listMap = new Map();
        if (evt.to.hasChildNodes())
        {
            evt.to.childNodes.forEach((e, i) => {                
                listMap.set(e.dataset.id, i+1);
            })
        }
        const listToBeEdited = [];
        listItem.forEach((e) => {
            if (e.position != listMap.get("" + e.id + "")) {
                e.position = listMap.get("" + e.id + "");
                listToBeEdited.push(e);
            }
        });

        const list = await listService.updateListPosition({ boardId, lists: listToBeEdited });

        console.log(listItem);
    }
    return (
        <>
            <div >
                {/* <div>
                    <Button variant="primary" onClick={() => addList(false)}>Add List</Button>
                </div> */}
                <>
                    <ReactSortable list={listItem} chosenClass={'chosen'} sort={true} setList={setListItem} animation={200} easing={ "cubic-bezier(1, 0, 0, 1)"} onUpdate={changePosition}
                        className="listContainer d-flex">
                    {listItem.map((e,i) => (
                        <ListItem addList={false} item={e}  key={i} />
                    ))}
                    <ListItem properties={listProperty} addList={true} />
                </ReactSortable>
                </>
            </div>
        </>
    )
}

export default ListContainer;