import React from 'react';
import PropTypes from 'prop-types';

export const LazyBox = ({component, dataLoaded = false}) => (
    <div>
        {
            dataLoaded ? component : 'Loading...'
        }
    </div>
);

LazyBox.propTypes = {
    dataLoaded: PropTypes.bool.isRequired,
    component: PropTypes.element.isRequired
};