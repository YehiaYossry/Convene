const Event = require('../models/Event');
const Registration = require('../models/Registration');

// POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { title, category, location, date, capacity, description } = req.body;

    if (!title || !category || !location || !date || !capacity || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const event = await Event.create({ title, category, location, date, capacity, description });
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




// GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    const registrationsCount = await Registration.countDocuments({ eventId: event._id });
    res.json({ success: true, data: { ...event.toObject(), registrationsCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    await Registration.deleteMany({ eventId: req.params.id }); 
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getEvents = async (req, res) => {
  try {
    const { search, category, location, date } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' }; 
    }
    if (category) {
      filter.category = category;
    }
    if (location) {
      filter.location = location;
    }
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end }; 
    }

    const events = await Event.find(filter);

const eventsWithCounts = await Promise.all(
  events.map(async (event) => {
    const registrationsCount = await Registration.countDocuments({ eventId: event._id });
    return { ...event.toObject(), registrationsCount };
  })
);

res.json({ success: true, data: eventsWithCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};