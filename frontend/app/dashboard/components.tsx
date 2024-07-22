"use client"

import { useEffect, useState } from "react"
import { CitationInfo, getCitationInfo, getUserInfo, getVehicle, User, Vehicle } from "./script"
import { randomInt } from "crypto"
import { InboxIcon, TrashIcon } from "@primer/octicons-react"


export const VehicleCard = (props: { plate: string }) => {
    const max = 220
    const min = 180
    // const [backgroundColor, _] = useState<number[]>([Math.floor(Math.random() * (max - min + 1)) + min, Math.floor(Math.random() * (max - min + 1)) + min, Math.floor(Math.random() * (max - min + 1)) + min])
    const [citations, setCitations] = useState<CitationInfo[]>()
    const [vehicle, setVehicle] = useState<Vehicle>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadData = async () => {
            setCitations(await getCitationInfo(props.plate) as CitationInfo[])
            setVehicle(await getVehicle(props.plate) as Vehicle)
            setLoading(false)
        }

        loadData()
    }, [])

    if (loading) {
        return <>Loading...</>
    }

    return (
        // <section className="vehicle-card" style={{ backgroundColor: `rgb(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]})` }}>
        <section className="vehicle-card-wrapper">
            <section className="vehicle-card">
                <h1>{vehicle?.nickname}</h1>
                <h5>{vehicle?.plate.toUpperCase()}</h5>
                <h6>Citations: </h6>
                {citations &&
                    <div>
                        {citations.map(citation => (
                            <p>{citation.location} </p>
                        ))}
                    </div>}
            </section>
                <div className="button-row">
                    <ul>
                        <li><TrashIcon /></li>
                        <li><InboxIcon /></li>
                    </ul>
                </div>
        </section>
    )

}

export const TopBar = () => {
    const [user, setUser] = useState<User>()
    const loadData = async () => {
        const userId = localStorage.getItem("userId")
        if (userId) {
            setUser(await getUserInfo(userId))
        }
    }

    useEffect(() => {
        loadData()
    }, [])


    return (
        <nav>
            <ul>
                <li>{user?.name}</li>
            </ul>
        </nav>
    )
}