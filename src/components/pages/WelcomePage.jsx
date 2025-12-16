import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { Menu } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import SmsIcon from "@mui/icons-material/Sms";
import { keyframes, styled } from "@mui/system";

// Floating animation
// const float = keyframes`
//   0% { transform: translateY(0px) translateX(0px); opacity: 0.8; }
//   50% { transform: translateY(-20px) translateX(12px); opacity: 1; }
//   100% { transform: translateY(0px) translateX(0px); opacity: 0.8; }
// `;

// const FloatingWrapper = styled("div")({
//   position: "absolute",
//   top: "120px",
//   left: 0,
//   width: "100%",
//   height: "280px",
//   pointerEvents: "none",
//   zIndex: 0,
// });

// const FloatingIcon = styled("div")(
//   ({ delay, top, left, right, bottom }) => ({
//     position: "absolute",
//     animation: `${float} 5.5s ease-in-out infinite`,
//     animationDelay: delay,
//     top,
//     left,
//     right,
//     bottom,
//     color: "rgba(0, 255, 255, 0.8)",
//     fontSize: "32px",

//     // mobile responsive size
//     "@media (max-width:600px)": {
//       fontSize: "24px",
//     },
//   })
// );


export default function WelcomePage() {
  const navigate = useNavigate()

  const menuItems = ["Features", "How It Works", "Pricing"];
  const handleLogin = () => {
    navigate('/login')
  }
  const handleGetStarted = () => {
    navigate('/register')
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0F24, #051018)",
        color: "#fff",
      }}
    >
      {/* Navbar */}
      <AppBar position="static" elevation={0} sx={{ background: "transparent" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={1}>
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
              sx={{ fontWeight: "bold", fontSize: { xs: "1rem", md: "1.4rem" } }}
            >
              AutoMarket
            </Typography>
          </Stack>

          {/* Right Buttons */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display:  "flex"  }}
          >
           
            <Button
              variant="contained"
              sx={{
                background: "#00e5ff",
                color: "black",
                fontWeight: "bold",
                px: 3,
                borderRadius: "12px",
                "&:hover": { background: "#19f3ff" },
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      {/* Floating Icons */}
    {/* <FloatingWrapper>
      <FloatingIcon delay="0s" top="10%" left="12%">
        <MailOutlineIcon fontSize="inherit" />
      </FloatingIcon>

      <FloatingIcon delay="1s" top="50%" right="10%">
        <ChatBubbleOutlineIcon fontSize="inherit" />
      </FloatingIcon>

      <FloatingIcon delay="2s" bottom="5%" left="25%">
        <SendIcon fontSize="inherit" />
      </FloatingIcon>

      <FloatingIcon delay="3s" bottom="0%" right="30%">
        <SmsIcon fontSize="inherit" />
      </FloatingIcon>
    </FloatingWrapper> */}


      {/* Main Section */}
      <Container sx={{ textAlign: "center", mt: { xs: 6, md: 10 } }}>
        {/* Title */}
        <Typography
          sx={{
            fontWeight: "800",
            fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
            lineHeight: 1.2,
          }}
        >
          Automate Your
        </Typography>

        <Typography
          sx={{
            fontWeight: "800",
            fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
            background: "linear-gradient(to right, #00e5ff, #b388ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
          }}
        >
          Marketing Magic
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            mt: 3,
            maxWidth: "700px",
            mx: "auto",
            color: "#bbb",
            fontSize: { xs: "0.9rem", md: "1.1rem" },
            px: { xs: 2, md: 0 },
            lineHeight: 1.7,
          }}
        >
          Transform your outreach with AI-powered personalized messaging.
          Generate compelling content and reach your leads through email, SMS,
          and multiple channels — automatically.
        </Typography>

        {/* CTA */}
        <Button
          variant="contained"
          sx={{
            mt: 5,
            px: { xs: 4, md: 6 },
            py: { xs: 1.2, md: 1.8 },
            background: "linear-gradient(to right, #00e5ff, #b388ff)",
            color: "black",
            fontWeight: "bold",
            borderRadius: "12px",
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
          onClick={handleGetStarted}
        >
          Get Started →
        </Button>

        {/* Stats Section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 10 }}
          sx={{ justifyContent: "center", mt: 10 }}
        >
          <Box textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              10x
            </Typography>
            <Typography sx={{ color: "#aaa" }}>Faster Outreach</Typography>
          </Box>

          <Box textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              85%
            </Typography>
            <Typography sx={{ color: "#aaa" }}>Open Rate</Typography>
          </Box>

          <Box textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              24/7
            </Typography>
            <Typography sx={{ color: "#aaa" }}>Automation</Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
