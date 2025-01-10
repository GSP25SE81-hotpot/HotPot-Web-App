import React from "react";
import "./RightMenu.scss";
import AccountSection from "./AccountSection";

const RightMenu: React.FC = () => {
  return (
    <>
      <div className="right_menu">
        <div className="item__user">
          <AccountSection />
        </div>
      </div>
    </>
  );
};

export default RightMenu;
