const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/bookly', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected!'));


// const db = mongoose.connection;

// db.on('error', () => console.error('ERROR: Connecting to mongoDB failed'));
// db.once('open', () => console.log('Successfully connected to MongoDB!'));
