import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Typography, styled } from "@mui/material";

interface DropFileInputProps {
  onFileChange: (files: File[]) => void;
  uploadProgress?: number | null;
}

const DropZone = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%", // Make it responsive
  maxWidth: "500px", // Adjust max width to fit UI
  height: "200px",
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.paper,
  cursor: "pointer",
  textAlign: "center",
  transition: "opacity 0.3s",
  margin: "0 auto",
  "&:hover, &.dragover": {
    opacity: 0.7,
  },
  "@media (max-width: 600px)": {
    height: "150px",
  },
}));
const DropFileInput: React.FC<DropFileInputProps> = ({
  onFileChange,
  uploadProgress,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<File[]>([]);

  const onDragEnter = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.add("dragover");
    }
  };

  const onDragLeave = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };

  const onDrop = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };

  const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      const updatedList = [newFile];
      setFileList(updatedList);
      onFileChange(updatedList);
      console.log(fileList);
    }
  };

  return (
    <>
      <DropZone
        ref={wrapperRef}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileDrop}
          style={{ display: "none" }}
        />
        <Box>
          <CloudUploadIcon fontSize="large" />
          <Typography>
            Kéo và thả các tập tin của bạn ở đây hoặc nhấp để duyệt
          </Typography>
          {uploadProgress !== null && (
            <Typography color="primary" sx={{ mt: 2 }}>
              Đang tải lên: {(uploadProgress ?? 0).toFixed(0)}%
            </Typography>
          )}
        </Box>
      </DropZone>
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func.isRequired,
};

export default DropFileInput;
