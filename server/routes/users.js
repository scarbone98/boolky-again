const router = require('express').Router();
const { User } = require('../models/user');

router.get('/getUserData', async (req, res) => {
    const { id } = req.decoded || {};
    User.find(
        {
            _id: id
        },
        (error, user) => {
            if (error) {
                return res.status(500).send({ error: 'ERROR FETCHING USER DATA' });
            } else {
                if (!user.length) {
                    return res.status(403).send({error: 'User not found!'});
                }
                return res.status(200).send({ data: user });
            }
        });
});

module.exports = router;