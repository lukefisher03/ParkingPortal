import { TopBar, AddVehicleModal } from "./components"
import { PiPlusThin } from "react-icons/pi";
import { VehicleCard } from "./components";
import { getCitationInfo, CitationInfo, getVehicle, Vehicle, getUserVehicles } from "./script";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import Router from "next/navigation";

const fetchVehicleCardData = async (plate:string) => {
  return {
    vehicle: await getVehicle(plate),
    citations: await getCitationInfo(plate)
  }
}

const VehicleCards = async () => {
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")

  if (!userId) {
    return
  }

  const vehicles = await getUserVehicles(userId.value)
  const vehicleCards = vehicles.map(async v => 
    <VehicleCard  {...(await fetchVehicleCardData(v.plate))}/>
  )

  return (
    <>
      {vehicleCards}
    </>
  )
}


export default async function Dasbboard() {
  const i = await fetchVehicleCardData("JJN4759")
  return (
    <section>
      <TopBar/>

      <h1 className="page-heading">My Vehicles</h1>

      <section className="vehicle-card-container">
        <VehicleCards/>
        <PiPlusThin className={"add-vehicle"} size={50}/>
      </section>
  
      <AddVehicleModal visible={false}/>
    </section>
  )
}
