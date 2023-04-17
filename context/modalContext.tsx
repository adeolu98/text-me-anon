import { createContext, useContext, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit";

export enum Modals {
  MobileNav = "mobileNav"
}

interface ModalProps {
  open: boolean
}

type ModalContextValue = {[modal in Modals]: ModalProps}

type SetModals = (value: ModalContextValue) => void

const modalContext = createContext<{modals: ModalContextValue, setModals: SetModals}>({
  modals: {
    mobileNav: {open: false},
  },
  setModals: () => {}
})

export const useModalContext = (modal: Modals) => {
  const {modals, setModals} = useContext(modalContext);

  const open = () => {
    setModals({...modals, [modal]: {open: true}})
  }

  const close = () => {
    setModals({ ...modals, [modal]: { open: false } });
  }

  return {
    open,
    close,
    active: modals[modal].open
  }
}

function ModalContext ({children}: {children: JSX.Element}){
  const [modals, setModals] = useState({
    mobileNav: {open: false}
  });

  return <modalContext.Provider value={{modals, setModals}} >
    {children}
  </modalContext.Provider>
}

export default ModalContext