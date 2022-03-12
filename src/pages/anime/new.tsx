import React, {forwardRef, useRef, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    BoxProps,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Icon,
    InputAdornment,
    styled,
    TextField,
    Typography
} from "@mui/material";
import type {TextFieldProps} from '@mui/material/TextField'
import TopAppBar from "../../components/TopAppBar";
import Stepper, {StepperButtonProps, StepperButtons} from "../../components/Stepper";
import {Add as AddIcon, Done as DoneIcon, ExpandMore as ExpandMoreIcon} from "@mui/icons-material";
import Head from "next/head";
import Image from "next/image";
import type {NextPage} from "next";
import Release from "../../modals/Release";

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
    return (<StyledForm {...props} component='form' ref={ref}>{props.children}</StyledForm>)
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

function TitleForm(props: StepperButtonProps<Title[]>) {
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
            ({title: title.toString(), language: language.toString()}))
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
            <StepperButtons handleNext={next} handleBack={props.handleBack} activeStep={props.activeStep}/>
        </>
    )
}

const TwoColumnGrid = styled(Box)(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr'
    }
}))

// eslint-disable-next-line react/display-name
const LinkField = forwardRef((props: TextFieldProps & { site: string }, ref) => {
    const site = props.site

    return (
        <TextField
            {...props}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Icon>
                            <Image alt={`${site} icon`} src={`/${site}.webp`} width={24} height={24}/>
                        </Icon>
                    </InputAdornment>
                ),
            }}

        />
    )
})

function ReleasesForm(props: StepperButtonProps<object[]>) {
    const [expanded, setExpanded] = useState<string | false>(false);
    const [releases, setReleases] = useState<Release[]>([])
    const formRef = useRef<HTMLFormElement | null>(null)

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const addRelease = () => {
        if (formRef.current === null) {
            throw Error("form ref is null")
        }

        const formData = new FormData(formRef.current)
        const fields = [
            'title',
            'releaseGroup',
            'notes',
            'comparisons',
            'nyaaLink',
            'bbtLink',
            'toshLink',
            'dualAudio',
            'isRelease',
            'isBestVideo',
            'incomplete',
            'isExclusiveRelease',
        ]
        const release = {}
        fields.forEach(f => {
            release[f] = formData.get(f)
        })
        setReleases(r => [...r, release])
        formRef.current?.reset()
    }

    const handleNext = () => {
        props.handleNext(releases)
    }

    return (
        <>
            {releases.map(release => (
                <Accordion expanded={expanded === release.id} key={release.id} onChange={handleChange(release.id)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{width: '33%', flexShrink: 0}}>
                            General settings
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>I am an accordion</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                            Aliquam eget maximus est, id dignissim quam.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Form ref={formRef}>
                <TwoColumnGrid sx={{gap: 2}}>
                    <TextField
                        autoFocus
                        label="Title"
                        name='title'
                        helperText='e.g. S1'
                        fullWidth
                        required
                    />

                    <TextField
                        autoFocus
                        label="Release Group"
                        name='releaseGroup'
                        fullWidth
                        required
                    />
                </TwoColumnGrid>

                <TextField
                    autoFocus
                    label="Notes"
                    name='notes'
                    fullWidth
                    multiline
                />

                <TextField
                    autoFocus
                    label="Comparisons"
                    name='comparisons'
                    fullWidth
                    multiline
                />

                <LinkField site='nyaa' name='nyaaLink' label='Nyaa link'/>

                <LinkField site='bbt' name='bbtLink' label='Bbt link'/>

                <LinkField site='tosh' name='toshLink' label='Tosh link'/>

                <TwoColumnGrid>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox name='dualAudio'/>} label="Dual Audio"/>
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked name='isRelease'/>} label="Release"/>
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked name='isBestVideo'/>} label="Best video"/>
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel control={<Checkbox name='incomplete'/>} label="Incomplete"/>
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel control={<Checkbox name='isExclusiveRelease'/>} label="Exclusive release"/>
                    </FormGroup>
                </TwoColumnGrid>

                <Button onClick={addRelease}>
                    <DoneIcon/> Add release
                </Button>

            </Form>
            <StepperButtons activeStep={props.activeStep} handleNext={handleNext} handleBack={props.handleBack}
                nextButtonText="Finish"/>
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
        console.log(releases)
        handleNext()
    }
    console.log(titles)
    const steps = [
        {
            label: 'Show titles',
            view: <>
                <TitleForm handleNext={goToReleases} activeStep={activeStep} handleBack={handleBack}/>
            </>
        },
        {
            label: 'Add Releases',
            view: <>
                <ReleasesForm handleNext={finish} activeStep={activeStep} handleBack={handleBack}/>
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
                <Stepper steps={steps} finished={<>Yo mf, we done</>} activeStep={activeStep}/>
            </Box>
        </>
    );
}

// noinspection JSUnusedGlobalSymbols
export default NewPage
