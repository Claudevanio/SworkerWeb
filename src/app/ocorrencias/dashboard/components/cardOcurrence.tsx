import { COLORS } from "@/utils";
import { TrendingDownOutlined, TrendingUpOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import React from "react";

export default function CardOcurrence({
  Icon,
  percentage,
  days,
  dayStart,
  dayEnd,
  month,
  number,
  statusOcurrence,
  width,
}: {
  Icon: React.ElementType;
  percentage: number | string;
  days: number;
  dayStart: string;
  dayEnd: string;
  month: string;
  number: number;
  statusOcurrence: string;
  width: string;
}) {
  return (
    <Stack
      gap={2}
      sx={{
        borderRadius: "8px",
        border: `2px solid ${COLORS.primary["100"]}`,
        padding: "1.5rem",
        width: width,
      }}
    >
      <Stack flexDirection="row" gap={2}>
        <Stack
          justifyContent="center"
          padding="1.5rem"
          sx={{
            backgroundColor: COLORS.primary["100"],
            color: COLORS.primary["600"],
            borderRadius: "16px",
          }}
        >
          <Icon sx={{ width: "32px", height: "32px" }} />
        </Stack>
        <Stack justifyContent="space-around">
          <Typography
            color={COLORS.primary["600"]}
            fontSize="2rem"
            fontWeight={700}
          >
            {number}
          </Typography>
          <Typography
            fontSize="1rem"
            color={COLORS.primary["500"]}
            fontWeight={600}
          >
            {statusOcurrence}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        flexDirection="row"
        padding="0.2rem 0.5rem"
        sx={{
          backgroundColor:
            Number(percentage) >= 0 ? COLORS.sucesso["0"] : COLORS.erro["0"],
          border:
            Number(percentage) >= 0
              ? `1px solid ${COLORS.sucesso["2"]}`
              : `1px solid ${COLORS.erro["2"]}`,
          color:
            Number(percentage) >= 0 ? COLORS.sucesso["3"] : COLORS.erro["3"],
          borderRadius: "24px",
        }}
        alignItems="center"
        gap={1}
      >
        {Number(percentage) >= 0 ? (
          <TrendingUpOutlined />
        ) : (
          <TrendingDownOutlined />
        )}
        <Typography fontWeight={500} fontSize="0.9rem">
          {Number(percentage) >= 0 ? "+" : ""}
          {Number(percentage).toLocaleString('pt-br', {
            maximumFractionDigits: 1
          })}% nos últimos {days} dias ({dayStart} {month} -{" "}
          {dayEnd} {month})
        </Typography>
      </Stack>
    </Stack>
  );
}
