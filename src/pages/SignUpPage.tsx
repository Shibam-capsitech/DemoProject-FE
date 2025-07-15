import React from "react";
import {
  Stack,
  TextField,
  PrimaryButton,
  Text,
  Dropdown,
  type IDropdownOption,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import apiService from "../api/apiService";

const roles: IDropdownOption[] = [
  { key: "Admin", text: "Admin" },
  { key: "Manager", text: "Manager" },
  { key: "Staff", text: "Staff" },
];

// ✅ Validation Schema
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: Yup.string().required("Role is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  postcode: Yup.string().required("Postcode is required"),
});

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    name: "",
    role: "",
    city: "",
    country: "",
    state: "",
    postcode: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role,
        address: {
          city: values.city,
          state: values.state,
          country: values.country,
          postcode: values.postcode,
        },
      };

      const res = await apiService.post("/User/signup", payload);
      toast.success("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E9ECEF",
      }}
    >
      <Stack
        styles={{
          root: {
            width: 500,
            padding: 32,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            borderRadius: 12,
            borderTop: "6px solid #0078D4",
          },
        }}
        tokens={{ childrenGap: 10 }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/logo.svg"
            alt="Logo"
            style={{ height: 60, width: 100, objectFit: "contain" }}
          />
        </div>

        <Text
          variant="xxLarge"
          styles={{ root: { fontWeight: 600, textAlign: "center" } }}
        >
          Sign Up
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, handleBlur }) => (
            <form onSubmit={handleSubmit}>
              <Stack tokens={{ childrenGap: 16 }} >
                <Stack horizontal tokens={{ childrenGap: 12 }}>
                  <TextField
                    label="Username"
                    value={values.username}
                    onChange={(_, val) => handleChange("username")(val ?? "")}
                    onBlur={handleBlur}
                    errorMessage={touched.username ? errors.username : undefined}
                    styles={{ root: { width: "100%" }, fieldGroup: { width: "100%", borderRadius: 6 } }}
                  />
                  <TextField
                    label="Full Name"
                    value={values.name}
                    onChange={(_, val) => handleChange("name")(val ?? "")}
                    onBlur={handleBlur}
                    errorMessage={touched.name ? errors.name : undefined}
                    styles={{ root: { width: "100%" }, fieldGroup: { width: "100%", borderRadius: 6 } }}
                  />
                </Stack>

                <TextField
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={(_, val) => handleChange("email")(val ?? "")}
                  onBlur={handleBlur}
                  errorMessage={touched.email ? errors.email : undefined}
                  styles={{ fieldGroup: { borderRadius: 6 } }}
                />

                <TextField
                  label="Password"
                  type="password"
                  canRevealPassword
                  revealPasswordAriaLabel="Show password"
                  value={values.password}
                  onChange={(_, val) => handleChange("password")(val ?? "")}
                  onBlur={handleBlur}
                  errorMessage={touched.password ? errors.password : undefined}

                  styles={{ fieldGroup: { borderRadius: 6 } }}
                />

                <Dropdown
                  label="Role"
                  selectedKey={values.role}
                  onChange={(_, option) =>
                    setFieldValue("role", option?.key as string)
                  }
                  onBlur={() => setFieldValue("role", values.role)}
                  errorMessage={touched.role ? errors.role : undefined}
                  options={roles}
                  styles={{ dropdown: { borderRadius: 6 } }}
                />

                <Stack horizontal tokens={{ childrenGap: 12 }} styles={{ root: { width: "100%" } }}>
                  <TextField
                    label="City"
                    value={values.city}
                    onChange={(_, val) => handleChange("city")(val ?? "")}
                    onBlur={handleBlur}
                    errorMessage={touched.city ? errors.city : undefined}
                    styles={{ root: { width: "100%" }, fieldGroup: { width: "100%", borderRadius: 6 } }}
                  />
                  <TextField
                    label="State"
                    value={values.state}
                    onChange={(_, val) => handleChange("state")(val ?? "")}
                    onBlur={handleBlur}
                    errorMessage={touched.state ? errors.state : undefined}
                    styles={{ root: { width: "100%" }, fieldGroup: { width: "100%", borderRadius: 6 } }}
                  />
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 12 }}>
                  <TextField
                    label="Country"
                    value={values.country}
                    onChange={(_, val) => handleChange("country")(val ?? "")}
                    onBlur={handleBlur}
                    errorMessage={touched.country ? errors.country : undefined}
                    styles={{ root: { width: "100%" }, fieldGroup: { width: "100%", borderRadius: 6 } }}
                  />
                  <TextField
                    label="Postcode"
                    value={values.postcode}
                    onChange={(_, val) => handleChange("postcode")(val ?? "")}
                    onBlur={handleBlur}
                    errorMessage={touched.postcode ? errors.postcode : undefined}
                    styles={{ root: { width: "100%" }, fieldGroup: { width: "100%", borderRadius: 6 } }}
                  />
                </Stack>

                <PrimaryButton
                  text="Sign Up"
                  type="submit"
                  styles={{
                    root: {
                      borderRadius: 6,
                      padding: "12px 0",
                      backgroundColor: "#0078D4",
                      borderColor: "#0078D4",
                      fontWeight: 600,
                      fontSize: 16,
                    },
                    rootHovered: {
                      backgroundColor: "#106EBE",
                      borderColor: "#106EBE",
                    },
                  }}
                />
              </Stack>
            </form>
          )}
        </Formik>

        <Text
          styles={{ root: { textAlign: "center", marginTop: 8, fontSize: 14 } }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#0078D4",
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Login
          </span>
        </Text>
      </Stack>
    </div>
  );
};

export default SignupPage;
