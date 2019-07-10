import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const controlClickHandler = (e, callback) => {
    if (typeof callback === 'function') {
        callback();
    } else {
        throw new Error('callback is not a function');
    }
};

const InfoModal = (props) => (
    <div>
        <Modal isOpen={props.isOpen} className={props.className}>
            <ModalBody>
                { props.message }
            </ModalBody>
            <ModalFooter>
                {
                    props.modalControls.ok
                        ? (
                            <Button color="primary" onClick={e => {controlClickHandler(e, props.okCallback)}}>
                                { props.okControlName || 'OK'}
                            </Button>
                        )
                        : null
                }
                {
                    props.modalControls.cancel
                        ? (
                            <Button color="secondary" onClick={e => {controlClickHandler(e, props.cancelCallback)}}>
                                { props.cancelControlName || 'Cancel'}
                            </Button>
                        )
                        : null
                }
            </ModalFooter>
        </Modal>
    </div>
);

InfoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    modalControls: PropTypes.shape({
        ok: PropTypes.bool,
        cancel: PropTypes.bool
    }).isRequired,
    okControlName: PropTypes.string,
    cancelControlName: PropTypes.string,
    okCallback: PropTypes.func,
    cancelCallback: PropTypes.func
};

export default InfoModal;