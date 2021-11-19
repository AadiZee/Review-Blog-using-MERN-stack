import React from "react";
import AdminLayout from "../../../hoc/adminLayout/adminLayout";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const TestUpload = () => {
  const formik = useFormik({
    initialValues: { file: "" },
    validationSchema: Yup.object({
      file: Yup.mixed().required("A file is required in order to upload!"),
    }),
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append("file", values.file);

      //axios request (multer)
      //   axios
      //     .post("/api/files/multerupload", formData, {
      //       header: { "content-type": "multipart/form-data" },
      //     })
      //     .then((response) => {
      //       console.log(response);
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });

      //axios request cloudinary
      axios
        .post("/api/files/testupload", formData, {
          header: { "content-type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  const errorHelper = (formik, values) => ({
    error: formik.errors[values] && formik.touched[values] ? true : false,
    helperText:
      formik.errors[values] && formik.touched[values]
        ? formik.errors[values]
        : null,
  });

  return (
    <AdminLayout section="Test Upload">
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Control
            style={{ width: "50%" }}
            type="file"
            id="file"
            name="file"
            label="Example File"
            onChange={(event) => {
              formik.setFieldValue("file", event.target.files[0]);
            }}
          />
          {formik.errors.file && formik.touched.file ? <>Error</> : null}
        </Form.Group>
        <Button variant="primary" type="Submit" className="mt-2">
          Upload
        </Button>
      </Form>
    </AdminLayout>
  );
};

export default TestUpload;
