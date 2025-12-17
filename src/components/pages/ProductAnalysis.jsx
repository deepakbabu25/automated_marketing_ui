import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

export default function ProductAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.getProductAnalysis(id);
        setAnalysis(response);
      } catch (err) {
        console.error("Failed to load analysis", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #0A0F24, #051018)",
        }}
      >
        <CircularProgress sx={{ color: "#00e5ff" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0F24, #051018)",
        color: "#fff",
        pb: 6,
      }}
    >
      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Stack spacing={3}>
          {/* HEADER */}
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" fontWeight={800}>
              Product Analysis
            </Typography>

            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                borderColor: "#00e5ff",
                color: "#00e5ff",
                textTransform: "none",
              }}
            >
              Back
            </Button>
          </Stack>

          {/* SUMMARY */}
          <Paper
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 3,
            }}
          >
            <Typography fontWeight={700} mb={1}>
              Summary
            </Typography>
            <Typography sx={{ color: "#bbb", fontSize: "0.95rem" }}>
              {analysis?.summary ||
                "This product is performing steadily based on recent customer interactions."}
            </Typography>
          </Paper>

          {/* KEY INSIGHTS */}
          <Paper
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 3,
            }}
          >
            <Typography fontWeight={700} mb={2}>
              Key Insights
            </Typography>

            <Stack spacing={1.5}>
              {(analysis?.insights || [
                "High interest from customers aged 20–30",
                "Better engagement in metro locations",
                "Discount improves click-through rate",
              ]).map((item, idx) => (
                <Typography key={idx} sx={{ color: "#ddd", fontSize: "0.9rem" }}>
                  • {item}
                </Typography>
              ))}
            </Stack>
          </Paper>

          {/* RECOMMENDATIONS */}
          <Paper
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 3,
            }}
          >
            <Typography fontWeight={700} mb={2}>
              Recommendations
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(analysis?.recommendations || [
                "Run Instagram Ads",
                "Target Chennai & Bangalore",
                "Use limited-time discount messaging",
              ]).map((rec, idx) => (
                <Chip
                  key={idx}
                  label={rec}
                  sx={{
                    background: "rgba(0,229,255,0.15)",
                    color: "#00e5ff",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
