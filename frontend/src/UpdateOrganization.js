import React from 'react';
import BackButton from './BackButton';
import OrganizationForm from './OrganizationForm';
import Heading from './Heading';
import InfoModal from './InfoModal';
import { LazyBox } from './LazyBox';
import config from './config.json';

const { SERVER_URL } = config;
class CreateOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heading: '',
            data: null,
            isOpen: false,
            modalMessage: '',
            dataLoaded: false
        };
        this.modalControls = {
            ok: true,
            cancel: false
        };
        this.URL = '';
    }

    loadData(bic) {
        this.URL = SERVER_URL + '/api/creditOrganizations/' + bic;
        fetch(this.URL, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    console.error('incorrect data');
                } else {
                    this.setState({
                        heading: data.name,
                        data,
                        dataLoaded: true
                    })
                }
            })
            .catch(err => console.error(err));
    }

    componentDidMount() {
        let { match } = this.props;
        let { bic } = match.params;
        if (!bic) {
            console.error('can\'t get BIC');
        }
        this.loadData(bic);
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

    updateData(data, setSubmitting) {
        if (typeof setSubmitting !== 'function') {
            console.error('setSubmitting must be a function!');
        }
        let formData = new FormData();
        for (let part in data) {
            if (data.hasOwnProperty(part)) {
                formData.append(part, data[part]);
            }
        }
        fetch(this.URL, {
            method: 'PUT',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    let message = 'Данные успешно обновлены';
                    this.openModal(message);
                } else {
                    console.error('incorrect data');
                }

                setSubmitting(false);
            })
            .catch(err => {
                setSubmitting(false);
                console.error(err);
            })
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
                    <LazyBox component={
                        <OrganizationForm
                            update={true}
                            data={this.state.data}
                            submitCallback={this.updateData.bind(this)}
                        />
                    } dataLoaded={this.state.dataLoaded} />
                </div>
                <BackButton />
            </div>
        )
    }
}

export default CreateOrganization;