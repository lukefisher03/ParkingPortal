"use client"

import { useEffect, useState } from "react"
import { CitationInfo, getCitationInfo, getUserInfo, getVehicle, User, Vehicle} from "./script"


export const VehicleCard = (props: {plate:string}) => {

    const [citations, setCitations] = useState<CitationInfo[]>()
    const [vehicle, setVehicle] = useState<Vehicle>()

    const loadData = async () => {
        setCitations(await getCitationInfo(props.plate) as CitationInfo[])
        setVehicle(await getVehicle(props.plate) as Vehicle)
    }

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        console.log(citations)
    }, [citations])

    return (
      <section>
        <h1>{vehicle?.nickname}</h1>
        <h3>{vehicle?.plate}</h3>
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
                <li>User name: {user?.name}</li>
                <li>User ID: {user?.userId}</li>
                <li>User email: {user?.email}</li>
            </ul>
        </nav>
    )
}