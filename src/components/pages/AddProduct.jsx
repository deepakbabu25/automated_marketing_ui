import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

/* -------------------------------
   OPTIONS
--------------------------------*/
const CATEGORY_OPTIONS = [
  { value: "fashion", label: "Fashion" },
  { value: "sandals", label: "Sandals" },
  { value: "formal", label: "Formal" },
  { value: "gym", label: "Gym" },
  { value: "walking", label: "Walking" },
  { value: "sneaker", label: "Sneaker" },
];

const LOCATION_OPTIONS = [
  "Chennai",
  "Pune",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Delhi",
  "Kolkata",
  "Others",
];

/* -------------------------------
   DARK TEXTFIELD STYLE
--------------------------------*/
const darkTextFieldSx = {
  input: { color: "#ffffff" },
  textarea: { color: "#ffffff" },

  "& .MuiSelect-select": { color: "#ffffff" },

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover fieldset": {
      borderColor: "#00e5ff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00e5ff",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#9ddcff",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#00e5ff",
  },

  "& .MuiFormHelperText-root": {
    color: "#ff8a80", // error color
  },
};

/* -------------------------------
   ADD PRODUCT
--------------------------------*/
export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_name: "",
    product_description: "",
    location: "",
    product_category: "",
    price: "",
    discount: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  /* -------------------------------
     VALIDATION
  --------------------------------*/
  const validateForm = () => {
    const newErrors = {};

    if (!form.product_name.trim())
      newErrors.product_name = "Product name is required";

    if (!form.product_description.trim())
      newErrors.product_description = "Description is required";

    if (!form.location)
      newErrors.location = "Location is required";

    if (!form.product_category)
      newErrors.product_category = "Category is required";

    if (!form.price || Number(form.price) <= 0)
      newErrors.price = "Enter a valid price";

    if (
      form.discount !== "" &&
      (Number(form.discount) < 0 || Number(form.discount) > 100)
    )
      newErrors.discount = "Discount must be between 0 and 100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------------------
     SUBMIT
  --------------------------------*/
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
        product_name: form.product_name,
        product_description: form.product_description,
        location: form.location,
        product_category: form.product_category,
        price: Number(form.price),
        discount: Number(form.discount),
      };
      console.log(payload);

    try {
        await api.addProduct(payload);

      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0F24, #051018)",
        color: "#fff",
        pb: 6,
      }}
    >
      <Container maxWidth="md" sx={{ pt: 4 }}>
        {/* HEADER */}
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{ color: "#00e5ff" }} />
          </IconButton>
          <Typography variant="h5" fontWeight={800}>
            Add New Product
          </Typography>
        </Stack>

        {/* FORM */}
        <Paper
          sx={{
            p: 4,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Stack spacing={3}>
            <TextField
              label="Product Name"
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              error={!!errors.product_name}
              helperText={errors.product_name}
              fullWidth
              sx={darkTextFieldSx}
            />

            <TextField
              label="Product Description"
              name="product_description"
              value={form.product_description}
              onChange={handleChange}
              error={!!errors.product_description}
              helperText={errors.product_description}
              multiline
              rows={3}
              fullWidth
              sx={darkTextFieldSx}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                select
                label="Category"
                name="product_category"
                value={form.product_category}
                onChange={handleChange}
                error={!!errors.product_category}
                helperText={errors.product_category}
                fullWidth
                sx={darkTextFieldSx}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <MenuItem key={c.value} value={c.value} sx={{ color: "#000" }}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                fullWidth
                sx={darkTextFieldSx}
              >
                {LOCATION_OPTIONS.map((loc) => (
                  <MenuItem key={loc} value={loc} sx={{ color: "#000" }}>
                    {loc}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Price (₹)"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                fullWidth
                sx={darkTextFieldSx}
              />

              <TextField
                label="Discount (%)"
                name="discount"
                type="number"
                value={form.discount}
                onChange={handleChange}
                error={!!errors.discount}
                helperText={errors.discount || "Leave empty to apply 0%"}
                fullWidth
                sx={darkTextFieldSx}
              />
            </Stack>

            <Button
              onClick={handleSubmit}
              size="large"
              sx={{
                mt: 2,
                background: "linear-gradient(to right,#00e5ff,#b388ff)",
                color: "black",
                fontWeight: 700,
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              Save Product
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
