import React, { useEffect, useState, useReducer } from "react";
import AdminLayout from "../../../hoc/adminLayout/adminLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Button,
  ButtonToolbar,
  InputGroup,
  FormControl,
  ButtonGroup,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  getPaginateArticles,
  changeStatusArticle,
  removeArticle,
} from "../../../store/actions/articleActions/articleActions";
import PaginationComponent from "./paginate/paginate";
import Loader from "../../../utils/loader/loader";
import SearchIcon from "@material-ui/icons/Search";

const Articles = (props) => {
  const articles = useSelector((state) => state.articles);
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const [removeAlert, setRemoveAlert] = useState(false);
  const [toRemove, setToRemove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchValues, setSearchValues] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { value: "", memory: "" }
  );
  let limit = 5;

  let arts = articles.adminArticles;

  const editArtsAction = (id) => {
    props.history.push(`/dashboard/articles/edit/${id}`);
  };

  const handleClose = () => setRemoveAlert(false);

  const handleShow = (id = null) => {
    setToRemove(id);
    setRemoveAlert(true);
  };

  const handleDelete = () => {
    dispatch(removeArticle(toRemove));
  };

  const handleStatusChange = (status, _id) => {
    let newStatus = status === "draft" ? "public" : "draft";
    dispatch(changeStatusArticle(newStatus, _id));
  };

  const goToPrevPage = (page) => {
    dispatch(getPaginateArticles(page, limit, searchValues.memory));
  };

  const goToNextPage = (page) => {
    dispatch(getPaginateArticles(page, limit, searchValues.memory));
  };

  const triggerSearch = (e) => {
    e.preventDefault();
    if (searchValues.value !== "") {
      setSearchValues({ memory: searchValues.value });
    }
  };

  const resetSearch = () => {
    setSearchValues({ memory: "", value: "" });
    dispatch(getPaginateArticles());
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getPaginateArticles(1, limit, searchValues.memory));
  }, [dispatch, searchValues.memory, limit]);

  useEffect(() => {
    setLoading(false);
  }, [articles]);

  useEffect(() => {
    handleClose();
    if (notifications && notifications.removeArticle) {
      dispatch(getPaginateArticles(arts.page, limit, searchValues.memory));
    }
  }, [dispatch, notifications, arts, limit, searchValues.memory]);

  useEffect(() => {
    dispatch(getPaginateArticles());
  }, [dispatch]);

  return (
    <AdminLayout section="Articles">
      <div className="articles_table">
        <ButtonToolbar className="mb-3">
          <ButtonGroup style={{ marginRight: "10px" }}>
            <LinkContainer to="/dashboard/articles/add">
              <Button variant="secondary">Add Article</Button>
            </LinkContainer>
          </ButtonGroup>

          <form onSubmit={triggerSearch}>
            <InputGroup>
              <InputGroup>
                <InputGroup.Text id="btnGroupAddon2">
                  <SearchIcon />
                </InputGroup.Text>
              </InputGroup>
              <FormControl
                type="text"
                placeholder="Search Articles"
                value={searchValues.value}
                onChange={(e) => setSearchValues({ value: e.target.value })}
              />
            </InputGroup>
          </form>
        </ButtonToolbar>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div>
              {searchValues.memory !== "" ? (
                <p>
                  Your search for <b>"{searchValues.memory}"</b> got
                  <b>{articles.adminArticles.totalDocs}</b> articles. &nbsp;
                  <span
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => resetSearch()}
                  >
                    RESET SEARCH
                  </span>
                </p>
              ) : null}
            </div>
            <PaginationComponent
              arts={arts}
              prev={(page) => goToPrevPage(page)}
              next={(page) => goToNextPage(page)}
              handleShow={(id) => handleShow(id)}
              handleStatusChange={(status, id) =>
                handleStatusChange(status, id)
              }
              editArtsAction={(id) => editArtsAction(id)}
            />
          </>
        )}

        <Modal show={removeAlert} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            If you remove the article there is no way of recovering
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Oops, close this
            </Button>
            <Button variant="danger" onClick={() => handleDelete()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Articles;
