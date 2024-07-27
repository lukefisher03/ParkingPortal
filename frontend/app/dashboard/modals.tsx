"use client"

import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState, useContext, ReactNode, useEffect } from "react"
import { GoX } from "react-icons/go"
import { createContext } from "react"
import { addVehicle, getUserDelegateEmails, removeVehicle, DelegateEmail, addUserDelegateEmail } from "./actions"
import { User, Vehicle } from "./script"
import styles from "./layout.module.css"
import { DelegateUserEmail } from "./components"
import { CitationInfo } from "./script"
import { getCitationInfo } from "./script"
export enum modals {
  addVehicle,
  removeVehicle,
  userManagement,
  citations,
  notifications
}

export type ModalInformation = {
  visible: boolean,
  setVisibility: Dispatch<SetStateAction<boolean>>,
  activeModal: number,
  setActiveModal: Dispatch<SetStateAction<number>>
  props: any,
  setProps: Dispatch<SetStateAction<any>>
}

export const ModalVisibilityContext = createContext<ModalInformation>({
  visible: false,
  setVisibility: () => { },
  activeModal: 0,
  setActiveModal: () => { },
  props: null,
  setProps: () => { }
})

export const ModalWrapper = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [visible, setVisibility] = useState<boolean>(false)
  const [activeModal, setActiveModal] = useState<number>(modals["addVehicle"])
  const [props, setProps] = useState<any>(null)

  const modalContext: ModalInformation = {
    visible: visible,
    setVisibility: setVisibility,
    activeModal: activeModal,
    setActiveModal: setActiveModal,
    props: props,
    setProps: setProps
  }
  return (
    <ModalVisibilityContext.Provider value={modalContext}>
      {children}
    </ModalVisibilityContext.Provider>
  )
}


export const ModalManager = () => {
  const modalContext = useContext(ModalVisibilityContext)
  let Child: ReactNode;
  switch (modalContext.activeModal) {
    case 0:
      Child = <AddVehicleModal />
      break
    case 1:
      Child = <RemoveVehicleModal vehicle={modalContext.props as Vehicle}></RemoveVehicleModal>
      break
    case 2:
      Child = <UserManagementModal user={modalContext.props as User}></UserManagementModal>
      break
    case 3:
      Child = <CitationsModal vehicle={modalContext.props as Vehicle}></CitationsModal>
      break
    case 4:
      Child = <NotificationsModal vehicle={modalContext.props as Vehicle}></NotificationsModal>
    default:
      break
  }
  return (
    <>
      {modalContext.visible && <section className="modal-wrapper">
        <div className="modal-body">
          <section className="exit-button-wrapper">
            <GoX size={20} onClick={(e) => { modalContext.setVisibility(false) }} />
          </section>
          {Child}
        </div>
      </section>}
    </>
  )
}


