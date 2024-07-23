"use client"

import { useEffect, useState } from "react"
import { CitationInfo, getCitationInfo, getUserInfo, getVehicle, User, Vehicle } from "./script"
import { GoInbox, GoTrash, GoScreenFull, GoPerson } from "react-icons/go"
import Image, { StaticImageData } from "next/image"

import suvPic from "./assets/suv.png"
import sedanPic from "./assets/sedan.png"
import truckPic from "./assets/truck.png"
import vanPic from "./assets/van.png"


export const VehicleCard = (props: { plate: string }) => {
    const [citations, setCitations] = useState<CitationInfo[]>()
    const [vehicle, setVehicle] = useState<Vehicle>()
    const [loading, setLoading] = useState<boolean>(true)
    const [vehiclePicture, setPicture] = useState<StaticImageData>()
    
    useEffect(() => {
        const loadData = async () => {
            setCitations(await getCitationInfo(props.plate) as CitationInfo[])
            setVehicle(await getVehicle(props.plate) as Vehicle)
        }
        loadData()
        setLoading(false)
    }, [])

    useEffect(() => {
        if (vehicle) {
            switch (vehicle.kind) {
                case "sedan":
                    setPicture(sedanPic)
                    break;

                case "suv":
                    setPicture(suvPic)
                    break;

                case "van":
                    setPicture(vanPic)
                    break;

                case "truck":
                    setPicture(truckPic)
                    break;

                default:
                    setPicture(suvPic)
                    break;
            }
        }
    }, [vehicle?.kind])

    if (loading) {
        return <>Loading...</>
    }

    return (
        <section className="vehicle-card-wrapper">
            <section className="vehicle-card">
                {vehiclePicture && <Image
                    src={vehiclePicture}
                    width={200}
                    alt="SUV Picture"
                />}
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
                    <li><GoTrash /></li>
                    <li><GoInbox /></li>
                    <li><GoScreenFull /></li>
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
            <h3>Parking Portal</h3>
            <ul>
                <li>{user?.name}</li>
                <li><GoPerson size={20} /></li>
            </ul>
        </nav>
    )
}