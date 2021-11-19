import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  registerUser,
  signInUser,
} from "../../store/actions/user_actions/user_actions";
import PreventAuthRoute from "../../hoc/preventAuthRoute/preventAuthRoute";

const Auth = (props) => {
  const [register, setRegister] = useState(false);
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Sorry, Email is required!")
        .email("Please enter a valid Email"),
      password: Yup.string().required("Sorry, Password is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (values) => {
    if (register) {
      dispatch(registerUser(values));
    } else {
      dispatch(signInUser(values));
    }
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
      props.history.push("/dashboard");
    }
  }, [notifications, props]);

  return (
    <PreventAuthRoute>
      <div className="auth_container">
        <h1>Authenticate</h1>
        <form className="mt-3" onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <TextField
              className="mt-3"
              style={{ width: "100%" }}
              name="email"
              label="Enter your email"
              type="email"
              variant="outlined"
              {...formik.getFieldProps("email")}
              {...errorHelper(formik, "email")}
            />
          </div>

          <div className="form-group">
            <TextField
              className="mt-3"
              style={{ width: "100%" }}
              name="password"
              label="Enter your password"
              type="password"
              variant="outlined"
              {...formik.getFieldProps("password")}
              {...errorHelper(formik, "password")}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            style={{ marginTop: "3px" }}
          >
            {register ? "Register" : "Login"}
          </Button>
          <Button
            className="mt-3"
            variant="outlined"
            color="secondary"
            size="small"
            style={{ marginTop: "3px" }}
            onClick={() => {
              setRegister(!register);
            }}
          >
            Want to {!register ? "Register" : "Login"} ?
          </Button>
        </form>
      </div>
    </PreventAuthRoute>
  );
};

export default Auth;
