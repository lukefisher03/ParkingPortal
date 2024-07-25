"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"
import { getUserInfo, User } from "./script"
import { GoPerson, GoX, GoTrash, GoInbox, GoScreenFull } from "react-icons/go"
import styles from "./layout.module.css"
import { CitationInfo, Vehicle } from "./script"
import Image from "next/image";
import suvPic from "./assets/suv.png"
import sedanPic from "./assets/sedan.png"
import truckPic from "./assets/truck.png"
import vanPic from "./assets/van.png"
import { PiPlusThin } from "react-icons/pi"
import { addVehicle, removeVehicle } from "./actions"
import { useRouter } from "next/navigation"

export type VehicleCardInfo = {
    vehicle: Vehicle,
    citations: CitationInfo[]
}

export const ModalVisibilityContext = createContext<[boolean, Dispatch<SetStateAction<boolean>> ]>([false, () => { } ])

export const VehicleCard = ({ vehicle, citations }: VehicleCardInfo) => {
    const router = useRouter()
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
        await removeVehicle(vehicle)
        router.refresh()
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
    const [visible, setVisible] = useContext(ModalVisibilityContext)
    return (
        <PiPlusThin className={"add-vehicle"} size={50} onClick={(e) => {setVisible(true)}}/>
    )

}

export const ModalWrapper = ({children}: Readonly<{children:React.ReactNode}>) => {
    const [visible, setVisible] = useState<boolean>(false)
    return (
    <ModalVisibilityContext.Provider value={[visible, setVisible]}>
        {children}
    </ModalVisibilityContext.Provider>
    )
}


export const Modal = ({children}:Readonly<{children:React.ReactNode}>) => {
    const [visible, setVisible] = useContext(ModalVisibilityContext)
    return (
        <>
           {visible && <section className="modal-wrapper">
                <div className="modal-body">
                    <section className="exit-button-wrapper">
                        <GoX size={20} onClick={(e) => { setVisible(false) }} />
                    </section>
                    
                        {children}
                </div>
            </section>}
        </>
    )
}

export const AddVehicleModal = (props: { backgroundColor?: string }) => {
    const router = useRouter()
    const [visible, setVisible] = useContext(ModalVisibilityContext)
    const [formInput, setFormInput] = useState<{ plate: string, nickname: string, kind: string }>({
        plate: "",
        nickname: "",
        kind: "sedan"
    })
    const [error, setError] = useState<string>("")
    if (!props.backgroundColor) {
        props.backgroundColor = "#fffff"
    }

    async function handleSubmit(e: React.MouseEvent) {
        e.preventDefault()

        const response = await addVehicle(formInput.plate, formInput.nickname, formInput.kind)
        if (!response[1]) {
            setError(response[0])
        } else {
            setVisible(false)
            router.refresh()
        }
    }

    return (
        <form id="form">
            <h1>Add Vehicle</h1>
            <input
                className={styles["text-input"]}
                type="text"
                name="plate"
                placeholder="License Plate"
                onChange={(e) => { setFormInput({ ...formInput, plate: e.target.value.toString() }) }}
            />
            <input
                className={styles["text-input"]}
                type="text"
                name="nickname"
                placeholder="Nickname"
                onChange={(e) => { setFormInput({ ...formInput, nickname: e.target.value.toString() }) }}
            />

            <select
                className={styles["select-input"]}
                onChange={(e) => { setFormInput({ ...formInput, kind: e.target.value.toString() }) }}
            >
                <option value="" disabled selected>Vehicle Type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
            </select>

            <input type="button" value="Submit" className={styles["form-button"]} onClick={handleSubmit} />
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
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