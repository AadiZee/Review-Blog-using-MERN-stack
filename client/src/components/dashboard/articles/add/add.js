import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../../../hoc/adminLayout/adminLayout";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  addArticle,
  getCategories,
} from "../../../../store/actions/articleActions/articleActions";
import { validation, formValues } from "../validationSchema/validationSchema";
import WYSIWYG from "../../../../utils/forms/wysiwyg/wysiwyg";
import Loader from "../../../../utils/loader/loader";

import {
  TextField,
  Button,
  Divider,
  Chip,
  Paper,
  InputBase,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const AddArticle = (props) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const { categories } = useSelector((state) => state.articles);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorBlur, setEditorBlur] = useState(false);

  const actorsValue = useRef("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formValues,
    validationSchema: validation,
    onSubmit: (values, { resetForm }) => {
      setIsSubmitting(true);
      dispatch(addArticle(values));
    },
  });

  const handleEditorState = (state) => {
    formik.setFieldValue("content", state, true);
  };

  const handleEditorBlur = (blur) => {
    setEditorBlur(true);
  };

  const errorHelper = (formik, values) => ({
    error: formik.errors[values] && formik.touched[values] ? true : false,
    helperText:
      formik.errors[values] && formik.touched[values]
        ? formik.errors[values]
        : null,
  });

  useEffect(() => {
    if (notifications && notifications.success) {
      props.history.push("/dashboard/articles");
    }
    if (notifications && notifications.error) {
      setIsSubmitting(false);
    }
  }, [notifications, props.history]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <AdminLayout section="Add article">
      {isSubmitting ? (
        <Loader />
      ) : (
        <form className="mt-3 article_form" onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <TextField
              style={{ width: "100%" }}
              name="title"
              label="Enter a title"
              variant="outlined"
              {...formik.getFieldProps("title")}
              {...errorHelper(formik, "title")}
            />
          </div>

          <div className="form-group mb-3 mt-3">
            <WYSIWYG
              setEditorState={(state) => handleEditorState(state)}
              setEditorBlur={(blur) => handleEditorBlur(blur)}
            />

            {formik.errors.content && editorBlur ? (
              <FormHelperText error={true}>
                {formik.errors.content}
              </FormHelperText>
            ) : null}

            <TextField
              type="hidden"
              name="content"
              {...formik.getFieldProps("content")}
            />
          </div>

          <div className="form-group">
            <TextField
              style={{ width: "100%" }}
              name="excerpt"
              label="Enter an excerpt"
              variant="outlined"
              {...formik.getFieldProps("excerpt")}
              {...errorHelper(formik, "excerpt")}
              multiline
              rows={4}
            />
          </div>

          <Divider className="mt-3 mb-3" />
          <h5>Movie data and score</h5>
          <div className="form-group">
            <TextField
              style={{ width: "100%" }}
              name="score"
              label="Enter a score"
              variant="outlined"
              {...formik.getFieldProps("score")}
              {...errorHelper(formik, "score")}
            />
          </div>

          <FormikProvider value={formik}>
            <h6 className="mt-2">Add Actors(Min. 2):</h6>
            <FieldArray
              name="actors"
              render={(arrayhelpers) => (
                <div>
                  <Paper className="actors_form mb-3">
                    <InputBase
                      inputRef={actorsValue}
                      className="input"
                      placeholder="Actor name here"
                    />
                    <IconButton
                      onClick={() => {
                        arrayhelpers.push(actorsValue.current.value);
                        actorsValue.current.value = "";
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Paper>

                  {formik.errors.actors && formik.touched.actors ? (
                    <FormHelperText error={true}>
                      {formik.errors.actors}
                    </FormHelperText>
                  ) : null}

                  <div className="chip_container">
                    {formik.values.actors.map((actor, index) => (
                      <div key={index}>
                        <Chip
                          label={`${actor}`}
                          color="primary"
                          onDelete={() => {
                            arrayhelpers.remove(index);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
          </FormikProvider>

          <div className="form-group">
            <TextField
              style={{ width: "100%" }}
              name="director"
              label="Enter a director"
              variant="outlined"
              {...formik.getFieldProps("director")}
              {...errorHelper(formik, "director")}
            />
          </div>

          <FormControl variant="outlined">
            <h5>Select a category</h5>
            <Select
              name="category"
              {...formik.getFieldProps("category")}
              error={
                formik.errors.category && formik.touched.category ? true : false
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories
                ? categories.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))
                : null}
            </Select>
            {formik.errors.category && formik.touched.category ? (
              <FormHelperText error={true}>
                {formik.errors.category}
              </FormHelperText>
            ) : null}
          </FormControl>

          <Divider className="mt-3 mb-2" />

          <FormControl variant="outlined">
            <h5>Select a status</h5>
            <Select
              name="status"
              {...formik.getFieldProps("status")}
              error={
                formik.errors.status && formik.touched.status ? true : false
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="public">Public</MenuItem>
            </Select>
            {formik.errors.status && formik.touched.status ? (
              <FormHelperText error={true}>
                {formik.errors.status}
              </FormHelperText>
            ) : null}
          </FormControl>

          <Divider className="mt-3 mb-3" />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            // disabled={false}
          >
            Add article
          </Button>
        </form>
      )}
    </AdminLayout>
  );
};

export default AddArticle;
