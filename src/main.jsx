import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useContext, } from 'react'
import { UserContext, UserProvider } from './context.jsx'
import PrivateRoute from './components/privateroute.jsx'

//router 
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import Homepage from './pages/Homepage.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Movie from './pages/Moviepage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Upload from './pages/Upload.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'
//Needs a 404 not found page 




const router = createBrowserRouter([
  {
    path: '/',
    element: < Homepage />,
  }, {
    path: '/login',
    element: <Login />
  }, {
    path: '/signup',
    element: <Signup />
  }, {
    path: '/movies/:id',
    element: <Movie />
  }, {
    path: '/dashboard',
    element: (<PrivateRoute> <Dashboard /> </PrivateRoute>)
  }, {
    path: '/upload',
    element: (<PrivateRoute> <Upload /> </PrivateRoute>)
  }, {
    path: '/profile/:id',
    element: <Profile />
  }, {
    path: '*',
    element: <NotFound />
  }


])

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </UserProvider>
)
