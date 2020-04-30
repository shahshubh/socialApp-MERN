const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const PORT = process.env.PORT || 3000;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('db connected'));

mongoose.connection.on('error', err => {
    console.log(`DB Error: ${err.message}`);
});




const postRoutes = require('./routes/post');


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(expressValidator());


app.use('/', postRoutes);



app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})