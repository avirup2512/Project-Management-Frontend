import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ListItem from "./listItem/ListItem";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./List.css"
import ListService from "../service/ListService";
import { ReactSortable , Swap} from "react-sortablejs";
import { useDispatch, useSelector } from "react-redux";
import { setAllList } from "./ListSlice";

function ListContainer({ onTrigger }) {
    const allList = useSelector((e) => e.list.allList);
    const dispatch = useDispatch();
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
    }, []);
    useEffect(() => {  
        console.log(allList);
        
    },[allList])
    const getList = async () => {
        const list = await listService.getAllList(boardId);
        if (list.status && list.status == 200)
        {
            const result = Object.entries(list.data).map(([_, value]) => value);
            result.sort((a, b) => {
                return a.position > b.position ? 1 : -1
            });
            dispatch(setAllList(result))
            // setListItem(result);
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
        // getList();
        
    }
    const changePosition = async (evt) => {
        let oldListItem = {};
        let newListItem = {};
        allList.forEach((e) => {
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
        allList.forEach((e) => {
            if (e.position != listMap.get("" + e.id + "")) {
                let obj = { ...e };
                obj.position = listMap.get("" + e.id + "");
                listToBeEdited.push(obj);
            }
        });
        const list = await listService.updateListPosition({ boardId, lists: listToBeEdited });
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
    const completeCard = (listId, cardId, value) => {
        console.log(allList);
        
        let list = [...allList ];
        let index = list.findIndex(l => l.id === listId);
        console.log(list);
        
        console.log(index);
        
        const updatedCards = list[index].cards.map((e) => {                
            if (e.id == cardId) {
                e.complete = value;
            }
            return e;
        });
        // dispatch(setAllList(list));
    }
    return (
        <>
            <div >
                {/* <div>
                    <Button variant="primary" onClick={() => addList(false)}>Add List</Button>
                </div> */}
                <>
                    <ReactSortable list={allList.map(item => ({ ...item }))} chosenClass={'chosen'} sort={true} setList={(list) => {
                        let obj = JSON.parse(JSON.stringify(list));
                        dispatch(setAllList(obj)); 
                    }} animation={200} easing={"cubic-bezier(1, 0, 0, 1)"}
                        onUpdate={changePosition} 
                        className="listContainer d-flex">
                        {allList.map((e,i) => (
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