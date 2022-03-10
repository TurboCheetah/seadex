import React, {useRef, useState, forwardRef} from 'react';
import {Autocomplete, Box, BoxProps, Button, styled, TextField} from "@mui/material";
import TopAppBar from "../../components/TopAppBar";
import Stepper, {StepperButtonProps, StepperButtons} from "../../components/Stepper";
import {Add as AddIcon} from "@mui/icons-material";
import Head from "next/head";
import {NextPage} from "next";

const flex = (direction: 'row' | 'column' = 'row') => ({
    display: 'flex',
    flexDirection: direction,
})


const StyledForm = styled(Box)(({theme}) => ({
    ...flex('column'),
    margin: 'auto',
    width: 'fit-content',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
}))

// eslint-disable-next-line react/display-name
const Form = forwardRef((props: BoxProps, ref) => {
    return (<StyledForm {...props} noValidate component='form' ref={ref}>{props.children}</StyledForm>)
})

const availableLanguages = {
    'English': 'en', 'Romanji': 'romanji'
}

function zip<T, K>(a: T[], b: K[]): [T, K][] {
    return a.map((k, i) => [k, b[i]]);
}

interface Title {
    title: string
    language: string
}

interface TitleFormProps extends StepperButtonProps {
    handleNext: (titles: Title[]) => void
}

function TitleForm(props: TitleFormProps) {
    const [inputs, setInputs] = useState([1])
    const formRef = useRef<HTMLFormElement | null>(null)
    const addInput = () => {
        setInputs(i => [...i, i.length + 1])
    };
    const next = () => {
        if (formRef.current === null) {
            throw Error("form ref is null")
        }

        const formGroup = new FormData(formRef.current)
        const titles = formGroup.getAll('title')
        const languages = formGroup.getAll('lang')
        const data = zip(titles, languages).map(([title, language]) =>
            ({ title: title.toString(), language: language.toString() }))
        props.handleNext(data)
    }
    return (
        <>
            <Form ref={formRef}>
                {inputs.map((i) => (
                    <Box key={i} sx={{
                        ...flex(),
                        gap: 2
                    }}>
                        <TextField
                            autoFocus
                            label="Title"
                            name='title'
                            fullWidth
                            required
                        />

                        <Autocomplete
                            disablePortal
                            fullWidth
                            options={Object.keys(availableLanguages)}
                            renderInput={(params) => <TextField {...params} name='lang' required label="Language"/>}
                        />
                    </Box>
                ))}
                <Button onClick={addInput}>
                    <AddIcon/> Add another title
                </Button>
            </Form>
            <StepperButtons handleNext={next} handleBack={props.handleBack} activeStep={props.activeStep} />
        </>
    )
}

interface ReleasesFormProps extends StepperButtonProps {
    handleNext: (releases: object[]) => void
}

function ReleasesForm(props: ReleasesFormProps) {
    return (
        <>
            <StepperButtons activeStep={props.activeStep} handleNext={props.handleNext} handleBack={props.handleBack} nextButtonText="Finish" />
        </>
    )
}

const NewPage: NextPage = () => {
    const [titles, setTitles] = useState<Title[]>([])
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const goToReleases = (titles: Title[]) => {
        setTitles(titles)
        handleNext()
    }

    const finish = (releases: object[]) => {
        handleNext()
    }
    console.log(titles)
    const steps = [
        {
            label: 'Show titles',
            view: <>
                <TitleForm handleNext={goToReleases}  activeStep={activeStep} handleBack={handleBack} />
            </>
        },
        {
            label: 'Add Releases',
            view: <>
                <ReleasesForm handleNext={finish} activeStep={activeStep} handleBack={handleBack} />
            </>
        }
    ]
    return (
        <>
            <Head>
                <title>Add release | Seadex</title>
                <meta name="description" content="A Certain Smoke's Index"/>
            </Head>
            <TopAppBar/>
            <Box component='main'>
                <Stepper steps={steps} finished={<>Yo mf, we done</>} activeStep={activeStep} />
            </Box>
        </>
    );
}

// noinspection JSUnusedGlobalSymbols
export default NewPage
