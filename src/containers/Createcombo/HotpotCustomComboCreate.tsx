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
import { CreateHotPotCustomFormSchema } from "../../types/hotpot";
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
import adminComboAPI from "../../api/Services/adminComboAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import IngredientsTypeSelectorModal from "./ModalCombo/ModalIngredientType";

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

const HotpotCustomComboCreate: React.FC = () => {
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
    console.log(selectedMeats);

    const updatedIngredients = selectedMeats.map((ingredient, idx) => ({
      id: idx,
      ingredientTypeId: ingredient.ingredientTypeId || 0,
      minQuantity: 1,
      name: ingredient.name,
    }));

    console.log(updatedIngredients, "up");

    setIngredients(updatedIngredients);
    setValue("ingredients", updatedIngredients);
    setOpenModal(false);
  };

  const defaultValues: CreateHotPotCustomFormSchema = {
    name: "",
    size: 0,
    imageURLs: [],
    tutorialVideo: {
      name: "",
      description: "",
    },
    ingredients: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Bắt buộc có tên sản phẩm"),
    size: Yup.number()
      .required("Bắt buộc có kích thước")
      .min(1, "Kích thước phải lớn hơn 0"),
    imageURLs: Yup.array().of(Yup.string()).min(1, "Bắt buộc có hình"),
    tutorialVideo: Yup.object().shape({
      name: Yup.string().required("Bắt buộc có tên video"),
      description: Yup.string().required("Bắt buộc có mô tả video"),
    }),
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

  const methods = useForm<CreateHotPotCustomFormSchema>({
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

  const onSubmit = async (values: CreateHotPotCustomFormSchema) => {
    const prepareParams = {
      name: values.name,
      size: values.size,
      imageURLs: values.imageURLs,
      tutorialVideo: {
        name: values.tutorialVideo.name,
        description: values.tutorialVideo.description,
        videoURL: videoLink,
      },
      allowedIngredientTypes: ingredients,
    };

    try {
      await adminComboAPI.CreateAdminComboCustom(prepareParams);
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

  const updateIngredientMinQuantity = (index: number, value: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index].minQuantity = value;
    setIngredients(newIngredients);
    setValue(`ingredients.${index}.minQuantity`, value, {
      shouldValidate: true,
    });
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
                  name="size"
                  label="Kích thước (khẩu phần)"
                  type="number"
                  sx={{ mb: 2 }}
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
                    🥬 Loại nguyên liệu ({ingredients.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleOpenModal}
                    sx={{ borderRadius: 2 }}
                  >
                    Chọn loại nguyên liệu
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
                            {ingredient.name}
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
              {isSubmitting ? "Đang tạo..." : "🍲 Tạo món lẩu mới"}
            </LoadingButton>
          </Box>
        </CardContent>
      </StyledCard>

      {openModal && (
        <IngredientsTypeSelectorModal
          open={openModal}
          handleCloseVegetableModal={() => setOpenModal(false)}
          onSendVegetable={handleModalSubmit}
          selectBefore={ingredients}
        />
      )}
    </FormProvider>
  );
};

export default HotpotCustomComboCreate;
