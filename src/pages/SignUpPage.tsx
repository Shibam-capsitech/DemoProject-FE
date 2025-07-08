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
import axios from "axios";
import { toast } from 'react-toastify'
import apiService from "../api/apiService";

const roles: IDropdownOption[] = [
  { key: "Admin", text: "Admin" },
  { key: "Manager", text: "Manager" },
  { key: "Technician", text: "Technician" },
];

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
      const res = await apiService.post("/User/signup", values);
      console.log("Signup successful:", res.data);
      if(res.status === 200) {
        toast.success("Signup successful! Redirecting to login...");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup failed:", error);
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

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ handleChange, handleSubmit, values, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <Stack tokens={{ childrenGap: 16 }}>
                {/* Username and Name in one row */}
                <Stack horizontal tokens={{ childrenGap: 12 }} styles={{ root: { width: "100%" } }}>
                  <TextField
                    label="Username"
                    value={values.username}
                    onChange={(_, val) => handleChange("username")(val?? "")}
                    required
                     styles={{ fieldGroup: { borderRadius: 6, width: "100%" }, root: { width: "100%" } }}
                  />
                  <TextField
                    label="Full Name"
                    value={values.name}
                    onChange={(_, val) => handleChange("name")(val?? "")}
                    required
                   styles={{ fieldGroup: { borderRadius: 6, width: "100%" }, root: { width: "100%" } }}
                  />
                </Stack>

                <TextField
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={(_, val) => handleChange("email")(val?? "")}
                  required
                  styles={{ fieldGroup: { borderRadius: 6, width: "100%" }, root: { width: "100%" } }}
                />

                <TextField
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={(_, val) => handleChange("password")(val?? "")}
                  canRevealPassword
                  revealPasswordAriaLabel="Show password"
                  required
                  styles={{ fieldGroup: { borderRadius: 6, width: "100%" }, root: { width: "100%" } }}
                />

                <Dropdown
                  label="Role"
                  selectedKey={values.role}
                  onChange={(_, option) =>
                    setFieldValue("role", option?.key as string)
                  }
                  options={roles}
                  required
                  styles={{ dropdown: { borderRadius: 6 } }}
                />

                {/* City / State */}
                <Stack horizontal tokens={{ childrenGap: 12 }}>
                  <TextField
                    label="City"
                    value={values.city}
                    onChange={(_, val) => handleChange("city")(val?? "")}
                    styles={{ fieldGroup: { borderRadius: 6, width: "100%" }, root: { width: "100%" } }}
                  />
                  <TextField
                    label="State"
                    value={values.state}
                    onChange={(_, val) => handleChange("state")(val?? "")}
                     styles={{ fieldGroup: { borderRadius: 6, width: "100%" }, root: { width: "100%" } }}
                  />
                </Stack>

                {/* Country / Postcode */}
                <Stack horizontal tokens={{ childrenGap: 12 }}>
                  <TextField
                    label="Country"
                    value={values.country}
                    onChange={(_, val) => handleChange("country")(val?? "")}
                    styles={{ fieldGroup: { borderRadius: 6, width: "100%" }, root: { width: "100%" } }}
                  />
                  <TextField
                    label="Postcode"
                    value={values.postcode}
                    onChange={(_, val) => handleChange("postcode")(val?? "")}
                    styles={{ fieldGroup: { borderRadius: 6, width: "100%" }, root: { width: "100%" } }}
                    
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
