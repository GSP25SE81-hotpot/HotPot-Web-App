/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  FormProvider,
  RHFAutoComplete,
  RHFTextField,
  RHFUploadSingleFile,
} from "../../components/hook-form";
import { LoadingButton } from "@mui/lab";
import { uploadImageToFirebase } from "../../firebase/uploadImageToFirebase";
import { IngredientAddSchema } from "../../types/ingredients";
import adminIngredientsAPI from "../../api/Services/adminIngredientsAPI";
import { useNavigate } from "react-router";
import config from "../../configs";
import { toast } from "react-toastify";

const CreateIngredients: React.FC = () => {
  const [type, setType] = useState<any[]>([]);
  const navigate = useNavigate();
  const defaultValues = {
    name: "",
    description: "",
    imageURL: "",
    quantity: 0,
    measurementUnit: "",
    minStockLevel: 0,
    ingredientTypeID: "",
    price: 0.01,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Bắt buộc có tên nguyên liệu"),
    description: Yup.string()
      .trim()
      .required("Bắt buộc có mô tả")
      .min(10, "Tối thiểu 10 kí tự"),
    imageURL: Yup.string().min(1, "Bắt buộc có hình"),
    quantity: Yup.number()
      .required("Bắt buộc nhập số lượng")
      .min(0, "Số lượng không hợp lệ"),
    measurementUnit: Yup.string()
      .trim()
      .required("Bắt buộc nhập đơn vị đo lường"),
    minStockLevel: Yup.number()
      .required("Bắt buộc nhập mức tồn kho tối thiểu")
      .min(0, "Giá trị không hợp lệ"),
    ingredientTypeID: Yup.string().required("Bắt buộc nhập loại nguyên liệu"),
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
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  console.log(watch("ingredientTypeID"));

  const fetchType = async () => {
    try {
      const data = await adminIngredientsAPI.getListIngredientsType();
      console.log(data?.data);

      setType(data?.data);
    } catch (error) {
      console.error("Error fetching ingredient types:", error);
    }
  };

  useEffect(() => {
    fetchType();
  }, []);

  const onSubmit = async (values: IngredientAddSchema) => {
    try {
      const resData = await adminIngredientsAPI.createNewIngredients(values);
      reset();
      navigate(config.adminRoutes.manageIngredients);
      toast.success("Thêm mới thành công");
      console.log(resData);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <Card sx={{ maxWidth: "100%", margin: "auto", mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Tạo mới nguyên liệu
          </Typography>

          <Grid2 container spacing={3}>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <RHFTextField
                name="name"
                label="Tên nguyên liệu"
                sx={{ mb: 2 }}
              />
              <RHFTextField name="description" label="Mô tả" sx={{ mb: 2 }} />
              <RHFTextField
                name="quantity"
                type="number"
                label="Số lượng"
                sx={{ mb: 2 }}
                InputProps={{
                  type: "number",
                  inputProps: { min: 0 },
                }}
              />
              <RHFTextField
                name="measurementUnit"
                label="Đơn vị đo lường"
                sx={{ mb: 2 }}
              />
              <RHFTextField
                name="minStockLevel"
                type="number"
                label="Mức tồn kho tối thiểu"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">VNĐ</InputAdornment>
                  ),
                  type: "number",
                  inputProps: { min: 0 },
                }}
              />
              <RHFAutoComplete
                name="ingredientTypeID"
                options={type || []}
                label="Chọn Loại nguyên liệu"
              />
              <RHFTextField
                name="price"
                type="number"
                label="Giá"
                sx={{ mb: 2, mt: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">VNĐ</InputAdornment>
                  ),
                  type: "number",
                  inputProps: { min: 0 },
                }}
              />
            </Grid2>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <RHFUploadSingleFile
                label="Hình ảnh"
                name="imageURL"
                maxSize={3145728}
                onDrop={handleDrop}
              />
            </Grid2>
          </Grid2>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              sx={{ ml: "auto" }}
            >
              Thêm nguyên liệu mới
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default CreateIngredients;
