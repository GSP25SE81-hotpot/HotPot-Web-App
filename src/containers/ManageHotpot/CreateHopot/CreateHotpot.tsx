import React, { useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import {
  FormProvider,
  RHFTextField,
  RHFUploadMultiFile,
  RHFSelect,
} from "../../../components/hook-form";
import { LoadingButton } from "@mui/lab";
import { uploadImageToFirebase } from "../../../firebase/uploadImageToFirebase";
import { CreateHotPotSchema, SizeData } from "../../../types/hotpot";
import adminHotpot from "../../../api/Services/adminHotpot";
import { toast } from "react-toastify";

// Define form schema
const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Tên là bắt buộc").min(1),
  material: Yup.string().trim().required("Chất liệu là bắt buộc"),
  size: Yup.string().trim().required("Kích thước là bắt buộc"),
  description: Yup.string().trim().required("Mô tả là bắt buộc").min(10),
  imageURLs: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
  price: Yup.number().min(0, "Giá phải lớn hơn 0").required("Bắt buộc có giá"),
  basePrice: Yup.number()
    .min(0, "Giá gốc phải lớn hơn 0")
    .required("Bắt buộc có giá gốc"),
  status: Yup.boolean().required(),
  seriesNumbers: Yup.array()
    .of(Yup.string().trim())
    .min(1, "Bắt buộc có số series"),
});

const CreateHotpot: React.FC = () => {
  const defaultValues = {
    name: "",
    material: "",
    size: SizeData?.[0].id || "",
    description: "",
    imageURLs: [],
    price: 0,
    basePrice: 0,
    status: true,
    seriesNumbers: [""],
  };

  const methods = useForm<CreateHotPotSchema>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  const { errors } = methods.formState;

  console.log(errors);

  const onSubmit = async (values: CreateHotPotSchema) => {
    try {
      const res = await adminHotpot.createHotpot(values);
      toast.success("Thêm lẩu mới thành công");
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any) => {
      const images = values.imageURLs || [];

      const uploadedImages = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acceptedFiles.map(async (file: any) => {
          const downloadURL = await uploadImageToFirebase(file);
          return downloadURL;
        })
      );

      // Update the form with the new image URLs
      setValue("imageURLs", [...images, ...uploadedImages]);
    },
    [setValue, values.imageURLs]
  );

  const handleRemoveAll = () => setValue("imageURLs", []);

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageURLs?.filter((_file) => _file !== file);
    setValue("imageURLs", filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ maxWidth: "100%", margin: "auto", mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Tạo mới sản phẩm
          </Typography>

          <Grid2 container spacing={3}>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <RHFTextField name="name" label="Tên sản phẩm" sx={{ mb: 2 }} />
              <RHFTextField name="material" label="Chất liệu" sx={{ mb: 2 }} />
              <RHFSelect name="size" label="Kích thước" sx={{ mb: 2 }}>
                {SizeData?.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField
                name="price"
                label="Giá"
                type="number"
                sx={{ mb: 2 }}
              />
              <RHFTextField
                name="basePrice"
                label="Giá gốc"
                type="number"
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} />
                    )}
                  />
                }
                label="Trạng thái"
              />
            </Grid2>

            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <RHFTextField
                name="description"
                label="Mô tả"
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <RHFUploadMultiFile
                label="Hình ảnh"
                showPreview
                name="imageURLs"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
              />
            </Grid2>

            <Grid2 size={{ mobile: 12 }}>
              <RHFTextField
                name="seriesNumbers"
                label="Số Series (cách nhau bởi dấu phẩy)"
                sx={{ mb: 2 }}
                onChange={(e) =>
                  setValue("seriesNumbers", e.target.value.split(","))
                }
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
              Thêm sản phẩm
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default CreateHotpot;
