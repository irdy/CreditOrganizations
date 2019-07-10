import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import { Formik } from 'formik';
import { validate } from './OrganizationFormValidation';

let data = {
    BIC: '',
    name: '',
    Tnp: '',
    Nnp: '',
    Adr: '',
    account: ''
};

class OrganizationForm extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }

    focusTextInput() {
        console.log(this.textInput.current);
        this.textInput.current.focus();
    }

    componentDidMount() {
        console.log('didmount');
        this.focusTextInput();
    }

    componentWillUpdate() {
        console.log('will update');
    }

    componentDidUpdate() {
        console.log('update');
    }

    render() {
        return (
            <div>
                <Formik
                    initialValues={this.props.data || data}
                    validate={validate}
                    onSubmit={(values, {setSubmitting}) => {
                        let { submitCallback } = this.props;

                        if (typeof submitCallback === 'function') {
                            submitCallback(values, setSubmitting);
                        }
                    }}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting
                    }) => (

                    <Form onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="bicInp">БИК <span className="red-color">*</span></Label>
                                    <Input
                                        innerRef={this.textInput}
                                        valid={touched.BIC && !errors.BIC}
                                        invalid={touched.BIC && !!errors.BIC}
                                        value={values.BIC}
                                        disabled={this.props.update === true}
                                        name="BIC"
                                        type="text"
                                        id="bicInp"
                                        placeholder={this.props.update === true ? '' : "БИК"}
                                        onChange={handleChange}
                                        onBlur={() => {setTimeout(handleBlur, 0)}}
                                    />
                                    {errors.BIC && touched.BIC ? <FormFeedback invalid='true'>{ errors.BIC }</FormFeedback> : null}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="nameInp">Название <span className="red-color">*</span></Label>
                                    <Input
                                        valid={touched.name && !errors.name}
                                        invalid={touched.name && !!errors.name}
                                        value={values.name}
                                        type="text"
                                        name="name"
                                        id="nameInp"
                                        placeholder="Название"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.name && touched.name ? <FormFeedback invalid='true'>{ errors.name }</FormFeedback> : null}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="TnpInp">Тип населенного пункта <span className="red-color">*</span></Label>
                                    <Input
                                        valid={touched.Tnp && !errors.Tnp}
                                        invalid={touched.Tnp && !!errors.Tnp}
                                        value={values.Tnp}
                                        type="text"
                                        name="Tnp"
                                        id="TnpInp"
                                        placeholder="г."
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.Tnp && touched.Tnp ? <FormFeedback invalid='true'>{ errors.Tnp }</FormFeedback> : null}
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="NnpInp">Название населенного пункта <span className="red-color">*</span></Label>
                                    <Input
                                        valid={touched.Nnp && !errors.Nnp}
                                        invalid={touched.Nnp && !!errors.Nnp}
                                        value={values.Nnp}
                                        type="text"
                                        name="Nnp"
                                        id="NnpInp"
                                        placeholder="Москва"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.Nnp && touched.Nnp ? <FormFeedback invalid='true'>{ errors.Nnp }</FormFeedback> : null}
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="addressInp">Адрес <span className="red-color">*</span></Label>
                                    <Input
                                        valid={touched.Adr && !errors.Adr}
                                        invalid={touched.Adr && !!errors.Adr}
                                        value={values.Adr}
                                        type="text"
                                        name="Adr"
                                        id="addressInp"
                                        placeholder="ул. Садовая, д 15, кв. 6"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.Adr && touched.Adr ? <FormFeedback invalid='true'>{ errors.Adr }</FormFeedback> : null}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="accountInp">Корсчет <span className="red-color">*</span></Label>
                                    <Input
                                        valid={touched.account && !errors.account}
                                        invalid={touched.account && !!errors.account}
                                        value={values.account}
                                        type="text"
                                        name="account"
                                        id="accountInp"
                                        placeholder="30145123451234512345"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.account && touched.account ? <FormFeedback invalid='true'>{ errors.account }</FormFeedback> : null}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Button color="primary" type="submit" disabled={isSubmitting}>Сохранить</Button>
                    </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

OrganizationForm.propTypes = {
    update: PropTypes.bool,
    data: PropTypes.shape({
        BIC: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        Tnp: PropTypes.string.isRequired,
        Nnp: PropTypes.string.isRequired,
        Adr: PropTypes.string.isRequired,
        account: PropTypes.string.isRequired
    }),
    submitCallback: PropTypes.func.isRequired
};

export default OrganizationForm;