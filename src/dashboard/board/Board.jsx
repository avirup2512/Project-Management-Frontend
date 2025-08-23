import { useCallback, useContext, useEffect, useRef, useState } from "react";
import BoardService from "../service/BoardService";
import { Button, Dropdown, Form, Modal, Tab, Tabs } from "react-bootstrap";
import ListComponent from "../../shared/List";
import debounce from "lodash.debounce";
import SearchBox from "../../shared/SerachBox";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { polyfill } from "../../helper/polyfill";
import {
  deleteBoardRedux,
  resetSelectedBoard,
  selectAllBoard,
  setArchiveBoard,
  setBoard,
  setBoardList,
  setTagAttachInBoardInStore,
  setTagColorInStore,
  setTagNameInStore,
} from "./BoardSlice";
import { setUserList } from "../userProfile/UserSlice";
import {
  setAllRoles,
  setBoardPaginationDefault,
  setBoardPaginationObject,
  setPage,
  setPaginateHappen,
} from "../DashboardSlice";
import "./Board.css";
import { motion } from "framer-motion";
import BoardTag from "../../shared/BoardTag";

function Board({ paginate }) {
  const hasMounted = useRef(false);
  const { projectId } = useParams();
  const userState = useSelector((state) => state.auth.user);
  const boardSelector = useSelector((state) => state.board);
  const selectedBoard = useSelector((state) => state.board.selectedBoard);
  const selectedBoardRef = useRef(selectedBoard);
  const projectSelector = useSelector((state) => state.project);
  const boardList = useSelector((state) => state.board.boardList);
  const allRoles = useSelector((e) => e.dashboard.allRoles);
  const projectList = useSelector((e) => e.project.projectList);
  const paginateHappen = useSelector((p) => p.dashboard.paginateHappen);
  const paginationObject = useSelector(
    (e) => e.dashboard.boardPaginationObject
  );
  const defaultPaginationObject = useSelector(
    (e) => e.dashboard.defaultPaginationObject
  );
  const [allChecked, setAllChecked] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("activeBoard");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let currentId = "";
  const [query, setQuery] = useState("");
  const boardService = new BoardService();
  const [isEmpty, setEmpty] = useState(true);
  const [showAddModal, setModalShow] = useState(false);
  const [boardName, setName] = useState("");
  const [isPublic, setPublic] = useState(true);
  const [users, setUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#bca7a7ff");
  const [tagAttachInBoard, setTagAttachInBoard] = useState(0);
  const [sameTag, setSameTag] = useState(false);
  const [selectedBoards, setSelectedBoards] = useState({
    name: "",
    id: "",
    users: [],
    isPublic: null,
  });
  const [boardListLocal, setBoardListLocal] = useState({});
  let selectedUser = [];
  const tagNameSet = useSelector((e) => e.board.tagNameSet);
  let selectedUserMap = new Map();
  let [multiSearchProperties, setSerachProperties] = useState({
    inputLabel: "Add User",
    selectedUser: [],
    result: [],
    roles: [],
    onSearch: function (e) {
      searchUser(e);
    },
    onItemSelect: function (i, property) {
      onUserSelect(i, property);
    },
    onItemRemove: function (id, property) {
      onUserRemoved(id, property);
    },
    onRoleUpdate: function (role, property, id) {
      onRoleUpdate(role, property, id);
    },
  });
  const [confirmationModalProp, setConfirmationProp] = useState({
    showModal: false,
    message: "",
    action: function (t) {
      onConfirm(t);
    },
    close: function () {
      closeModal();
    },
    selectedItem: {},
    type: "",
  });
  const [listProperties, setListProperties] = useState({
    users: [],
    edit: function () {
      editBoard();
    },
    delete: function (id) {
      deleteBoard(id, false);
    },
    archive: function (id) {
      archiveBoard(id, false);
    },
    archiveRestore: function (id) {
      archiveRestore(id, false);
    },
    open: function (id) {
      openBoard(id);
    },
  });
  useEffect(() => {
    dispatch(resetSelectedBoard({}));
  }, []);
  useEffect(() => {
    selectedBoardRef.current = selectedBoard;
  }, [selectedBoard]);
  useEffect(() => {
    dispatch(setPage("board"));
    dispatch(setBoardPaginationDefault(defaultPaginationObject));
    dispatch(setPaginateHappen(!paginateHappen));
    return () => {
      console.log("Component unmounted");
    };
  }, [projectId]);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true; // ✅ skip first run
      return;
    }
    if (activeTabKey == "activeBoard") {
      getBoard(projectId, 0);
    } else {
      getBoard(projectId, 1);
    }
    getRoles();
  }, [paginateHappen, activeTabKey]);
  useEffect(() => {
    console.log("Redux data updated:", boardList);
  }, [boardList]); // runs whenever myData changes
  const getBoard = async function (projectId, isActive) {
    const board = await boardService.getAllBoards(
      localStorage.getItem("token"),
      projectId,
      isActive,
      paginationObject.itemPerPage,
      paginationObject.currentOffset
    );
    if (board.status && board.status == 200) {
      dispatch(setBoardList(board.data));
      setBoardListLocal(board.data);
      const { itemPerPage } = paginationObject;
      const items = {
        items: Math.ceil(board?.totalCount / itemPerPage),
        totalCount: board?.totalCount,
      };
      dispatch(setBoardPaginationObject({ ...paginationObject, ...items }));
      setEmpty(false);
    }
  };
  const getRoles = async function () {
    const roles = await boardService.getAllRoles();
    if (roles.status && roles.status == 200) {
      setRoles(roles.data);
      dispatch(setAllRoles(roles.data));
      setSerachProperties((prevItem) => ({ ...prevItem, roles: roles.data }));
    }
  };
  const addBoard = async function () {
    let user = [];
    if (boardSelector.board.name) {
      if (!boardSelector.board.id) {
        if (boardSelector.board.user && boardSelector.board.user.length > 0) {
          boardSelector.board.user.forEach((e) => {
            if (!e.creator) user.push({ user_id: e.id, role: e.role_id });
          });
        }
        const board = await boardService.createBoard({
          projectId: projectId,
          name: boardSelector.board.name,
          isPublic: boardSelector.board.isPublic ? 1 : 0,
          users: user,
        });
        if (board.status && board.status == 200) {
          setModalShow(false);
          getBoard(projectId, 0);
        }
      } else {
        if (boardSelector.board.user && boardSelector.board.user.length > 0) {
          boardSelector.board.user.forEach((e) => {
            if (!e.creator) user.push({ user_id: e.id, role: e.role_id });
          });
        }
        const board = await boardService.editBoard({
          boardId: boardSelector.board.id,
          name: boardSelector.board.name,
          isPublic: boardSelector.board.isPublic ? 1 : 0,
          users: user,
        });
        if (board.status && board.status == 200) {
          setModalShow(false);
          getBoard(projectId, 0);
        } else {
          setModalShow(false);
          // getBoard(projectId);
        }
      }
    }
  };
  const deleteBoard = async function (id, t) {
    currentId = id;
    setConfirmationProp((prevItem) => ({
      ...prevItem,
      showModal: true,
      type: "delete",
      message: "Are you sure want to delete board?",
    }));
  };
  const archiveBoard = async function (id, t) {
    currentId = id;
    setConfirmationProp((prevItem) => ({
      ...prevItem,
      showModal: true,
      type: "archive",
      message: "Are you sure want to archive board?",
    }));
  };
  const archiveRestore = async function (id, t) {
    currentId = id;
    setConfirmationProp((prevItem) => ({
      ...prevItem,
      showModal: true,
      type: "archiveRestore",
      message: "Are you sure want to restore the board?",
    }));
  };
  const editBoard = async function () {
    setModalShow(true);
    setTagName("");
    setTagColor("#000000");
  };
  const fetchUsers = async (params) => {
    const user = await boardService.searchUser(params, projectId);
    if (user.status && user.status == 200) {
      setUser(user.data);
      dispatch(setUserList(user.data));
    }
  };
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 400), []);
  const searchUser = (e) => {
    const value = e.target.value;
    if (value == null)
      setSerachProperties((prevItem) => ({ ...prevItem, result: [] }));
    setQuery(value);
    if (value.length >= 2) {
      debouncedFetchUsers(value);
    } else {
      setSerachProperties((prevItem) => ({ ...prevItem, result: [] }));
    }
  };
  const onUserSelect = function (i, property) {
    // property.result[i].selected = !property.result[i].selected;
    // if(property.result[i].selected == true)
    // {
    //     property.result[i].role_id = property.result[i].role;
    //     property.selectedUser.push(property.result[i]);
    //     selectedUserMap.set(property.result[i].id, property.result[i]);
    //     property.onRoleUpdate(1, property, property.result[i].id);
    // } else {
    //     selectedUser = property.selectedUser.filter((e) => (e.id != property.result[i].id));
    //     selectedUserMap.delete(property.result[i].id);
    // }
    // setSerachProperties((prevItem) => ({ ...prevItem, property }));
  };
  const onUserRemoved = function (id, property) {
    property.result.forEach((e) => {
      if (e.id == id) e.selected = false;
    });
    property.selectedUser = property.selectedUser.filter((e) => e.id != id);
    selectedUserMap.delete(id);
    setSerachProperties({ ...property });
    setSelectedBoards((p) => ({ ...p, users: property.selectedUser }));
  };
  const onRoleUpdate = function (role, property, id) {
    property.selectedUser.forEach((e) => {
      if (e.id == id) e.role_id = role;
    });
    setSerachProperties({ ...property });
  };
  const closeModal = function () {
    currentId = "";
    setConfirmationProp((prevItem) => ({ ...prevItem, showModal: false }));
  };
  const onConfirm = async function (t) {
    if (t == "archive") {
      const seletedList = [];
      if (currentId) {
        seletedList.push(currentId);
      } else {
        for (var x in selectedBoardRef.current) {
          seletedList.push(x);
        }
      }
      const board = await boardService.archivedBoard({
        boardIds: seletedList,
        archive: 1,
        projectId,
      });
      if (board.status && board.status == 200) {
        dispatch(setArchiveBoard(seletedList));
        dispatch(resetSelectedBoard({}));
        setAllChecked(false);
        let total = 0;
        for (let x in board?.data?.total) {
          if (board?.data?.total[x]?.type == "active") {
            total = board?.data?.total[x]?.total;
          }
        }
        const { itemPerPage } = paginationObject;
        const items = {
          items: Math.ceil(total / itemPerPage),
          totalCount: total,
          currentOffset:
            itemPerPage *
            (Math.ceil(total / itemPerPage) == 0
              ? Math.ceil(total / itemPerPage)
              : Math.ceil(total / itemPerPage) - 1),
        };
        dispatch(setBoardPaginationObject({ ...paginationObject, ...items }));
        dispatch(setPaginateHappen(!paginateHappen));
      }
    } else if (t == "archiveRestore") {
      const seletedList = [];
      if (currentId) {
        seletedList.push(currentId);
      } else {
        for (var x in selectedBoardRef.current) {
          seletedList.push(x);
        }
      }
      const board = await boardService.archivedBoard({
        boardIds: seletedList,
        archive: 0,
        projectId,
      });
      if (board.status && board.status == 200) {
        dispatch(setArchiveBoard(seletedList));
        dispatch(resetSelectedBoard({}));
        setAllChecked(false);
        let total = 0;
        for (let x in board?.data?.total) {
          if (board?.data?.total[x]?.type == "archived") {
            total = board?.data?.total[x]?.total;
          }
        }
        const { itemPerPage } = paginationObject;
        const items = {
          items: Math.ceil(total / itemPerPage),
          totalCount: total,
          currentOffset:
            itemPerPage *
            (Math.ceil(total / itemPerPage) == 0
              ? Math.ceil(total / itemPerPage)
              : Math.ceil(total / itemPerPage) - 1),
        };
        dispatch(setBoardPaginationObject({ ...paginationObject, ...items }));
        dispatch(setPaginateHappen(!paginateHappen));
      }
    } else if (t == "delete") {
      const seletedList = [];
      if (currentId) {
        seletedList.push(currentId);
      } else {
        for (var x in selectedBoardRef.current) {
          seletedList.push(x);
        }
      }
      const deletedBoard = await boardService.deleteBoard(seletedList);
      if (deletedBoard.status && deletedBoard.status == 200) {
        dispatch(deleteBoardRedux(seletedList));
      }
      //   deleteBoard(currentId, true);
      //   dispatch(resetSelectedBoard({}));
      //   setAllChecked(false);
    }
  };
  const openBoard = function (id) {
    navigate("../list/" + projectId + "/" + id);
  };
  const addAllProjectMember = () => {
    const projectList = JSON.parse(JSON.stringify(projectSelector.projectList));
    const users = projectList[projectId].user;
    const updatedBoard = {
      ...boardSelector.board,
      user: users,
    };
    dispatch(setBoard(updatedBoard));
  };
  const selectBoard = (e) => {
    if (e.target.checked) {
      dispatch(selectAllBoard());
      setAllChecked(true);
    } else {
      dispatch(resetSelectedBoard({}));
      setAllChecked(false);
    }
  };
  const openAction = (e) => {
    setConfirmationProp((prevItem) => ({
      ...prevItem,
      showModal: true,
      type: e,
      message: `Are you sure want to ` + e + ` board?`,
    }));
  };
  const tabSelection = (k) => {
    const items = {
      currentOffset: 0,
    };
    dispatch(setBoardPaginationObject({ ...paginationObject, ...items }));
    dispatch(resetSelectedBoard({}));
    setActiveTabKey(k);
    setAllChecked(false);
    dispatch(setPaginateHappen(!paginateHappen));
  };
  const editTagName = (e) => {
    dispatch(setTagNameInStore(e));
  };
  const editTagColor = (e) => {
    dispatch(setTagColorInStore(e));
  };
  const editTagAttachinBoard = (e) => {
    dispatch(setTagAttachInBoardInStore(e));
  };
  const saveTag = async (e) => {
    const editedTag = await boardService.editBoardTag({
      tagId: e.id,
      boardId: boardSelector.board.id,
      name: e.name,
      color: e.tagColor,
      attachInBoard: e.attachInboard,
    });
    if (editedTag.status && editedTag.status == 200) {
      const baordCopy = {};
      for (var key in boardSelector.board) {
        baordCopy[key] = polyfill.deepCopy(boardSelector.board[key]);
      }
      baordCopy.tag[e.id] = {
        tagId: e.id,
        tagName: e.name,
        tagColor: e.tagColor,
        attachInboard: e.attachInboard,
      };
      const allBoardCopy = {};
      for (var x in boardSelector.boardList) {
        allBoardCopy[x] = polyfill.deepCopy(boardSelector.boardList[x]);
      }
      allBoardCopy[baordCopy.id] = baordCopy;
      dispatch(setBoard(baordCopy));
      dispatch(setBoardList(allBoardCopy));
    }
  };
  const addTag = async (e) => {
    setSameTag(false);
    e.preventDefault();
    if (tagNameSet.hasOwnProperty(tagName)) {
      setSameTag(true);
      return;
    }
    const addedTag = await boardService.addBoardTag({
      boardId: boardSelector.board.id,
      name: tagName,
      color: tagColor,
      attachInBoard: tagAttachInBoard,
    });
    if (addedTag.status && addedTag.status == 200) {
      const baordCopy = {};
      for (var key in boardSelector.board) {
        baordCopy[key] = polyfill.deepCopy(boardSelector.board[key]);
      }
      baordCopy.tag[addedTag.data.insertId] = {
        tagId: addedTag.data.insertId,
        tagName: tagName,
        tagColor: tagColor,
        attachInboard: tagAttachInBoard,
      };
      const allBoardCopy = {};
      for (var x in boardSelector.boardList) {
        allBoardCopy[x] = polyfill.deepCopy(boardSelector.boardList[x]);
      }
      allBoardCopy[baordCopy.id] = baordCopy;
      dispatch(setBoard(baordCopy));
      dispatch(setBoardList(allBoardCopy));
    }
  };
  const deleteBoardTag = async (e) => {
    const deletedTag = await boardService.deleteBoardTag(
      e,
      boardSelector.board.id
    );
    if (deletedTag.status && deletedTag.status == 200) {
      const baordCopy = {};
      for (var key in boardSelector.board) {
        baordCopy[key] = polyfill.deepCopy(boardSelector.board[key]);
      }
      delete baordCopy.tag[e];
      const allBoardCopy = {};
      for (var x in boardSelector.boardList) {
        allBoardCopy[x] = polyfill.deepCopy(boardSelector.boardList[x]);
      }
      allBoardCopy[baordCopy.id] = baordCopy;
      dispatch(setBoard(baordCopy));
      dispatch(setBoardList(allBoardCopy));
    }
  };
  return (
    <>
      <div className="header d-flex align-center justify-content-space-between">
        <h3 className="float-start">Boards</h3>
        <Form.Select
          className="select custom-select"
          onChange={(e) => {
            navigate("../board/" + e.target.value + "");
          }}
        >
          {Object.entries(projectList).map(([index, item]) => {
            return <option value={item.id}> {item.name}</option>;
          })}
        </Form.Select>
        <button
          className="btn btn-primary   button-primary btn-sm float-end"
          onClick={() => {
            dispatch(setBoard({ user: [] }));
            setModalShow(true);
          }}
        >
          Add Board
        </button>
      </div>
      <div className="clearfix"></div>
      <hr></hr>
      <Tabs
        id="list-container-tab"
        activeKey={activeTabKey}
        onSelect={(k) => tabSelection(k)}
      >
        <Tab eventKey="activeBoard" title="Active">
          {isEmpty ? (
            <>
              <p>No Board</p>
            </>
          ) : (
            <>
              {Object.keys(selectedBoard).length > 0 && (
                <motion.section className="actionMenu mb-3 p-2">
                  <Button
                    className="ms-0 button-primary"
                    onClick={() => {
                      openAction("archive");
                    }}
                    size="sm"
                  >
                    Archive
                  </Button>
                  <Button
                    className="ms-2 button-primary"
                    onClick={() => {
                      openAction("activate");
                    }}
                    size="sm"
                  >
                    Activate
                  </Button>
                  <Button
                    className="ms-2 button-primary"
                    onClick={() => {
                      openAction("deactivate");
                    }}
                    size="sm"
                  >
                    De Activate
                  </Button>
                </motion.section>
              )}
              <section className="tableHeader d-flex align-center d-none-medium">
                <section className="headerItem">
                  <Form.Group
                    className=""
                    onChange={selectBoard}
                    controlId="formBasicCheckbox"
                  >
                    <Form.Check type="checkbox" checked={allChecked} />
                  </Form.Group>
                </section>
                <section className="headerItem">Name</section>
                <section className="headerItem">Assignee</section>
                <section className="headerItem">Tags</section>
                <section className="headerItem">Card Stautus</section>
                <section className="headerItem">Created At</section>
                <section className="headerItem">Action</section>
              </section>
              <section className=" height-100 padding-bottom-50-percent">
                {Object.keys(boardList).length > 0 &&
                  Object.entries(boardList).map((item, index) => {
                    return (
                      <ListComponent
                        type="board"
                        isArchive={false}
                        key={index}
                        item={item[1]}
                        properties={listProperties}
                        users={item[1].user}
                        loggedInUser={userState}
                      />
                    );
                  })}
              </section>
            </>
          )}
        </Tab>
        <Tab eventKey="archivedBoard" title="Archived">
          {isEmpty ? (
            <>
              <p>No Board</p>
            </>
          ) : (
            <>
              {Object.keys(selectedBoard).length > 0 && (
                <motion.section className="actionMenu mb-3 p-2">
                  <Button
                    className="ms-0 button-primary"
                    onClick={() => {
                      openAction("delete");
                    }}
                    size="sm"
                  >
                    Delete
                  </Button>
                  <Button
                    className="ms-2 button-primary"
                    onClick={() => {
                      openAction("archiveRestore");
                    }}
                    size="sm"
                  >
                    Restore
                  </Button>
                </motion.section>
              )}
              <section className="tableHeader d-flex align-center">
                <section className="headerItem">
                  <Form.Group
                    className=""
                    onChange={selectBoard}
                    controlId="formBasicCheckbox"
                  >
                    <Form.Check type="checkbox" checked={allChecked} />
                  </Form.Group>
                </section>
                <section className="headerItem">Name</section>
                <section className="headerItem">Assignee</section>
                <section className="headerItem">Status</section>
                <section className="headerItem">Card Stautus</section>
                <section className="headerItem">Created At</section>
                <section className="headerItem">Action</section>
              </section>
              <section className=" height-100 padding-bottom-50-percent">
                {Object.keys(boardList).length > 0 &&
                  Object.entries(boardList).map((item, index) => {
                    return (
                      <ListComponent
                        type="board"
                        isArchive={true}
                        key={index}
                        item={item[1]}
                        properties={listProperties}
                        users={item[1].user}
                        loggedInUser={userState}
                      />
                    );
                  })}
              </section>
            </>
          )}
        </Tab>
      </Tabs>
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <Modal show={showAddModal} size="lg">
            <Modal.Header closeButton onClick={() => setModalShow(false)}>
              <Modal.Title>Add Board</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={addBoard}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="input"
                    value={boardSelector.board.name}
                    onChange={(e) =>
                      dispatch(
                        setBoard({
                          ...boardSelector.board,
                          name: e.target.value,
                        })
                      )
                    }
                    required
                  ></Form.Control>
                </Form.Group>
                <SearchBox
                  properties={multiSearchProperties}
                  addAllProjectMember={addAllProjectMember}
                  type="board"
                ></SearchBox>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    onChange={(e) => setPublic(e.target.value)}
                    type="checkbox"
                    label="is Public"
                  />
                </Form.Group>
              </Form>
              <section>
                <h5>Tag</h5>
                <hr></hr>
                <section className="addTag">
                  <Form className="d-flex align-items-center" onSubmit={addTag}>
                    <Form.Group
                      controlId="formSearch"
                      className="me-2 width100"
                    >
                      <Form.Control
                        type="text"
                        value={tagName}
                        onChange={(e) => {
                          setSameTag(false);
                          setTagName(e.target.value);
                        }}
                        placeholder="Enter Tag name"
                        isInvalid={sameTag == true}
                      />
                      <Form.Control.Feedback type="invalid">
                        Tag already exists.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formSearch" className="me-2">
                      <Form.Control
                        type="color"
                        value={tagColor}
                        onChange={(e) => {
                          setTagColor(e.target.value);
                        }}
                        placeholder="Tag"
                      />
                    </Form.Group>
                    <Form.Group controlId="formSearch" className="me-2">
                      <Form.Check
                        onChange={(e) =>
                          setTagAttachInBoard(e.target.checked ? 1 : 0)
                        }
                        type="checkbox"
                        label="Attach in Board"
                      />
                    </Form.Group>
                    <Button
                      className="btn-primary mt-2 btn-sm"
                      type="submit"
                      variant="primary"
                    >
                      Add
                    </Button>
                  </Form>
                </section>
                <hr></hr>
                {Object.entries(boardSelector.board.tag).map((e) => {
                  return (
                    <BoardTag
                      tag={e[1]}
                      editTagName={editTagName}
                      editTagColor={editTagColor}
                      editTagAttachinBoard={editTagAttachinBoard}
                      saveTag={saveTag}
                      deleteBoardTag={deleteBoardTag}
                    ></BoardTag>
                  );
                })}
              </section>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={() => setModalShow(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => addBoard()}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
      <ConfirmationModal properties={confirmationModalProp}></ConfirmationModal>
    </>
  );
}

export default Board;
