import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "./AddTagForm.css";
import CardTag from "./CardTag";
import { useSelector } from "react-redux";
import { polyfill } from "../helper/polyfill";

function AddTagForm({ showModal, close, allTag, deleteTag, addTag }) {
  const currentCard = useSelector((s) => s.card.card);
  const tagNameSet = useSelector((e) => e.board.tagNameSet);
  const [filterTag, setFilterTag] = useState([]);
  const [currentSerachedTag, setCurrentSerachedTag] = useState("");
  const [currentSerachedTagColor, setCurrentSerachedTagColor] =
    useState("#000000");
  useEffect(() => {
    console.log(allTag);

    setFilterTag(allTag);
  }, [allTag]);
  useEffect(() => {
    console.log(currentCard);
  }, [currentCard]);
  const closeModal = function () {
    close();
  };
  const editTagName = () => {};
  const editTagColor = () => {};
  const editTagAttachinBoard = () => {};
  const saveTag = () => {};
  const searchTag = (e) => {
    console.log(e.target.value);

    setCurrentSerachedTag(e.target.value);
    if (!e.target.value) {
      setFilterTag(allTag);
      return;
    }
    const tag = [];
    allTag.forEach((t) => {
      console.log(t);

      if (t.name == e.target.value) {
        tag.push(t);
      }
    });
    console.log(e.target.value);
    setFilterTag(tag);
  };
  const tagAdd = () => {
    if (
      !tagNameSet.hasOwnProperty(currentSerachedTag) ||
      (tagNameSet.hasOwnProperty(currentSerachedTag) &&
        tagNameSet[currentSerachedTag].color !== currentSerachedTagColor)
    ) {
      addTag({ name: currentSerachedTag, color: currentSerachedTagColor });
      setCurrentSerachedTag("");
    }
    console.log(currentSerachedTag);
  };
  const tagDelete = (id) => {
    deleteTag(id);
  };
  const addExistingTagInBoard = (t) => {
    console.log(t);
    addTag({ name: t.name, color: t.color, boardTagId: t.id });
  };
  const getListStyle = (color) => {
    const lightColor = polyfill.isColorLight(color || "");
    const fontColor = lightColor ? "#000000" : "#ffffff";
    return {
      background: color,
      color: fontColor,
    };
  };
  return (
    <>
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <Modal show={showModal} size="md">
            <Modal.Header closeButton onClick={() => closeModal()}>
              <Modal.Title>Add Tags</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="parentWrapper position-relative">
                <label>Tags</label>
                <hr className="mt-1"></hr>
                <>
                  <section className="addTag">
                    <Form className="d-flex align-items-center ">
                      <Form.Group
                        controlId="formSearch"
                        className="me-2 width100"
                        value={currentSerachedTag}
                      >
                        <Form.Control
                          type="text"
                          placeholder="Search/Add Tag"
                          onChange={searchTag}
                        />
                      </Form.Group>
                      {filterTag.length == 0 && (
                        <Form.Group controlId="formSearch" className="me-2">
                          <Form.Control
                            type="color"
                            value={currentSerachedTagColor}
                            onChange={(e) => {
                              setCurrentSerachedTagColor(e.target.value);
                            }}
                          />
                        </Form.Group>
                      )}
                    </Form>
                    {filterTag.length == 0 && (
                      <Button
                        className="btn-primary mt-2"
                        type="submit"
                        variant="primary"
                        onClick={tagAdd}
                      >
                        Add Tag
                      </Button>
                    )}
                  </section>
                  <section className="cardTag">
                    {currentCard.hasOwnProperty("tags") &&
                      Object.keys(currentCard.tags).length > 0 &&
                      Object.entries(currentCard.tags).map((e, i) => {
                        return (
                          <>
                            <span
                              key={i}
                              className="tagItem"
                              style={getListStyle(e[1]?.color)}
                            >
                              {e[1].tagName}
                              <i
                                onClick={() => {
                                  tagDelete(e[1]);
                                }}
                                className="ms-4 cursor-pointer bi bi-x-circle"
                              ></i>
                            </span>
                          </>
                        );
                      })}
                  </section>
                  <section className="boardTag">
                    {filterTag.length > 0 &&
                      filterTag.map((e, i) => {
                        if (!currentCard.tags.hasOwnProperty(e.id))
                          return (
                            <CardTag
                              tag={e}
                              editTagName={editTagName}
                              editTagColor={editTagColor}
                              editTagAttachinBoard={editTagAttachinBoard}
                              saveTag={saveTag}
                              readOnly={true}
                              saveBoardTaginCard={addExistingTagInBoard}
                            ></CardTag>
                          );
                      })}
                  </section>
                </>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={() => closeModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => saveAction(true)}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default AddTagForm;
