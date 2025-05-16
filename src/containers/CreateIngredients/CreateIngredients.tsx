/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  InputAdornment,
  Typography,
  Paper,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
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
  RHFDatePicker,
  RHFSelect,
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
  const [weightUnit, setWeightUnit] = useState<string>("g");
  const navigate = useNavigate();
  const measurementData = [
    {
      id: "g",
      name: "gam",
    },
    {
      id: "M",
      name: "kilogam",
    },
  ];

  const defaultValues: IngredientAddSchema = {
    name: "",
    description: "",
    imageURL: "",
    unit: measurementData[0].id || "",
    measurementValue: 0,
    totalAmount: 0,
    minStockLevel: 0,
    ingredientTypeID: "",
    price: 0,
    bestBeforeDate: new Date().toISOString(),
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Bắt buộc có tên nguyên liệu"),
    description: Yup.string()
      .trim()
      .required("Bắt buộc có mô tả")
      .min(10, "Tối thiểu 10 kí tự"),
    imageURL: Yup.string().min(1, "Bắt buộc có hình"),
    totalAmount: Yup.number()
      .required("Bắt buộc nhập số lượng")
      .min(0, "Số lượng không hợp lệ"),
    unit: Yup.string().trim().required("Bắt buộc nhập đơn vị đo lường"),
    measurementValue: Yup.number()
      .required("Bắt buộc nhập giá trị đo lường")
      .min(0.0001, "Giá trị không hợp lệ"),
    minStockLevel: Yup.number()
      .required("Bắt buộc nhập mức tồn kho tối thiểu")
      .min(0, "Giá trị không hợp lệ"),
    ingredientTypeID: Yup.string().required("Bắt buộc nhập loại nguyên liệu"),
    price: Yup.number()
      .required("Bắt buộc nhập giá")
      .min(0, "Giá không hợp lệ"),
    bestBeforeDate: Yup.string().required("Bắt buộc nhập ngày hết hạn"),
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

  const fetchType = async () => {
    try {
      const data = await adminIngredientsAPI.getListIngredientsType();
      setType(data?.data);
    } catch (error) {
      console.error("Error fetching ingredient types:", error);
    }
  };

  useEffect(() => {
    fetchType();
  }, []);

  const handleWeightUnitChange = (event: SelectChangeEvent) => {
    setWeightUnit(event.target.value);
  };

  const onSubmit = async (values: IngredientAddSchema) => {
    try {
      // Convert totalAmount to grams if kg is selected
      const submissionValues = { ...values };
      if (weightUnit === "kg") {
        submissionValues.totalAmount = values.totalAmount * 1000;
      }

      console.log(submissionValues);

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
                  options={type || []}
                  label="Loại nguyên liệu"
                />
              </Stack>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "text.secondary", mb: 2.5 }}
                >
                  Thông tin số lượng
                </Typography>

                <Grid2 container spacing={2} paddingBottom={1}>
                  <Grid2 size={{ mobile: 12, desktop: 10 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <RHFTextFieldNumber
                          name="totalAmount"
                          label="Tổng khối lượng"
                          InputProps={{
                            type: "number",
                            inputProps: { min: 0 },
                          }}
                        />
                      </Box>
                      <FormControl sx={{ minWidth: 80 }}>
                        <InputLabel id="weight-unit-label">Đơn vị</InputLabel>
                        <Select
                          labelId="weight-unit-label"
                          id="weight-unit"
                          value={weightUnit}
                          label="Đơn vị"
                          onChange={handleWeightUnitChange}
                          size="small"
                          sx={{ height: "56px" }}
                        >
                          <MenuItem value="g">g</MenuItem>
                          <MenuItem value="kg">kg</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid2>
                </Grid2>

                <Grid2 container spacing={2} sx={{ mt: 1 }}>
                  <Grid2 size={{ mobile: 12, desktop: 10 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <RHFTextFieldNumber
                        name="measurementValue"
                        slotProps={{
                          input: {
                            type: "number",
                            inputProps: { min: 0.0001, step: "0.0001" },
                          },
                        }}
                        label="Giá trị đo lường 1 gói"
                      />

                      <RHFSelect
                        name="unit"
                        label="Đơn vị đo lường"
                        sx={{ mb: 2 }}
                      >
                        {measurementData?.map((measurement) => (
                          <option key={measurement.id} value={measurement.id}>
                            {measurement.name}
                          </option>
                        ))}
                      </RHFSelect>
                    </Box>
                  </Grid2>
                </Grid2>
                <Grid2 size={{ mobile: 12, desktop: 6 }}></Grid2>
                <Grid2 size={{ mobile: 12, desktop: 6 }}>
                  <RHFTextFieldNumber
                    name="minStockLevel"
                    label="Mức tồn kho tối thiểu"
                    InputProps={{
                      type: "number",
                      inputProps: { min: 0 },
                    }}
                  />
                </Grid2>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "text.secondary", mb: 2.5 }}
                >
                  Thông tin giá & thời hạn
                </Typography>

                <Grid2 container spacing={2}>
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
                  <Grid2 size={{ mobile: 12, desktop: 6 }}>
                    <RHFDatePicker
                      name="bestBeforeDate"
                      label="Ngày hết hạn"
                      helperText="Không được chọn ngày trong quá khứ"
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
