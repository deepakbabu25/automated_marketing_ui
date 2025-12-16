import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
} from "@mui/material";

import FlashOnIcon from "@mui/icons-material/FlashOn";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  // validation state (same rules as Login)
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    businessEmail: false,
    password: false,
  });

  const handleRegister =async () => {
    // trigger validation on submit
    setTouched({ businessEmail: true, password: true });
    if (!validateWithError()) return;

    // ensure no required field is empty
    if (
      !orgName ||
      !businessEmail ||
      !websiturl ||
      !password ||
      !confirmPassword ||
      !uploadedPdf
    ) {
      setErrorMsg("Please fill in all fields before registering.");
      setSuccessMsg("");
      return;
    }

    console.log(orgName,businessEmail,password,confirmPassword,websiturl,uploadedPdf);
    try{
    const formData = new FormData();
    formData.append('website_url', websiturl);
    formData.append('pdf', uploadedPdf)

    const response = await api.checkCredibilityScore(formData);
    const {p_score:pdfScore, web_score:webScore} = response;
    if(pdfScore>=0 && webScore>=0){
      const payload={
        "org_name": orgName,
          "business_email": businessEmail,
          "website": websiturl,
          "password": password
      }
      const responseOrg=await api.register(payload);
      if(responseOrg.status){
        setSuccessMsg("Registration successful");
        setErrorMsg("");
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrorMsg("Registration failed. Please try again.");
        setSuccessMsg("");
      }
    }
    console.log("Respnse----", response)
    } catch(error){
      console.log("Error----", error)
    }
  }
  

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const[orgName, setOrgName]=useState("");
  const[businessEmail, setBusinessEmail]=useState("");
  const[websiturl, setWebsiteurl]=useState("");
  const[password, setPassword]=useState("");
  const[confirmPassword, setConfirmPassword]=useState('');
  const[uploadedPdf, setUploadedPdf]=useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
      {/* ⭐ TOP-LEFT LOGO */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            background: "#00e5ff",
            p: 1,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FlashOnIcon sx={{ color: "black" }} />
        </Box>

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontSize: { xs: "1.1rem", md: "1.4rem" } }}
        >
          AutoMarket
        </Typography>
      </Box>

      {/* Center Registration Card */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pt: 4,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            background: "rgba(255,255,255,0.06)",
            padding: 4,
            borderRadius: 3,
            boxShadow: "0 0 40px rgba(0,255,255,0.15)",
            backdropFilter: "blur(8px)",
            mt: 6,
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            sx={{ fontWeight: "800", textAlign: "start", mb: 4 }}
          >
            Register
          </Typography>

          {/* ORG NAME */}
          <TextField
            fullWidth
            label="Organisation Name"
            variant="outlined"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
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

          {/* BUSINESS EMAIL */}
          <TextField
            fullWidth
            label="Business Email"
            type="email"
            variant="outlined"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, businessEmail: true }));
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

          {/* WEBSITE */}
          <TextField
            fullWidth
            label="Website URL"
            variant="outlined"
            value={websiturl}
            onChange={(e) => setWebsiteurl(e.target.value)}
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

          {/* PASSWORD */}
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, password: true }));
              validateWithError();
            }}
            error={Boolean(errors.password)}
            helperText={errors.password}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: "#bbb" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* CONFIRM PASSWORD */}
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    sx={{ color: "#bbb" }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* PORTFOLIO PDF */}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              mb: 3,
              borderRadius: "12px",
              borderColor: "#00e5ff",
              color: "#00e5ff",
              textTransform: "none",
            }}
          >
            Upload Portfolio (PDF)
            <input type="file" accept="application/pdf" hidden
            onChange={(e) =>{console.log("Event--", e.target.files); setUploadedPdf(e.target.files[0])}} />
          </Button>

          {/* REGISTER BUTTON */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              py: 1.6,
              fontWeight: "bold",
              borderRadius: "12px",
              background: "linear-gradient(to right, #00e5ff, #b388ff)",
              color: "black",
              "&:hover": { opacity: 0.9 },
            }}
            onClick={handleRegister}
          >
            Register
          </Button>

          {/* LOGIN LINK */}
          <Typography
            sx={{
              textAlign: "center",
              color: "#bbb",
              mt: 3,
              fontSize: "0.9rem",
            }}
          >
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{ color: "#00e5ff" }}
            >
              Login
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
