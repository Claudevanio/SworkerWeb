import { Check } from '@mui/icons-material';
import { StepConnector, stepConnectorClasses, Stepper as BaseStepper, styled, Step, StepLabel, StepIconProps, useMediaQuery } from '@mui/material';

export type StepperProps = {
  currentStep: number;
  steps: {
    value: number;
    name?: string;
  }[];
};

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    '@media (min-width: 768px)': {
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: '#94A3B8'
        }
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: '#94A3B8'
        }
      },
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1
      }
    },
    '@media (max-width: 768px)': {
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: '#94A3B8'
        }
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: '#94A3B8'
        }
      },
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderLeftWidth: 2,
        borderRadius: 1
      }
    }
  }));

  const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 24,
    alignItems: 'center',
    width: 24,
    justifyContent: 'flex-start',
    ...(ownerState.active && {
      color: '#DBEAFE',
      '& .QontoStepIcon-circle': {
        backgroundColor: '#DBEAFE !important',
        color: '#020617'
      }
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#DBEAFE',
      zIndex: 1,
      fontSize: 18
    },
    '& .QontoStepIcon-circle': {
      width: 24,
      height: 24,
      borderRadius: '50%',
      backgroundColor: '#F1F5F9',
      color: '#020617',
      textAlign: 'center',
      fontSize: 12,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }));

  interface stepProps extends StepIconProps {
    step: number;
  }

  const QontoStepIcon = (props: stepProps) => {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon bg-success text-white rounded-full p-1 h-6 w-6" />
        ) : (
          <div
            className="QontoStepIcon-circle"
            style={{
              backgroundColor: active ? '#DBEAFE' : '#fff',
              color: active ? '#020617' : '#0F172A'
            }}
          >
            {props.step}
          </div>
        )}
      </QontoStepIconRoot>
    );
  };

  return (
    <BaseStepper
      activeStep={currentStep - 1}
      orientation={isMobile ? 'vertical' : 'horizontal'}
      connector={<QontoConnector />}
      sx={{
        justifyContent: 'space-between',
        pb: 0,
        mb: 4,
        mt: 2
      }}
    >
      {steps.map((value, index) => (
        <Step
          key={index}
          sx={{
            '@media (min-width: 768px)': {
              '.MuiStepLabel-root': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px'
              }
            }
          }}
        >
          <StepLabel
            StepIconComponent={QontoStepIcon}
            StepIconProps={
              {
                step: value.value as any
              } as any
            }
          >
            {value.name}
          </StepLabel>
        </Step>
      ))}
    </BaseStepper>
  );
};
