module.exports = Func => (req,res,next) => {
    Promise.resolve(Func(req, res, next)).catch(err => {
        console.log(err);
        next(err);
    });
}