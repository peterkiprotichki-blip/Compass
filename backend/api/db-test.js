const mongoose = require('mongoose');

module.exports = async (req, res) => {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://peterkiprotichki_db_user:FyONfVf7VlHKuPuK@cluster0.hbo4kvh.mongodb.net/compass?retryWrites=true&w=majority&appName=Cluster0';
  const start = Date.now();

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    }
    const count = await mongoose.connection.db.collection('businesses').countDocuments();
    return res.status(200).json({
      success: true,
      timeMs: Date.now() - start,
      businessesCount: count,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      timeMs: Date.now() - start,
      errorName: err.name,
      errorMessage: err.message,
    });
  }
};
