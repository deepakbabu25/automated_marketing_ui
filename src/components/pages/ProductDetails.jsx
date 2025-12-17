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

  // Get organisation name (handle both object and ID cases)
  const getOrganisationName = () => {
    if (!product.organisation) return "N/A";
    
    // If organisation is an object, try to get the name
    if (typeof product.organisation === "object") {
      return product.organisation.name || 
             product.organisation.org_name || 
             product.organisation.organisation_name ||
             JSON.stringify(product.organisation);
    }
    
    // If it's just an ID, return it (API should ideally return organisation name)
    return product.organisation;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format field value based on its type
  const formatFieldValue = (key, value) => {
    if (value === null || value === "") return null;
    
    if (key.includes("date") || key === "created_at" || key === "updated_at") {
      return formatDate(value);
    }
    
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  // Get all product fields that aren't already displayed prominently
  const displayedFields = [
    "product_name",
    "product_description",
    "price",
    "product_category",
    "location",
    "marketing_message",
    "organisation",
    "high_intent_leads_count",
  ];

  // Get all other fields
  const allOtherFields = Object.entries(product).filter(
    ([key]) => !displayedFields.includes(key)
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0F24, #051018)",
        color: "#ffff",
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
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#fff" }}>
                {product.product_name}
              </Typography>

              <Typography sx={{ mt: 2, color: "#bbb" }}>
                {product.product_description}
              </Typography>

              {/* Marketing Message */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: "#7aa0b5", mb: 0.5 }}>
                  Marketing Message
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: product.marketing_message ? "#fff" : "#888",
                    fontStyle: product.marketing_message ? "normal" : "italic",
                    fontSize: "0.9rem",
                  }}
                >
                  {product.marketing_message || "No marketing message available"}
                </Box>
              </Box>

              {/* Organisation Name */}
              {product.organisation && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: "#7aa0b5", mb: 0.5 }}>
                    Organisation
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "0.9rem" }}>
                    {getOrganisationName()}
                  </Typography>
                </Box>
              )}
             <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: "#7aa0b5", mb: 0.5 }}>
                    HighIntentLeads
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "0.9rem" }}>
                    {product.high_intent_leads_count||"No Matchingn leads for right now"}
                  </Typography>
                </Box>

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
                {product.discount && (
                  <Chip
                    label={`${product.discount}% OFF`}
                    sx={{
                      borderRadius: "999px",
                      border: "1px solid #b388ff",
                      color: "#b388ff",
                    }}
                  />
                )}
              </Stack>

              {/* All Other Product Details */}
              {allOtherFields.length > 0 && (
                <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <Typography variant="body2" sx={{ color: "#7aa0b5", mb: 2, fontWeight: 600, fontSize: "0.95rem" }}>
                    Additional Details
                  </Typography>
                  <Stack spacing={1.5}>
                    {allOtherFields.map(([key, value]) => {
                      const formattedValue = formatFieldValue(key, value);
                      if (formattedValue === null) return null;
                      
                      const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                      
                      return (
                        <Stack key={key} direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ gap: 2 }}>
                          <Typography variant="body2" sx={{ color: "#7aa0b5", minWidth: "140px" }}>
                            {formattedKey}:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: "#fff", 
                              textAlign: "right", 
                              flex: 1,
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap"
                            }}
                          >
                            {formattedValue}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Box>
              )}
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
