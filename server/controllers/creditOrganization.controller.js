const Credit_Organization = require('../models/creditOrganization.model');
const DataConverter = require('../models/DataConverter');
const createError = require('http-errors');

// requested fields from document
const fields = 'BIC ParticipantInfo.NameP Accounts ParticipantInfo.Tnp ParticipantInfo.Nnp ParticipantInfo.Adr';
// filters: [bic, name]

// let message = 'entry with such BIC does not exist';
const notFoundMessage = 'Организация с таким БИК не найдена';

const getQuery = (reqQuery) => {
    if (Object.keys(reqQuery).length > 0) {
        let { bic, name } = reqQuery;
        let query = {};
        if (bic) {
            query["BIC"] = bic;
        }
        if (name) {
            query["ParticipantInfo.NameP"] = name
        }
        return query;
    }
    return {};
};

const getEntries = (req, res, next) => {

    let perPage = 50;
    let page = Number.parseInt(req.query.page, 10) || 1;

    let query = getQuery(req.query);
    Credit_Organization
        .find(query, fields)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, orgs) => {
            Credit_Organization.estimatedDocumentCount().then((count) => {

                let entries = [];
                if (Array.isArray(orgs)) {
                    entries = orgs.map(org => new DataConverter(org));
                }  else {
                    return next(createError(500, `expected array, but got ${orgs}`));
                }

                // todo refactor
                if (entries.length === 1) {
                    res.send({
                        entries,
                        page: 1,
                        pageCount: 1
                    });

                } else {
                    res.send({
                        entries,
                        page,
                        entriesCount: count,
                        pageCount: Math.ceil(count / perPage)
                    });
                }
            },
            err => {
                if (err) return next(err);
            })
        });
};

const getEntry = (req, res, next) => {
    Credit_Organization.findOne({BIC: req.params.bic}, fields, (err, org) => {
        if (err) return next(err);

        org !== null
            ? res.send(new DataConverter(org, next))
            : next(createError(404, notFoundMessage))
    });
};

const createEntry = (req, res, next) => {
    Credit_Organization.exists({BIC: req.body.BIC}).then(isExists => {
        if (!isExists) {
            Credit_Organization.create(
                DataConverter.convertToModel(req.body),
                (err, data) => {
                    if (err) return next(err);
                    console.log(`created entry with BIC ${req.body.BIC}`);
                    res.send(data);
                });
        } else {
            let message = 'Запись с таким БИК уже существует';
            //console.log('entry with such BIC already exists');
            return next(createError(409, message));
        }
    }).catch(e => next(e));
};

const updateEntry = (req, res, next) => {
    Credit_Organization.exists({BIC: req.body.BIC}).then(isExists => {
        if (isExists) {
            Credit_Organization.findOneAndUpdate(
                { BIC: req.body.BIC },
                { $set: DataConverter.convertToModel(req.body) },
                {
                    runValidators: true,
                    useFindAndModify: false,
                    new: true
                },
                (err, updatedEntry) => {
                    if (err) return next(err);
                    console.log(`entry with ${req.body.BIC} was successfully updated!`);
                    res.send(new DataConverter(updatedEntry));
                }
            );
        } else {
            console.log(notFoundMessage);
            return next(createError(404, notFoundMessage));
        }
    });
};

const deleteEntry = (req, res, next) => {
    Credit_Organization.exists({BIC: req.params.bic}).then(isExists => {
        if (isExists) {
            Credit_Organization.deleteOne({BIC: req.params.bic}, err => {
                if (err) return next(err);
                let message = `Запись с БИК ${req.params.bic} была успешно удалена`;
                console.log(message);
                res.send({
                    message
                });
            })
        } else {
            console.log(notFoundMessage);
            return next(createError(404, notFoundMessage));
        }
    });
};

module.exports = {
    getEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry
};