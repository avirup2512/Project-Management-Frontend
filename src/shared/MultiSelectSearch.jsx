import Alert from 'react-bootstrap/Alert';
import "./List.css";
import { Button, Form, Modal } from 'react-bootstrap';
import "./MultiSelectSearch.css";
import { useEffect, useState } from 'react';
import Select from 'react-select'
function MultiSelectSearch({ properties, item }) {
    const [selectedItem, setSelectedItem] = useState([]);
    useEffect((e) => {
        console.log(e);
        
    },[item])
    const closeModal = function ()
    {
        properties.close();  
    }
    const saveAction = function ()
    {
        properties.onSubmit(selectedItem);
    }
    const listSelect = (e) => {
        console.log(e);
        setSelectedItem(e);
    }
    return (
    <>
             <div className="modal show d-block" tabIndex="-1">
                <Modal show={true} size={'md'}>
                    <Modal.Header closeButton onClick={() => closeModal()}>
                        <Modal.Title>Select Destination Lists</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Select
                        onChange={listSelect}
                        isMulti
                        name="List"
                        options={item}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="danger" onClick={() => closeModal(false)}>Close</Button>
                    <Button variant="primary" onClick={() => saveAction(true)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </div>
    </>
);
}

export default MultiSelectSearch;