const jwt = require('jsonwebtoken');
const { Token } = require('../models/token');

function validateJwt(req, res, next) {

    if (!req.headers.authorization) return res.status(403).send({ error: 'Unauthorized!' });

    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, 'my-secret', async (error, decoded) => {
        if (error) {
            return res.status(401).send({ error: 'Invalid token' });
        } else {
            const tokenObject = await Token.findOne({ token });
            if (!tokenObject) return res.status(401).send({ error: 'Invalid token' });
            req.decoded = decoded;
            next();
        }
    });
}

module.exports = validateJwt;