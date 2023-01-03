const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../helpers/mailer');

const { default: mongoose } = require('mongoose');

const { User } = require('../models/user');
const { Token } = require('../models/token');

router.post('/signUp', async (req, res) => {
    const { userName, password, firstName, lastName, email } = req.body;

    const newUser = new User({
        username: userName,
        hash: password,
        firstName,
        lastName,
        email
    });

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        await newUser.save({ session });
        await sendVerificationEmail(email, session);
        await session.commitTransaction();
        session.endSession();
        res.status(200).send({ data: 'success' });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).send({ error: e });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email, hash: password });

    if (!user) {
        return res.status(400).send({ error: 'Incorrect username or password.' });
    }


    const payload = { id: user._id, isEmailVerified: user.isEmailVerified };
    const secret = 'my-secret';
    const options = { expiresIn: '30d' };

    const tokenValue = jwt.sign(payload, secret, options);
    const currentTime = new Date();

    // Delete any other active auth tokens AKA invalidate them
    await Token.updateOne({ email, type: 'auth' }, { token: tokenValue, expiresAt: currentTime.setDate(currentTime.getDate() + 30) }, { upsert: true });

    res.status(200)
        .send({
            data:
            {
                isEmailVerified: user.isEmailVerified,
                firstName: user.firstName,
                lastName: user.lastName,
                token: tokenValue
            }
        });
});


router.get('/validToken', async (req, res) => {
    const { token } = req.query;
    const foundToken = await Token.findOne({ token: token, type: 'auth' });
    return res.status(200).send({ valid: !!foundToken });
});

router.get('/verify', async (req, res) => {
    const { token } = req.query;

    const foundToken = await Token.findOne({ token: token });

    if (!foundToken) {
        // If the token was not found, return an error
        return res.status(400).send({ error: 'Token not found' });
    }

    if (foundToken.expiresAt < new Date()) {
        // If the token is expired, return an error
        await Token.deleteOne({ _id: foundToken._id });
        return res.status(400).send({ error: 'Token is expired' });
    }

    await User.updateOne({ email: foundToken.email }, { isEmailVerified: true });

    await Token.deleteOne({ _id: foundToken._id });

    res.redirect('http://localhost:5173/login');
});

router.post('/signOut', async (req, res) => {

});

module.exports = router;