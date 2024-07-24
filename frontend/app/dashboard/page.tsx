import { TopBar, AddVehicleModal } from "./components"
import { PiPlusThin } from "react-icons/pi";

import { getCitationInfo, CitationInfo, getVehicle, Vehicle } from "./script";

import Image from "next/image";
import suvPic from "./assets/suv.png"
import sedanPic from "./assets/sedan.png"
import truckPic from "./assets/truck.png"
import vanPic from "./assets/van.png"
import { StaticImageData } from "next/image";

import { GoTrash, GoInbox, GoScreenFull } from "react-icons/go";

export const VehicleCard = async (props: { plate: string }) => {
  const citations = await getCitationInfo(props.plate) as CitationInfo[]
  const vehicle = await getVehicle(props.plate) as Vehicle
  let vehiclePicture:StaticImageData = suvPic;

      if (vehicle) {
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


export default function Dasbboard() {
  
  return (
    <section>

      <TopBar/>
      <h1 className="page-heading">My Vehicles</h1>
      <section className="vehicle-card-container">
        <VehicleCard plate="JJN4759"/>
        <VehicleCard plate="JEJ6785"/>
        <VehicleCard plate="JGA7846"/>
        <PiPlusThin className={"add-vehicle"} size={50}/>
      </section>

      <AddVehicleModal />
    </section>
  )
}
