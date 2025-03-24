import React from "react";
import "./uploadButton.scss";

type UploadButtonProps = {
  onClick: () => void;
  children?: React.ReactNode; // Allow children
};

const UploadButton: React.FC<UploadButtonProps> = ({ onClick, children }) => {
  return (
    <button className="uploadButton" onClick={onClick}>
      {children || "Upload Button"}
    </button>
  );
};

export default UploadButton;
