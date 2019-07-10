/**
 * fetch data from server
 * @param {string} url - url for fetch data
 * @param {Object} config - fetch config
 * @returns {Promise<any>}
 */
export const fetchData = (url, config) => {
    return new Promise((resolve, reject) => {
        fetch(url, config)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    resolve(data);
                } else {
                    reject(new Error({
                        error: {
                            name: 'DataParseError',
                            message: 'data is empty',
                        }
                    }))
                }

            })
            .catch(err => {
                if (typeof err.json === 'function') {
                    err.json()
                        .then(err => reject(err))
                } else if (typeof err.text === 'function') {
                    err.text()
                        .then(message => reject(new Error({
                            name: 'Error',
                            message
                        })))
                } else {
                    reject(new Error({
                        name: 'ErrorParseError',
                        message: `can't parse error`
                    }))
                }
            })
    });
};