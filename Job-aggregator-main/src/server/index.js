const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 5000;

// Replace with your actual MongoDB URI
const mongoURI = 'mongodb+srv://Rashmi:Mailara@7>@cluster0.nklhdrg.mongodb.net/';

app.use(express.json());
app.use('/api', userRoutes);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});