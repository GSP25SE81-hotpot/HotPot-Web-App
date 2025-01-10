import React, { KeyboardEvent, useState, useRef, useEffect } from "react";
import { Box, InputBase } from "@mui/material";
import { KeyboardAlt, Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null); // Reference for InputBase

  const handleSearch = async (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    if (event.key === "Enter") {
      console.log(1);
    }
  };

  const handleKeyboardAltClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <InputBase
        placeholder="Nhập tên sản phẩm bạn muốn tìm..."
        endAdornment={
          <LoadingButton onClick={handleKeyboardAltClick}>
            <KeyboardAlt sx={{ color: "rgba(0, 0, 0, 0.55)" }} />
          </LoadingButton>
        }
        inputRef={inputRef} // Assign the inputRef to the InputBase
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.55)",
          padding: "5px 5px 5px 20px",
          borderRadius: "50px 0 0 50px",
          width: "500px",
        }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyDown={handleSearch}
      />
      <Box
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.55)",
          borderRadius: "0 50px 50px 0",
          padding: "5px",
        }}
      >
        <LoadingButton>
          <Search sx={{ color: "rgba(0, 0, 0, 0.55)" }} />
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default SearchBar;
