import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Fab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  CircularProgress,
} from "@mui/material";

import FlashOnIcon from "@mui/icons-material/FlashOn";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAppSelector } from "../../store/hooks";
import { selectOrgData } from "../../store/slices/organisationSlice";


const PAGE_SIZE = 10;


/* -------------------------------
   CHECK IF PRODUCT IS LOCKED
--------------------------------*/
function getMarketingLockInfo(marketingDate) {
  if (!marketingDate) return { locked: false, daysLeft: 0 };

  const marketedDate = new Date(marketingDate);
  const now = new Date();

  const diffMs = now - marketedDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 10) {
    return {
      locked: true,
      daysLeft: Math.ceil(10 - diffDays),
    };
  }
  return { locked: false, daysLeft: 0 };
}

/* -------------------------------
   MOCK API — REPLACE WITH REAL API
--------------------------------*/
function mockFetchProducts(page = 1, limit = PAGE_SIZE) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit + 1;

      const products = Array.from({ length: limit }, (_, i) => {
        const id = start + i;

        // give some sample marketed_at dates for UI testing
        const marketed_at =
          id % 4 === 0
            ? new Date(Date.now() - id * 86400000).toISOString()
            : null;

        return {
          id,
          name: `Product ${id}`,
          description: `Short description for Product ${id}.`,
          marketed: !!marketed_at,
          marketed_at,
        };
      });

      const hasMore = page < 5;

      resolve({ products, hasMore });
    }, 600);
  });
}

