import React, { useCallback } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  FormProvider,
  RHFEditor,
  RHFTextField,
  RHFUploadMultiFile,
} from "../../components/hook-form";
// import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { CreateHotPotFormSchema } from "../../types/hotpot";
import uploadImageToFirebase from "../../firebase/uploadImageToFirebase";
import config from "../../configs";

// const LabelStyle = styled(Typography)(({ theme }) => ({
//   ...theme.typography.subtitle2,
//   color: theme.palette.text.secondary,
//   marginBottom: theme.spacing(1),
// }));

const CreateIngredients: React.FC = () => {
  //yub
  const defaultValues = {
    name: "",
    description: "",
    imageURL: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Bắt buộc có tên sản phẩm")
      .min(1, "Tối thiểu 1 kí tự"),
    description: Yup.string()
      .trim()
      .required("Bắt buộc có mô tả")
      .min(10, "Tối thiểu 10 kí tự"),
    imageURL: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
  });

  const methods = useForm<CreateHotPotFormSchema>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const onSubmit = async (values: CreateHotPotFormSchema) => {
    try {
      console.log(values);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any) => {
      const images = values.imageURL || [];

      const uploadedImages = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acceptedFiles.map(async (file: any) => {
          const downloadURL = await uploadImageToFirebase(file);
          return downloadURL;
        })
      );

      // Update the form with the new image URLs
      setValue("imageURL", [...images, ...uploadedImages]);
    },
    [setValue, values.imageURL]
  );

  const handleRemoveAll = () => {
    setValue("imageURL", []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageURL?.filter((_file) => _file !== file);
    setValue("imageURL", filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ maxWidth: "100%", margin: "auto", mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Tạo mới thực đơn lẩu
          </Typography>

          <Grid2 container spacing={3}>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <RHFTextField
                name="hotpotName"
                label={config.Vntext.CreateCombo.hotpotName}
                sx={{ mb: 2 }}
              />

              <RHFTextField
                name="description"
                label={config.Vntext.CreateCombo.description}
                sx={{ mb: 2 }}
              />

              <div>
                <RHFEditor simple name="newsContent" label="Nội dung" />
              </div>
              <div>
                <RHFUploadMultiFile
                  label={config.Vntext.CreateCombo.image}
                  showPreview
                  name="imageURL"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
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
              Thêm món lẩu mới
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default CreateIngredients;
