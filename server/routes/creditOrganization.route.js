const express = require('express');
const {
    getEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry
} = require('../controllers/creditOrganization.controller');

const router = express.Router();

router.get('/creditOrganizations', getEntries);
router.post('/creditOrganizations', createEntry);
router.get('/creditOrganizations/:bic', getEntry);
router.put('/creditOrganizations/:bic', updateEntry);
router.delete('/creditOrganizations/:bic', deleteEntry);

module.exports = router;