/* -------------------------------
   MAIN DASHBOARD COMPONENT
--------------------------------*/
export default function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const [productList, setProductList]= useState([]);
  const [isProductListLoading, setIsProductListLoading] = useState(true);
  const org = useAppSelector(selectOrgData);

  // Get organisation name from Redux data
  // const getOrganisationName = () => {
  //   if (!org) return "Your Products";
    
  //   // Try different possible field names for organisation name
  //   const orgName = org.org_name || 
  //                  org.name || 
  //                  org.organisation_name ||
  //                  (typeof org === "string" ? org : null);
    
  //   return orgName || "Your Products";
  // };

  console.log("Org Data---", org)

  const getProductsByPageSize = (page, size) => {
    console.log("List------", productList.length, page, size, page*size, productList.length > (page*size))
    const isMoreDataAvailable =  productList.length > (page*size);
    console.log("IsMoreDataAvailable---", isMoreDataAvailable)
    return {
      products: productList.splice(page-1, page*size),
      hasMore: isMoreDataAvailable
    }
  }


  const loadPage = useCallback(
    async (p = page) => {
      console.log("LoadPage is called", loading, !hasMore)
      if (loading || !hasMore) return;
      
      setLoading(true);
      try {
        const { products: newData, hasMore: more } = getProductsByPageSize(p, PAGE_SIZE)
        console.log("New Data---", newData, more)
        setProducts((prev) => [...prev, ...newData]);
        setHasMore(more);
        setPage(p + 1);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, loading, hasMore, productList]
  );

  const fetchProductList =async ()=>{
    try {
      const response = await api.getProductsData();
      setProductList(response)
      setIsProductListLoading(false);
    } catch(error){
      console.log("Error----", error)
    }
  }

  useEffect(() => {
    fetchProductList();
  }, []);

  useEffect(()=>{
    productList.length && loadPage(1);
  },[productList])

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          loadPage(page);
          console.log("Triggering from intersection")
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current && sentinelRef.current)
        observerRef.current.unobserve(sentinelRef.current);
    };
  }, [loadPage, loading, hasMore]);

  /* -------------------------------
      HANDLERS
  --------------------------------*/
  const handleDetails = (p) => {
    console.log(p.id);
    navigate(`/products/${p.product_id}`)};
  const handleChatbot = (p) => navigate(`/products/${p.product_id}/chatbot`);
  const handleAnalysis = (p) => navigate(`/products/${p.product_id}/analysis`);
  const handleAddProduct = () => navigate("/addproduct");

  const [navValue, setNavValue] = useState("products");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0F24, #051018)",
        color: "#fff",
        pb: 8,
      }}
    >
      {/* LOGO */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          zIndex: 10,
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
          AutoMarket
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          {org?org.org_name:'Your Products'}
        </Typography>

        <Typography sx={{ color: "#bbb", mb: 3 }}>
          Manage your products and run marketing campaigns.
        </Typography>

        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            sx={{
              background: "linear-gradient(to right,#00e5ff,#b388ff)",
              color: "black",
              borderRadius: "12px",
              textTransform: "none",
            }}
          >
            Add Product
          </Button>
        </Stack>

        {/* PRODUCT LIST */}
        {isProductListLoading?<Box>Loading....</Box>:
        <Paper
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 2,
            p: 2,
          }}
        >
          <List>
            {products.map((p) => {
              const { locked, daysLeft } = getMarketingLockInfo(
                p.marketing_date
              );

              return (
                <React.Fragment key={p.product_id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#ffffff",
                            cursor: "pointer",
                            "&:hover": { color: "#00e5ff" },
                          }}
                          onClick={() => handleDetails(p)} // CLICK NAME
                        >
                          {p.product_name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: "rgba(0, 229, 255, 0.6)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {p.product_description}
                        </Typography>
                      }
                    />

                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={1}>
                        {/* MARKET & CHAT */}
                        <Button
                          variant="text"
                          disabled={locked}
                          startIcon={<ChatBubbleOutlineIcon />}
                          onClick={() => !locked && handleChatbot(p)}
                          sx={{
                            borderRadius: "10px",
                            color: "#00e5ff",
                            cursor: locked ? "not-allowed" : "pointer",
                            textTransform: "none",
                            "&.Mui-disabled": {
                              color: "#6b6b6b",          // disabled text color
                              opacity: 0.6,
                              cursor: "not-allowed",
                            },
                          }}
                        >
                          {locked
                            ? `Locked (${daysLeft} days)`
                            : "Market & Chat"}
                        </Button>

                        {/* ANALYSIS BUTTON */}
                        {p.marketing_date && (
                          <Button
                            variant="text"
                            startIcon={<AnalyticsOutlinedIcon />}
                            onClick={() => handleAnalysis(p)}
                            sx={{
                              color: "#00e5ff",
                              textTransform: "none",
                            }}
                          >
                            Analysis
                          </Button>
                        )}
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
                </React.Fragment>
              );
            })}

            {/* INFINITE SCROLL SENTINEL */}
            <ListItem ref={sentinelRef} sx={{ justifyContent: "center" }}>
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#00e5ff" }} />
              ) : !hasMore ? (
                <Typography sx={{ color: "#777" }}>No more products</Typography>
              ) : (
                <Typography sx={{ color: "#777" }}>
                  Scroll to load more
                </Typography>
              )}
            </ListItem>
          </List>
        </Paper>}
      </Container>

      {/* FLOATING ADD BUTTON */}
      <Fab
        onClick={handleAddProduct}
        sx={{
          position: "fixed",
          right: 20,
          bottom: 82,
          background: "linear-gradient(to right,#00e5ff,#b388ff)",
          color: "black",
        }}
      >
        <AddIcon />
      </Fab>

      {/* BOTTOM NAV */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backdropFilter: "blur(6px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
        elevation={3}
      >
        <BottomNavigation
          value={navValue}
          onChange={(e, nv) => {
            setNavValue(nv);
            if (nv === "products") navigate("/products");
            if (nv === "profile") navigate("/profile");
            if (nv === "dashboard") navigate("/campaigns");
          }}
          sx={{
            "& .Mui-selected": { color: "#00e5ff" },
            "& .MuiBottomNavigationAction-root": { color: "#7aa0b5" },
          }}
        >
          <BottomNavigationAction
            label="Products"
            value="products"
            icon={<HomeOutlinedIcon />}
          />
          <BottomNavigationAction
            label="Profile"
            value="profile"
            icon={<PersonOutlineIcon />}
          />
          <BottomNavigationAction
            label="Campaigns"
            value="dashboard"
            icon={<AnalyticsOutlinedIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
