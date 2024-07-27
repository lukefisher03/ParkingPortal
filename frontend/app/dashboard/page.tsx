import { PiPlusLight, PiPlusThin } from "react-icons/pi";
import { TopBar, AddVehicleButton } from "./components"
import { VehicleCard } from "./components";
import { getCitationInfo, getVehicle, getUserVehicles, notifyUser } from "./script";
import { cookies } from "next/headers";
import { ModalWrapper, ModalManager } from "./modals";

const fetchVehicleCardData = async (plate: string) => {
  const citationResponse = await getCitationInfo(plate)
  const vehicleResponse = await getVehicle(plate)
  notifyUser()
  return {
    vehicle: vehicleResponse.vehicle,
    citations: citationResponse.citationList
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
    <VehicleCard  {...(await fetchVehicleCardData(v.plate))} />
  )

  return (
    <>
      {vehicleCards}
    </>
  )
}


export default async function Dasbboard() {
  return (
    <section>
      <ModalWrapper>
        <TopBar />
        <h1 className="page-heading">My Vehicles</h1>
        <section className="vehicle-card-container">
          <VehicleCards />
          <AddVehicleButton/>
          <ModalManager/>
        </section>
      </ModalWrapper>
    </section>
  )
}
