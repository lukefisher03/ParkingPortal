"use client"

import { useEffect, useState } from "react"
import { getUserInfo, User } from "./script"
import { GoPerson, GoX, GoTrash, GoInbox, GoScreenFull } from "react-icons/go"

import { CitationInfo, Vehicle } from "./script"
import Image from "next/image";
import suvPic from "./assets/suv.png"
import sedanPic from "./assets/sedan.png"
import truckPic from "./assets/truck.png"
import vanPic from "./assets/van.png"

export type VehicleCardInfo = {
    vehicle: Vehicle,
    citations: CitationInfo[]
}

export const VehicleCard = ({vehicle, citations}: VehicleCardInfo) => {
    let vehiclePicture = suvPic
    switch (vehicle.kind) {
        case "sedan":
            vehiclePicture = sedanPic
            break;
  
        case "suv":
            vehiclePicture = suvPic
            break;
  
        case "van":
            vehiclePicture = vanPic
            break;
  
        case "truck":
            vehiclePicture = truckPic
            break;
  
        default:
            vehiclePicture = suvPic
            break;
    }
  
    function showCitations(c:CitationInfo[]) {
        let s = ""
        c.forEach((citation, i) => {
            if (c.length <= 0) {
                s = "No citations found"
                return
            }
            if (i < 3) {
                s += citation.location + "\n"
            } else if (i == 3) {
                s += `${c.length - 3} More...`
            }
        })
  
        return (
            <p style={{whiteSpace:"pre-wrap"}}>{s}</p>
        )
    }
  
    return (
        <section className="vehicle-card-wrapper">
            <section className="vehicle-card">
                <div className="picture-container">
                    <Image
                        src={vehiclePicture}
                        width={200}
                        alt="SUV Picture"
                        className="vehicle-picture"
                    />
                </div>
                <div className="heading-group">
                    <h1>{vehicle.nickname}</h1>
                    <h5>{vehicle.plate.toUpperCase()}</h5>
                </div>
  
                <div className="citation-group">
                    <h6>Citations: </h6>
                    {citations &&
                        <div>
                            {showCitations(citations)}
                        </div>}
                </div>
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
  

export const AddVehicleModal = (props: {visible: boolean, backgroundColor?: string}) => {
    if (!props.backgroundColor) {
        props.backgroundColor = "#bfa356"
    }
    return (
       props.visible && <section className="modal-wrapper">
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