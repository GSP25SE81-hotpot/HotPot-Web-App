/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  styled,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  FormProvider,
  RHFAutoCompleteBroth,
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
import adminIngredientsAPI from "../../api/Services/adminIngredientsAPI";

import styles from "./HotpotComboCreate.module.scss";
import classNames from "classnames/bind";
import IngredientsSelectorModal from "./ModalCombo/IngredientsSelectorModal";
import adminComboAPI from "../../api/Services/adminComboAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const cx = classNames.bind(styles);
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const HotpotComboCreate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [broth, setBroth] = useState<any[]>([]);
  const navigate = useNavigate();

  //meat modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleModalSubmit = (selectedMeats: any[]) => {
    const updatedIngredients = selectedMeats.map((ingredient) => ({
      ingredientId: ingredient.ingredientId || 0,
      name: ingredient.name || "",
      quantity: 0,
      measurementUnit: ingredient.measurementUnit || "g",
    }));

    setIngredients(updatedIngredients);
    setValue("ingredients", updatedIngredients);
    setOpenModal(false);
  };

  const defaultValues: CreateHotPotFormSchema = {
    name: "",
    description: "",
    size: 0,
    hotpotBrothID: 0,
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
    size: Yup.number().required("Bắt buộc có kích thước"),
    hotpotBrothID: Yup.number().required("Bắt buộc có nước lẩu"),
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
            .min(1, "Số lượng phải lớn hơn 0"),
          measurementUnit: Yup.string().required("Bắt buộc có đơn vị đo lường"),
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
    register,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (values: CreateHotPotFormSchema) => {
    const prepareParams = {
      ...values,
      tutorialVideo: {
        ...values.tutorialVideo,
        videoURL: videoLink,
      },
      ingredients: values.ingredients?.map((ingredient) => ({
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity,
        measurementUnit: ingredient.measurementUnit,
      })),
    };
    try {
      await adminComboAPI.CreateAdminCombo(prepareParams);

      toast.success("Tạo combo mới thành công");

      navigate(config.adminRoutes.tableHotPotCombo);
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
    console.log(file);

    try {
      const uploadedVideoLink = await uploadVideoToFirebase(currentFile);
      if (typeof uploadedVideoLink === "string") {
        setVideoLink(uploadedVideoLink);
      } else {
        console.error("Unexpected upload response:", uploadedVideoLink);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const resData: any = await adminIngredientsAPI.getListIngredients({
          typeId: 1,
        });
        setBroth(resData?.data?.items);
      } catch (e) {
        console.error("Error fetching ingredients:", e);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ maxWidth: "100%", margin: "auto", mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Tạo mới thực đơn lẩu
          </Typography>

          <Grid2 container spacing={3}>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <RHFTextField name="name" label="Tên lẩu" sx={{ mb: 2 }} />
              <RHFTextField name="description" label="Mô tả" sx={{ mb: 2 }} />
              <RHFTextField
                name="size"
                label="Kích thước"
                type="number"
                sx={{ mb: 2 }}
              />

              <RHFAutoCompleteBroth
                tagname="hotpotBrothID"
                options={broth || []}
                label="Chọn Loại Nước Lẩu"
              />
              <RHFUploadMultiFile
                label={config.Vntext.CreateCombo.image}
                showPreview
                name="imageURLs"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
              />
            </Grid2>
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <LabelStyle>Video Hướng Dẫn</LabelStyle>
              <RHFTextField
                name="tutorialVideo.name"
                label="Tên Video"
                sx={{ mb: 2 }}
              />
              <RHFTextField
                name="tutorialVideo.description"
                label="Mô tả Video"
                sx={{ mb: 2 }}
              />
              <div style={{ marginTop: "10px" }}>
                <LabelStyle>Video Hướng Dẫn</LabelStyle>
                <DropFileInput onFileChange={(files) => onFileChange(files)} />
                <br></br>
                <br></br>
                {videoLink ? (
                  <div className={cx("video-container")}>
                    <video controls>
                      <source src={videoLink} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <p>No video uploaded yet.</p>
                )}
              </div>
              <Typography variant="h6">Nguyên liệu</Typography>
              <Button variant="contained" onClick={() => handleOpenModal()}>
                {" "}
                Chọn nguyên liệu
              </Button>
              {ingredients.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">
                    Danh sách nguyên liệu đã chọn
                  </Typography>
                  {ingredients.map((ingredient, index) => (
                    <Box
                      key={ingredient.ingredientId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 1,
                      }}
                    >
                      {/* ✅ Show ingredient name */}
                      <Typography sx={{ flex: 1 }}>
                        {ingredient.name}{" "}
                        {/* Now ingredient name is displayed */}
                      </Typography>

                      {/* Quantity Input */}
                      <input
                        {...register(`ingredients.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        defaultValue={ingredient.quantity}
                        onChange={(e) => {
                          const newIngredients = [...ingredients];
                          newIngredients[index].quantity = Number(
                            e.target.value
                          );
                          setIngredients(newIngredients);
                          setValue(
                            `ingredients.${index}.quantity`,
                            Number(e.target.value),
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                        style={{
                          width: 100,
                          padding: 5,
                          border: "1px solid #ccc",
                        }}
                      />

                      {/* Measurement Unit Input */}
                      <input
                        {...register(`ingredients.${index}.measurementUnit`)}
                        type="text"
                        defaultValue={ingredient.measurementUnit}
                        onChange={(e) => {
                          const newIngredients = [...ingredients];
                          newIngredients[index].measurementUnit =
                            e.target.value;
                          setIngredients(newIngredients);
                          setValue(
                            `ingredients.${index}.measurementUnit`,
                            e.target.value,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                        style={{
                          width: 100,
                          padding: 5,
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Grid2>
          </Grid2>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
            >
              Thêm món lẩu mới
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
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
