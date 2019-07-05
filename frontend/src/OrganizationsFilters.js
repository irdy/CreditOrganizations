import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class OrganizationsFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bic: '',
            name: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        let { name, value } = e.target;
        this.setState({
            [name]: value.trim()
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let { filtersChanged } = this.props;
        if (typeof filtersChanged === 'function') {
            filtersChanged(this.state);
        }
    }

    render() {
        return (
            <Form inline onSubmit={this.handleSubmit}>
                <FormGroup className="mr-sm-2">
                    <Label for="bicInp" className="mr-sm-2">Поиск по</Label>
                    <Input type="text" name="bic" id="bicInp" placeholder="БИК" onChange={this.handleChange} value={this.state.bic}/>
                </FormGroup>
                <FormGroup className="mr-sm-2">
                    <Label for="nameInp" className="mr-sm-2">или</Label>
                    <Input type="text" name="name" id="nameInp" placeholder="Названию" onChange={this.handleChange} value={this.state.name}/>
                </FormGroup>
                <Button>Найти</Button>
            </Form>
        )
    }
}

OrganizationsFilters.propTypes = {
    filtersChanged: PropTypes.func.isRequired
};

export default OrganizationsFilters;