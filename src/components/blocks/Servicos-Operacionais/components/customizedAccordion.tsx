import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { COLORS } from '@/utils';
import { Box } from '@mui/material';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&::before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary {...props} />)(({ theme }) => ({
  backgroundColor: COLORS['primary']['50'],
  border: `1px solid ${COLORS['primary']['200']}`,
  flexDirection: 'row-reverse'
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

export default function CustomizedAccordions({
  children,
  summary,
  expanded,
  onChange,
  special
}: {
  children: React.ReactNode;
  summary: string;
  expanded?: boolean;
  onChange?: (value: string | number) => void;
  special?: 'first' | 'last';
}) {
  const handleChange = (panel: string | number) => () => {
    onChange && onChange(panel);
  };
  return (
    <Box
      sx={{
        '& .MuiAccordion-root:last-child': {
          background: 'transparent !important'
        }
      }}
    >
      <Accordion expanded={expanded} onChange={handleChange('panel1')}>
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          sx={
            special === 'first'
              ? {
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px'
                }
              : special === 'last'
                ? {
                    '&:not(.Mui-expanded)': {
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px'
                    }
                  }
                : {}
          }
        >
          <p className="text-base-6 font-bold text-base">{summary}</p>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </Box>
  );
}
