import { useContext, useEffect, useState } from "react"
import styles from "layout.module.css"
import { CitationInfo, getCitationInfo} from "./script"
import Link from "next/link"
import { TopBar, VehicleCard } from "./components"
import { PiPlusThin } from "react-icons/pi";


export default function Dasbboard() {
  return (
    <section>
      <TopBar/>
      <section className="vehicle-card-container">
        <VehicleCard plate="jjn4759"/>
        <VehicleCard plate="JEJ6785"/>
        <VehicleCard plate="JGA7846"/>
        <PiPlusThin className={"add-vehicle"} size={50}/>
      </section>
    </section>
  )
}
