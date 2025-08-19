import Alert from 'react-bootstrap/Alert';
import "./List.css";
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  removeSelectedBoard, setBoard, setBoardList, setSelectedBoard } from '../dashboard/board/BoardSlice';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { setProject } from '../dashboard/project/ProjectSlice';
import { Archive, ArchiveRestore, ArchiveX, Copy, Delete, Edit, Edit2, Trash } from 'lucide-react';
function ListComponent({ item, properties, users, loggedInUser, type,isArchive }) {
  const boardSelector = useSelector((state) => state.board);
  const selectedBoard = useSelector((state) => state.board.selectedBoard);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(selectedBoard);
    console.log(item.id);
    
  }, [selectedBoard])
  const open = function ()
  {
    properties.open(item.id);
  }
  const edit = function ()
  {
    let obj = { ...item, edit: true };
    switch (type) {
      case "project":
        dispatch(setProject(obj));
        break;
        case "board":
        dispatch(setBoard(obj));
        break;
      default:
        break;
    }
    
    properties.edit();
  }
  const deleteAction = function ()
  {
    properties.delete(item.id);
  }
  const archiveAction = function ()
  {
    properties.archive(item.id);
  }
  const archiveRestoreAction = function ()
  {
    properties.archiveRestore(item.id);
  }
  
  const selectBoard = (e) => {
    if(e.target.checked)
      dispatch(setSelectedBoard(item))
    else {
      dispatch(removeSelectedBoard(item.id))
    }
  }
  return (
      <>
        <div className="list d-flex align-center">  
          <div className='listItems'>
          {
            type != "project" && <Form.Group className="" onChange={selectBoard} controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" checked={selectedBoard.hasOwnProperty(item.id)} />
              </Form.Group>}
          </div>
          <div onClick={open} className='align-content-center boardName listItems'>{item?.name}</div>
          <div className='users section listItems'>
                    {
                    users.map((item, index) => (
                        <span className='user' key={index}><span className='align-text-top'>{ item.first_name[0] }</span></span>
                      ))
                    }
          </div>
          <div className='status listItems'>
          <p className='mb-0'>Active</p>
          </div>
          <div className='owner listItems'>
          {type != "project" && 
            <>
            <ProgressBar className='cardStatus' now={(item.totalCompleteCard/item.totalCard)*100} />
            <span>{ item.totalCompleteCard}/{ item.totalCard}</span></>
          }
          </div>
          <div className='listItems'>
              {/* <i className="bi bi-plus-circle primary"></i> */}
          </div>
          <div className='icon section listItems'>
          {/* <i onClick={open} className="bi bi-eye-fill primary"></i> */}
          {/* {
            type != "project" && <Copy size={16} />
          } */}
          
          {
            !isArchive && 
            <>
              <Archive size={16} onClick={archiveAction} />
              <Edit2 onClick={edit} size={16} />
            </>
          }
          {
            isArchive && 
            <>
              <Trash size={16} onClick={deleteAction}></Trash>
              <ArchiveRestore size={16} onClick={archiveRestoreAction}/>
            </>
          }
          </div>
        </div>
    </>
  );
}

export default ListComponent;