"use client";
import React from "react";
import { Pagination as MuiPagination, useMediaQuery } from "@mui/material";
import {
  East,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { COLORS } from "@/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onChange,
}) => {
  
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value - 1);
  };
  
  
  if( !totalPages)
    return <></>
  

  return (
    <div
      className={`flex ${
        isMobile ? "justify-center" : "justify-between"
      } w-full items-center gap-2`}
    >
      <span
        className="text-sm flex items-center gap-2 cursor-pointer min-w-[90px] justify-start"
        onClick={() => (currentPage > 0 ? onChange(currentPage - 1) : {})}
        style={
          currentPage > 0
            ? {
                color: COLORS["primary"]["600"],
                display: isMobile ? "none" : "inline",
              }
            : {
                color: COLORS["base"]["4"],
                display: isMobile ? "none" : "inline",
              }
        }
      >
        <East className="rotate-180" />
        Anterior
      </span>
      <MuiPagination
        count={totalPages}
        page={currentPage + 1}
        color="primary"
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: ".5rem",
          },
          ".MuiPagination-ul": {
            gap: "2px",
          },
        }}
        hideNextButton
        hidePrevButton
        onChange={handleChange}
      />
      <span
        className="text-sm flex items-center gap-2 cursor-pointer min-w-[90px] justify-end"
        onClick={() =>
          currentPage + 1 < totalPages ? onChange(currentPage + 1) : {}
        }
        style={
          currentPage + 1 < totalPages
            ? {
                color: COLORS["primary"]["600"],
                display: isMobile ? "none" : "inline",
              }
            : {
                color: COLORS["base"]["4"],
                display: isMobile ? "none" : "inline",
              }
        }
      >
        Próximo
        <East />
      </span>
    </div>
  );
};

export default Pagination;
