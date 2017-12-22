export const errorHandle = (err, next) => {
    err.status = 500;
    next(err);
}
