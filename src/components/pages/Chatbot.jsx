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

export default function Chatbot() {
  /* -----------------------------
     STATE
  ----------------------------- */
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi 👋 I can help you rewrite and optimize your marketing message.",
    },
  ]);

  const [draft, setDraft] = useState("");          // text user types
  const [finalMessage, setFinalMessage] = useState(""); // approved message

  const chatEndRef = useRef(null);

  /* -----------------------------
     AUTO SCROLL
  ----------------------------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =====================================================
     MOCK AI REWRITE FUNCTION
     (Replace this when connecting to backend AI)
     ===================================================== */
  const mockAIRewrite = async (text) => {
    // ⛔ REMOVE THIS FUNCTION WHEN BACKEND IS READY

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`✨ Optimized version: ${text}`);
      }, 700);
    });
  };

  /* =====================================================
     OPTIMIZE BUTTON (⬆️)
     - Calls AI rewrite
     - Updates chat
     - Stores finalMessage
     ===================================================== */
  const handleOptimize = async () => {
    if (!draft.trim()) return;

    // show user message immediately
    setMessages((prev) => [...prev, { role: "user", text: draft }]);

    /* ---------------------------------------------------
       🔌 BACKEND INTEGRATION POINT #1 (AI REWRITE)
       ---------------------------------------------------
       Replace mockAIRewrite with API call like:

       const res = await fetch("/api/ai/rewrite/", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           product_id: PRODUCT_ID,
           input_text: draft
         })
       });
       const data = await res.json();
       const optimizedText = data.optimized_text;
    --------------------------------------------------- */

    const optimizedText = await mockAIRewrite(draft);

    // show AI response
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: optimizedText },
    ]);

    // store as final message
    setFinalMessage(optimizedText);
    setDraft("");
  };

  /* =====================================================
     SEND FINAL MESSAGE BUTTON
     - Sends approved message to backend
     ===================================================== */
  const handleSendFinal = async () => {
    if (!finalMessage.trim()) return;

    /* ---------------------------------------------------
       🔌 BACKEND INTEGRATION POINT #2 (SEND MARKETING)
       ---------------------------------------------------
       Replace console.log with real API:

       await fetch("/api/marketing/send/", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           product_id: PRODUCT_ID,
           message: finalMessage
         })
       });
    --------------------------------------------------- */

    console.log("FINAL MESSAGE SENT TO API:", finalMessage);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: finalMessage },
      {
        role: "bot",
        text: "✅ Final message sent successfully for marketing.",
      },
    ]);

    setFinalMessage("");
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
        <Box
          sx={{
            background: "#00e5ff",
            p: 1,
            borderRadius: "12px",
          }}
        >
          <FlashOnIcon sx={{ color: "black" }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          AutoMarket Chatbot
        </Typography>
      </Box>

      {/* CHAT AREA */}
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
                <Typography sx={{ fontSize: "0.95rem" }}>
                  {msg.text}
                </Typography>
              </Paper>
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Stack>
      </Container>

      {/* INPUT AREA */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,15,36,0.95)",
        }}
      >
        {/* OPTIMIZE INPUT */}
        <TextField
          fullWidth
          placeholder="Type message to rewrite / optimize..."
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
                  "&:hover": { background: "#19f3ff" },
                }}
              >
                <ArrowUpwardIcon />
              </IconButton>
            ),
          }}
        />

        {/* SEND FINAL MESSAGE */}
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
