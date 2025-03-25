/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Grid2,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ImageList,
  ImageListItem,
} from "@mui/material";
import adminComboAPI from "../../../api/Services/adminComboAPI";
import { formatMoney } from "../../../utils/fn";

interface Ingredient {
  comboIngredientId: number;
  ingredientID: number;
  ingredientName: string;
  quantity: number;
  measurementUnit: string;
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!combo) return <Typography>No data available</Typography>;

  return (
    <Grid2 container sx={{ minHeight: "100vh" }}>
      <Grid2
        size={{ mobile: 12, desktop: 6 }}
        sx={{
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        {combo.imageURLs && combo.imageURLs.length > 0 ? (
          <ImageList
            variant="masonry"
            cols={2}
            gap={8}
            sx={{ width: "100%", maxHeight: "100vh", overflowY: "auto" }}
          >
            {combo?.imageURLs?.map((url, index) => (
              <ImageListItem key={index}>
                <img
                  src={url}
                  alt={`${combo.name} - ${index}`}
                  loading="lazy"
                  style={{
                    borderRadius: 8,
                    width: "100%",
                    display: "block",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <Typography>No images available</Typography>
        )}
      </Grid2>

      <Grid2
        size={{ mobile: 12, desktop: 6 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 3,
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {combo.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {combo.description}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Nước lẩu: {combo.hotpotBrothName}</Typography>
        <Typography variant="h6">Số lượng người: {combo.size} </Typography>
        <Typography variant="h6">
          Giá tiền: {combo.totalPrice ? formatMoney(combo.totalPrice) : "-----"}
        </Typography>
        <Typography variant="h6">
          Giảm giá: {combo.appliedDiscountPercentage}%
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h5">Nguyên liệu</Typography>
        <List>
          {combo?.ingredients?.map((ingredient) => (
            <ListItem key={ingredient.comboIngredientId}>
              <ListItemText
                primary={`${ingredient.ingredientName}: ${ingredient.quantity} ${ingredient.measurementUnit}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h5">Nguyên liệu thêm</Typography>
        <List>
          {combo?.allowedIngredientTypes?.map((type) => (
            <ListItem key={type.id}>
              <ListItemText
                primary={`${type.ingredientTypeName} (Min: ${type.minQuantity} ${type.measurementUnit})`}
              />
            </ListItem>
          ))}
        </List>

        {combo.tutorialVideo?.videoURL && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5">Video hướng dẫn</Typography>
            <Typography variant="body2" color="text.secondary">
              {combo.tutorialVideo.description}
            </Typography>
            <Box
              sx={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                mt: 1,
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
          </>
        )}
      </Grid2>
    </Grid2>
  );
};

export default HotpotComboDetail;
