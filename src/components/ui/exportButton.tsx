import { COLORS } from "@/utils";
import { QrCode } from "@mui/icons-material";

import { CSVLink } from "react-csv";
import { Button } from "./button";

interface ExportButtonProps {
  csvData?: string[][];
  onClick?: () => void;
  hidden?: boolean;
  fileName?: string;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  csvData = [],
  onClick,
  hidden,
  fileName,
  disabled,
}) => {
  return disabled ? (
    <Button
      variant="primary"
      onClick={onClick}
      disabled={disabled}
      sx={{
        gap: 2,
        borderRadius: "8px",
        backgroundColor: COLORS.primary["600"],
        color: "white",
        display: hidden ? "none" : "block",
      }}
    >
      <QrCode />
      Exportar
    </Button>
  ) : (
    <CSVLink
      filename={fileName}
      data={csvData}
      style={{ display: hidden ? "none" : "block" }}
    >
      <Button
        variant="primary"
        onClick={onClick}
        disabled={disabled}
        sx={{
          gap: 2,
          borderRadius: "8px",
          backgroundColor: COLORS.primary["600"],
          color: "white",
        }}
      >
        <QrCode />
        Exportar
      </Button>
    </CSVLink>
  );
};
