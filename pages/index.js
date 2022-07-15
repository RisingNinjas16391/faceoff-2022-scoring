import Head from 'next/head'
import styles from '../styles/Home.module.css'

import {useEffect, useState} from "react";
import { client } from "../lib/supabase";

export default function Home() {

    const [teams, setTeams] = useState([]);
    const [update, setUpdate] = useState(null);

    useEffect(() => {
        getTeams()

        setTimeout(() => {
            client
                .from('points')
                .on('UPDATE', (v) => {
                    setUpdate(v.new)
                })
                .subscribe()

        }, 1000)

        return () => {
            client.removeAllSubscriptions().then(() => {
                console.log("Removed all subscriptions")
            })
        }

    }, []);

    useEffect(() => {
        if (update) {
            updateTeam(update);
            setUpdate(null);
        }
    }, [update])

    const getTeams = () => {
        client
            .from("points")
            .select("*")
            .then(({ data, error }) => {
                if (!error) {
                    setTeams(data);
                }
            });
    }

    const updateTeam = (updated) => {
        setTeams(teams.map(team => {
            return team.id === updated.id ? updated : team;
        }))
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1>Scores</h1>
                {teams?.map(team => {
                    return <p key={team.id}>{team.team}: {team.points}</p>
                })}
            </main>

        </div>
    )
}