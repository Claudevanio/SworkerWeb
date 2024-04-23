import { COLORS } from "@/utils";
import { Stack, Typography } from "@mui/material";

export default function CardCategory({
  Icon,
  number,
  description,
  width,
  hide
}: {
  Icon: React.ElementType;
  number: number;
  description: string;
  width: string;
  hide: boolean
}) {
  return (
    <Stack
      gap={2}
      display={hide ? "none" : "flex"}
      width={width}
      sx={{
        borderRadius: "8px",
        border: `2px solid ${COLORS.primary["50"]}`,
        padding: "1.5rem",
      }}
    >
      <Stack flexDirection="row" gap={2}>
        <Stack
          justifyContent="center"
          padding="1.5rem"
          sx={{
            backgroundColor: COLORS.base["2"],
            color: COLORS.primary["500"],
            borderRadius: "16px",
          }}
        >
          <Icon sx={{ width: "28px", height: "28px" }} />
        </Stack>
        <Stack justifyContent="space-around">
          <Typography fontSize="2rem" fontWeight={700}>
            {number}
          </Typography>
          <Typography fontSize="1rem" fontWeight={600}>
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
