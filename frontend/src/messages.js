import React from 'react';
import { Alert } from 'reactstrap';

export const renderNoResults = (message = 'Результатов не найдено', color = 'info') => {
    return (
        <Alert color={color}>
            { message }
        </Alert>
    )
};