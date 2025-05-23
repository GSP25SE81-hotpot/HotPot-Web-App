/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  InputAdornment,
  Typography,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  FormProvider,
  RHFAutoComplete,
  RHFTextField,
  RHFTextFieldNumber,
  RHFUploadSingleFile,
} from "../../components/hook-form";
import { LoadingButton } from "@mui/lab";
import { uploadImageToFirebase } from "../../firebase/uploadImageToFirebase";
import adminIngredientsAPI from "../../api/Services/adminIngredientsAPI";
import { useNavigate } from "react-router";
import config from "../../configs";
import { toast } from "react-toastify";
import { IngredientAddSchema } from "../../types/ingredients";

const CreateIngredients: React.FC = () => {
  const [types, setTypes] = useState<any[]>([]);
  const navigate = useNavigate();

  const defaultValues: IngredientAddSchema = {
    name: "",
    description: "",
    imageURL: "",
    unit: "",
    minStockLevel: 0,
    price: 0,
    ingredientTypeID: 0,
    measurementValue: 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Bắt buộc có tên nguyên liệu"),
    description: Yup.string()
      .trim()
      .required("Bắt buộc có mô tả")
      .min(10, "Tối thiểu 10 kí tự"),
    imageURL: Yup.string().min(1, "Bắt buộc có hình"),
    unit: Yup.string().trim().required("Bắt buộc nhập đơn vị đo lường"),
    minStockLevel: Yup.number()
      .required("Bắt buộc nhập mức tồn kho tối thiểu")
      .min(0, "Giá trị không hợp lệ"),
    measurementValue: Yup.number()
      .required("Bắt buộc nhập khối lượng gói")
      .min(0, "Giá trị không hợp lệ"),
    ingredientTypeID: Yup.number().required("Bắt buộc nhập loại nguyên liệu"),
    price: Yup.number()
      .required("Bắt buộc nhập giá")
      .min(0, "Giá không hợp lệ"),
  });

  const methods = useForm<IngredientAddSchema>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const fetchTypes = async () => {
    try {
      const data = await adminIngredientsAPI.getListIngredientsType();
      setTypes(data?.data);
    } catch (error) {
      console.error("Error fetching ingredient types:", error);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const onSubmit = async (values: IngredientAddSchema) => {
    try {
      // Ensure ingredientTypeID is a number
      const submissionValues = {
        ...values,
        ingredientTypeID: Number(values.ingredientTypeID),
      };

      console.log(submissionValues, "nguyên liệu");

      const resData = await adminIngredientsAPI.createNewIngredients(
        submissionValues
      );
      reset();
      navigate(config.adminRoutes.manageIngredients);
      toast.success("Thêm mới thành công");
      console.log(resData);
    } catch (error: any) {
      const apiError = error?.response?.data || error;
      const errorMessage = apiError?.message || "Something went wrong!";
      const firstDetailedError = apiError?.errors?.[0];
      toast.error(firstDetailedError || errorMessage);
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles: any[]) => {
      const file = acceptedFiles[0];

      const coverImage = await uploadImageToFirebase(file);
      if (typeof coverImage === "string") {
        setValue("imageURL", coverImage);
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Paper
        elevation={3}
        sx={{ maxWidth: "100%", margin: "auto", mt: 4, mb: 4 }}
      >
        <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h5" fontWeight="bold">
            Tạo mới nguyên liệu
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Grid2 container spacing={3}>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <Stack spacing={2.5}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "text.secondary" }}
                >
                  Thông tin cơ bản
                </Typography>

                <RHFTextField
                  name="name"
                  label="Tên nguyên liệu"
                  placeholder="Nhập tên nguyên liệu"
                />

                <RHFTextField
                  name="description"
                  label="Mô tả"
                  multiline
                  rows={3}
                  placeholder="Mô tả chi tiết về nguyên liệu"
                />

                <RHFAutoComplete
                  name="ingredientTypeID"
                  options={types || []}
                  label="Loại nguyên liệu"
                />

                <RHFTextField
                  name="unit"
                  label="Đơn vị đo lường"
                  placeholder="Nhập đơn vị đo lường (g, kg, ml, etc)"
                />
              </Stack>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "text.secondary", mb: 2.5 }}
                >
                  Thông tin số lượng và giá
                </Typography>

                <Grid2 container spacing={2}>
                  <Grid2 size={{ desktop: 12 }}>
                    <RHFTextFieldNumber
                      name="measurementValue"
                      label="Khối lượng một gói"
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">g</InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ mobile: 12, desktop: 6 }}>
                    <RHFTextFieldNumber
                      name="minStockLevel"
                      label="Mức tồn kho tối thiểu"
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">g</InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ mobile: 12, desktop: 6 }}>
                    <RHFTextFieldNumber
                      type="number"
                      name="price"
                      label="Giá"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">VNĐ</InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      }}
                    />
                  </Grid2>
                </Grid2>
              </Box>
            </Grid2>

            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "text.secondary", mb: 2.5 }}
              >
                Hình ảnh nguyên liệu
              </Typography>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <RHFUploadSingleFile
                  label="Kéo và thả hoặc chọn hình"
                  name="imageURL"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  sx={{ height: 350, mb: 2 }}
                  helperText="Dung lượng tối đa: 3MB. Định dạng: JPG, PNG"
                />
              </Box>
            </Grid2>
          </Grid2>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <LoadingButton
              variant="outlined"
              size="large"
              onClick={() => navigate(config.adminRoutes.manageIngredients)}
            >
              Hủy
            </LoadingButton>

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
            >
              Thêm nguyên liệu
            </LoadingButton>
          </Box>
        </Box>
      </Paper>
    </FormProvider>
  );
};

export default CreateIngredients;
