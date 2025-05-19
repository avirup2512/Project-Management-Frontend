import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ListItem from "./listItem/ListItem";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./List.css"
import ListService from "../service/ListService";
import { ReactSortable , Swap} from "react-sortablejs";

function ListContainer({ onTrigger }) {
    let lists = [];
    const listService = new ListService();
    const navigate = useNavigate();
    const {boardId} = useParams();
    const [listItem, setListItem] = useState([]);
    const [lastPosition, setLastPosition] = useState(0);
    const [listProperty, setListProperties] = useState({
        boardId,
        listAdded: function () { getList() },
        lastPosition: null,
        updateCards: (listId, updatedCards) => { updateCard(listId, updatedCards) },
        completeCard:(listId,cardId,value)=> {completeCard(listId,cardId,value)},
        listEdited:()=>{editList()},
        cards:[]
    })
    useEffect(() => {
        getList();
    },[])
    const getList = async () => {
        const list = await listService.getAllList(boardId);
        if (list.status && list.status == 200)
        {
            const result = Object.entries(list.data).map(([_, value]) => value);
            result.sort((a, b) => {
                return a.position > b.position ? 1 : -1
            })
            setListItem(result);
            if (result.length > 0)
            {
                setLastPosition(result[result.length - 1].position);
                setListProperties((p) => ({ ...p, lastPosition: result[result.length - 1].position }));
            }
            else
            {
                setListProperties((p)=>({...p,lastPosition:0}))
            }
        }        
    }
    const editList = function ()
    {
        getList();
        
    }
    const changePosition = async (evt) => {
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
        setListProperties((p) => ({ ...p, positionChanged: !listProperty.positionChanged }));
    }
    const updateCard = (listId, updatedCards) => {
        setListItem(prevLists => {
            const newLists = [...prevLists];         
            const index = newLists.findIndex(l => l.id === listId);
            if (index !== -1) {
                newLists[index] = { ...newLists[index], cards: updatedCards };
            }
                return newLists;
        });
        
    }
    const completeCard = (listId,cardId,value) => {
        setListItem(prevLists => {
            const newLists = [...prevLists];         
            const index = newLists.findIndex(l => l.id === listId);
            const updatedCards = newLists[index].cards.map((e) => {                
                if (e.id == cardId) {
                    e.complete = value;
                }
                return e;
            });
                console.log(updatedCards);
            if (index !== -1) {
                newLists[index] = { ...newLists[index], cards: updatedCards };
            }
                return newLists;
        });
    }
    return (
        <>
            <div >
                {/* <div>
                    <Button variant="primary" onClick={() => addList(false)}>Add List</Button>
                </div> */}
                <>
                    <ReactSortable list={listItem} chosenClass={'chosen'} sort={true} setList={setListItem} animation={200} easing={"cubic-bezier(1, 0, 0, 1)"}
                        onUpdate={changePosition} 
                        className="listContainer d-flex">
                        {listItem.map((e,i) => (
                            <ListItem addList={false} item={e} properties={listProperty}  key={i} />
                        ))}
                            <ListItem properties={listProperty} addList={true} />
                    </ReactSortable>
                </>
            </div>
        </>
    )
}

export default ListContainer;