import "./auth.css";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastType, generateToast } from "../ui/Toast";
import { useAuth } from "../../context/authContext";

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialRegisterValues = { username: "", email: "", password: "", confirmPassword: "" };

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onLogin, token } = useAuth();
  const { from } = location.state || { from: { pathname: "/" } };

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
    // Submit form
    try {
      await onLogin(values.email, values.password);
      setSubmitting(false);
      resetForm();
      navigate(from.pathname);
    } catch (err: any) {
      if (!err.response) {
        generateToast("No Server Response", ToastType.Info);
      } else if (err.response?.status === 404) {
        generateToast("User not found", ToastType.Info);
      } else if (err.response?.status === 401) {
        generateToast("Password is incorrect", ToastType.Info);
      } else {
        generateToast("Login Failed", ToastType.Info);
      }
      setSubmitting(false);
    }
  };

  if (token) return <div>You are already logged in!</div>;

  return (
    <div className="login-body">
      <div className="home-button-container-login">
        <Link to="/" className="home-button">
          {"< Home"}
        </Link>
      </div>
      <div className="login-left-panel">
        <Formik initialValues={initialRegisterValues} onSubmit={handleSubmit}>
          {({ isSubmitting, isValid }) => (
            <Form className="auth-form">
              <h1>Sign in to your account</h1>
              <section>
                <label htmlFor="username">Email:</label>
                <Field name="email" type="text" />
                <ErrorMessage name="email" component="div" className="error-text" />
              </section>

              <section>
                <label htmlFor="password">Password:</label>
                <Field name="password" type="password" />
                <ErrorMessage name="password" component="div" className="error-text" />
              </section>

              <button type="submit" disabled={!isValid || isSubmitting}>
                Log In
              </button>
              <div className="link-container">
                <span>
                  Do not have an account? <Link to="/register">Register now</Link>
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="login-right-panel">
        <img src="desk-sitting-person.png" style={{ height: "100%", width: "100%" }} alt="" />
      </div>
    </div>
  );
};
