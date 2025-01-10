// @mui
import { styled } from "@mui/material/styles";
import { Typography, Box, BoxProps } from "@mui/material";
//
import Image from "./Image";
import images from "../constants/images";

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(8, 2),
}));

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  title: string;
  img?: string;
  description?: string;
}

export default function EmptyOrder({
  title,
  description,
  img,
  ...other
}: Props) {
  return (
    <RootStyle {...other}>
      <Image
        disabledEffect
        visibleByDefault
        alt="empty content"
        src={img || images.emptyOrder}
        sx={{ height: 240, mb: 3 }}
      />

      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      )}
    </RootStyle>
  );
}
