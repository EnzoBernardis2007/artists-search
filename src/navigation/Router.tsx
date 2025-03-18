import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "../pages/Layout"

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={ <Layout /> }/>
            </Routes>
        </BrowserRouter>
    )
}