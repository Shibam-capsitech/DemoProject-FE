import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  TextField,
  PrimaryButton,
  Text,
  DefaultButton,
} from "@fluentui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import apiService from "../api/apiService";
import { useUser } from "../context/UserContext";
import { jwtDecode } from "jwt-decode";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await apiService.post("/User/login", values);
        const token = response.token;

        sessionStorage.setItem("token", token);

        const decoded = jwtDecode<{
          sub: string;
          email: string;
          username: string;
          role: string;
        }>(token);

        setUser({
          id: decoded.sub,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role,
          setUser, 
        });

        toast.success("Login successful!");
        navigate("/admin/clients");
      } catch (error: any) {
        toast.error(error?.response?.data || "Login error");
      }
    },
  });

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
            width: 400,
            height: 500,
            padding: 32,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            borderRadius: 12,
            borderTop: "6px solid #0078D4",
          },
        }}
        tokens={{ childrenGap: 20 }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/logo.svg"
            style={{ height: 60, width: 100, objectFit: "contain" }}
            alt="Logo"
          />
        </div>

        <Text
          variant="xxLarge"
          styles={{ root: { fontWeight: 600, textAlign: "center" } }}
        >
          Login
        </Text>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={(_, value) => formik.setFieldValue("email", value)}
            onBlur={formik.handleBlur}
            errorMessage={formik.touched.email ? formik.errors.email : undefined}
            styles={{
              fieldGroup: { borderRadius: 6, width: "100%" },
              root: { width: "100%" },
            }}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            canRevealPassword
            revealPasswordAriaLabel="Show password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.password ? formik.errors.password : undefined
            }
            styles={{
              fieldGroup: { borderRadius: 6, width: "100%" },
              root: { width: "100%" },
            }}
          />

          <PrimaryButton
            text="Login"
            type="submit"
            styles={{
              root: {
                borderRadius: 6,
                padding: "12px 0",
                backgroundColor: "#0078D4",
                borderColor: "#0078D4",
                fontWeight: 600,
                fontSize: 16,
                width: "100%",
                marginTop: 20,
              },
              rootHovered: {
                backgroundColor: "#106EBE",
                borderColor: "#106EBE",
              },
            }}
          />
        </form>

        <Text
          styles={{ root: { textAlign: "center", marginTop: 8, fontSize: 14 } }}
        >
          Don’t have an account?{" "}
          <DefaultButton
            text="Sign up"
            onClick={() => navigate("/signup")}
            styles={{
              root: {
                padding: 0,
                height: "auto",
                minWidth: "auto",
                background: "none",
                border: "none",
                color: "#0078D4",
                fontWeight: 500,
              },
              rootHovered: {
                background: "none",
                textDecoration: "underline",
              },
            }}
          />
        </Text>
      </Stack>
    </div>
  );
};

export default LoginPage;
