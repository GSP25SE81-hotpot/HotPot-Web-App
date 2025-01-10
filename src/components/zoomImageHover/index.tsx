import { Box } from "@mui/material";
import React, { useState, CSSProperties, MouseEvent } from "react";

interface Props {
  src: string;
  width?: string | number;
  zoomScale?: number;
  height?: string | number;
  className?: string;
  transitionTime?: number;
  style?: CSSProperties;
}

const Zoom: React.FC<Props> = ({
  src,
  zoomScale = 2,
  className,
  transitionTime = 0,
  style,
}) => {
  const [backgroundPosition, setBackgroundPosition] = useState("center");

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  const handleMouseLeave = () => {
    setBackgroundPosition("center");
  };

  return (
    <Box
      component={"figure"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      sx={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${zoomScale * 100}%`,
        backgroundPosition,
        width: "250px",
        height: "250px",
        backgroundRepeat: "no-repeat",
        transition: `background-position ${transitionTime}s ease`,
        ...style,
        boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        "&: hover": {
          cursor: "pointer",
        },

        "&:hover img": {
          cursor: "pointer",
          opacity: 0,
        },
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          objectFit: "cover",
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        }}
      />
    </Box>
  );
};

export default Zoom;
