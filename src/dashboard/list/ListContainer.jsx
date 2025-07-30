import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ListItem from "./listItem/ListItem";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./List.css"
import ListService from "../service/ListService";
import { ReactSortable , Swap} from "react-sortablejs";
import { useDispatch, useSelector } from "react-redux";
import { setAllList } from "./ListSlice";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import MultiSelectSearch from "../../shared/MultiSelectSearch";
function ListContainer({ onTrigger }) {
    const allList = useSelector((e) => e.list.allList);
    const dispatch = useDispatch();
    let lists = [];
    const grid = 8;
    const listService = new ListService();
    const navigate = useNavigate();
    const {boardId} = useParams();
    const [listItem, setListItem] = useState([]);
    const [lastPosition, setLastPosition] = useState(0);
    const [showListModal, setShowListModal] = useState(false)
    const [listForMultiSelect, setListForMultiSelect] = useState([]);
    let [multiSearchProperties, setSerachProperties] = useState({
    onSubmit: function (e) { copyCard(e) },
    close: function (e) { setShowListModal(false) }
    });
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
        console.log(allList);
        getList();
    }, []);
    useEffect(() => {  
    const listCopy = JSON.parse(JSON.stringify(allList));
    if(listCopy && listCopy.length > 0)
    {
        listCopy.forEach((e) => {
            console.log(e);
            
            e.label = e.name;
            e.value = e.id
        });
        }
        setListForMultiSelect(listCopy);
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
        const listCopy = JSON.parse(JSON.stringify(allList));
        let oldListItem = {};
        let newListItem = {};
        listCopy.forEach((e) => {
            if (e.position == evt.source.index + 1) {
                newListItem = e;
                newListItem.position = evt.destination.index + 1
            } else if (e.position == evt.destination.index + 1) {
                oldListItem = e;
                oldListItem.position = evt.source.index + 1;
            }
        });
        listCopy.sort((a, b) => {
            return a.position > b.position ? 1 : -1
        });
        if (Object.keys(oldListItem).length > 0 && Object.keys(newListItem).length > 0)
        {
            const list = await listService.updateListPosition({ boardId, lists: [oldListItem, newListItem] });        
            if(list.status && list.status == 200)
            {
                dispatch(setAllList(listCopy));
            }
        }
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
        let list = [...allList ];
        let index = list.findIndex(l => l.id === listId);
        const updatedCards = list[index].cards.map((e) => {                
            if (e.id == cardId) {
                e.complete = value;
            }
            return e;
        });
        // dispatch(setAllList(list));
    }
    const getListStyle = (isDraggingOver) => ({
        background: isDraggingOver ? 'lightblue' : 'lightgrey',
        padding: grid,
        display: "flex",
        "justify-content":"flex-start",
        width: "100%",
        gap:"20px"
    });
    const copyCard = (e) => {
        console.log(e);
        
    }
    return (
        <>
            <div >
                {/* <div>
                    <Button variant="primary" onClick={() => addList(false)}>Add List</Button>
                </div> */}
                <>
                    <div className="listContainer d-flex">
                        <DragDropContext onDragEnd={changePosition}>
                        <Droppable droppableId="droppable" isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={true} className="listContainer d-flex">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                {...provided.droppableProps}>
                                    {allList.map((e, i) => (
                                        <Draggable
                                        key={i}
                                        draggableId={('index'+i).toString()}
                                        index={i}>
                                            {(draggableProvided, snapshot) => (
                                                <div ref={draggableProvided.innerRef}
                                                
                                                    {...draggableProvided.draggableProps}>
                                                    <ListItem copyCard={()=> setShowListModal(true) } provided={draggableProvided} addList={false} item={e} properties={listProperty}  key={i} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                        <ListItem className="margin-left-auto" properties={listProperty} addList={true} />
                                </div>
                            )}
                        </Droppable>
                        </DragDropContext>
                        {
                            showListModal && <MultiSelectSearch properties={multiSearchProperties} item={listForMultiSelect} />
                        }
                    </div>
                    {/* <ReactSortable list={allList.map(item => ({ ...item }))} chosenClass={'chosen'} sort={true} setList={(list) => {
                        let obj = JSON.parse(JSON.stringify(list));
                        dispatch(setAllList(obj)); 
                    }} animation={200} easing={"cubic-bezier(1, 0, 0, 1)"}
                        onUpdate={changePosition} 
                        className="listContainer d-flex">
                        {allList.map((e,i) => (
                            <ListItem addList={false} item={e} properties={listProperty}  key={i} />
                        ))}
                            <ListItem properties={listProperty} addList={true} />
                    </ReactSortable> */}
                </>
            </div>
        </>
    )
}

export default ListContainer;