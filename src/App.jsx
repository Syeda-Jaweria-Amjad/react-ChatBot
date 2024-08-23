import React,{useContext} from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import Main from './Components/Main/Main'
import "./Components/Sidebar/Sidebar.css"
import { Context } from './context/Context'
const App = () => {
  // const { isOpen,setIsOpen } = useContext(Context);
  // const closeSidebar= ()=>{
  //   if(window.innerWidth < 276)
  //     {
  //       setIsOpen(false);
  //     }
  // }
  
  return (
    <>
      {/* <Sidebar/> */}
      {/* <div className={`main ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`} onClick={closeSidebar}> */}
        <Main/>
      {/* </div> */}
    </>
  )
}

export default App