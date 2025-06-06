/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
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
import {
  FormProvider,
  RHFTextField,
  RHFUploadMultiFile,
} from "../../components/hook-form";
import { LoadingButton } from "@mui/lab";
import { CreateHotPotFormSchema } from "../../types/hotpot";
import config from "../../configs";
import DropFileInput from "../../components/drop-input/DropInput";
import {
  uploadImageToFirebase,
  uploadVideoToFirebase,
} from "../../firebase/uploadImageToFirebase";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

import styles from "./HotpotComboCreate.module.scss";
import classNames from "classnames/bind";
import IngredientsSelectorModal from "./ModalCombo/IngredientsSelectorModal";
import adminComboAPI from "../../api/Services/adminComboAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { formatMoney } from "../../utils/fn";

const cx = classNames.bind(styles);
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  fontWeight: 600,
}));

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

const HotpotComboCreate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const navigate = useNavigate();

  console.log(file);

  //meat modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

const handleModalSubmit = (selectedMeats: any[]) => {
  const currentSize = watch('size') || 0;
  const suggestedQuantity = Math.ceil(currentSize / 2) || 1; // Default to 1 if calculation is 0
  
  const updatedIngredients = selectedMeats.map((ingredient) => ({
    ingredientId: ingredient.ingredientId || 0,
    name: ingredient.name || "",
    quantity: suggestedQuantity, // Set initial value to suggested quantity
    price: ingredient.price || 0,
    imageURL: ingredient.imageURL || "",
  }));
  
  setIngredients(updatedIngredients);
  setValue("ingredients", updatedIngredients);
  setOpenModal(false);
};
  const defaultValues: CreateHotPotFormSchema = {
    name: "",
    description: "",
    size: 1,
    imageURLs: [],
    tutorialVideo: {
      name: "",
      description: "",
    },
    ingredients: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Bắt buộc có tên sản phẩm"),
    description: Yup.string().trim().required("Bắt buộc có mô tả"),
    size: Yup.number()
      .required("Bắt buộc có kích thước")
      .min(1, "Kích thước phải lớn hơn 0")
      .typeError("Kích thước phải là số"),
    imageURLs: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
    tutorialVideo: Yup.object().shape({
      name: Yup.string().required("Bắt buộc có tên video"),
      description: Yup.string().required("Bắt buộc có mô tả video"),
    }),
    ingredients: Yup.array()
        .of(
          Yup.object().shape({
            ingredientId: Yup.number().required("Thiếu ID nguyên liệu"),
            quantity: Yup.number()
              .required("Bắt buộc có số lượng")
              .min(1, "Số lượng phải lớn hơn 0"), // Only enforce minimum of 1
          })
        )
        .min(1, "Bắt buộc có ít nhất một nguyên liệu"),
  });

  const methods = useForm<CreateHotPotFormSchema>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  React.useEffect(() => {
  const currentSize = watch('size');
  
  // Only update if we have ingredients and a valid size
  if (ingredients.length > 0 && currentSize > 0) {
    const minQuantity = Math.ceil(currentSize / 2);
    
    // Create a copy of ingredients with updated quantity where needed
    const updatedIngredients = ingredients.map(ingredient => ({
      ...ingredient,
      quantity: Math.max(ingredient.quantity, minQuantity)
    }));
    
    // Only update if something actually changed
    const hasChanges = updatedIngredients.some(
      (item, idx) => item.quantity !== ingredients[idx].quantity
    );
    
    if (hasChanges) {
      setIngredients(updatedIngredients);
      
      // Update form values
      updatedIngredients.forEach((ingredient, index) => {
        setValue(`ingredients.${index}.quantity`, ingredient.quantity, {
          shouldValidate: true
        });
      });
    }
  }
}, [watch('size')]); 

  const onSubmit = async (values: CreateHotPotFormSchema) => {
    const prepareParams = {
      name: values.name,
      description: values.description,
      size: values.size,
      imageURLs: values.imageURLs,
      tutorialVideo: {
        name: values.tutorialVideo.name,
        description: values.tutorialVideo.description,
        videoURL: videoLink,
      },
      ingredients: ingredients.map((ingredient) => ({
        ingredientID: ingredient.ingredientId,
        quantity: ingredient.quantity,
      })),
    };

    try {
      await adminComboAPI.CreateAdminCombo(prepareParams);
      toast.success("Tạo combo mới thành công");
      navigate(config.adminRoutes.tableHotPotCombo);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Đã có lỗi xảy ra";
      toast.error(errorMessage);
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles: any) => {
      const images = values.imageURLs || [];

      const uploadedImages = await Promise.all(
        acceptedFiles.map(async (file: any) => {
          const downloadURL = await uploadImageToFirebase(file);
          return downloadURL;
        })
      );

      setValue("imageURLs", [...images, ...uploadedImages]);
    },
    [setValue, values.imageURLs]
  );

  const handleRemoveAll = () => {
    setValue("imageURLs", []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageURLs?.filter((_file) => _file !== file);
    setValue("imageURLs", filteredItems);
  };

  const onFileChange = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const currentFile = files[0];
    setFile(currentFile);
    setUploadProgress(0);

    try {
      const uploadedVideoLink = await uploadVideoToFirebase(
        currentFile,
        (progress) => {
          setUploadProgress(progress);
        }
      );
      setVideoLink(uploadedVideoLink);
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Lỗi tải video lên");
    } finally {
      setUploadProgress(null);
    }
  };
  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    setValue("ingredients", newIngredients);
  };

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
              🍲 Tạo mới thực đơn lẩu
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tạo một món lẩu mới với thông tin chi tiết và nguyên liệu phong
              phú
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
                  label="Số lượng người ăn"
                  type="number"
                  sx={{ mb: 2 }}
                  slotProps={{
                    input: {
                      inputProps: {
                        min: 1, // Prevent negative values
                      },
                    },
                  }}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    // Ensure value is at least 1
                    setValue('size', value < 1 ? 1 : value);
                  }}
                />

                <Box sx={{ mt: 3 }}>
                  <LabelStyle>Hình ảnh món lẩu</LabelStyle>
                  <RHFUploadMultiFile
                    showPreview
                    name="imageURLs"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                    label="Hình ảnh"
                  />
                  {errors.imageURLs && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {errors.imageURLs.message}
                    </Alert>
                  )}
                </Box>
              </StyledPaper>
            </Grid2>

            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <StyledPaper sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <PlayCircleOutlineIcon color="primary" />
                  Video Hướng Dẫn
                </Typography>

                <RHFTextField
                  name="tutorialVideo.name"
                  label="Tên Video"
                  sx={{ mb: 2 }}
                />
                <RHFTextField
                  name="tutorialVideo.description"
                  label="Mô tả Video"
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ mt: 2 }}>
                  <LabelStyle>Tải lên video</LabelStyle>
                  <DropFileInput
                    onFileChange={(files) => onFileChange(files)}
                    uploadProgress={uploadProgress}
                  />

                  {videoLink ? (
                    <Box>
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: "success.light",
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <CheckCircleIcon color="success" />
                          <Typography variant="body2" color="success.dark">
                            Video đã được tải lên thành công
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <div className={cx("video-container")}>
                          <video
                            controls
                            style={{ width: "100%", borderRadius: 8 }}
                          >
                            <source src={videoLink} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </Box>
                    </Box>
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Chưa có video nào được tải lên
                    </Alert>
                  )}
                </Box>
              </StyledPaper>

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
  placeholder={`Đề xuất: ${Math.ceil(watch('size') / 2)}`}
  slotProps={{
    input: {
      inputProps: {
        min: 1, // Only enforce minimum of 1
      },
    },
  }}
  sx={{ width: 120 }}
  onChange={(e) => {
    const newIngredients = [...ingredients];
    const value = Number(e.target.value);
    // Only enforce minimum of 1, not the suggested minimum
    newIngredients[index].quantity = value < 1 ? 1 : value;
    setIngredients(newIngredients);
    setValue(
      `ingredients.${index}.quantity`,
      value < 1 ? 1 : value,
      {
        shouldValidate: true,
      }
    );
  }}
  helperText={`Đề xuất: ${Math.ceil(watch('size') / 2)}`}
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
              {isSubmitting ? "Đang tạo..." : "🍲 Tạo món lẩu mới"}
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

export default HotpotComboCreate;
