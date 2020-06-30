class Index {
    test(req, res, next) {
        res.render('index', { title: 'hit123' });
    }
}
module.exports = new Index()
