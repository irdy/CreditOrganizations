import React from 'react';
import BackButton from './BackButton';
import OrganizationForm from './OrganizationForm';
import Heading from './Heading';
import InfoModal from './InfoModal';
import config from './config.json';

const { SERVER_URL } = config;
class CreateOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heading: 'Добавление организации',
            modalOpened: false,
            modalMessage: '',
            modalControls: {
                ok: true,
                cancel: false
            }
        };
        this.URL = SERVER_URL + 'api/creditOrganizations/';
    }

    openModal(message) {
        this.setState({
            modalOpened: true,
            modalMessage: message
        })
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

        const dataExistsStr = 'Запись с теким БИК уже существует!';

        fetch(this.URL, {
            method: 'POST',
            body: formData
        })
            .then(res => {
                if (res.status === 409) {
                    return Promise.resolve(dataExistsStr);
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    let message = 'Данные успешно сохранены!';
                    if (typeof data === 'string') {
                        if (data === dataExistsStr) {
                            message = dataExistsStr;
                        }
                    }
                    this.openModal(message);
                    this.setState({
                        modalOpened: false
                    });
                } else {
                    console.error('incorrect data');
                }

                setSubmitting(false);
            })
            .catch(err => console.error(err))
    }

    render() {
        return (
            <div className="container">
                <div className="mb-3">
                    <Heading text={this.state.heading} />
                    <InfoModal
                        modalOpened={this.state.modalOpened}
                        message={this.state.modalMessage}
                        modalControls={this.state.modalControls}
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