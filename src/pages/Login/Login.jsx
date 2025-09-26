import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Link,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import logo from "../../../public/logo.png";
import leftBg from "../../../public/login-left-bg.png";
import rightBg from "../../../public/login-right-bg.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/authSlice";
import API from "../../utils/api";
import CustomSnackbar from "../../components/snackbar/Snackbar";

const StyledPaper = styled(Paper)({
  padding: "2rem",
  maxWidth: 400,
  margin: "auto",
  textAlign: "center",
  borderRadius: "12px",
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Close the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // login api
  const handleLogin = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await API.post("api/Auth/admin/login", formData);
      console.log(response);

      if (response?.data?.status === true) {
        setSnackbarMessage(response?.data?.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        dispatch(
          login({
            // user: response?.data?.data,
            user: "Admin",
            token: response?.data.data[0]?.jwtToken,
          })
        );

        setTimeout(() => navigate("/dashboard"), 1000);
      } else if (response?.data?.status === false) {
        setSnackbarMessage(response?.data?.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setSnackbarMessage("Something went wrong!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="false"
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        backgroundImage: "url('../../public/login-bg.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Snackbar Component */}
      <CustomSnackbar
        snackbarOpen={snackbarOpen}
        snackbarMessage={snackbarMessage}
        snackbarSeverity={snackbarSeverity}
        handleCloseSnackbar={handleCloseSnackbar}
      />
      <img
        src={leftBg}
        alt="sdv"
        width={550}
        style={{ position: "absolute", bottom: 0, left: 0 }}
      />
      <img
        src={rightBg}
        alt="sdv"
        width={550}
        style={{ position: "absolute", bottom: 0, right: 0 }}
      />
      <StyledPaper sx={{ width: "100%" }} elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <img
            style={{ transition: "ease", marginBottom: 20 }}
            src={logo}
            alt=""
            width={"40%"}
            // height={"140"}
          />
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            variant="outlined"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
            mt={1}
          >
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember this Device"
            />
            <Link href="#" variant="body2">
              Forgot Password?
            </Link>
          </Box> */}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1.2, bgcolor: "#5C1870" }}
            onClick={() => handleLogin()}
          >
            Login In
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Login;
