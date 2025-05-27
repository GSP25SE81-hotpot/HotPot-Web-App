/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  styled,
  Typography,
  Paper,
  IconButton,
  Divider,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { LoadingButton } from "@mui/lab";
import config from "../../../configs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import adminComboAPI from "../../../api/Services/adminComboAPI";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { updateComboCustomSchema } from "../../../types/hotpot";
import IngredientsTypeSelect from "../Modal/IngredientsTypeSelect";

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

const HotpotCustomComboUpdate: React.FC = () => {
  const { comboId } = useParams<{ comboId: string }>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [comboData, setComboData] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch existing combo data
  useEffect(() => {
    const fetchComboData = async () => {
      if (!comboId) {
        // toast.error("Id combo không hợp lệ");
        // navigate(config.adminRoutes.tableHotPotCombo);
        return;
      }

      try {
        setLoading(true);
        const response: any = await adminComboAPI.GetAdminComboDetail(comboId);

        setComboData(response);
        setIngredients(response.allowedIngredientTypes || []);

        // Set form values
        reset({
          name: response.name || "",
          size: response.size || 0,
          imageURLs: response.imageURLs || [],
          turtorialVideoID: response?.turtorialVideoID || 0,
          ingredients: response.allowedIngredientTypes || [],
        });
      } catch (error: any) {
        console.error("Error fetching combo data:", error);
        toast.error("Không thể tải dữ liệu combo");
        // navigate(config.adminRoutes.tableHotPotCombo);
      } finally {
        setLoading(false);
      }
    };

    fetchComboData();
  }, [comboId, navigate]);

  //meat modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleModalSubmit = (selectedMeats: any[]) => {
    console.log(selectedMeats);

    const updatedIngredients = selectedMeats.map((ingredient, idx) => ({
      id: ingredient.id || idx,
      ingredientTypeId: ingredient.ingredientTypeId || 0,
      minQuantity: ingredient.minQuantity || 1,
      ingredientTypeName: ingredient.name,
    }));

    console.log(updatedIngredients, "up");

    setIngredients(updatedIngredients);
    setValue("ingredients", updatedIngredients);
    setOpenModal(false);
  };

  const defaultValues: updateComboCustomSchema = {
    name: "",
    size: 0,
    imageURLs: [],
    turtorialVideoID: 0,
    ingredients: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Bắt buộc có tên sản phẩm"),
    size: Yup.number()
      .required("Bắt buộc có kích thước")
      .min(1, "Kích thước phải lớn hơn 0"),
    imageURLs: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
    turtorialVideoID: Yup.number().required("Bắt buộc có kích thước"),
    ingredients: Yup.array()
      .of(
        Yup.object().shape({
          ingredientTypeId: Yup.number().required("Thiếu loại nguyên liệu"),
          minQuantity: Yup.number()
            .required("Bắt buộc có số lượng tối thiểu")
            .min(0, "Số lượng tối thiểu phải từ 0 trở lên"),
        })
      )
      .min(1, "Bắt buộc có ít nhất một nguyên liệu"),
  });

  const methods = useForm<updateComboCustomSchema>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (values: updateComboCustomSchema) => {
    if (!comboId) {
      toast.error("ID combo không hợp lệ");
      return;
    }

    const prepareParams = {
      name: values.name,
      size: values.size,
      imageURLs: values.imageURLs,
      turtorialVideoID: values.turtorialVideoID,
      allowedIngredientTypes: ingredients,
      groupIdentifier: comboData.groupIdentifier,
    };

    try {
      await adminComboAPI.UpdateCustomCombo(comboId, prepareParams);
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
    setValue("ingredients", newIngredients);
  };

  const updateIngredientMinQuantity = (index: number, value: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index].minQuantity = value;
    setIngredients(newIngredients);
    setValue(`ingredients.${index}.minQuantity`, value, {
      shouldValidate: true,
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Đang tải dữ liệu combo...
        </Typography>
      </Box>
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
              ✏️ Cập nhật thực đơn lẩu
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Chỉnh sửa thông tin món lẩu với các nguyên liệu và chi tiết mới
            </Typography>
            {comboData && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Đang chỉnh sửa combo: <strong>{comboData.name}</strong>
              </Alert>
            )}
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
                    🥬 Loại nguyên liệu ({ingredients.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleOpenModal}
                    sx={{ borderRadius: 2 }}
                  >
                    Chỉnh sửa nguyên liệu
                  </Button>
                </Box>

                {ingredients.length === 0 ? (
                  <Alert severity="warning">
                    Vui lòng chọn ít nhất 4 loại nguyên liệu
                  </Alert>
                ) : (
                  <Stack spacing={2}>
                    {ingredients.map((ingredient, index) => (
                      <IngredientCard
                        key={`ingredient-${ingredient.id || index}`}
                        elevation={2}
                        sx={{
                          transition: "all 0.3s ease",
                          borderLeft: "4px solid",
                          borderColor: "primary.main",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: (theme) => theme.shadows[4],
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "success.main",
                            mr: 1,
                            ml: -1,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {ingredient.ingredientTypeName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Số lượng tối thiểu cho loại nguyên liệu này
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              mt: 1,
                              alignItems: "center",
                            }}
                          >
                            <RHFTextField
                              name={`ingredients.${index}.minQuantity`}
                              label="Số lượng tối thiểu"
                              type="number"
                              size="small"
                              slotProps={{
                                input: {
                                  inputProps: {
                                    min: 0,
                                  },
                                },
                              }}
                              sx={{
                                width: 150,
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": {
                                    borderColor: "primary.main",
                                  },
                                },
                              }}
                              onChange={(e) => {
                                updateIngredientMinQuantity(
                                  index,
                                  Number(e.target.value)
                                );
                              }}
                            />
                          </Box>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() => handleRemoveIngredient(index)}
                          sx={{
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: "error.lighter",
                              transform: "rotate(90deg)",
                            },
                            width: 40,
                            height: 40,
                            border: "1px solid",
                            borderColor: "error.light",
                          }}
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
              {isSubmitting ? "Đang cập nhật..." : "✏️ Cập nhật combo"}
            </LoadingButton>
          </Box>
        </CardContent>
      </StyledCard>

      {openModal && (
        <IngredientsTypeSelect
          open={openModal}
          handleCloseVegetableModal={() => setOpenModal(false)}
          onSendVegetable={handleModalSubmit}
          selectBefore={ingredients}
        />
      )}
    </FormProvider>
  );
};

export default HotpotCustomComboUpdate;
