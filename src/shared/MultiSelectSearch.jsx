import Alert from 'react-bootstrap/Alert';
import "./List.css";
import { Form } from 'react-bootstrap';
import "./MultiSelectSearch.css";
import { useState } from 'react';
function MultiSelectSearch({ properties }) {
    const [isOpen, toggleShow] = useState(false);
    const search = function (e)
    {        
        properties.onSearch(e);
    }
    const onItemSelect = function (i)
    {
        properties.onItemSelect(i,properties);
    }
    const onItemRemove = function (id)
    {
        properties.onItemRemove(id,properties);
    }
    const getUserInfo = function (e)
    {
        return e.first_name.length > 4 ? e.first_name : e.first_name;    
    }
    return (
    <>
        <div className='parentWrapper position-relative'>
        <label>{properties.inputLabel }</label>
                <div className='selector'>
                    <div className='users'>
                        {properties.selectedUser.map((e,index) => e.selected ? (
                            <p className='user' key={index}  title={e.email}>{getUserInfo(e)}
                                <span onClick={onItemRemove.bind(null, e.id)} className='float-end remove'>
                                    <i className="bi bi-x"></i>
                                </span>
                            </p>
                        ):"")}
                    </div>
                <span className='arrow' onClick={() => toggleShow(!isOpen)}>{!isOpen && <i className="bi bi-caret-down-fill"></i>}{isOpen && <i className="bi bi-caret-up-fill"></i> }</span>
        </div>
        { isOpen &&
            <div className='input'>
                <Form.Group className='p-2'>
                    <Form.Control type="input" onChange={search}></Form.Control>
                </Form.Group>
                <div className='result'>
                    {
                        properties.result.map((item, index) => {                          
                            return <p className={`${item.selected ? "disabled" : ""} ${true ? "item" : ""}`} onClick={onItemSelect.bind(null, index)} key={index}>
                                <span className='float-start'>{item.email}</span>
                                {item.selected && <span className='float-end'><i className="bi bi-x"></i></span>}
                                <span className='clearfix'></span>
                            </p>
                        })
                    }
                    {
                                properties.result.length == 0 && 
                                <p className='m-0 p-3 text-center'>Type user name or email</p>
                    }
                </div>
            </div>
        }
    </div>
    </>
);
}

export default MultiSelectSearch;