export const AddVehicleModal = () => {
  const router = useRouter()
  const modalContext = useContext(ModalVisibilityContext)
  const [formInput, setFormInput] = useState<{ plate: string, nickname: string, kind: string }>({
    plate: "",
    nickname: "",
    kind: "sedan"
  })
  const [error, setError] = useState<string>("")

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()

    const response = await addVehicle(formInput.plate, formInput.nickname, formInput.kind)
    if (response.error) {
      setError(response.body)
    } else {
      modalContext.setVisibility(false)
      router.refresh()
    }
  }

  return (
    <form id="form" className="add-vehicle-modal">
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

export const RemoveVehicleModal = (props: { vehicle: Vehicle }) => {
  const modalContext = useContext(ModalVisibilityContext)
  const router = useRouter()

  async function handleYes(e: React.MouseEvent) {
    const response = await removeVehicle(props.vehicle)
    if (response.error) {
      console.error(response.body)
    }
    router.refresh()
    modalContext.setVisibility(false)
  }
  return (
    <section className="remove-vehicle-modal">
      <h1>Are your sure?</h1>
      <input type="button" name="yes" id="yes-button" value="YES" className={styles["form-button"]} onClick={handleYes} />
      <input type="button" name="no" id="no-button" value="NO" className={styles["form-button"]} onClick={() => { modalContext.setVisibility(false) }} />
    </section>
  )
}

export const UserManagementModal = (props: { user: User }) => {

  const [delegateEmail, setDelegateEmail] = useState<DelegateEmail>({
    email: "",
    label: ""
  })
  const [delegateEmails, setDelegateEmailList] = useState<DelegateEmail[]>([])
  const [error, setError] = useState<string>("")

  const fetchDelegateEmails = async () => {
    const delegateEmailsResponse = await getUserDelegateEmails()
    setDelegateEmailList([...delegateEmailsResponse.emailList])
  }

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()

    if (!delegateEmail.email || !delegateEmail.label) {
      setError("Please provide an email and label")
      return
    } else {
      setError("")
    }

    const response = await addUserDelegateEmail(delegateEmail)

    if (response.error) {
      console.error(response.body)
    } else {
      await fetchDelegateEmails()
    }
  }

  useEffect(() => {
    fetchDelegateEmails()
  }, [])

  const emailList = delegateEmails.map((e) => (
    <DelegateUserEmail delegateEmailItem={e} refreshEmailList={fetchDelegateEmails} />
  ))

  return (
    <section className="user-management-modal">

      <h1 className={styles["modal-heading"]}>Hello, {props.user.name}</h1>
      <h6>Phone number</h6>
      <p>{props.user.phoneNumber}</p>

      <h6>Primary email</h6>
      <p>{props.user.email}</p>

      <h6>User ID</h6>
      <p>{props.user.userId}</p>

      <h6>Delegate emails</h6>
      <ul>
        {emailList}
      </ul>
      <h6>Add delegate email</h6>
      <input type="text" placeholder="Delegate Email" className={styles["text-input"]} onChange={(e) => {
        setDelegateEmail({
          ...delegateEmail,
          email: e.target.value
        })
      }} />
      <input type="text" placeholder="Email Label" className={styles["text-input"]} onChange={(e) => {
        setDelegateEmail({
          ...delegateEmail,
          label: e.target.value
        })
      }} />
      <input type="button" value="Add Delegate Email" className={styles["form-button"]} onClick={handleSubmit} />
      <p style={{ color: "red", fontSize: "0.7em" }}>{error}</p>
    </section>
  )
}

export const NotificationsModal = (props: { vehicle: Vehicle }) => {
  console.log(props.vehicle.lastNotificationDate)
  const formatted_date = new Date(props.vehicle.lastNotificationDate * 1000)
  return (
    <section className="notifications-modal">
      <h1>Notification details</h1>
      <h6>Number of notifications sent</h6>
      <p>{props.vehicle.notificationCount}</p>
      <h6>Last notification</h6>
      {(props.vehicle.notificationCount != 0) && <p><i>{formatted_date.toDateString()} at {formatted_date.toLocaleTimeString()}</i></p>}
      {!props.vehicle.notificationCount && <p><i>No notifications have been sent</i></p>}
    </section>
  )
}

export const CitationsModal = (props: { vehicle: Vehicle }) => {

  const [citationList, setCitationList] = useState<CitationInfo[]>([])
  const [citationElements, setCitationElements] = useState<React.ReactNode>()
  useEffect(() => {
    const collectCitations = async () => {
      const response = await getCitationInfo(props.vehicle.plate)
      if (response.error) {
        console.error(response.body)
        return
      }

      setCitationList([...(response.citationList)])
    }

    collectCitations()
  }, [])

  const buildCitationTable = (citations: CitationInfo[]) => {

    const rows = citations.map((citation) =>
      <tr>
        <td>{citation.citationNumber}</td>
        <td>{citation.location}</td>
        <td>{citation.issueDate}</td>
        <td>{citation.dueDate}</td>
        <td>{citation.amountDue}</td>
        <td>{citation.status}</td>
        <td style={{ textAlign: "center" }}><a href={citation.citationLink} target="_blank" rel="noreferrer noopener">PAY</a></td>
      </tr>
    )

    return <>{rows}</>
  }

  useEffect(() => {
    setCitationElements(buildCitationTable(citationList))
  }, [citationList])


  return (
    <section className="citations-modal">
      <h1>Citations for <i>{props.vehicle.nickname}</i></h1>

      <table className="citation-table">
        <tr className="header-row">
          <th>Citation Number</th>
          <th>Location</th>
          <th>Issue Date</th>
          <th>Due Date</th>
          <th>Amount Due</th>
          <th>Status</th>
          <th></th>
        </tr>
        {(citationList.length > 0) &&
          <>{citationElements}</>
        }


        {(citationList.length <= 0) &&
            <p>No citations found</p>
        }
      </table>

    </section>
  )
}