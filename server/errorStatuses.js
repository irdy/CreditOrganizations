const getErrorStatus = err => {
    if (!err) {
        console.log('error object required');
        return null;
    }

    if (typeof err.name === 'string') {
        switch (err.name) {
            case 'ValidationError':
                return 422;
            default:
                return null;
        }
    }

    return null;
};

module.exports = {
    getErrorStatus
};

