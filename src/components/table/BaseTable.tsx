"use client";
import { IRole } from "@/types";
import { COLORS } from "@/utils";
import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Image from "next/image";
import React from "react";
import { CardsGrid } from "./TableCard";

interface CustomizedTableProps {
  columns: Array<{
    label: string;
    key: string;
    Formatter?: (value: any) => React.ReactNode;
    rowFormatter?: (value: any) => React.ReactNode;
    style?: any;
    hideOnDesktop?: boolean;
    hideOnMobile?: boolean;
    mobileTitle?: boolean;
  }>;
  isLoading?: boolean;
  rows: { [key: string]: any }[];
  onClickRow?: (row: { [key: string]: any }) => void;
  actions?: Array<{
    icon?: React.ReactNode;
    label: string;
    onClick: (data?: any) => void;
    hiddenDesktop?: boolean;
  }>;
  onExpand?: (row: { [key: string]: number | string }) => void;
  hideMobileView?: boolean;
  isRecognize?: boolean;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    "&: first-child": {
      borderTopLeftRadius: ".5rem",
      borderBottomLeftRadius: ".5rem",
    },
    "&: last-child": {
      borderTopRightRadius: ".5rem",
      borderBottomRightRadius: ".5rem",
    },
    backgroundColor: COLORS["primary"]["50"],
    color: COLORS["base"]["5"],
    fontWeight: "600",
    fontSize: "1rem",
  },
  [`&.${tableCellClasses.body}`]: {
    width: "250px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "td, th": {
    borderBottom: "1px solid #E2E8F0",
    borderTop: "1px solid #E2E8F0",
  },
  "td:first-child": {
    borderTopLeftRadius: ".5rem",
    borderBottomLeftRadius: ".5rem",
    borderLeft: "1px solid #E2E8F0",
  },
  "td:last-child": {
    borderTopRightRadius: ".5rem",
    borderBottomRightRadius: ".5rem",
    borderRight: "1px solid #E2E8F0",
  },
  td: {
    color: "#0F172A",
    fontSize: "1rem",
  },
}));

export function BaseTable({
  rows,
  columns,
  actions,
  onExpand,
  onClickRow,
  isLoading,
  isRecognize,
  hideMobileView
}: CustomizedTableProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [selectedRow, setSelectedRow] = React.useState<any | undefined>();

  const desktopColumns = columns.filter((column) => !column.hideOnDesktop);

  return (
    <>
    {
      !hideMobileView && (
        <CardsGrid
          columns={columns}
          rows={rows}
          actions={actions}
          onExpand={onExpand}
          onClickRow={onClickRow}
          isRecognize={isRecognize}
        />
      )
    }
      <TableContainer
        sx={{
          "@media (max-width: 768px)": {
            display: hideMobileView ? 'inherit' : "none",
          },
        }}
      >
        <Table
          sx={{
            minWidth: 700,
            borderCollapse: "separate",
            borderSpacing: "0px 16px",
          }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow
              sx={{
                "td, th": {
                  border: 0,
                },
              }}
            >
              {desktopColumns.map((column) => (
                <StyledTableCell key={column.key} align="left">
                  {column.label}
                </StyledTableCell>
              ))}
              {actions && (
                <StyledTableCell
                  sx={{
                    width: "80px",
                    maxWidth: "80px",
                  }}
                  align="right"
                ></StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading &&
              new Array(3).fill(0).map((_, index) => (
                <StyledTableRow key={index}>
                  {desktopColumns.map((column) => (
                    <StyledTableCell align="left" key={column.key}>
                      <Skeleton />
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="right">
                    <Skeleton variant="circular" width={20} />
                  </StyledTableCell>
                </StyledTableRow>
              ))}

            {
              !isLoading && rows && rows.length === 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={columns.length + 1} align="center">
                    Nenhum registro encontrado
                  </StyledTableCell>
                </StyledTableRow>
              )
            }

            {!isLoading && rows && rows.map((row) => (
                <StyledTableRow
                  key={row.name}
                  style={
                    onClickRow && {
                      cursor: "pointer",
                    }
                  }
                  onClick={() => onClickRow && onClickRow(row)}
                >
                  {desktopColumns.map((column) => (
                    <StyledTableCell
                      align="left"
                      key={column.key}
                      component="td"
                      style={column.style}
                    >
                      {column.rowFormatter
                        ? column.rowFormatter(row)
                        : column.Formatter
                        ? column.Formatter(row[column.key])
                        : row[column.key]}
                    </StyledTableCell>
                  ))}

                  {actions && (
                    <StyledTableCell
                      align="center"
                      sx={{
                        width: "80px",
                        maxWidth: "100px",
                      }}
                    >
                      <div className="flex justify-end items-center w-full h-full">
                        {onExpand && (
                          <IconButton
                            sx={{
                              width: "40px",
                              height: "40px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onExpand && onExpand(row);
                            }}
                          >
                            <Image
                              src={"/expand_content.svg"}
                              alt="Expand"
                              width={16}
                              height={16}
                            />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRow(row);
                            setAnchorEl(e.currentTarget);
                          }}
                        >
                          <MoreVert className="text-base-7" />
                        </IconButton>
                      </div>
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {actions && (
        <Menu
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {actions.map((action, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                action.onClick(selectedRow);
                setAnchorEl(null);
              }}
              sx={{
                display: action.hiddenDesktop ? "none" : "flex",
                gap: "8px",
                color: "#000000",
              }}
            >
              {action.icon && action.icon}
              {action.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}
