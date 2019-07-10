import React from 'react';
import BackButton from './BackButton';
import OrganizationForm from './OrganizationForm';
import Heading from './Heading';
import InfoModal from './InfoModal';
import { LazyBox } from './LazyBox';
import config from './config.json';
import { fetchData } from './utils/fetchData';
import { renderNoResults } from './messages';

let successMessage = 'Данные успешно сохранены!';

const { SERVER_URL } = config;
class CreateOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heading: '',
            data: null,
            isOpen: false,
            modalMessage: '',
            dataLoaded: false,
            shouldOpenForm: true,
            notFoundMessage: 'Not found'
        };
        this.modalControls = {
            ok: true,
            cancel: false
        };
        this.URL = '';
    }

    loadData(bic) {
        this.URL = SERVER_URL + '/api/creditOrganizations/' + bic;

        fetchData(this.URL, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(data => {
                this.setState({
                    heading: data.name,
                    data,
                    dataLoaded: true
                })
            })
            .catch(err => {
                if (err.message) {
                    this.setState({
                        dataLoaded: true,
                        shouldOpenForm: false,
                        notFoundMessage: err.message
                    });
                }
            });
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

    fetchData(formData, setSubmitting) {
        fetchData(this.URL, {
            method: 'PUT',
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
            })
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

        this.fetchData(formData, setSubmitting);
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
                        this.state.shouldOpenForm
                            ? (
                                <OrganizationForm
                                    update={true}
                                    data={this.state.data}
                                    submitCallback={this.updateData.bind(this)}
                                />        
                            )
                            : renderNoResults(this.state.notFoundMessage)
                    } dataLoaded={this.state.dataLoaded} />
                </div>
                <BackButton />
            </div>
        )
    }
}

export default CreateOrganization;