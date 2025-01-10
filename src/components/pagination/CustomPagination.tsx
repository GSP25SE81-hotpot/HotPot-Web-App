import React from "react";
import { Pagination } from "@mui/material";
import Stack from "@mui/material/Stack";

interface PaginationInterface {
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  sibling?: number;
}

const CustomPagination: React.FC<PaginationInterface> = ({
  totalPosts,
  postsPerPage,
  currentPage,
  onPageChange,
  sibling,
}) => {
  const pageCount = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    event.preventDefault();
    onPageChange(page);
  };

  return (
    <Stack
      spacing={2}
      display="flex"
      direction="row"
      sx={{ justifyContent: "center" }}
    >
      <Pagination
        variant="outlined"
        shape="rounded"
        color="primary"
        count={pageCount}
        page={currentPage}
        onChange={handlePageChange}
        size="small"
        siblingCount={sibling}
      />
    </Stack>
  );
};

export default CustomPagination;
