const router = require('express').Router();
const fetch = require('cross-fetch');

router.get('/getBooks', async (req, res) => {
    try {
        const data = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${req.query.title}&orderBy=relevance`).then(res => res.json());
        res.status(200).send({ data });
    } catch (e) {
        res.status(500).send({ error: 'API ERROR' })
    }
});


module.exports = router;