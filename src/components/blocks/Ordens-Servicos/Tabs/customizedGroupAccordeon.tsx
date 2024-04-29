import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { COLORS } from '@/utils';
import { Box } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary 
    {...props}
  />
))(({ theme }) => ({   
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding:  0,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedGroupAccordion(
  {
    children,
    summary,
    expanded,
    onChange, 
    defaultExpanded=true,
    filledSummary,
  }: {
    children: React.ReactNode,
    summary: string,
    expanded?: boolean
    onChange?: (value: string | number ) => void
    special?: 'first' | 'last'
    defaultExpanded?: boolean  
    filledSummary?: boolean
  }
) {
  const handleChange = (panel: string | number) => () => {
    onChange && onChange(panel)
  };
  return (
    <Box
      sx={{
        '& .MuiAccordion-root:last-child': {
          background: 'transparent !important'
        }
      }}
    >
      <Accordion  
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      onChange={
        handleChange('panel1')
      }
      sx={{
        border: `1px solid ${COLORS['primary']['200']}`, 
        borderRadius: '8px',
      }}
      >
        <AccordionSummary  
          expandIcon={
            <KeyboardArrowDown
              className="text-base-7"
            />
          }
          sx={
            filledSummary ? {
              backgroundColor: COLORS['primary']['50'],
            } : {}
          }
        >
            <p
              className="text-base-7 font-medium text-base"
            >{summary}</p>
        </AccordionSummary>
        <AccordionDetails
          sx={
            { 
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              borderTop: 0,
            }
          }
        >
          {
            children
          }
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}