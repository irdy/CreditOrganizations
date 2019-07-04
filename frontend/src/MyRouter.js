import React from 'react';
import { Switch, Route } from 'react-router';
import OrganizationsList from './OrganizationsList';
// components:

const MyRouter = () => (
    <Switch>
        <Route exact path="/" component={OrganizationsList} />
        {/*<Route exact path="/edit" component={CrudListContainer} />*/}
    </Switch>
);

export default MyRouter;