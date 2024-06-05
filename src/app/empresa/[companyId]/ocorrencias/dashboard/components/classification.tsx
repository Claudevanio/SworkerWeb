import { PieChart } from "@/components/charts/pie";
import { Stack, Typography } from "@mui/material";
import CardCategory from "./cardCategory";
import { COLORS } from "@/utils";

interface IClassificationCard {
  icon: React.ElementType;
  number: number;
  description: string;
}

export default function Classification({
  classificationCards,
  isMobile,
}: {
  classificationCards: IClassificationCard[];
  isMobile: boolean;
}) {
  const totalNumber = classificationCards.reduce((total, item) => {
    return total + item.number;
  }, 0);

  return (
    <> 
      <Stack
        flexDirection={isMobile ? "column" : "row"}
        mt={2}
        justifyContent={isMobile ? "" : "space-between"}
      >
        {classificationCards.slice(0, 4).map((item, index) => (
          <CardCategory
            hide={item.number < 0}
            key={index}
            Icon={item.icon}
            number={item.number}
            description={item.description}
            width={isMobile ? "auto" : "24%"}
          />
        ))}
      </Stack>
      <Stack mt={2} flexDirection={isMobile ? "column-reverse" :"row"} justifyContent="space-between">
        <Stack
          sx={{
            borderRadius: "8px",
            border: `2px solid ${COLORS.primary["50"]}`,
            padding: "1.5rem",
          }}
          width={isMobile ? "auto" : "49%"}
        >
          <Typography fontWeight={700} fontSize="1.5rem">
            TOTAL
          </Typography>
          <Typography fontSize="1.5rem" fontWeight={500}>
            {totalNumber}
          </Typography>
          <PieChart
            data={classificationCards.map((item) => ({
              type: item.description,
              value: item.number,
            }))}
          />
        </Stack>
        <Stack width="49%" gap={2} justifyContent="space-between">
          {classificationCards.slice(4, 7).map((item, index) => (
            <CardCategory
              hide={item.number < 0}
              key={index}
              Icon={item.icon}
              number={item.number}
              description={item.description}
              width={"100%"}
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
}
