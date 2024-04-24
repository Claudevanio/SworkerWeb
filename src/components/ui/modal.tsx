import { Close } from '@mui/icons-material';
import { Modal as MuiModal, Box, Typography, IconButton } from "@mui/material";
import { Button } from './button';

export type ModalProps = {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  width?: string;  
  fullMobile?: boolean;
  onSubmit?: () => void; 
  SubmitText?: string;
  methods?: any;
};

export const Modal = ({
  title,
  isOpen,
  onClose,
  children, 
  width = "444px", 
  fullMobile = false,
  onSubmit,
  SubmitText,
  methods,
}: ModalProps) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    bgcolor: "#fff",
    maxHeight: "95vh",
    overflowY: "auto",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: 24,
    "@media (max-width: 768px)": {
      width: fullMobile ? "100%" : "90%",
      height: fullMobile ? "100%" : "auto",
      maxHeight: fullMobile ? "100%" : "95vh", 
      boxShadow: "none",
    },
  };

  return (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ 
        backgroundColor:'#A4A4A47A',
        '@media (max-width: 768px)': { 
          backgroundColor: fullMobile ?'#fff' : '#A4A4A47A',
          '.MuiBackdrop-root': {
            backgroundColor: fullMobile ?'#fff' : '#A4A4A47A',
          }
        }
      }}
    >
      <>
        <Box sx={style}>
            <div className="flex justify-between items-center w-full mb-2">
            <h2
              className='text-primary-700 md:text-base-7 font-bold text-base md:text-lg'
            >
              {title}
            </h2> 
            <IconButton
              onClick={onClose}
              className="cursor-pointer text-primary"> 
            <Close
              />
            </IconButton>
          </div>
          {children}
          {
            onSubmit && (
              <div className="flex flex-col-reverse gap-2 w-full md:flex-row justify-between items-center mt-4">
                <p
                  onClick={onClose}
                  className="text-base-7 font-medium text-sm md:text-lg cursor-pointer"
                >
                  Cancelar
                </p>
                <Button
                  onClick={onSubmit} 
                  disabled={methods?.formState.isSubmitting}
                  className='w-full md:w-auto'
                >
                  {
                    SubmitText || 'Salvar'
                  }
                </Button>
              </div>
            )
          }
        </Box>
      </>
    </MuiModal>
  );
};
