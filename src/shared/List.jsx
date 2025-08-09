import Alert from 'react-bootstrap/Alert';
import "./List.css";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBoard, setBoardList } from '../dashboard/board/BoardSlice';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { setProject } from '../dashboard/project/ProjectSlice';
import { Archive, ArchiveX, Copy, Delete, Edit, Edit2 } from 'lucide-react';
function ListComponent({ item, properties, users, loggedInUser, type }) {
  const boardSelector = useSelector((state) =>  state.board);
  const dispatch = useDispatch();

  useEffect(() => {
  }, [boardSelector])
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
  return (
      <>
        <div className="list d-flex align-center">  
          <div className='listItems'>
              <Form.Group className="" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" />
              </Form.Group>
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
          {/* {loggedInUser.id == item.board_user_id && <i className="bi bi-person-circle primary"></i>} */}
          <ProgressBar className='cardStatus' now={(item.totalCompleteCard/item.totalCard)*100} />
          <span>{ item.totalCompleteCard}/{ item.totalCard}</span>
          </div>
          <div className='listItems'>
              <i className="bi bi-plus-circle primary"></i>
          </div>
          <div className='icon section listItems'>
          {/* <i onClick={open} className="bi bi-eye-fill primary"></i> */}
          <Copy size={16}/>
          <Edit2 onClick={edit} size={16} />
          <ArchiveX size={16} onClick={deleteAction}/>
          </div>
        </div>
    </>
  );
}

export default ListComponent;