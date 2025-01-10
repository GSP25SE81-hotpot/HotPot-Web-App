import React from "react";
import images from "../../constants/images";
import "./Logo.scss";

const Logo: React.FC = () => {
  return <img className="logo" alt="icon" src={images.logo} />;
};

export default Logo;
