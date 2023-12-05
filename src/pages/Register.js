import React, { useState } from "react";

import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "../components/common/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import BannerImage from "../assets/about.webp";
import { makeStyles } from "@mui/styles"; // Import makeStyles for custom styles

const useStyles = makeStyles((theme) => ({
  signin: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BannerImage})`,
    backgroundSize: "cover",
    minHeight: "100vh",
  },
}));

export default function Register() {
  const classes = useStyles(); // Add Material-UI styles

  const [emailUsed, setEmailUsed] = useState(false);
  const [usernameUsed, setUsernameUsed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState("password");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [openTermsDialog, setOpenTermsDialog] = useState(false);
  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
    setPasswordInputType(showPassword ? "password" : "text");
  };
  const currentDate = new Date();
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  const formattedDate = currentDate.toLocaleString("en-US", options);

  const [formData, setFormData] = useState({
    _fName: "",
    _lName: "",
    _email: "",
    _pwd: "",
    _userName: "",
    _phone: "",
    _bday: "",
    _address: "",
    _date: formattedDate,
  });
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleAgreeToTermsChange = (event) => {
    setAgreeToTerms(event.target.checked);
  };

  const handleOpenTermsDialog = () => {
    setOpenTermsDialog(true);
  };

  const handleCloseTermsDialog = () => {
    setOpenTermsDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { _fName, _lName, _email, _pwd, _userName } = formData;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

    if (!nameRegex.test(_fName) || !nameRegex.test(_lName)) {
      toast.error(
        "First name and last name must contain only alphabetic characters"
      );
      return;
    }

    if (!usernameRegex.test(_userName)) {
      toast.error("Username must contain only alphanumeric characters");
      return;
    }
    if (_userName.length < 8) {
      toast.error("Username must be at least 8 characters long");
      return;
    }
    if (!emailRegex.test(_email)) {
      toast.error("Invalid email address");
      return;
    }
    if (_pwd.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!lowercaseRegex.test(_pwd)) {
      toast.error("Password must contain an lowercase character");
      return;
    }
    if (!uppercaseRegex.test(_pwd)) {
      toast.error("Password must contain an uppercase character");
      return;
    }
    if (!digitRegex.test(_pwd)) {
      toast.error("Password must contain a number");
      return;
    }
    if (!specialCharRegex.test(_pwd)) {
      toast.error("Password must contain a special character");
      return;
    }
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/register",
        formData
      );
      console.log("Registration successful", response.data);
      toast.success("Registration successful", {
        autoClose: 500,
        onClose: () => {
          navigate("/login");
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const { field } = error.response.data;
        if (field === "email") {
          setEmailUsed(true);
        } else if (field === "username") {
          setUsernameUsed(true);
        }
      } else {
        console.error("Registration failed", error);
        toast.error("Registration failed. Please try again later.");
      }
    }
  };
  const calculateEighteenYearsAgo = () => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18);
    return currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
  };

  return (
    <div className={classes.signin}>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontSize: "30px", fontWeight: "bold" }}
            gutterBottom
            marked="center"
            align="center"
          >
            SIGN UP
          </Typography>
          <Typography align="center">
            {"Already have an account? "}
            <Link to="/login" align="center" className="link">
              Login here
            </Link>
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="_fName"
                  label="First Name"
                  fullWidth
                  onChange={handleChange}
                  value={formData._fName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="_lName"
                  label="Last Name"
                  fullWidth
                  onChange={handleChange}
                  value={formData._lName}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="_phone"
                  label="Phone Number"
                  fullWidth
                  onChange={handleChange}
                  value={formData._phone}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  name="_bday"
                  label="Birthday"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  onChange={handleChange}
                  value={formData._bday}
                  required
                  inputProps={{
                    max: calculateEighteenYearsAgo(), // Set the max date to 18 years ago
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="_address"
                  label="Address"
                  fullWidth
                  onChange={handleChange}
                  value={formData._address}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="_userName"
                  label="Username"
                  fullWidth
                  onChange={handleChange}
                  value={formData._userName}
                  required
                  autoComplete="userName"
                  error={usernameUsed}
                  helperText={usernameUsed ? "Username is already used" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="_email"
                  label="Email Address"
                  fullWidth
                  onChange={handleChange}
                  value={formData._email}
                  required
                  autoComplete="email"
                  error={emailUsed}
                  helperText={emailUsed ? "Email is already used" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="_pwd"
                  label="Password"
                  fullWidth
                  type={passwordInputType}
                  onChange={handleChange}
                  value={formData._pwd}
                  required
                  autoComplete="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleShowPasswordToggle}
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeToTerms}
                      onChange={handleAgreeToTermsChange}
                      value="agreeToTerms"
                      color="primary"
                    />
                  }
                  label="I agree to the terms and conditions."
                  required
                  onClick={handleOpenTermsDialog} // Open terms dialog when clicked
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#83948a" }}
            >
              Sign Up
            </Button>
          </form>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/" variant="caption" className="link">
                Go back to home
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
      {/* Terms and conditions dialog */}
      <Dialog open={openTermsDialog} onClose={handleCloseTermsDialog}>
        <DialogTitle style={{ fontSize: "1.2rem" }}>
          Terms and Conditions
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p style={{ fontSize: "0.9rem" }}>
              By creating an account with JMIG, you agree to the following terms
              and conditions:
            </p>
            <ol style={{ fontSize: "0.9rem" }}>
              <li>
                <strong>Eligibility:</strong>
                <ul>
                  <li>
                    You must be at least 18 years of age to register for an
                    account on JMIG.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Account Information:</strong>
                <ul>
                  <li>
                    You are responsible for providing accurate and complete
                    information during registration.
                  </li>
                  <li>
                    You must choose a secure password and keep it confidential.
                  </li>
                </ul>
              </li>
              <li>
                <strong>User Conduct:</strong>
                <ul>
                  <li>
                    You agree not to engage in any unlawful, abusive, or harmful
                    behavior on JMIG.
                  </li>
                  <li>
                    You will not use JMIG for any unauthorized or illegal
                    purposes.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Privacy:</strong>
                <ul>
                  <li>
                    JMIG may collect and use your personal information as
                    described in our Privacy Policy.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Disclaimer:</strong>
                <ul>
                  <li>
                    JMIG is provided "as is" without any warranties or
                    guarantees.
                  </li>
                  <li>
                    JMIG is not responsible for any user-generated content or
                    actions.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Changes to Terms:</strong>
                <ul>
                  <li>
                    JMIG may update these terms and conditions from time to
                    time. It is your responsibility to review them periodically.
                  </li>
                </ul>
              </li>
            </ol>
            <p style={{ fontSize: "0.9rem" }}>
              By clicking "I agree to the terms and conditions," you acknowledge
              that you have read and accept these terms.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTermsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}