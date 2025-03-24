/* eslint-disable @typescript-eslint/no-unused-vars */
// src/containers/ProofOfDelivery/Form/MockProofOfDeliveryForm.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SignatureCanvas from "react-signature-canvas";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { ProofOfDeliveryDto } from "../../../types/proofOfDelivery";
import {
  mockExistingProof,
  mockSaveProofResponse,
} from "../../../types/mockData";

interface MockProofOfDeliveryFormProps {
  shippingOrderId: string;
}

const MockProofOfDeliveryForm: React.FC<MockProofOfDeliveryFormProps> = ({
  shippingOrderId,
}) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [existingProof, setExistingProof] = useState<ProofOfDeliveryDto | null>(
    null
  );
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasExistingProof, setHasExistingProof] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [orientation, setOrientation] = useState(
    window.innerHeight > window.innerWidth ? "portrait" : "landscape"
  );

  useEffect(() => {
    const handleResize = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Simulate fetching existing proof of delivery
  useEffect(() => {
    const fetchExistingProof = async () => {
      if (!shippingOrderId) return;

      try {
        setLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (hasExistingProof) {
          // Use mock data
          setExistingProof(mockExistingProof);
          setDeliveryNotes(mockExistingProof.deliveryNotes || "");

          // If there's an existing signature, display it
          if (mockExistingProof.base64Signature && sigCanvas.current) {
            const img = new Image();
            img.onload = () => {
              const ctx = sigCanvas.current?.getCanvas().getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0);
              }
            };
            img.src = `data:image/png;base64,${mockExistingProof.base64Signature}`;
          }

          // If there's an existing image, display it
          if (mockExistingProof.base64Image) {
            setImagePreview(
              `data:${mockExistingProof.imageType || "image/jpeg"};base64,${
                mockExistingProof.base64Image
              }`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching existing proof:", error);
        showSnackbar("Failed to load existing proof of delivery", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchExistingProof();
  }, [shippingOrderId, hasExistingProof]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async () => {
    if (!shippingOrderId) {
      showSnackbar("Shipping order ID is required", "error");
      return;
    }

    try {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful response
      const response = mockSaveProofResponse;

      if (response.success) {
        showSnackbar("Proof of delivery saved successfully", "success");
        // Update the hasExistingProof state to show the data was saved
        setHasExistingProof(true);
      } else {
        showSnackbar("Failed to save proof of delivery", "error");
      }
    } catch (error) {
      console.error("Error submitting proof of delivery:", error);
      showSnackbar("An error occurred while saving proof of delivery", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        {/* Mock Controls - Only for demo purposes */}
        <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Mock Controls (Demo Only)
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={hasExistingProof}
                onChange={(e) => setHasExistingProof(e.target.checked)}
              />
            }
            label="Simulate existing proof of delivery"
          />
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Delivery Notes */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Delivery Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Enter any notes about the delivery"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
              />
            </Grid>

            {/* Signature Pad */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Customer Signature
              </Typography>
              <Paper
                elevation={2}
                sx={{
                  p: 1,
                  border: "1px dashed #ccc",
                  backgroundColor: "#f9f9f9",
                  height: "200px",
                  touchAction: "none",
                }}
              >
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    width: "100%",
                    height: orientation === "landscape" ? 150 : 190,
                    className: "signature-canvas",
                    style: {
                      touchAction: "none",
                      msTouchAction: "none",
                    },
                  }}
                  backgroundColor="rgba(255, 255, 255, 0)"
                />
              </Paper>
              <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={clearSignature}
                  size="small"
                >
                  Clear Signature
                </Button>
              </Box>
            </Grid>

            {/* Image Upload */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Proof of Delivery Image
              </Typography>

              {imagePreview ? (
                <Box sx={{ mt: 2, position: "relative" }}>
                  <img
                    src={imagePreview}
                    alt="Proof of delivery"
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "contain",
                      border: "1px solid #eee",
                      borderRadius: "4px",
                    }}
                  />
                  <Box
                    sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={clearImage}
                      size="small"
                      color="error"
                    >
                      Remove Image
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <CloudUploadIcon
                    sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
                  />
                  <Typography variant="body1" gutterBottom>
                    Click to upload an image
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or drag and drop (PNG, JPG)
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Timestamp */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {existingProof?.proofTimestamp
                  ? `Last updated: ${new Date(
                      existingProof.proofTimestamp
                    ).toLocaleString()}`
                  : "No existing proof of delivery found"}
              </Typography>
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
              <Divider sx={{ mb: 3 }} />
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Proof of Delivery"}
              </Button>
            </Grid>
          </Grid>
        )}
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MockProofOfDeliveryForm;
