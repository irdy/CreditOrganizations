import React from 'react';
import MyRouter from './MyRouter';
import { Navbar, NavbarBrand } from 'reactstrap';

function App() {
    return (
        <div id="main">
            <div className="content">
                <Navbar color="light" light expand="md" className="mb-3">
                    <NavbarBrand href="/">Справочник банков</NavbarBrand>
                </Navbar>
                <MyRouter />
            </div>
            <footer className="bg-light row-fluid footer">
                <div className="navbar-inner">
                    <div className="container">
                        <div className="py-3 float-right">© 2019 Copyright:
                            <a href="javascript:void(0)"> brsty Inc.</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
