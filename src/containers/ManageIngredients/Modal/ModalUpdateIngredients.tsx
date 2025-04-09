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
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Fade,
} from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { colors } from "../../../styles/Color/color";
import adminIngredientsAPI from "../../../api/Services/adminIngredientsAPI";
import { toast } from "react-toastify";

interface UpdateIngredientModalProps {
  open: boolean;
  handleClose: () => void;
  ingredientId: string | number;
  onUpdateSuccess?: () => void;
}

interface IngredientData {
  ingredientId?: string | number;
  name: string;
  description: string;
  imageURL: string;
  minStockLevel: number;
  quantity: number;
  price: number;
}

interface FormFieldProps {
  icon: ReactNode;
  label: string;
  name: keyof IngredientData;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  multiline?: boolean;
  rows?: number;
  inputProps?: any;
  error?: boolean;
  helperText?: string;
}

const UpdateIngredientModal: React.FC<UpdateIngredientModalProps> = ({
  open,
  handleClose,
  ingredientId,
  onUpdateSuccess,
}) => {
  // States
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [initialQuantity, setInitialQuantity] = useState<number>(0);
  const [ingredientData, setIngredientData] = useState<IngredientData>({
    name: "",
    description: "",
    imageURL: "",
    minStockLevel: 0,
    quantity: 0,
    price: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch ingredient data
  const fetchIngredientData = async () => {
    setLoading(true);
    try {
      const res: any = await adminIngredientsAPI.getListIngredientsDetail(
        ingredientId
      );
      const data = res?.data;

      // Store the initial quantity for validation
      setInitialQuantity(data?.quantity || 0);

      setIngredientData({
        ingredientId: data?.ingredientId,
        name: data?.name || "",
        description: data?.description || "",
        imageURL: data?.imageURL || "",
        minStockLevel: data?.minStockLevel || 0,
        quantity: data?.quantity || 0,
        price: data?.price || 0,
      });
    } catch (error) {
      console.error("Error fetching ingredient details:", error);
      toast.error("Không thể tải thông tin nguyên liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && ingredientId) {
      fetchIngredientData();
    }
  }, [open, ingredientId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      const numValue = value === "" ? initialQuantity : Number(value);
      setIngredientData({
        ...ingredientData,
        [name]: Math.max(numValue, initialQuantity),
      });
    } else {
      setIngredientData({
        ...ingredientData,
        [name]:
          name === "name" || name === "description" || name === "imageURL"
            ? value
            : value === ""
            ? 0
            : Number(value),
      });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!ingredientData.name.trim()) {
      newErrors.name = "Tên nguyên liệu không được để trống";
    }

    if (ingredientData.minStockLevel < 0) {
      newErrors.minStockLevel = "Mức tối thiểu không được âm";
    }

    if (ingredientData.quantity < initialQuantity) {
      newErrors.quantity = `Số lượng không được nhỏ hơn ${initialQuantity}`;
    }

    if (ingredientData.price < 0) {
      newErrors.price = "Giá không được âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await adminIngredientsAPI.updateIngredients(ingredientId, ingredientData);

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      toast.success("Cập nhật thành công");
      handleClose();
    } catch (error) {
      console.error("Error updating ingredient:", error);
      toast.error("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // Image preview
  const imagePreview = ingredientData.imageURL ? (
    <img
      src={ingredientData.imageURL}
      alt="Preview"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  ) : (
    <Box
      sx={{
        bgcolor: "rgba(0,0,0,0.1)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <InventoryIcon sx={{ fontSize: 64, color: "rgba(0,0,0,0.2)" }} />
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: colors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" color={colors.white} fontWeight="bold">
          Cập nhật nguyên liệu
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: colors.white,
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Fade in={!loading} timeout={500}>
            <Box>
              <Grid container spacing={3}>
                {/* Left Column - Image Preview */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        mb: 2,
                        overflow: "hidden",
                        width: "100%",
                        height: 250,
                      }}
                    >
                      {imagePreview}
                    </Paper>
                  </Box>
                </Grid>

                {/* Right Column - Form Fields */}
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormField
                        icon={<TextFieldsIcon color="primary" />}
                        label="Tên nguyên liệu"
                        name="name"
                        value={ingredientData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormField
                        icon={<DescriptionIcon color="primary" />}
                        label="Mô tả"
                        name="description"
                        value={ingredientData.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormField
                        icon={<InventoryIcon color="primary" />}
                        label={`Số lượng (Tối thiểu: ${initialQuantity})`}
                        name="quantity"
                        value={ingredientData.quantity}
                        onChange={handleChange}
                        type="number"
                        inputProps={{ min: initialQuantity }}
                        error={!!errors.quantity}
                        helperText={errors.quantity}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormField
                        icon={<WarningAmberIcon color="primary" />}
                        label="Mức tối thiểu"
                        name="minStockLevel"
                        value={ingredientData.minStockLevel}
                        onChange={handleChange}
                        type="number"
                        inputProps={{ min: 0 }}
                        error={!!errors.minStockLevel}
                        helperText={errors.minStockLevel}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormField
                        icon={<MonetizationOnIcon color="primary" />}
                        label="Giá"
                        name="price"
                        value={ingredientData.price}
                        onChange={handleChange}
                        type="number"
                        inputProps={{ min: 0, step: 1000 }}
                        error={!!errors.price}
                        helperText={errors.price}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Actions */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    submitting ? <CircularProgress size={20} /> : <SaveIcon />
                  }
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </Box>
            </Box>
          </Fade>
        )}
      </DialogContent>
    </Dialog>
  );
};

const FormField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  multiline = false,
  rows = 1,
  inputProps = {},
  error = false,
  helperText = "",
}: FormFieldProps) => (
  <TextField
    fullWidth
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    variant="outlined"
    size="medium"
    type={type}
    multiline={multiline}
    rows={rows}
    error={error}
    helperText={helperText}
    InputProps={{
      startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
      ...inputProps,
    }}
    sx={{
      mb: 2,
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
      },
    }}
  />
);

export default UpdateIngredientModal;
