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
import Box from "@mui/material/Box";
import {useTheme} from "@mui/material/styles";
import ReleaseDetailsList from "../../components/ReleaseDetailsList";

function DisplayRelease({release}: { release: Release }) {
    return <Box>
        <Typography component="h3" variant="h5">
            {release.releaseGroup}
        </Typography>
        <ReleaseDetailsList release={release}/>
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
            } else if (left < right) {
                return -1
            } else {
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
