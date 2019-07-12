import React from 'react';
import BackButton from './BackButton';
import OrganizationForm from './OrganizationForm';
import Heading from './Heading';
import InfoModal from './InfoModal';
import config from './config.json';
import { fetchData } from './utils/fetchData';

const successMessage = 'Данные успешно сохранены!';

const { SERVER_URL } = config;
class CreateOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heading: 'Добавление организации',
            isOpen: false,
            modalMessage: ''
        };
        this.modalControls = {
            ok: true,
            cancel: false
        };
        this.URL = SERVER_URL + '/api/creditOrganizations';
    }

    openModal(message) {
        this.setState({
            isOpen: true,
            modalMessage: message
        })
    }

    closeModal() {
        this.setState({
            isOpen: false,
            modalMessage: ''
        })
    }

    modalOkBtnClicked() {
        this.closeModal();
    }

    createData(data, setSubmitting) {
        if (typeof setSubmitting !== 'function') {
            console.error('setSubmitting must be a function!');
        }
        let formData = new FormData();
        for (let part in data) {
            if (data.hasOwnProperty(part)) {
                formData.append(part, data[part]);
            }
        }

        fetchData(this.URL, {
            method: 'POST',
            body: formData
        })
            .then(data => {
                this.setState({ data }, () => {
                    this.openModal(successMessage);
                });
                setSubmitting(false);
            })
            .catch(err => {
                if (err.message) {
                    this.openModal(err.message)
                }
                setSubmitting(false);
            });
    }

    render() {
        return (
            <div className="container">
                <div className="mb-3">
                    <Heading text={this.state.heading} />
                    <InfoModal
                        isOpen={this.state.isOpen}
                        message={this.state.modalMessage}
                        modalControls={this.modalControls}
                        okCallback={this.modalOkBtnClicked.bind(this)}
                    />
                </div>
                <div className="mb-3">
                    <OrganizationForm update={false} submitCallback={this.createData.bind(this)}/>
                </div>
                <BackButton />
            </div>
        )
    }
}

export default CreateOrganization;