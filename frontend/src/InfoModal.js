import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

class InfoModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: props.modalOpened
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalOpened) {
            this.setState({
                modal: true
            })
        }
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalBody>
                        { this.props.message }
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.props.modalControls.ok
                                ? <Button color="primary" onClick={this.toggle}>OK</Button>
                                : null
                        }
                        {
                            this.props.modalControls.cancel
                                ? <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                : null
                        }
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

InfoModal.propTypes = {
    modalOpened: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    modalControls: PropTypes.shape({
        ok: PropTypes.bool,
        cancel: PropTypes.bool
    }).isRequired,
    okCallback: PropTypes.func,
    cancelCallback: PropTypes.func
};

export default InfoModal;