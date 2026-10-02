const express = require('express');
const router = express.Router({ mergeParams: true });
const { registerAttendee, getAttendees, cancelRegistration } = require('../controllers/registrationController');

router.post('/register', registerAttendee);
router.get('/attendees', getAttendees);
router.delete('/registrations/:registrationId', cancelRegistration);

module.exports = router;