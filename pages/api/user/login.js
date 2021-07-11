import { query } from "../../../lib/db";
import { compare } from 'bcrypt'
import { sign } from "jsonwebtoken";

export default async function handler(req, res) {
    const {email, password} = req.body
    if (req.method == 'POST') {
        const result = await query('SELECT * FROM user WHERE email = ?', [email])
        const user = await result[0]

        if (!user) {
            return res.status(404).send('Tidak ada user dengan email tersebut.')
        }

        compare(password, user.password, function(err, result) {
            if (!err && result) {
                const claims = {
                    email: user.email
                }
                const jwt = sign(claims, process.env.SECRET)
                return res.json({authToken: jwt})
            } else {
                return res.status(401).send('Password salah.')
            }
        })
    }
}