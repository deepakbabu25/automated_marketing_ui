import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  Button,
  Grid,
  LinearProgress,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { useAppSelector } from "../../store/hooks";
import { selectOrgData } from "../../store/slices/organisationSlice";

export default function Profile() {
  const org = useAppSelector(selectOrgData);

  const hasOrg = Boolean(org);

  // Safe fallbacks in case some fields are missing
  const orgName = org?.org_name || org?.name || "Your Company";
  const businessEmail = org?.business_email || org?.email || "Not provided";
  const website = org?.website || org?.website_url || "Not provided";
  const createdAt =
    org?.created_at || org?.createdAt || org?.registered_at || null;

  // Example usage / plan data to make this feel like a real SaaS profile page.
  // In a real app these would come from the backend.
  const planName = org?.plan_name || "Starter";
  const planStatus = org?.plan_status || "Trial";
  const campaignsUsed = org?.campaigns_used ?? 3;
  const campaignsLimit = org?.campaigns_limit ?? 10;
  const contacts = org?.contacts_count ?? 1250;
  const emailsThisMonth = org?.emails_this_month ?? 4800;

  const campaignsUsagePercent = Math.min(
    100,
    (campaignsUsed / campaignsLimit) * 100
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0F24, #051018)",
        color: "#fff",
        position: "relative",
        px: 2,
        py: 4,
      }}
    >
      {/* TOP-LEFT LOGO */}
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

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Card
            sx={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 3,
              boxShadow: "0 0 40px rgba(0,255,255,0.15)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              p: 2,
            }}
          >
            <CardContent>
              {/* HEADER */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                gap={2}
                mb={3}
              >
                <Box>
                  <Typography variant="h5" fontWeight="800">
                    Workspace Overview
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bbb" }}>
                    See your company details, plan usage, and key marketing
                    metrics at a glance.
                  </Typography>
                </Box>
                <Stack direction="row" gap={1} alignItems="center">
                  <Chip
                    label={hasOrg ? "Account Active" : "No org data loaded"}
                    color={hasOrg ? "success" : "default"}
                    size="small"
                  />
                  <Chip label={planName} variant="outlined" size="small" />
                </Stack>
              </Stack>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 3 }} />

              <Grid container spacing={3}>
                {/* LEFT: COMPANY DETAILS */}
                <Grid item xs={12} md={5}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#bbb", letterSpacing: 1 }}
                      >
                        Organisation
                      </Typography>
                      <Typography variant="h6" fontWeight="700">
                        {orgName}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#bbb", letterSpacing: 1 }}
                      >
                        Business Email
                      </Typography>
                      <Typography variant="body1">{businessEmail}</Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#bbb", letterSpacing: 1 }}
                      >
                        Website
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ wordBreak: "break-all" }}
                      >
                        {website}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#bbb", letterSpacing: 1 }}
                      >
                        Member Since
                      </Typography>
                      <Typography variant="body1">
                        {createdAt
                          ? new Date(createdAt).toLocaleDateString()
                          : "-"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#bbb", letterSpacing: 1 }}
                      >
                        Plan Status
                      </Typography>
                      <Typography variant="body1">{planStatus}</Typography>
                    </Box>
                  </Stack>
                </Grid>

                {/* RIGHT: PLAN & METRICS */}
                <Grid item xs={12} md={7}>
                  <Stack spacing={3}>
                    {/* Plan usage */}
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#bbb", letterSpacing: 1 }}
                      >
                        Campaign Usage
                      </Typography>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          {campaignsUsed} / {campaignsLimit} campaigns used
                        </Typography>
                        <Typography variant="body2">
                          {Math.round(campaignsUsagePercent)}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={campaignsUsagePercent}
                        sx={{
                          mt: 1,
                          height: 8,
                          borderRadius: 999,
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(to right, #00e5ff, #b388ff)",
                          },
                        }}
                      />
                    </Box>

                    {/* Key metrics */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: "rgba(255,255,255,0.03)",
                          }}
                        >
                          <Typography
                            variant="overline"
                            sx={{ color: "#bbb", letterSpacing: 1 }}
                          >
                            Contacts
                          </Typography>
                          <Typography variant="h6" fontWeight="700">
                            {contacts.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#bbb" }}>
                            Total subscribers in your workspace.
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: "rgba(255,255,255,0.03)",
                          }}
                        >
                          <Typography
                            variant="overline"
                            sx={{ color: "#bbb", letterSpacing: 1 }}
                          >
                            Emails this month
                          </Typography>
                          <Typography variant="h6" fontWeight="700">
                            {emailsThisMonth.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#bbb" }}>
                            Estimated campaign emails sent.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Suggested next steps */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: "rgba(0,229,255,0.08)",
                        border: "1px solid rgba(0,229,255,0.3)",
                      }}
                    >
                      <Typography
                        variant="overline"
                        sx={{ color: "#00e5ff", letterSpacing: 1 }}
                      >
                        Recommended next step
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Start a new campaign targeting your most engaged
                        contacts, or connect an additional channel (like
                        WhatsApp or SMS) to increase your reach.
                      </Typography>
                    </Box>

                    {/* Quick actions (placeholder) */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "12px",
                          background:
                            "linear-gradient(to right, #00e5ff, #b388ff)",
                          color: "black",
                          fontWeight: "bold",
                          flex: 1,
                        }}
                        disabled
                      >
                        Create Campaign (Coming Soon)
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderRadius: "12px",
                          borderColor: "#00e5ff",
                          color: "#00e5ff",
                          flex: 1,
                        }}
                        disabled
                      >
                        Billing & Plan (Coming Soon)
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>

              {/* FALLBACK MESSAGE IF NO ORG DATA */}
              {!hasOrg && (
                <Typography
                  variant="body2"
                  sx={{ color: "#ffcc80", mt: 3 }}
                >
                  We couldn&apos;t find your organisation details in this
                  session. Try logging in again to refresh your profile
                  information.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}

