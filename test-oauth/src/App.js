import logo from './logo.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'
import Oauth from './Oauth'

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '/oauth',
            element: <Oauth />,
        },
    ])
    return <RouterProvider router={router} />
}

export default App
