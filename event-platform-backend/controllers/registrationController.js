const Registration = require('../models/Registration');
const Event = require('../models/Event');

// POST /api/events/:id/register
exports.registerAttendee = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const currentCount = await Registration.countDocuments({ eventId: event._id });
    if (currentCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is at full capacity' });
    }

    const registration = await Registration.create({ eventId: event._id, name, email });
    res.status(201).json({ success: true, data: registration });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'This email is already registered for this event' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id/attendees
exports.getAttendees = async (req, res) => {
  try {
    const attendees = await Registration.find({ eventId: req.params.id });
    res.json({ success: true, data: attendees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/events/:id/registrations/:registrationId
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOneAndDelete({
      _id: req.params.registrationId,
      eventId: req.params.id
    });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};