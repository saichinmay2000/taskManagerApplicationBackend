const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth');
const tasks = require('./routes/tasks')
require('dotenv').config()

const app = express();
app.use(express.json())
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected!')).catch(err => console.error(err))

app.use('/auth', authRoutes);
app.use('/tasks', tasks)

app.get('/', (req, res) => {
    res.send('API is running!')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))