import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import OrganizationsList from './OrganizationsList';
import CreateOrganization from './CreateOrganization';
import UpdateOrganization from './UpdateOrganization';
import { useNavigate } from "react-router";

function RedirectToMainPage() {
    const navigate = useNavigate();

    React.useEffect(() => {
        navigate("/creditOrganizations");
    }, [navigate]);

    return null;
}


const MyRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<RedirectToMainPage/>}/>
            <Route exact path="/creditOrganizations" element={<OrganizationsList/>}/>
            <Route exact path="/creditOrganizations/create" element={<CreateOrganization/>}/>
            <Route exact path="/creditOrganizations/:bic/update" element={<UpdateOrganization/>}/>
        </Routes>
    </BrowserRouter>
)


export default MyRouter;