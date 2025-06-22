// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import Login from './pages/Login'
// import Workspace from './pages/Workspace'

// export default function App(){
//   const token = localStorage.getItem('token')
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login/>}/>
//         <Route
//           path="/app"
//           element={ token ? <Workspace/> : <Navigate to="/login"/> }
//         />
//         <Route path="*" element={<Navigate to={token?"/app":"/login"}/>}/>
//       </Routes>
//     </BrowserRouter>
//   )
// }


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Workspace from './pages/Workspace'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login (opcional) */}
        <Route path="/login" element={<Login />} />

        {/* Workspace siempre accesible */}
        <Route path="/app" element={<Workspace />} />

        {/* Cualquier otra ruta redirige a /app */}
        <Route path="*" element={<Navigate to="/app" />} />
      </Routes>
    </BrowserRouter>
  )
}
