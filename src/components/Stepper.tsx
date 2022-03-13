import React, { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import MuiStep from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'

export interface StepperButtonProps<T> {
    activeStep: number
    handleNext: (val: T) => void
    handleBack: () => void
    nextButtonText?: string
}

export function StepperButtons(props: StepperButtonProps<unknown>) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
                color="inherit"
                disabled={props.activeStep === 0}
                onClick={props.handleBack}
                sx={{ mr: 1 }}
            >
                Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={() => props.handleNext(undefined as unknown)}>
                {props.nextButtonText ?? 'Next'}
            </Button>
        </Box>
    )
}

interface Step {
    label: string
    view: ReactNode
}

interface StepperProps {
    steps: Step[]
    finished: ReactNode
    activeStep: number
}

export default function HorizontalLinearStepper({
    activeStep,
    steps,
    finished,
}: StepperProps) {
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((step) => {
                    const stepProps: { completed?: boolean } = {}
                    const labelProps: {
                        optional?: React.ReactNode
                    } = {}
                    return (
                        <MuiStep key={step.label} {...stepProps}>
                            <StepLabel {...labelProps}>{step.label}</StepLabel>
                        </MuiStep>
                    )
                })}
            </Stepper>
            {activeStep === steps.length ? (
                finished
            ) : (
                <>{steps[activeStep].view}</>
            )}
        </Box>
    )
}
