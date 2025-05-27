/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  styled,
  Typography,
  Paper,
  Chip,
  IconButton,
  Divider,
  Stack,
  Alert,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { LoadingButton } from "@mui/lab";
import { updateComboSchema } from "../../../types/hotpot";
import config from "../../../configs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import adminComboAPI from "../../../api/Services/adminComboAPI";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { formatMoney } from "../../../utils/fn";
import IngredientsSelectorModal from "../../Createcombo/ModalCombo/IngredientsSelectorModal";

const StyledCard = styled(Card)(() => ({
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  backgroundColor: theme.palette.grey[50],
  border: "1px solid rgba(0, 0, 0, 0.05)",
}));

const IngredientCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  backgroundColor: "#fff",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  "&:hover": {
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
}));

const UpdateCombo: React.FC = () => {
  const { comboId } = useParams<{ comboId: string }>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [comboData, setComboData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Define validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Bắt buộc có tên sản phẩm"),
    description: Yup.string().trim().required("Bắt buộc có mô tả"),
    size: Yup.number()
      .required("Bắt buộc có kích thước")
      .min(1, "Kích thước phải lớn hơn 0"),
    imageURLs: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
    turtorialVideoID: Yup.number().required("Bắt buộc có kích thước"),
    ingredients: Yup.array()
      .of(
        Yup.object().shape({
          ingredientId: Yup.number().required("Thiếu ID nguyên liệu"),
          quantity: Yup.number()
            .required("Bắt buộc có số lượng")
            .min(1, "Số lượng phải lớn hơn 0"),
        })
      )
      .min(1, "Bắt buộc có ít nhất một nguyên liệu"),
  });

  // Initialize form with empty default values
  const methods = useForm<updateComboSchema>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: "",
      size: 0,
      imageURLs: [],
      turtorialVideoID: 0,
      ingredients: [],
    },
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  // Fetch combo data and update form
  useEffect(() => {
    const fetchData = async () => {
      if (!comboId) return;

      try {
        setIsLoading(true);
        const comboRes: any = await adminComboAPI.GetAdminComboDetail(comboId);

        console.log("Fetched combo data:", comboRes);
        setComboData(comboRes);

        // Format ingredients for both form and display
        let formattedIngredients: any[] = [];
        if (comboRes?.ingredients) {
          formattedIngredients = comboRes.ingredients.map(
            (ingredient: any) => ({
              ingredientId:
                ingredient.ingredientId || ingredient.ingredientID || 0,
              name: ingredient.name || "",
              quantity: ingredient.quantity || 1,
              price: ingredient.totalPrice || ingredient.price || 0,
              imageURL: ingredient.imageURL || "",
            })
          );
        }

        // Update form with fetched data
        const formData = {
          name: comboRes?.name || "",
          description: comboRes?.description || "",
          size: comboRes?.size || 0,
          imageURLs: comboRes?.imageURLs || [],
          turtorialVideoID: comboRes?.turtorialVideoID || 0,
          ingredients: formattedIngredients,
        };

        // Reset form with new data
        reset(formData);

        // Update ingredients state for display
        setIngredients(formattedIngredients);
      } catch (err: any) {
        console.error("Error fetching combo data:", err);
        toast.error(err?.message || "Lỗi tải dữ liệu combo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [comboId, reset]);

  //meat modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleModalSubmit = (selectedMeats: any[]) => {
    const updatedIngredients = selectedMeats.map((ingredient) => ({
      ingredientId: ingredient.ingredientId || 0,
      name: ingredient.name || "",
      quantity: 1,
      price: ingredient.price || 0,
      imageURL: ingredient.imageURL || "",
    }));

    setIngredients(updatedIngredients);
    setValue("ingredients", updatedIngredients);
    setOpenModal(false);
  };

  const onSubmit = async (values: updateComboSchema) => {
    const prepareParams = {
      name: values.name,
      description: values.description,
      size: values.size,
      imageURLs: values.imageURLs,
      turtorialVideoID: values.turtorialVideoID,
      ingredients: ingredients.map((ingredient) => ({
        ingredientID: ingredient.ingredientId,
        quantity: ingredient.quantity,
      })),
    };

    try {
      // Use update API instead of create
      await adminComboAPI.UpdateCombo(comboId, prepareParams);
      toast.success("Cập nhật combo thành công");
      navigate(config.adminRoutes.tableHotPotCombo);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Đã có lỗi xảy ra";
      toast.error(errorMessage);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    setValue("ingredients", newIngredients, { shouldValidate: true });
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <StyledCard sx={{ maxWidth: "100%", margin: "auto", mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h6" textAlign="center">
            🔄 Đang tải dữ liệu combo...
          </Typography>
        </CardContent>
      </StyledCard>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <StyledCard sx={{ maxWidth: "100%", margin: "auto", mt: 4, p: 3 }}>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              color="primary"
              fontWeight="bold"
            >
              🍲 Cập nhật combo: {comboData?.name || comboId}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Cập nhật thông tin combo lẩu với các nguyên liệu phong phú
            </Typography>
          </Box>

          <Grid2 container spacing={4}>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <StyledPaper>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <RestaurantMenuIcon color="primary" />
                  Thông tin cơ bản
                </Typography>

                <RHFTextField name="name" label="Tên lẩu" sx={{ mb: 2 }} />
                <RHFTextField
                  name="description"
                  label="Mô tả"
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <RHFTextField
                  name="size"
                  label="Kích thước (khẩu phần)"
                  type="number"
                  sx={{ mb: 2 }}
                />
              </StyledPaper>
            </Grid2>

            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <StyledPaper>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">
                    🥬 Nguyên liệu ({ingredients.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleOpenModal}
                    sx={{ borderRadius: 2 }}
                  >
                    Chọn nguyên liệu
                  </Button>
                </Box>

                {ingredients.length === 0 ? (
                  <Alert severity="warning">
                    Vui lòng chọn ít nhất một nguyên liệu
                  </Alert>
                ) : (
                  <Stack spacing={2}>
                    {ingredients.map((ingredient, index) => (
                      <IngredientCard
                        key={ingredient.ingredientId}
                        elevation={1}
                      >
                        <img
                          src={ingredient?.imageURL}
                          alt="Thumbnail"
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />

                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {ingredient.name}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                            <RHFTextField
                              name={`ingredients.${index}.quantity`}
                              label="Số lượng"
                              type="number"
                              size="small"
                              slotProps={{
                                input: {
                                  inputProps: {
                                    min: 1,
                                  },
                                },
                              }}
                              sx={{ width: 120 }}
                              onChange={(e) => {
                                const newValue = Number(e.target.value);
                                if (newValue >= 1) {
                                  const newIngredients = [...ingredients];
                                  newIngredients[index].quantity = newValue;
                                  setIngredients(newIngredients);
                                  setValue(
                                    `ingredients.${index}.quantity`,
                                    newValue,
                                    {
                                      shouldValidate: true,
                                    }
                                  );
                                }
                              }}
                            />
                            <Chip
                              label={formatMoney(
                                ingredient?.price * ingredient.quantity
                              )}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </Box>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() => handleRemoveIngredient(index)}
                          sx={{ "&:hover": { bgcolor: "error.light" } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </IngredientCard>
                    ))}
                  </Stack>
                )}
                {errors.ingredients && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.ingredients.message}
                  </Alert>
                )}
              </StyledPaper>
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              sx={{ borderRadius: 2 }}
            >
              Hủy bỏ
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              {isSubmitting ? "Đang cập nhật..." : "🍲 Cập nhật combo"}
            </LoadingButton>
          </Box>
        </CardContent>
      </StyledCard>

      {openModal && (
        <IngredientsSelectorModal
          open={openModal}
          handleCloseVegetableModal={() => setOpenModal(false)}
          onSendVegetable={handleModalSubmit}
          selectBefore={ingredients}
        />
      )}
    </FormProvider>
  );
};

export default UpdateCombo;
