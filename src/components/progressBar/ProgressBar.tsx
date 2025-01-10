// src/ProgressBar.js
import React, { useState, useEffect } from "react";
import style from "./ProgressBar.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(style);

const ProgressBar: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = () => {
    //the height of browers
    const winScroll = document.documentElement.scrollTop;
    //the height of content
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = (winScroll / height) * 100;
    setScrollTop(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={cx("progress-container")}>
      <div
        className={cx("progress-bar")}
        style={{ width: `${scrollTop}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
