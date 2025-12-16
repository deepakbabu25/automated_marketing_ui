import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";

import FlashOnIcon from "@mui/icons-material/FlashOn";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  /* -------------------- STATES -------------------- */
  const [businessEmail, setBusinessEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    businessEmail: false,
    password: false,
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* -------------------- VALIDATION -------------------- */
  const validateWithError = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])[A-Za-z0-9]{8,}$/;

    if (touched.businessEmail) {
      if (!businessEmail) {
        newErrors.businessEmail = "Email is required";
      } else if (!emailRegex.test(businessEmail)) {
        newErrors.businessEmail = "Invalid email format";
      }
    }

    if (touched.password) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (!passwordRegex.test(password)) {
        newErrors.password =
          "Password must be at least 8 characters and contain a number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- SUBMIT -------------------- */
  const handleLogin = async () => {
    setTouched({ businessEmail: true, password: true });

    if (!validateWithError()) return;

    try {
      const payload = {
        business_email: businessEmail,
        password,
      };

      const response = await api.login(payload);

      const token =
        response?.token ||
        response?.access ||
        response?.access_token ||
        response?.key ||
        response?.data?.token;

      if (token) {
        localStorage.setItem("user_token", token);
        setSuccessMsg("Login successful");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        const serverMsg =
          response?.message ||
          response?.detail ||
          response?.error ||
          "Invalid email or password";
        setErrorMsg(serverMsg);
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0F24, #051018)",
        color: "#fff",
        position: "relative",
        px: 2,
      }}
    >
      {/* LOGO */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Box sx={{ background: "#00e5ff", p: 1, borderRadius: "12px" }}>
          <FlashOnIcon sx={{ color: "black" }} />
        </Box>
        <Typography variant="h6" fontWeight="bold">
          AutoMarket
        </Typography>
      </Box>

      {/* FORM */}
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Container
          maxWidth="xs"
          sx={{
            background: "rgba(255,255,255,0.06)",
            p: 4,
            borderRadius: 3,
            boxShadow: "0 0 40px rgba(0,255,255,0.15)",
          }}
        >
          <Typography variant="h4" fontWeight="800" mb={4}>
            Login
          </Typography>

          <TextField
            fullWidth
            label="Business Email"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            onBlur={() => {
              setTouched((p) => ({ ...p, businessEmail: true }));
              validateWithError();
            }}
            error={Boolean(errors.businessEmail)}
            helperText={errors.businessEmail}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.06)",
                borderRadius: "12px",
              },
              "& .MuiOutlinedInput-input": { color: "#fff" },
              "& .MuiInputLabel-root": {
                color: "#bbb",
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => {
              setTouched((p) => ({ ...p, password: true }));
              validateWithError();
            }}
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "#bbb" }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.06)",
                borderRadius: "12px",
              },
              "& .MuiOutlinedInput-input": { color: "#fff" },
              "& .MuiInputLabel-root": {
                color: "#bbb",
              },
            }}
          />

          <Button fullWidth variant="contained" onClick={handleLogin}>
            Login
          </Button>

          <Typography textAlign="center" mt={3}>
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register">
              Register
            </Link>
          </Typography>
        </Container>
      </Box>

      {/* SUCCESS POPUP */}
      <Snackbar open={Boolean(successMsg)} autoHideDuration={2000}>
        <Alert severity="success" variant="filled">
          {successMsg}
        </Alert>
      </Snackbar>

      {/* ERROR POPUP */}
      <Snackbar open={Boolean(errorMsg)} autoHideDuration={4000}>
        <Alert severity="error" variant="filled">
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
