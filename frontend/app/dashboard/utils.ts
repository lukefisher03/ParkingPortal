import { Vehicle } from "./script"

export type ServerResponse = {
  error: boolean,
  body: any
}
export function jsonToVehicle(jsonResponse: any):Vehicle {
    return {
      userId: jsonResponse["user_id"],
      vehicleId: jsonResponse["vehicle_id"],
      nickname: jsonResponse["nickname"],
      plate: jsonResponse["plate"],
      kind: jsonResponse["kind"],
      notificationCount: jsonResponse["notification_count"],
      lastNotificationDate: jsonResponse["last_notification_date"]
    }
  }