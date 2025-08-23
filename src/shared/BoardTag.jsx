import { Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { useSelector } from "react-redux";

function BoardTag({
  tag,
  editTagName,
  editTagColor,
  editTagAttachinBoard,
  saveTag,
  deleteBoardTag,
}) {
  useEffect(() => {
    console.log(tag);

    if (saveTagFlag) {
      saveTag({
        id: tag.tagId,
        tagColor: tag.tagColor,
        name: tag.tagName,
        attachInboard: tag.attachInboard,
      });
      setSaveTag(false);
    } else {
      console.log(tag);
      setTagColor(tag.tagColor.trim());
      setTagName(tag.tagName);
      setTagAttachInBoard(tag.attachInboard);
    }
  }, [tag]);
  const [editMode, setEditMode] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(tag?.tagColor);
  const [tagAttachInBoard, setTagAttachInBoard] = useState(0);
  const [saveTagFlag, setSaveTag] = useState(false);
  const tagNameSet = useSelector((e) => e.board.tagNameSet);
  const tagColorSet = useSelector((e) => e.board.tagColorSet);

  const getListStyle = (color) => ({
    background: color,
    width: "100px",
    height: "20px",
  });
  const save = (e) => {
    if (
      !tagNameSet.hasOwnProperty(tagName) ||
      (tagNameSet.hasOwnProperty(tagName) &&
        tagNameSet[tagName].color !== tagColor) ||
      (tagNameSet.hasOwnProperty(tagName) &&
        tagNameSet[tagName].color == tagColor &&
        tagNameSet[tagName].attachInBoard !== tagAttachInBoard)
    ) {
      console.log(tag);

      editTagName({ id: tag.tagId, tagName });
      editTagColor({ id: tag.tagId, tagColor: tagColor.trim() });
      editTagAttachinBoard({ id: tag.tagId, attachInboard: tagAttachInBoard });
      setSaveTag(true);
      setEditMode(false);
    }
  };
  const deleteTag = () => {
    deleteBoardTag(tag.tagId);
  };
  return (
    <>
      <section className="d-flex align-content-center justify-content-space-between p-2 b1">
        {!editMode && (
          <>
            <span style={{ wordBreak: "break-all", width: "100px" }}>
              {tag?.tagName}
            </span>
            <span className="color" style={getListStyle(tag?.tagColor)}></span>
            <span>{tag?.attachInboard}</span>
            <section>
              <Edit
                size={16}
                onClick={() => {
                  setEditMode(true);
                }}
                className="cursor-pointer me-2"
              />
              <Trash
                size={16}
                onClick={deleteTag}
                className="cursor-pointer ml-2"
              />
            </section>
          </>
        )}
        {editMode && (
          <>
            <Form className="d-flex align-items-center justify-content-space-between">
              <Form.Group controlId="formSearch" className="me-2 width100">
                <Form.Control
                  type="text"
                  value={tagName}
                  placeholder="Search"
                  onChange={(e) => {
                    setTagName(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formSearch" className="me-2">
                <Form.Control
                  type="color"
                  value={tagColor}
                  onChange={(e) => {
                    setTagColor(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formSearch" className="me-2">
                <Form.Check
                  onChange={(e) =>
                    setTagAttachInBoard(e.target.checked ? 1 : 0)
                  }
                  type="checkbox"
                  label="Attach in Board"
                  checked={tagAttachInBoard}
                />
              </Form.Group>
            </Form>
            <section>
              <Button
                className="btn-primary ml-2 btn btn-primary btn-sm"
                type="submit"
                variant="primary"
                onClick={save}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setTagName(tag?.tagName);
                  setTagColor(tag?.tagColor);
                  setEditMode(false);
                }}
                className="btn-primary ms-2 btn btn-primary btn-sm btn-danger"
                type="submit"
                variant="primary"
              >
                Cancel
              </Button>
            </section>
          </>
        )}
      </section>
    </>
  );
}

export default BoardTag;
