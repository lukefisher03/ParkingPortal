"use client"

import { useEffect, useState, useContext } from "react"
import { CitationInfo, getCitationInfo, getUserInfo, getVehicle, User, Vehicle } from "./script"
import { GoInbox, GoTrash, GoScreenFull, GoPerson, GoX } from "react-icons/go"
import Image, { StaticImageData } from "next/image"


export const AddVehicleModal = (props: {backgroundColor?: string}) => {
    const enabled = false;
    if (!props.backgroundColor) {
        props.backgroundColor = "#bfa356"
    }
    return (
       enabled && <section className="modal-wrapper">
            <div className="modal-body" style={{backgroundColor:props.backgroundColor}}>
                <section className="exit-button-wrapper">
                    <GoX size={20}/>
                </section>
            </div>
        </section> 
    )
}



export const TopBar = () => {
    const [user, setUser] = useState<User>()
    const loadData = async () => {
        const userId = localStorage.getItem("userId") // this normally would be a server component, but localstorage is only in the browser
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