import Alert from 'react-bootstrap/Alert';
import "./List.css";
import { useEffect } from 'react';
function ListComponent({item, properties, users }) {
  useEffect(() => {
    console.log(properties);
    
  },[properties])
  const edit = function ()
  {
    properties.edit(item);
  }
  const deleteAction = function ()
  {
    properties.delete(item.id);
  }
  return (
      <>
          <div className="list">
        {item?.name}
        <div className='users'>
                {
                users.map((item, index) => (
                    <span className='user'><span className='align-text-top'>{ item.first_name[0] }</span></span>
                  ))
                }
              </div>
              <div className='icon'>
                <i className="bi bi-eye-fill green"></i>
                <i className="bi bi-person-fill-add primary"></i>
                <i onClick={edit} className="bi bi-pen-fill primary"></i>
                <i onClick={deleteAction} className="bi bi-x-circle-fill red"></i>
            </div>
            
          </div>
    </>
  );
}

export default ListComponent;