import Alert from 'react-bootstrap/Alert';
import "./List.css";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBoard, setBoardList } from '../dashboard/board/BoardSlice';
function ListComponent({ item, properties, users, loggedInUser }) {
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
    let obj = {...item,edit:true};
    dispatch(setBoard(obj));
    properties.edit();
  }
  const deleteAction = function ()
  {
    properties.delete(item.id);
  }
  return (
      <>
        <div className="list">  
          <span className='align-content-center'>{item?.name}</span>
          <div className='users'>
                  {
                  users.map((item, index) => (
                      <span className='user' key={index}><span className='align-text-top'>{ item.first_name[0] }</span></span>
                    ))
                  }
          </div>
          <div className=''>
                {loggedInUser.id == item.board_user_id && <i className="bi bi-person-circle primary"></i>}
          </div>
        <div className='icon'>
            <i onClick={open} className="bi bi-eye-fill primary"></i>
            <i onClick={edit} className="bi bi-pen-fill primary"></i>
            <i onClick={deleteAction} className="bi bi-x-circle-fill red"></i>
          </div>
        </div>
    </>
  );
}

export default ListComponent;