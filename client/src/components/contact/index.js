import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import Loader from "../../utils/loader/loader";
import { contactUs } from "../../store/actions/user_actions/user_actions";

const Contact = () => {
  const [loading, setLoading] = useState(null);
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { email: "", firstname: "", lastname: "", message: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required!")
        .email("This is not a valid email"),
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      message: Yup.string()
        .required("Message is required")
        .max(500, "Message too long"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      dispatch(contactUs(values));
    },
  });

  useEffect(() => {
    if (notifications && notifications.success) {
      formik.resetForm();
      setLoading(false);
    }
  }, [notifications]);

  const errorHelper = (formik, values) => ({
    error: formik.errors[values] && formik.touched[values] ? true : false,
    helperText:
      formik.errors[values] && formik.touched[values]
        ? formik.errors[values]
        : null,
  });

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1>Contact Us</h1>
          <form className="mt-3" onSubmit={formik.handleSubmit}>
            <div className="form-group mt-3">
              <TextField
                style={{ width: "100%" }}
                name="email"
                label="Enter your email"
                variant="outlined"
                {...formik.getFieldProps("email")}
                {...errorHelper(formik, "email")}
              />
            </div>

            <div className="form-group mt-3">
              <TextField
                style={{ width: "100%" }}
                name="firstname"
                label="Enter your first name"
                variant="outlined"
                {...formik.getFieldProps("firstname")}
                {...errorHelper(formik, "firstname")}
              />
            </div>

            <div className="form-group mt-3">
              <TextField
                style={{ width: "100%" }}
                name="lastname"
                label="Enter your last name"
                variant="outlined"
                {...formik.getFieldProps("lastname")}
                {...errorHelper(formik, "lastname")}
              />
            </div>

            <div className="form-group mt-3">
              <TextField
                style={{ width: "100%" }}
                name="message"
                label="Add your message here"
                variant="outlined"
                multiline
                rows={5}
                {...formik.getFieldProps("message")}
                {...errorHelper(formik, "message")}
              />
            </div>

            <Button
              className="mt-3"
              variant="contained"
              color="primary"
              type="submit"
            >
              Send us a message
            </Button>
          </form>
        </>
      )}
    </>
  );
};

export default Contact;
