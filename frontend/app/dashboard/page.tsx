import { PiPlusLight, PiPlusThin } from "react-icons/pi";
import { TopBar, AddVehicleModal, Modal, ModalWrapper, AddVehicleButton } from "./components"
import { VehicleCard } from "./components";
import { getCitationInfo, getVehicle, getUserVehicles } from "./script";
import { cookies } from "next/headers";

const fetchVehicleCardData = async (plate: string) => {
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
  console.log(vehicles)
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
          <Modal>
            <AddVehicleModal />
          </Modal>
        </section>
      </ModalWrapper>
    </section>
  )
}
