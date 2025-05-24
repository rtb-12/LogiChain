import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Alert,
  Stack,
  Link,
  Container,
  useTheme,
} from "@mui/material";
import { AccountCircle, HelpOutline } from "@mui/icons-material";
import { LineChart, BarChart } from "@mui/x-charts";
import { keyframes } from "@emotion/react";

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const HomePage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
        linear-gradient(
          45deg,
          ${theme.palette.background.default} 0%,
          #0a0b1a 30%,
          #1a1b2f 70%,
          ${theme.palette.background.default} 100%
        )
      `,
        animation: `${gradient} 15s ease infinite`,
        backgroundSize: "400% 400%",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.1,
        }}
      />

      <AppBar
        position="sticky"
        sx={{
          bgcolor: "rgba(10, 11, 26, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              background: "linear-gradient(45deg, #6366f1 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            LogiChain
          </Typography>

          <Stack direction="row" spacing={3} sx={{ mr: 4 }}>
            {["Pipelines", "Runners", "Billing", "Governance"].map((item) => (
              <Button
                key={item}
                sx={{
                  color: "white",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                {item}
              </Button>
            ))}
          </Stack>

          <Chip
            label="DevNet"
            sx={{
              mr: 2,
              bgcolor: "rgba(99, 102, 241, 0.2)",
              color: "#6366f1",
            }}
          />
          <IconButton sx={{ color: "white" }}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            bgcolor: "rgba(234, 179, 8, 0.15)",
            backdropFilter: "blur(4px)",
          }}
        >
          Sui Network: Elevated latency detected (12s block times)
        </Alert>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries({
            "Active Jobs": { value: "142", change: "+12%" },
            "Registered Runners": { value: "4.2M LOGI", change: "89 Online" },
            "Pending Payments": { value: "82.4k LOGI", change: "3 Chains" },
            "Attestation Rate": { value: "98.6%", change: "Audited" },
            "DAO Proposals": { value: "5 Active", change: "2 Ending" },
          }).map(([title, data], i) => (
            <Grid item xs={12} sm={6} lg={2.4} key={title}>
              <Card
                sx={{
                  bgcolor: "rgba(17, 18, 36, 0.7)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#818cf8",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {title} <HelpOutline fontSize="inherit" sx={{ ml: 0.5 }} />
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "white",
                      mb: 1,
                      fontWeight: "bold",
                    }}
                  >
                    {data.value}
                  </Typography>
                  <Chip
                    label={data.change}
                    size="small"
                    sx={{
                      bgcolor: "rgba(99, 102, 241, 0.2)",
                      color: "#6366f1",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #6366f1 0%, #a855f7 100%)",
              color: "white",
              py: 1.5,
              px: 4,
              borderRadius: "12px",
              "&:hover": { transform: "scale(1.05)" },
              transition: "transform 0.3s",
            }}
          >
            ⚡ Trigger Pipeline
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                borderColor: "#6366f1",
                background: "rgba(99, 102, 241, 0.1)",
              },
            }}
          >
            🖥️ Register Runner
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                borderColor: "#6366f1",
                background: "rgba(99, 102, 241, 0.1)",
              },
            }}
          >
            ✍️ Create Proposal
          </Button>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                bgcolor: "rgba(17, 18, 36, 0.7)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                animation: `${float} 6s ease-in-out infinite`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    mb: 3,
                    fontWeight: "bold",
                  }}
                >
                  Recent Pipeline Activity
                </Typography>
                <Box sx={{ height: 300 }}>
                  <LineChart
                    series={[
                      {
                        data: [35, 44, 32, 59, 68],
                        color: "#6366f1",
                        area: true,
                        showMark: false,
                      },
                    ]}
                    xAxis={[
                      {
                        data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                        scaleType: "point",
                        label: "Last 5 Days",
                        labelStyle: { fill: "white" },
                      },
                    ]}
                    sx={{
                      ".MuiChartsAxis-tickLabel": { fill: "white" },
                      ".MuiChartsAxis-line": {
                        stroke: "rgba(255,255,255,0.1)",
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                bgcolor: "rgba(17, 18, 36, 0.7)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    mb: 3,
                    fontWeight: "bold",
                  }}
                >
                  Runner Health
                </Typography>
                <BarChart
                  series={[
                    {
                      data: [85, 92, 78, 95],
                      color: "#a855f7",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: ["NA", "EU", "AS", "SA"],
                      label: "Regions",
                      labelStyle: { fill: "white" },
                    },
                  ]}
                  height={250}
                  sx={{
                    ".MuiChartsAxis-tickLabel": { fill: "white" },
                    ".MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.1)" },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 6,
            py: 4,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            background:
              "linear-gradient(90deg, rgba(17, 18, 36, 0.7) 0%, rgba(10, 11, 26, 0.7) 100%)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  component="span"
                  sx={{ animation: `${float} 4s ease-in-out infinite` }}
                >
                  ⚡
                </Box>
                <Box component="span" sx={{ mx: 1 }}>
                  LogiChain v1.0.2 | Sui DevNet
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={3} justifyContent="flex-end">
                {["Docs", "GitHub", "Discord", "Terms"].map((link) => (
                  <Link
                    key={link}
                    href="#"
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      "&:hover": {
                        color: "#6366f1",
                        textDecoration: "none",
                      },
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
