class Index {
    test(req, res, next) {
        res.render('index', { title: 'hit12334243234234' });
    }
}
module.exports = new Index()
