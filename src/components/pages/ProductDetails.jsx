import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Divider,
  Chip,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.getProductDetails(id);
        setProduct(response);
      } catch (err) {
        console.error("Failed to load product", err);
        setErrorMsg("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeleting(true);
      await api.deleteProduct(id);
      setSuccessMsg("Product deleted successfully");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("Failed to delete product", err);
      setErrorMsg("Failed to delete product. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to bottom, #0A0F24, #051018)",
          color: "#fff",
        }}
      >
        <Typography>Product not found</Typography>
      </Box>
    );
  }

  // separate main fields from extra meta so we can show "every detail"
  const mainKeys = [
    "product_name",
    "product_description",
    "price",
    "product_category",
    "location",
  ];

  const detailEntries = Object.entries(product).filter(
    ([key, value]) => !mainKeys.includes(key) && value !== null && value !== ""
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0F24, #051018)",
        color: "#fff",
        pb: 6,
      }}
    >
      <Container sx={{ pt: 6, maxWidth: "md" }}>
        {/* Header + primary info */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 0 40px rgba(0,255,255,0.12)",
            mb: 3,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {product.product_name}
              </Typography>

              <Typography sx={{ mt: 2, color: "#bbb" }}>
                {product.product_description}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
                <Chip
                  label={`₹${product.price}`}
                  sx={{
                    background: "linear-gradient(to right,#00e5ff,#b388ff)",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                />
                <Chip
                  label={product.product_category}
                  sx={{
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                  }}
                />
                {product.location && (
                  <Chip
                    label={product.location}
                    sx={{
                      borderRadius: "999px",
                      border: "1px solid #00e5ff",
                      color: "#00e5ff",
                    }}
                  />
                )}
              </Stack>
            </Box>

            {/* Actions */}
            <Stack spacing={1}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{
                  borderRadius: "10px",
                  borderColor: "#00e5ff",
                  color: "#00e5ff",
                  textTransform: "none",
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={deleting}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                }}
              >
                {deleting ? "Deleting..." : "Delete Product"}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* All raw product details */}
        {detailEntries.length > 0 && (
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(5,16,24,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              All Product Details
            </Typography>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }} />

            <Stack spacing={1.5}>
              {detailEntries.map(([key, value]) => (
                <Stack
                  key={key}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ gap: 2 }}
                >
                  <Typography sx={{ color: "#7aa0b5", textTransform: "capitalize" }}>
                    {key.replace(/_/g, " ")}
                  </Typography>
                  <Typography sx={{ color: "#fff", wordBreak: "break-word" }}>
                    {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        )}
      </Container>

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
