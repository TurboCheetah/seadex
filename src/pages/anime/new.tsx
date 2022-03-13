import React, {forwardRef, useCallback, useEffect, useRef, useState} from 'react';
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
    LinearProgress,
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
import {useRouter} from "next/router";
import type {NextPage} from "next";
import ReleaseDetailsList from "../../components/ReleaseDetailsList";
import {ReleaseWithType as Release} from "../../utils/dbQueries";
import {zip} from "../../utils/fns";
import {Paper} from "@mui/material/";
import {allTheHeight} from "../../utils/constants";

type Direction = 'row' | 'column';

const flex = (directionSmall: Direction = 'column', direction: Direction = 'row') => {

    return {
        display: 'flex',
        flexDirection: {
            xs: directionSmall,
            md: direction,
        }
    }
}

// eslint-disable-next-line react/display-name
const Form = forwardRef((props: BoxProps, ref) => {
    return (
        <Box {...props}
            component='form'
            ref={ref}
            sx={{
                ...flex('column'),
                margin: 'auto',
                width: 'fit-content',
                gap: 3,
                padding: 3,
                ...(props.sx)
            }}
        >
            {props.children}
        </Box>
    )
})

const availableLanguages = {
    'English': 'en', 'Romanji': 'romanji'
}

interface Title {
    title: string
    language: string
}

type TitleFormOutput = { titles: Title[], isMovie: boolean }

function TitleForm(props: StepperButtonProps<TitleFormOutput>) {
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
        const isMovie = formGroup.get('isMovie')
        const data = zip(titles, languages).map(([title, language]) =>
            ({
                title: title.toString(),
                language: language.toString(),
            }))
        props.handleNext({titles: data, isMovie: isMovie === 'on'})
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
                <FormGroup sx={{alignSelf: 'center'}}>
                    <FormControlLabel control={<Checkbox name='isMovie'/>} label="Movie"/>
                </FormGroup>
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
const LinkField = (props: TextFieldProps & { site: string }) => {
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
}

function ReleasesForm(props: StepperButtonProps<Release[]>) {

    const [expanded, setExpanded] = useState<string | false>(false);
    const [releases, setReleases] = useState<Release[]>([])
    const [formAltered, setFormAltered] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement | null>(null)

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const handleFormChange = () => {
        setFormAltered(true)
    }

    const addRelease = () => {
        if (formRef.current === null) {
            throw Error("form ref is null")
        }

        const formData = new FormData(formRef.current)
        const fields = [
            'title',
            'type',
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
        const release: { [k: string]: string | boolean | undefined } = {}
        fields.forEach((field: string) => {
            const data = formData.get(field);
            const boolFields = ['dualAudio', 'isRelease', 'isBestVideo', 'incomplete', 'isExclusiveRelease']
            if (boolFields.includes(field)) {
                release[field] = data === 'on' // 'on' is the value when checkbox is ticked
            } else {
                if (data === null) {
                    throw Error(`${field} in release form data was unexpectedly null`)
                }

                release[field] = data.toString()
            }
        })
        // we just set the properties above, it is a release
        setReleases(r => [...r, release as unknown as Release])
        formRef.current?.reset()
        setFormAltered(false)
    }

    const handleNext = () => {
        if (formAltered) {
            const shouldContinue = confirm('You have made changes to form but have not added the release. Are you sure you want to continue without saving changes?')
            if (shouldContinue) {
                props.handleNext(releases)
            }
        } else {
            props.handleNext(releases)
        }
    }

    return (
        <>
            {releases.map((release, i) => (
                <Accordion expanded={expanded === `${release.title}.${i}`} key={`${release.title}.${i}`} onChange={handleChange(`${release.title}.${i}`)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{width: '33%', flexShrink: 0}}>
                            {release.title}
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>{release.releaseGroup}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ReleaseDetailsList release={release} />
                    </AccordionDetails>
                </Accordion>
            ))}
            <Form ref={formRef} onChange={handleFormChange}>
                <TextField
                    autoFocus
                    label="Title"
                    name='title'
                    helperText='e.g. S1'
                    fullWidth
                    required
                />

                <TextField
                    label="Release Group"
                    name='releaseGroup'
                    fullWidth
                    required
                />

                <Autocomplete
                    disablePortal
                    fullWidth
                    options={['Best', 'Alternate']}
                    renderInput={(params) => <TextField {...params} name='type' required label="Type"/>}
                />


                <TextField
                    label="Notes"
                    name='notes'
                    fullWidth
                    multiline
                />

                <TextField
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

function StepperFinished({titles, releases}: {titles: TitleFormOutput, releases: Release[]}) {
    const router = useRouter()
    const save = useCallback(async (titles, releases) => {
        console.log({titles, releases})
        const id = 'uuid'
        await router.push(`/anime/${id}`)
    }, [router])

    useEffect(() => {
        save(titles, releases).then()
    }, [titles, releases, save])

    return <LinearProgress />;
}

const NewPage: NextPage = () => {
    const [titles, setTitles] = useState<TitleFormOutput>()
    const [releases, setReleases] = useState<Release[]>([])
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const goToReleases = (titles: TitleFormOutput) => {
        setTitles(titles)
        handleNext()
    }

    const finish = (releases: Release[]) => {
        setReleases(releases)
        handleNext()
    }


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
            <Box component='main' sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: activeStep === 0 ? allTheHeight : 'auto',
                my: 2,
            }}>
                <Paper sx={{
                    width: { xs: '100%', md: '75%', lg: '50%' },
                    p: 2,
                    m: 2,
                }}>
                    <Stepper steps={steps} finished={titles && <StepperFinished titles={titles} releases={releases} />} activeStep={activeStep}/>
                </Paper>
            </Box>
        </>
    );
}

// noinspection JSUnusedGlobalSymbols
export default NewPage
