import React, { useRef } from "react";
import * as Yup from "yup";
import "./auth.css";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { registerUser } from "../../api/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

// it must start with a lower case letter then be followed by 3-23 letters/digits/-/_/.
const USER_REGEX = /^[A-z][A-z0-9-_.]{3,23}$/;
// 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Required")
    .matches(
      USER_REGEX,
      "4 to 24 characters. Must begin with a letter.  Letters, numbers, underscores, hyphens, dots allowed."
    ),
  email: Yup.string().email("Email is not valid").required("Email is required"),
  password: Yup.string()
    .required("Required")
    .matches(
      PWD_REGEX,
      "8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: !@#$%"
    ),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

const initialRegisterValues = { username: "", email: "", password: "", confirmPassword: "" };

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  const { token } = useAuth();

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
    // Submit form
    try {
      await registerUser(values);
      setSubmitting(false);
      resetForm();
      navigate(from.pathname);
    } catch (err: any) {
      if (!err.response) {
        alert("No Server Response");
      } else if (err.response?.status === 409) {
        alert("Username Taken");
      } else {
        alert("Registration Failed");
      }
      setSubmitting(false);
    }
  };

  if (token) return <div>You are already logged in!</div>;

  return (
    <div className="register-body">
      <div className="home-button-container-register">
        <Link to="/" className="home-button">
          {"< Home"}
        </Link>
      </div>
      <div className="register-left-panel">
        <img src="desk-sitting-person.png" style={{ height: "100%", width: "100%" }} />
      </div>
      <div className="register-right-panel">
        <Formik initialValues={initialRegisterValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
          {({ isSubmitting, isValid }) => (
            <Form className="auth-form">
              <h1>Create an account</h1>
              <section>
                <label htmlFor="username">Email:</label>
                <Field name="email" type="text" />
                <ErrorMessage name="email" component="div" className="error-text" />
              </section>

              <section>
                <label htmlFor="username">Username:</label>
                <Field name="username" type="text" />
                <ErrorMessage name="username" component="div" className="error-text" />
              </section>

              <section>
                <label htmlFor="password">Password:</label>
                <Field name="password" type="password" />
                <ErrorMessage name="password" component="div" className="error-text" />
              </section>

              <section>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <Field name="confirmPassword" type="password" />
                <ErrorMessage name="confirmPassword" component="div" className="error-text" />
              </section>

              <button type="submit" disabled={!isValid || isSubmitting}>
                Sign Up
              </button>
              <div className="link-container">
                <span>
                  Already have an account? <Link to="/login">Sign in</Link>
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
