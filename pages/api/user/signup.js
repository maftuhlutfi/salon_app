import { query } from "../../../lib/db";
import {hash} from 'bcrypt'

export default async function handler(req, res) {
    if (req.method == 'POST') {
        const {nama, email, password, role, telepon, alamat} = req.body

        const user = await query(`SELECT id FROM user WHERE email = ?`, [email])
        if (user[0]) {
            return res.status(401).send('User dengan email tersebut sudah ada.')
        }

        hash(password, 8, async function(err, hashedPw) {
            try {
                const result = await query(`INSERT INTO user (nama, email, password, role, telepon, alamat) VALUES (?,?,?,?,?,?)`, [nama, email, hashedPw, role, telepon, alamat])
                return res.send('Berhasil membuat user.')
            } catch (e) {
                return res.status(500).json({message: e.message})
            }
        })
    }
}