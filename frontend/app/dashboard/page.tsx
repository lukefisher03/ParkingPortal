import { useContext, useEffect, useState } from "react"
import styles from "layout.module.css"
import { CitationInfo, getCitationInfo} from "./script"
import Link from "next/link"
import { TopBar, VehicleCard } from "./components"



export default function Dasbboard() {
  return (
    <section>
      <TopBar/>
      <section className="vehicle-card-container">
        <VehicleCard plate="jjn4759"/>
        <VehicleCard plate="jjn4759"/>
        <VehicleCard plate="jjn4759"/>
      </section>
    </section>
  )
}
