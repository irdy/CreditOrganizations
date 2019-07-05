import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

const BackButton = ({ history }) => {
    return (
        <Button color='success' onClick={history.goBack}>
            Назад
        </Button>
    )
};

BackButton.propTypes = {
    history: PropTypes.any.isRequired
};

export default withRouter(BackButton);
