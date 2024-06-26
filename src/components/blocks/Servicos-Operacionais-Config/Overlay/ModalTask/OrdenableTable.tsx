'use client';
import { IRole } from '@/types';
import { COLORS } from '@/utils';
import { DragIndicator, MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Image from 'next/image';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

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
    csv?: {
      fileName: string;
      data: (row) => string[][];
    };
  }>;
  showAllActions?: boolean;
  warning?: (row: { [key: string]: any }) => React.ReactNode;
  onExpand?: (row: { [key: string]: number | string }) => void;
  hideMobileView?: boolean;
  isRecognize?: boolean;
  onChangeOrder?: (order: any) => void;
  key?: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    '&: first-child': {
      borderTopLeftRadius: '.5rem',
      borderBottomLeftRadius: '.5rem'
    },
    '&: last-child': {
      borderTopRightRadius: '.5rem',
      borderBottomRightRadius: '.5rem'
    },
    backgroundColor: COLORS['primary']['50'],
    color: COLORS['base']['5'],
    fontWeight: '600',
    fontSize: '1rem'
  },
  [`&.${tableCellClasses.body}`]: {
    width: '250px'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  'td, th': {
    borderBottom: '1px solid #E2E8F0',
    borderTop: '1px solid #E2E8F0'
  },
  'td:first-child': {
    borderTopLeftRadius: '.5rem',
    borderBottomLeftRadius: '.5rem',
    borderLeft: '1px solid #E2E8F0'
  },
  'td:last-child': {
    borderTopRightRadius: '.5rem',
    borderBottomRightRadius: '.5rem',
    borderRight: '1px solid #E2E8F0'
  },
  td: {
    color: '#0F172A',
    fontSize: '1rem'
  }
}));

export function OrdenableTable({
  rows,
  columns,
  actions,
  onExpand,
  onClickRow,
  isLoading,
  isRecognize,
  hideMobileView,
  showAllActions = false,
  warning,
  onChangeOrder,
  key = 'number'
}: CustomizedTableProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [selectedRow, setSelectedRow] = React.useState<any | undefined>();

  const desktopColumns = columns.filter(column => !column.hideOnDesktop);

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newRows = [...rows]; // Cria uma cópia da matriz original

    // Remove o elemento da posição de origem e armazena-o
    const [removed] = newRows.splice(source.index, 1);

    // Insere o elemento removido na posição de destino
    newRows.splice(destination.index, 0, removed);

    const updatedRows = newRows.map((row, index) => {
      return {
        ...row,
        [key]: index + 1
      };
    });

    console.log(updatedRows);

    onChangeOrder && onChangeOrder(updatedRows);
  };

  return (
    <>
      <TableContainer>
        <Table
          sx={{
            minWidth: 700,
            borderCollapse: 'separate',
            borderSpacing: '0px 16px'
          }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow
              sx={{
                'td, th': {
                  border: 0
                }
              }}
            >
              {desktopColumns.map(column => (
                <StyledTableCell key={column.key} align="left">
                  {column.label}
                </StyledTableCell>
              ))}
              {actions && (
                <StyledTableCell
                  sx={{
                    width: '80px',
                    maxWidth: '80px'
                  }}
                  align="right"
                ></StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={onDragEnd}>
            {isLoading &&
              new Array(3).fill(0).map((_, index) => (
                <StyledTableRow key={index}>
                  {desktopColumns.map(column => (
                    <StyledTableCell align="left" key={column.key}>
                      <Skeleton />
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="right">
                    <Skeleton variant="circular" width={20} />
                  </StyledTableCell>
                </StyledTableRow>
              ))}

            {!isLoading && rows && rows.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={columns.length + 1} align="center">
                  Nenhum registro encontrado
                </StyledTableCell>
              </StyledTableRow>
            )}
            <Droppable droppableId="droppable" direction="vertical">
              {provided => (
                <TableBody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    padding: '0 !important',
                    margin: '0 !important'
                  }}
                >
                  {!isLoading &&
                    rows &&
                    rows.map((row, index) => (
                      <Draggable
                        key={row.id ? row.id : row?.draggable}
                        draggableId={row.id ? row.id.toString() : row?.draggable.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => {
                          if (snapshot.isDragging) {
                          }

                          return (
                            <StyledTableRow
                              sx={{
                                left: 'auto !important',
                                top: 'auto !important',
                                bottom: 'auto !important',
                                right: 'auto !important',
                                position: 'relative',
                                margin: '0 !important'
                              }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              {desktopColumns.map((column, index) => (
                                <StyledTableCell align="left" key={column.key} component="td" style={column.style}>
                                  {index === 0 && (
                                    <div className="inline" {...provided.dragHandleProps}>
                                      <DragIndicator className="text-base-7 cursor-grab " />
                                    </div>
                                  )}
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
                                    width: '80px',
                                    maxWidth: '100px'
                                  }}
                                >
                                  <div className="flex justify-end items-center w-full h-full gap-1">
                                    {onExpand && (
                                      <IconButton
                                        sx={{
                                          width: '40px',
                                          height: '40px'
                                        }}
                                        onClick={e => {
                                          e.stopPropagation();
                                          onExpand && onExpand(row);
                                        }}
                                      >
                                        <Image src={'/expand_content.svg'} alt="Expand" width={16} height={16} />
                                      </IconButton>
                                    )}

                                    {warning && warning(row)}
                                    {showAllActions &&
                                      actions.map((action, index) => (
                                        <IconButton
                                          key={index}
                                          onClick={() => action.onClick(row)}
                                          sx={{
                                            width: '32px',
                                            height: '32px',
                                            display: action.hiddenDesktop ? 'none' : 'flex'
                                          }}
                                        >
                                          {action.icon}
                                        </IconButton>
                                      ))}
                                    {!showAllActions && (
                                      <IconButton
                                        onClick={e => {
                                          e.stopPropagation();
                                          setSelectedRow(row);
                                          setAnchorEl(e.currentTarget);
                                        }}
                                      >
                                        <MoreVert className="text-base-7" />
                                      </IconButton>
                                    )}
                                  </div>
                                </StyledTableCell>
                              )}
                            </StyledTableRow>
                          );
                        }}
                      </Draggable>
                    ))}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </TableContainer>

      {actions && (
        <Menu
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
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
                display: action.hiddenDesktop ? 'none' : 'flex',
                gap: '8px',
                color: '#000000'
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
