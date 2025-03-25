import React, { useEffect, useState } from "react";
import Logo from "../../../../components/Logo/Logo";
import RightMenu from "../RightMenu/RightMenu";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./TopBar.module.scss";
import config from "../../../../configs";

const cx = classNames.bind(styles);

const LogoContainer = () => {
  return (
    <Link to="/">
      <Logo />
    </Link>
  );
};

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className={cx("wrapper")}>
        <div className={cx("inner")}>
          <div className={cx("logo")}>
            <LogoContainer />
          </div>
          <RightMenu />
        </div>
        <nav className={cx("main-nav")}>
          <a className={cx("header-navbar")} href={config.routes.home}>
            {" "}
            TRANG CHỦ{" "}
          </a>

          <a className={cx("header-navbar")}> TIN TỨC </a>
          <a className={cx("header-navbar")}> ĐIỀU KHOẢN </a>
          <a className={cx("header-navbar")}> CHÍNH SÁCH </a>
        </nav>
      </header>
    </>
  );
};

export default TopBar;
