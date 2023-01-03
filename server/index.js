const express = require('express');
const cors = require('cors');
const validateJwt = require('./middleware/jwt_middleware');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

const authentication = require('./routes/authentication');


const posts = require('./routes/posts');
const books = require('./routes/books');
const users = require('./routes/users');

require('./mongodb');


app.use(cookieParser());
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(
    cors(
        {
            origin: "http://localhost:5173",
            credentials: true
        }
    )
);

app.use('/authentication', authentication);

app.use(validateJwt);

app.use('/books', books);
app.use('/posts', posts);
app.use('/users', users);

app.listen(3000, () => {
    console.log('Book API listening on port 3000!');
});
