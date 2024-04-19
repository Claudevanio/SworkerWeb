import { QrCode } from "@mui/icons-material";
import { Button } from "@mui/material";

interface ExportButtonProps {
  onClick: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outlined"
      sx={{ gap: 2, borderRadius: "8px", borderColor: "#2563EB" }}
      onClick={onClick}
    >
      <QrCode />
      Exportar
    </Button>
  );
};
