import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import SignatureCanvas from "react-signature-canvas";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  getProofOfDelivery,
  uploadProofOfDelivery,
} from "../../../api/services/proofOfDeliveryService";
import { ProofOfDeliveryDto } from "../../../types/proofOfDelivery";

interface ProofOfDeliveryFormProps {
  shippingOrderId: string;
}

const ProofOfDeliveryForm: React.FC<ProofOfDeliveryFormProps> = ({
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
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch existing proof of delivery if available
  useEffect(() => {
    const fetchExistingProof = async () => {
      if (!shippingOrderId) return;

      try {
        setLoading(true);
        const response = await getProofOfDelivery(parseInt(shippingOrderId));
        if (response.success && response.data) {
          setExistingProof(response.data);
          setDeliveryNotes(response.data.deliveryNotes || "");

          // If there's an existing signature, display it
          if (response.data.base64Signature && sigCanvas.current) {
            const img = new Image();
            img.onload = () => {
              const ctx = sigCanvas.current?.getCanvas().getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0);
              }
            };
            img.src = `data:image/png;base64,${response.data.base64Signature}`;
          }

          // If there's an existing image, display it
          if (response.data.base64Image) {
            setImagePreview(
              `data:${response.data.imageType || "image/jpeg"};base64,${
                response.data.base64Image
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
  }, [shippingOrderId]);

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

      // Get signature as base64 string
      let base64Signature = "";
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        base64Signature = sigCanvas.current
          .getCanvas()
          .toDataURL("image/png")
          .replace("data:image/png;base64,", "");
      }

      // Prepare form data
      const formData = {
        base64Signature: base64Signature || undefined,
        deliveryNotes: deliveryNotes || undefined,
        proofImage: selectedFile || undefined,
      };

      // Submit the form
      const response = await uploadProofOfDelivery(
        parseInt(shippingOrderId),
        formData
      );

      if (response.success) {
        showSnackbar("Proof of delivery saved successfully", "success");
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
                }}
              >
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    width: "100%",
                    height: 190,
                    className: "signature-canvas",
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
            <Grid item xs={12} sx={{ mt: 2 }}>
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
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {existingProof?.proofTimestamp
                  ? `Last updated: ${new Date(
                      existingProof.proofTimestamp
                    ).toLocaleString()}`
                  : "No existing proof of delivery found"}
              </Typography>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
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

export default ProofOfDeliveryForm;
