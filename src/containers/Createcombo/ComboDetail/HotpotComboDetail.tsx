/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Container,
  Grid2,
} from "@mui/material";
import {
  People,
  Percent,
  LocalOffer,
  PlayCircleOutline,
  Add,
} from "@mui/icons-material";
import adminComboAPI from "../../../api/Services/adminComboAPI";
import { formatMoney } from "../../../utils/fn";

interface Ingredient {
  comboIngredientId: number;
  ingredientID: number;
  ingredientName: string;
  quantity: number;
  totalPrice: number;
  imageURL: string;
}

interface AllowedIngredientType {
  id: number;
  ingredientTypeId: number;
  ingredientTypeName: string;
  minQuantity: number;
  measurementUnit: string;
}

interface TutorialVideo {
  turtorialVideoId: number;
  name: string;
  description: string;
  videoURL: string;
}

interface HotpotCombo {
  comboId: number;
  name: string;
  description: string;
  size: number;
  basePrice: number;
  totalPrice: number;
  isCustomizable: boolean;
  hotpotBrothID: number;
  hotpotBrothName: string;
  appliedDiscountID: number;
  appliedDiscountPercentage: number;
  imageURLs: string[];
  tutorialVideo: TutorialVideo;
  ingredients: Ingredient[];
  allowedIngredientTypes: AllowedIngredientType[];
}

const HotpotComboDetail: React.FC = () => {
  const { comboId } = useParams<{ comboId: string }>();
  const [combo, setCombo] = useState<HotpotCombo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchCombo = async () => {
      try {
        const res: any = await adminComboAPI.GetAdminComboDetail(comboId);
        setCombo(res);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (comboId) {
      fetchCombo();
    }
  }, [comboId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <CircularProgress size={60} sx={{ color: "#667eea" }} />
            <Typography color="text.secondary">
              Đang tải thông tin combo...
            </Typography>
          </Box>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6">Lỗi tải thông tin combo</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Container>
    );
  }

  if (!combo) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Typography>Không có dữ liệu combo</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        pb: 4,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 2,
          px: 3,
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
              {combo.name}
            </Typography>
            {combo.isCustomizable && (
              <Chip
                label="Có thể tùy chỉnh"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
                icon={<LocalOffer sx={{ color: "white !important" }} />}
              />
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Grid2 container spacing={4}>
          {/* Image Gallery */}
          <Grid2 size={{ mobile: 12, desktop: 6 }}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                border: "1px solid rgba(255,255,255,0.5)",
              }}
            >
              {combo.imageURLs && combo.imageURLs.length > 0 ? (
                <>
                  <Box
                    sx={{ position: "relative", backgroundColor: "#f8f9fa" }}
                  >
                    <img
                      src={combo.imageURLs[selectedImageIndex]}
                      alt={combo.name}
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  {combo.imageURLs.length > 1 && (
                    <Box
                      display="flex"
                      gap={1}
                      p={2}
                      sx={{ backgroundColor: "white" }}
                    >
                      {combo.imageURLs.map((url, index) => (
                        <Box
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          sx={{
                            width: 80,
                            height: 60,
                            cursor: "pointer",
                            borderRadius: 2,
                            overflow: "hidden",
                            border:
                              selectedImageIndex === index
                                ? "3px solid #667eea"
                                : "2px solid transparent",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <img
                            src={url}
                            alt={`${combo.name} - ${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="h6">Không có hình ảnh</Typography>
                </Box>
              )}
            </Card>
          </Grid2>

          {/* Details */}
          <Grid2 size={{ mobile: 12, desktop: 6 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Basic Info */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.7 }}
                  >
                    Mô tả: {combo.description}
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{
                      backgroundColor: "#e8f5e9",
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      minWidth: "fit-content",
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#4caf50", width: 32, height: 32 }}>
                      <People sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Số người
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {combo.size} người
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Price Section */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Giá combo
                      </Typography>
                      <Typography variant="h3" fontWeight="700">
                        {combo.totalPrice
                          ? formatMoney(combo.totalPrice)
                          : "-----"}
                      </Typography>
                    </Box>
                    {combo.appliedDiscountPercentage > 0 && (
                      <Chip
                        label={`Giảm ${combo.appliedDiscountPercentage}%`}
                        icon={<Percent />}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 600,
                          "& .MuiChip-icon": { color: "white" },
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Ingredients */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(255,255,255,0.5)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    sx={{ mb: 2, color: "#333" }}
                  >
                    Nguyên liệu trong combo
                  </Typography>
                  <Grid2 container spacing={2}>
                    {combo.ingredients?.map((ingredient) => (
                      <Grid2
                        size={{ mobile: 12, desktop: 6 }}
                        key={ingredient.comboIngredientId}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#f8f9fa",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#e3f2fd",
                              transform: "translateY(-2px)",
                            },
                          }}
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
                          <Box>
                            <Typography variant="body1" fontWeight="600">
                              {ingredient.ingredientName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Số lượng: {ingredient.quantity} phần
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatMoney(
                                ingredient.totalPrice * ingredient.quantity
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid2>
                    ))}
                  </Grid2>
                </CardContent>
              </Card>

              {/* Additional Ingredients */}
              {combo.allowedIngredientTypes &&
                combo.allowedIngredientTypes.length > 0 && (
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(255,255,255,0.5)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        sx={{ mb: 2, color: "#333" }}
                      >
                        Có thể thêm nguyên liệu
                      </Typography>
                      <Grid2 container spacing={2}>
                        {combo.allowedIngredientTypes.map((type) => (
                          <Grid2
                            size={{ mobile: 12, desktop: 6 }}
                            key={type.id}
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={2}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#fff3e0",
                                border: "1px dashed #ff9800",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  backgroundColor: "#ffebcc",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "#ff9800",
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                <Add />
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight="600">
                                  {type.ingredientTypeName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Tối thiểu: {type.minQuantity}{" "}
                                  {type.measurementUnit}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid2>
                        ))}
                      </Grid2>
                    </CardContent>
                  </Card>
                )}
            </Box>
          </Grid2>
        </Grid2>

        {/* Video Section */}
        {combo.tutorialVideo?.videoURL && (
          <Card
            sx={{
              mt: 4,
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ bgcolor: "#d32f2f", width: 48, height: 48 }}>
                  <PlayCircleOutline sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="700">
                    Video hướng dẫn
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {combo.tutorialVideo.description}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              >
                <iframe
                  src={combo.tutorialVideo.videoURL}
                  title="Video hướng dẫn"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default HotpotComboDetail;
