import React from "react";
import "./RightMenu.scss";
import { Link } from "react-router-dom";
import AccountSection from "../AccountSection";
import config from "../../../../configs";
// import { useAuthContext } from "../../../../context/AuthContext";
import { Button } from "@mui/material";

const RightMenu: React.FC = () => {
  // const { authUser } = useAuthContext();
  const authUser = null;

  return (
    <>
      <div className="right_menu">
        <div className="item__user">
          {authUser ? (
            <>
              <AccountSection />
            </>
          ) : (
            <>
              <Link
                to={config.routes.home}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button variant="outlined">Đăng nhập/Đăng kí</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RightMenu;
