import React from 'react';
import BackButton from './BackButton';
import OrganizationForm from './OrganizationForm';
import Heading from './Heading';
import InfoModal from './InfoModal';
import { LazyBox } from './LazyBox';

const SERVER_URL = 'http://localhost:3002';
class CreateOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heading: '',
            data: null,
            modalOpened: false,
            modalMessage: '',
            modalControls: {
                ok: true,
                cancel: false
            },
            dataLoaded: false
        };
        this.URL = '';
    }

    loadData(bic) {
        this.URL = SERVER_URL + '/creditOrganizations/' + bic;
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
            modalOpened: true,
            modalMessage: message
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
        fetch(this.URL, {
            method: 'PUT',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    let message = 'Данные успешно обновлены';
                    this.openModal(message);
                    this.setState({
                        modalOpened: false
                    })
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
                        modalOpened={this.state.modalOpened}
                        message={this.state.modalMessage}
                        modalControls={this.state.modalControls}
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