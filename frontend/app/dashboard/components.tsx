"use client"

import { useContext, useEffect, useState } from "react"
import { getUserInfo, User } from "./script"
import { GoPerson, GoTrash, GoInbox, GoScreenFull } from "react-icons/go"
import { CitationInfo, Vehicle } from "./script"
import Image from "next/image";
import suvPic from "./assets/suv.png"
import sedanPic from "./assets/sedan.png"
import truckPic from "./assets/truck.png"
import vanPic from "./assets/van.png"
import { PiPlusThin } from "react-icons/pi"
import { ModalVisibilityContext, modals } from "./modals"

export type VehicleCardInfo = {
    vehicle: Vehicle,
    citations: CitationInfo[]
}


export const VehicleCard = ({ vehicle, citations }: VehicleCardInfo) => {
    const modalContext = useContext(ModalVisibilityContext)
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

    function showCitations(c: CitationInfo[]) {
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
            <p style={{ whiteSpace: "pre-wrap" }}>{s}</p>
        )
    }


    async function handleRemove(e: React.MouseEvent) {
        e.preventDefault()
        modalContext.setProps(vehicle)
        modalContext.setActiveModal(modals["removeVehicle"])
        modalContext.setVisibility(true)
    }

    return (
        <section className="vehicle-card-wrapper">
            <section className="vehicle-card">
                <div className="picture-container noselect">
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
                    <li><GoTrash onClick={handleRemove} /></li>
                    <li><GoInbox /></li>
                    <li><GoScreenFull /></li>
                </ul>
            </div>
        </section>
    )
}

export const AddVehicleButton = () => {
    const modalContext = useContext(ModalVisibilityContext)
    return (
        <PiPlusThin className={"add-vehicle"} size={50} onClick={() => { modalContext.setVisibility(true); modalContext.setActiveModal(modals["addVehicle"]) }} />
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