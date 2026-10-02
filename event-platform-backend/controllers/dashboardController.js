const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getDashboard = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });
    const totalRegistrations = await Registration.countDocuments();

    const mostPopular = await Registration.aggregate([
      { $group: { _id: '$eventId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let mostPopularEvent = null;
    if (mostPopular.length > 0) {
      const event = await Event.findById(mostPopular[0]._id);
      mostPopularEvent = event ? { ...event.toObject(), registrationsCount: mostPopular[0].count } : null;
    }

    res.json({
      success: true,
      data: { totalEvents, upcomingEvents, totalRegistrations, mostPopularEvent }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};