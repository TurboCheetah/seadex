import {GetServerSidePropsContext} from "next";
import {getShowsReleases, ReleaseWithType as Release, ReleaseWithType} from "../../utils/dbQueries";
import {Show, ShowName} from "../../modals";
import type ShowType from "../../modals/Show";
import type ShowNameType from "../../modals/ShowName";
import Head from "next/head";
import TopAppBar from "../../components/TopAppBar";
import {useLanguage} from "../../utils/hooks";
import {groupByKey} from "../../utils/fns";
import {Theme, Typography} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import {IconImage} from "../../components/IconButton";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import DownloadIcon from "@mui/icons-material/Download";
import NotesIcon from "@mui/icons-material/Notes";
import CompareIcon from '@mui/icons-material/Compare';
import {useTheme} from "@mui/material/styles";
import NestedList from "../../components/NestedList";


const Boolean = ({value, title}: { value: boolean, title: string }) => {
    return (
        <ListItem>
            <ListItemIcon>
                {value ? <DoneIcon/> : <CloseIcon/>}
            </ListItemIcon>
            <ListItemText primary={title}/>
        </ListItem>
    )
}

const ReleaseLinkListItem = ({link, site}: { link?: string, site: string }) => {
    return link ? <ListItemButton sx={{pl: 4}} component="a" href={`${link}`} target="_blank">
        <ListItemIcon>
            <IconImage icon={`/${site.toLowerCase()}.webp`}/>
        </ListItemIcon>
        <ListItemText primary={site}/>
    </ListItemButton> : <></>
}

function DisplayRelease({release}: { release: Release }) {
    return <Box>
        <Typography component="h3" variant="h5">
            {release.releaseGroup}
        </Typography>
        <List>
            <Boolean value={release.type === 'best'} title="Best release"/>
            <Boolean value={release.dualAudio} title="Dual audio"/>
            <Boolean value={!release.isRelease} title="Not a release"/>
            <Boolean value={release.isBestVideo} title="Best video"/>
            <Boolean value={release.incomplete} title="Incomplete"/>
            <Boolean value={release.isExclusiveRelease} title="Exclusive Release"/>
            <Boolean value={release.isBroken} title="Broken"/>
            {release.notes && <NestedList icon={NotesIcon} text="Notes">
                <Typography sx={{pl: 4, pr: 2, py: 1}}>{release.notes}</Typography>
            </NestedList>}
            {release.comparisons && <NestedList icon={CompareIcon} text="Comparisons">
                <Typography sx={{pl: 4, pr: 2, py: 1}}>{release.comparisons}</Typography>
            </NestedList>}

            <NestedList icon={DownloadIcon} text="Downloads">
                <List component="div" disablePadding>
                    <ReleaseLinkListItem link={release.nyaaLink} site="Nyaa"/>
                    <ReleaseLinkListItem link={release.bbtLink} site="BBT"/>
                    <ReleaseLinkListItem link={release.toshLink} site="Tosh"/>
                </List>
            </NestedList>
        </List>
    </Box>;
}

function gridStyles(theme: Theme) {
    return {
        display: 'grid',
        gridGap: theme.spacing(2)
    }
}

function SeasonReleases({season, releases}: { season: string, releases: ReleaseWithType[] }) {
    const theme = useTheme()
    const sorted = releases.sort((left, right) => {
        if (left.type == 'best') {
            return -1
        } else if (right.type == 'best') {
            return 1
        } else {
            return 0
        }
    })

    return (
        <Card sx={{maxWidth: 700, width: '100%'}}>
            <CardContent>
                <Typography variant="h4" component="h3" align="center" sx={{padding: theme.spacing(2)}}>
                    {season}
                </Typography>
                <Box sx={{
                    ...gridStyles(theme),
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(15rem, 100%), 1fr))",
                }}>
                    {sorted.map(r => <DisplayRelease key={r.id} release={r}/>)}
                </Box>
            </CardContent>
        </Card>
    )
}


type Props = {
    releases: ReleaseWithType[],
    show: ShowType & { titles: ShowNameType[] }
}

export default function Page(props: Props) {
    const lang = useLanguage()
    const theme = useTheme()

    const animeTitle = props.show.titles.find(it => it.language === lang)?.title
    const releases = groupByKey(props.releases, 'title');

    let head;
    if (Object.keys(releases).length === 1) {
        const season = Object.keys(releases)[0]
        head = (
            <Head>
                <title>{animeTitle} - {season} | Seadex</title>
                <meta name="description" content={`${animeTitle} ${season} on a Certain Smoke's Index`}/>
            </Head>
        )
    } else {
        head = (
            <Head>
                <title>{animeTitle} - Seadex</title>
                <meta name="description" content={`${animeTitle} on a Certain Smoke's Index`}/>
            </Head>
        )
    }

    const body = Object.entries(releases)
        .sort((a, b) => {
            const left = a[0]
            const right = b[0]

            if (left > right) {
                return 1
            }
            else if (left < right) {
                return -1
            }
            else {
                return 0
            }
        })
        .map(([season, releases]) => <SeasonReleases key={season} season={season} releases={releases}/>)
    return <>
        {head}
        <TopAppBar/>

        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: theme.spacing(2)}}>
            <Typography component="h2" variant="h3" sx={{padding: theme.spacing(1, 0)}}>{animeTitle}</Typography>
            <Box sx={{
                ...gridStyles(theme),
                gridTemplateColumns: "repeat(auto-fit, minmax(min(45rem, 100%), 1fr))",
                justifyItems: 'center',
                width: '100%'
            }}>
                {body}
            </Box>
        </Box>
    </>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const animeId = context.params?.animeId?.toString()
    const title = context.query.title?.toString()
    const anime = await Show.findByPk(animeId, {
        include: {
            model: ShowName,
            as: 'titles'
        }
    });
    if (!anime) {
        return {notFound: true}
    }
    const releases = await getShowsReleases(anime.id, title)
    const titles = anime.titles.map(tit => {
        if (tit instanceof ShowName) {
            return {title: tit.title, language: tit.language}
        } else {
            throw Error("unreachable")
        }
    });

    return {
        props: {
            show: {
                id: anime.id,
                isMovie: anime.isMovie,
                titles
            },
            releases
        }
    }
}
