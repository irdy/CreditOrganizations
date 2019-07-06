import React from 'react';
import { Switch, Route } from 'react-router';
import { Redirect } from "react-router-dom";
import OrganizationsList from './OrganizationsList';
import CreateOrganization from './CreateOrganization';
import UpdateOrganization from './UpdateOrganization';
// components:

const MyRouter = () => (
    <Switch>
        <Route exact path="/" render={() => <Redirect to="/creditOrganizations" />} />
        <Route exact path="/creditOrganizations" component={OrganizationsList} />
        <Route exact path="/creditOrganizations/create" component={CreateOrganization} />
        <Route exact path="/creditOrganizations/:bic/update" component={UpdateOrganization} />
    </Switch>
);

export default MyRouter;