const REQUIRED_MESSAGE = 'Данное поле обязательно для заполнения';
const createMinLengthMessage = minlength => {
    return `Минимальная длина ${minlength} символов`;
};

const createMaxLengthMessage = maxlength => {
    return `Максимальная длина ${maxlength} символов`;
};

const baseValidate = (values, field, errors) => {
    if (!values[field]) {
        errors[field] = REQUIRED_MESSAGE;
    } else if (values[field].length < 2) {
        errors[field] = createMinLengthMessage(2);
    } else if (values[field].length > 50) {
        errors[field] = createMaxLengthMessage(50);
    }
};

export const validate = values => {
    let errors = {};

    if (!values.BIC) {
        errors.BIC = REQUIRED_MESSAGE;
    } else if (!/^\d{9}$/.test(values.BIC)) {
        errors.BIC = 'БИК должен быть 9 цифр';
    }

    baseValidate(values, 'name', errors);
    baseValidate(values, 'Tnp', errors);
    baseValidate(values, 'Nnp', errors);
    baseValidate(values, 'Adr', errors);

    if (!values.account) {
        errors.account = REQUIRED_MESSAGE;
    } else if (!/^301\d{17}$/.test(values.account)) {
        errors.account = 'Корсчет должен быть 20 цифр и начинаться с 301';
    }

    return errors;
};
