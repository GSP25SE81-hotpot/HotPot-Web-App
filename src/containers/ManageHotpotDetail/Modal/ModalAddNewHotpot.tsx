/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip,
  Fade,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import React, { ReactNode, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DescriptionIcon from "@mui/icons-material/Description";
import StraightenIcon from "@mui/icons-material/Straighten";
import StyleIcon from "@mui/icons-material/Style";
import AddIcon from "@mui/icons-material/Add";
import adminHotpot from "../../../api/Services/adminHotpot";
import { toast } from "react-toastify";

interface ProductEditPopupProps {
  handleOpen: boolean;
  handleClose: () => void;
  productData: any | null;
  onSave: () => void;
}

interface ProductData {
  name: string;
  material: string;
  size: string;
  description: string;
  imageURLs: string[];
  price: number;
  basePrice: number;
  status: boolean;
  seriesNumbers: string[];
}

interface DetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  fullWidth?: boolean;
}

const ProductEditPopup: React.FC<ProductEditPopupProps> = ({
  handleOpen,
  handleClose,
  productData,
  onSave,
}) => {
  // Form state
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    material: "",
    size: "",
    description: "",
    imageURLs: [],
    price: 0,
    basePrice: 0,
    status: true,
    seriesNumbers: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [tempSeriesNumber, setTempSeriesNumber] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when productData changes
  useEffect(() => {
    if (productData) {
      setFormData({
        ...productData,
        // Ensure we have seriesNumbers from inventoryItems if needed
        seriesNumbers: productData.seriesNumbers || [],
      });
    }
  }, [productData]);

  // Handle form field changes
  const handleFieldChange = (field: keyof ProductData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for the field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle adding a new series number
  const handleAddSeriesNumber = () => {
    if (!tempSeriesNumber.trim()) return;

    // Check if the series number already exists
    if (formData.seriesNumbers.includes(tempSeriesNumber.trim())) {
      setErrors((prev) => ({
        ...prev,
        seriesNumber: "Mã series đã tồn tại",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      seriesNumbers: [...prev.seriesNumbers, tempSeriesNumber.trim()],
    }));
    setTempSeriesNumber("");

    // Clear error
    if (errors.seriesNumber) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.seriesNumber;
        return newErrors;
      });
    }
  };

  // Handle removing a series number
  const handleRemoveSeriesNumber = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      seriesNumbers: prev.seriesNumbers.filter((_, i) => i !== index),
    }));
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    }

    if (formData.price <= 0) {
      newErrors.price = "Giá không được âm";
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = "Giá gốc không được âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const serialID = productData.inventoryItems.map((seri: any) => {
        return seri.seriesNumber;
      });

      const prepareData = {
        name: formData.name,
        material: formData.material,
        size: formData.size,
        description: formData.description,
        imageURLs: formData.imageURLs,
        price: formData.price,
        basePrice: formData.basePrice,
        status: true,
        seriesNumbers: [...formData.seriesNumbers, ...serialID],
      };

      const res: any = await adminHotpot.updateAddHotpot(
        productData?.hotpotId,
        prepareData
      );

      console.log(res);
      handleClose();
      toast.success("Cập nhật thành công");

      onSave();
    } catch (error) {
      console.error("Error saving product:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Có lỗi xảy ra khi lưu sản phẩm",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={handleOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#1976d2",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" color="white" fontWeight="bold">
          Chỉnh sửa sản phẩm
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "white",
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Fade in={true} timeout={500}>
          <Box>
            <Grid container spacing={3}>
              {/* Left column - Images */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    height: 400,
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {formData.imageURLs && formData.imageURLs.length > 0 && (
                    <>
                      <img
                        src={formData.imageURLs[0]}
                        alt={formData.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x400?text=Invalid+Image+URL";
                        }}
                      />
                    </>
                  )}
                </Paper>
              </Grid>

              {/* Right column - Product details */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Tên sản phẩm"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                  />

                  <Box sx={{ mb: 2, mt: 2, display: "flex", gap: 2 }}>
                    <TextField
                      label="Giá bán"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleFieldChange("price", Number(e.target.value))
                      }
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2">VND</Typography>
                        ),
                      }}
                      error={!!errors.price}
                      helperText={errors.price}
                      fullWidth
                    />
                    <TextField
                      label="Giá gốc"
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) =>
                        handleFieldChange("basePrice", Number(e.target.value))
                      }
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2">VND</Typography>
                        ),
                      }}
                      error={!!errors.basePrice}
                      helperText={errors.basePrice}
                      fullWidth
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <DetailItem
                      icon={<StyleIcon color="primary" />}
                      label="Chất liệu"
                      value={formData.material}
                    />

                    <DetailItem
                      icon={<StraightenIcon color="primary" />}
                      label="Kích thước"
                      value={formData.size}
                    />

                    <Grid item xs={12}>
                      <DetailItem
                        icon={<DescriptionIcon color="primary" />}
                        label="Mô tả"
                        value={formData.description}
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Mã Series:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TextField
                        size="small"
                        label="Nhập mã series"
                        value={tempSeriesNumber}
                        onChange={(e) => setTempSeriesNumber(e.target.value)}
                        error={!!errors.seriesNumber}
                        helperText={errors.seriesNumber}
                        sx={{ flexGrow: 1 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddSeriesNumber}
                        sx={{ ml: 1, height: 40 }}
                      >
                        Thêm
                      </Button>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {formData.seriesNumbers &&
                      formData.seriesNumbers.length > 0 ? (
                        formData.seriesNumbers.map((series, index) => (
                          <Chip
                            key={index}
                            label={series}
                            size="small"
                            onDelete={() => handleRemoveSeriesNumber(index)}
                            sx={{ mb: 1 }}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Không có mã series
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {errors.form && (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                      {errors.form}
                    </Typography>
                  )}

                  <Box sx={{ mt: "auto", pt: 4, display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      fullWidth
                      size="large"
                      onClick={handleClose}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      startIcon={
                        loading ? <CircularProgress size={20} /> : <SaveIcon />
                      }
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      Lưu thay đổi
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </DialogContent>
    </Dialog>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
  fullWidth = false,
}: DetailItemProps) => (
  <Grid item xs={fullWidth ? 12 : 6}>
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "rgba(0,0,0,0.02)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon}
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body1" fontWeight="medium">
        {value}
      </Typography>
    </Paper>
  </Grid>
);

export default ProductEditPopup;
