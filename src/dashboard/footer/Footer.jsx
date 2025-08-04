// Sidebar.js
import { useSelector } from "react-redux";
import "./Footer.css"; // Optional custom styles
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Form, Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBoardPaginationObject, setPaginateHappen, setProjectPaginationObject } from "../DashboardSlice";

export default function Footer() {
  const navigate = useNavigate();
  const [pagePerItemSelect, setPagePerItemSelect] = useState([5, 10,50, 100]);
  const paginateHappen = useSelector((p) => p.dashboard.paginateHappen);
  const projectPaginationObject = useSelector((e) => e.dashboard.projectPaginationObject);
  const boardPaginationObject = useSelector((e) => e.dashboard.boardPaginationObject);
  const page = useSelector((e) => e.dashboard.page);
  const dispatch = useDispatch();
  const paginate = (e) => {
    switch (page) {
      case "project":
          dispatch(setProjectPaginationObject({...projectPaginationObject, currentOffset:e*projectPaginationObject.itemPerPage}))
        break;
      case "board":
          dispatch(setBoardPaginationObject({...boardPaginationObject, currentOffset:e*boardPaginationObject.itemPerPage}))
        break;
      default:
        break;
    }
    dispatch(setPaginateHappen(!paginateHappen));
  }
  const chnagePagePerItem = (e) => {
    switch (page) {
      case "project":
          dispatch(setProjectPaginationObject({...projectPaginationObject, currentOffset:0, itemPerPage:e.target.value}))
        break;
      case "board":
          dispatch(setBoardPaginationObject({...boardPaginationObject, currentOffset:0, itemPerPage:e.target.value}))
        break;
      default:
        break;
    }
    dispatch(setPaginateHappen(!paginateHappen));
  }
  const renderPagination = (page) => {
    switch (page) {
      case "project":
        return <Pagination>
            {
              projectPaginationObject.items && Array.from({length:projectPaginationObject.items}).map((e,i) => 
              {
                return <Pagination.Item size="sm" onClick={()=>{paginate(i)}}> {i+1} </Pagination.Item>
              }
              )
              }
        </Pagination>
      case "board":
        return <Pagination>
            {
              boardPaginationObject.items && Array.from({length:boardPaginationObject.items}).map((e,i) => 
              {
                return <Pagination.Item size="sm" onClick={()=>{paginate(i)}}> {i+1} </Pagination.Item>
              }
              )
              }
          </Pagination>
      default:
        break;
    }
  }
    return (
        <footer>
            <section className="d-flex justify-content-space-between align-center">
              <Button onClick={() => navigate(-1)} size="sm">Back</Button>
          <div className="pagination ml-auto">
                <Form.Select className="select" onChange={chnagePagePerItem}>
                    {
                        Object.entries(pagePerItemSelect).map(([index, item]) => {
                            return <option value={item}> {item}</option>
                        })
                    }
                </Form.Select>
                {
                    renderPagination(page)
                }
              </div>
            </section>
        </footer>
  );
}
