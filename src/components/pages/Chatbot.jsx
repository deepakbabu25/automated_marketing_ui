import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  Paper,
} from "@mui/material";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { Navigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

export default function Chatbot() {
  const { id } = useParams(); // product_id from URL
  const PRODUCT_ID = id;

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi 👋 I can help you rewrite and optimize your marketing message.",
    },
  ]);

  const [draft, setDraft] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const chatEndRef = useRef(null);

  /* -----------------------------
     AUTO SCROLL
  ----------------------------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =====================================================
     STREAMING AI CALL (REAL BACKEND)
  ===================================================== */
  const handleOptimize = async () => {
    if (!draft.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: draft }]);
    setDraft("");

    // Placeholder bot message (will stream into this)
    setMessages((prev) => [...prev, { role: "bot", text: "" }]);

    const response = await fetch(
      "http://localhost:8000/api/writer_chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body: JSON.stringify({
          product_id: PRODUCT_ID,
          text: draft,
        }),
      }
    );

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      const lines = chunk.split("\n");
      for (let line of lines) {
        if (line.startsWith("data: ")) {
          const token = line.replace("data: ", "");
          fullText += token;

          // Update last bot message
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "bot",
              text: fullText,
            };
            return updated;
          });
        }
      }
    }

    setFinalMessage(fullText);
  };

  /* =====================================================
     FINAL SEND (OPTIONAL)
     Backend already saves automatically
  ===================================================== */
  const handleSendFinal =async() => {
    const response=await api.sendFinalMessage({product_id:PRODUCT_ID})
    console.log(response);
    if (response.data.status === "success") {
      navigate("/dashboard"); // ✅ SAFE
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0F24, #051018)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box sx={{ background: "#00e5ff", p: 1, borderRadius: "12px" }}>
          <FlashOnIcon sx={{ color: "black" }} />
        </Box>
        <Typography variant="h6" fontWeight="bold">
          AutoMarket Chatbot
        </Typography>
      </Box>

      {/* CHAT */}
      <Container sx={{ flex: 1, overflowY: "auto", py: 3 }}>
        <Stack spacing={2}>
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "75%",
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "14px",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(to right,#00e5ff,#b388ff)"
                      : "rgba(255,255,255,0.08)",
                  color: msg.role === "user" ? "black" : "#fff",
                }}
              >
                <Typography>{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Stack>
      </Container>

      {/* INPUT */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <TextField
          fullWidth
          placeholder="Type message to optimize..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.06)",
              borderRadius: "14px",
            },
            "& input": { color: "#fff" },
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleOptimize}
                sx={{
                  background: "#00e5ff",
                  color: "black",
                  ml: 1,
                }}
              >
                <ArrowUpwardIcon />
              </IconButton>
            ),
          }}
        />

        <Button
          fullWidth
          disabled={!finalMessage}
          onClick={handleSendFinal}
          sx={{
            mt: 2,
            py: 1.4,
            borderRadius: "14px",
            fontWeight: "bold",
            background: finalMessage
              ? "linear-gradient(to right,#00e5ff,#b388ff)"
              : "rgba(255,255,255,0.2)",
            color: "black",
            textTransform: "none",
          }}
        >
          Send Final Message
        </Button>
      </Box>
    </Box>
  );
}
