import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ReactNode } from "react";
import { Button } from "../ui";
import { KeyboardArrowDown, QrCode, TrendingUp } from "@mui/icons-material";
import { CSVLink } from 'react-csv';

interface CustomizedTableProps {
  columns: Array<{
    label: string;
    key: string;
    Formatter?: (value: any) => React.ReactNode;
    style?: any;
    hideOnDesktop?: boolean;
    hideOnMobile?: boolean;
    mobileTitle?: boolean;
    rowFormatter?: (value: any) => React.ReactNode;
  }>;
  rows: { [key: string]: any }[];
  actions?: Array<{
    icon?: React.ReactNode;
    label: string;
    onClick: (data?: any) => void;
    csv?:{
      fileName: string;
      data: (row) => string[][];
    }
  }>;
  onExpand?: (row: { [key: string]: number | string }) => void;
  mobileView?: boolean;
  onClickRow?: (row: { [key: string]: any }) => void;
  isRecognize?: boolean;
}

export const CardsGrid = ({
  columns,
  rows,
  actions,
  onExpand,
  mobileView,
  onClickRow,
  isRecognize,
}: CustomizedTableProps) => {
  const mobileColumns = columns.filter(
    (column) => !column.hideOnMobile && !column.mobileTitle
  );

  const title = columns.find((column) => column.mobileTitle);

  return (
    <div className="grid grid-cols-1 md:hidden">
      {rows.map((row, index) => (
        <Accordion
          className="rounded-lg shadow-none"
          sx={{
            "&:before": {
              display: "none",
            },
          }}
          key={index}
        >
          <AccordionSummary
            className="bg-base-2 rounded-lg mb-2"
            expandIcon={<KeyboardArrowDown className="text-base-6" />}
          >
            <h2 className="text-base-6 font-bold text-base">
              {!title ? row.name :
               title.rowFormatter ? title.rowFormatter(row) : title.Formatter ? title.Formatter(row[title.key]) : row[title.key] }
            </h2>
          </AccordionSummary>
          <AccordionDetails
            className="flex flex-col gap-4 bg-base-2 p-4 rounded-lg"
            onClick={() => onClickRow && onClickRow(row)}
            style={{ cursor: onClickRow ? "pointer" : "default" }}
          > 
            <div className="grid grid-cols-2 gap-4">
              {mobileColumns.map((column, index) => (
                <TableCardField
                  key={index}
                  label={column.label}
                  style={column.style}
                >
                  {column.Formatter
                    ? column.Formatter(row[column.key])
                    : row[column.key]}
                </TableCardField>
              ))}
            </div>
            <div className="flex justify-between gap-4 w-full items-center">
              {actions?.some((action) => action.label === "Reconhecer") && (
                <p
                  className="text-secondary text-sm cursor-pointer w-fit"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions
                      .find((action) => action.label === "Reconhecer")
                      ?.onClick(row);
                  }}
                >
                  Reconhecer
                </p>
              )}

              {actions?.some((action) => action.label === "Evolucao") && (
                <p
                  className="text-primary-700 text-sm cursor-pointer w-fit flex gap-2 items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions
                      .find((action) => action.label === "Evolucao")
                      ?.onClick(row);
                  }}
                >
                <TrendingUp className="text-primary-700" />
                  Evolucao
                </p>
              )}

              {actions?.some((action) => action.label === "Exportar") && (
                <CSVLink
                  data={
                    actions.find((action) => action.label === "Exportar")?.csv?.data(row) ?? []
                  }
                  filename={actions.find((action) => action.label === "Exportar")?.csv?.fileName ?? 'export.csv'}
                >
                  <p
                    className="text-primary-700 text-sm cursor-pointer w-fit flex gap-2 items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      actions
                        .find((action) => action.label === "Exportar")
                        ?.onClick(row);
                    }}
                  >
                    <QrCode className="text-primary-700" />
                    Exportar
                  </p>
                </CSVLink>
              )}

              {actions?.some((action) => action.label === "Excluir") && (
                <p
                  className="text-erro-2 text-sm cursor-pointer w-fit"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions
                      .find((action) => action.label === "Excluir")
                      ?.onClick(row);
                  }}
                >
                  Excluir
                </p>
              )}

              {actions?.some((action) => action.label === "Detalhes") && (
                <p
                  className="text-primary-700 text-sm cursor-pointer w-fit"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions
                      .find((action) => action.label === "Detalhes")
                      ?.onClick(row);
                  }}
                >
                  Detalhes
                </p>
              )}

            {actions?.some((action) => action.label === "Editar") && (
              <p
                className="text-primary-700 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  actions
                    .find((action) => action.label === "Editar")
                    ?.onClick(row);
                }}
              >
                Editar
              </p>
            )}

            {actions?.some((action) => action.label === "Encerrar") && (
              <p
                className="text-erro-3 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  actions
                    .find((action) => action.label === "Encerrar")
                    ?.onClick(row);
                }}
              >
                Encerrar
              </p>
            )}

            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export const TableCardField = ({
  label,
  children,
  style,
}: {
  label: string;
  children: ReactNode;
  style?: any;
}) => {
  return (
    <div
      className="flex flex-col gap-2 text-base-8 font-semibold "
      style={style}
    >
      <span className="text-base-4 text-xs">{label}</span>
      {children}
    </div>
  );
};
