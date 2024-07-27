"use client"

import { useContext, useEffect, useState } from "react"
import { getUserInfo, User } from "./script"
import { GoPerson, GoTrash, GoInbox, GoScreenFull, GoX } from "react-icons/go"
import { CitationInfo, Vehicle } from "./script"
import Image from "next/image";
import suvPic from "./assets/suv.png"
import sedanPic from "./assets/sedan.png"
import truckPic from "./assets/truck.png"
import vanPic from "./assets/van.png"
import { PiPlusThin } from "react-icons/pi"
import { ModalVisibilityContext, modals } from "./modals"
import styles from "./layout.module.css"
import { DelegateEmail, removeUserDelegateEmail } from "./actions"

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

    async function handleShowCitations(e: React.MouseEvent) {
        e.preventDefault()

        modalContext.setProps(vehicle)
        modalContext.setActiveModal(modals["citations"])
        modalContext.setVisibility(true)
    }

    async function handleShowNotifications(e: React.MouseEvent) {
        e.preventDefault()

        modalContext.setProps(vehicle)
        modalContext.setActiveModal(modals["notifications"])
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
                    <li><GoInbox onClick={handleShowNotifications}/></li>
                    <li><GoScreenFull onClick={handleShowCitations}/></li>
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
    const modalContext = useContext(ModalVisibilityContext)
    const [user, setUser] = useState<User>({
        name: "",
        userId: "",
        email: "",
        phoneNumber: ""
    })

    const loadData = async () => {
        const response = await getUserInfo()
        if (!response.error) {
            setUser(response.user)
        } else {
            setUser({
                ...user,
                name:response.body
            })
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    async function handleClick(e: React.MouseEvent) {
        e.preventDefault()
        modalContext.setProps(user)
        modalContext.setActiveModal(modals["userManagement"])
        modalContext.setVisibility(true)
    }


    return (
        <nav>
            <h3>Parking Portal</h3>
            <ul>
                <li>{user?.name}</li>
                <li onClick={handleClick} className={styles["clickable"]}><GoPerson size={20} /></li>
            </ul>
        </nav>
    )
}

export const DelegateUserEmail = (props: {delegateEmailItem: DelegateEmail, refreshEmailList: () => Promise<void>}) => {
    async function handleClick(e: React.MouseEvent) {
        e.preventDefault()

        const response = await removeUserDelegateEmail(props.delegateEmailItem)
        
        if (response.error) {
            console.error(response.body)
        }

        await props.refreshEmailList()
    }
    return (
        <li>{props.delegateEmailItem.email} | <i>{props.delegateEmailItem.label}</i>  <GoTrash cursor="pointer" style={{ color: "red", float: "right", margin:"0 20px"}} onClick={handleClick} /></li>
    )
}