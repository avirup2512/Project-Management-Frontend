import { Button, Modal } from "react-bootstrap";

function ConfirmationModal({ properties,onConfirm }) {
    const closeModal = function ()
    {
        properties.close();
        console.log(properties);
        
    }
    const action = function (value)
    {
        onConfirm();
        closeModal();
    }
  return (
      <>
        {properties.showModal &&
            <div className="modal show d-block" tabIndex="-1">
                <Modal show={properties.showModal} size="sm">
                    <Modal.Header closeButton onClick={() => closeModal()}>
                    <Modal.Title>Add Board</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                            {properties.message}
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="danger" onClick={() => closeModal(false)}>Close</Button>
                    <Button variant="primary" onClick={() => action(true)}>Yes</Button>
                    </Modal.Footer>
                </Modal>
            </div>}
    </>
  );
}

export default ConfirmationModal;