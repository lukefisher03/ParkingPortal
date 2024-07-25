import { Vehicle } from "./script"

export function jsonToVehicle(jsonResponse: any):Vehicle {
    return {
      ownerId: jsonResponse["owner_id"],
      vehicleId: jsonResponse["vehicle_id"],
      plate: jsonResponse["plate"],
      nickname: jsonResponse["nickname"],
      kind: jsonResponse["kind"]
    }
  }