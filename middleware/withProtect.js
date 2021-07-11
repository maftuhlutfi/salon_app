import { verify } from "jsonwebtoken"
import { query } from "../lib/db"

const withProtect = handler => {
    return async (req, res) => {
        if (!req.headers['authorization']) {
            return res.status(401).send('Kamu tidak terautentikasi.')
        }

        const bearerToken = req.headers['authorization'].split(" ")[1]
        verify(bearerToken, process.env.SECRET, async (err, decoded) => {
            if (!err && decoded) {
                const result = await query('SELECT id, nama, email, role FROM user WHERE email = ?', [decoded.email])
                const user = await result[0]
                req.user = {
                    id: user.id,
                    nama: user.nama,
                    email: user.email,
                    role: user.role
                }
                return handler(req, res)
            } else {
                return res.status(401).send('Bearer tidak benar')
            }
        })
    }
}

export default withProtect