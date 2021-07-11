const withAdmin = (handler) => {
    if (!req.user.role == 'admin') {
        return res.status(403).send('Kamu bukan admin.')
    }

    return handler(req, res)
}

export default withAdmin