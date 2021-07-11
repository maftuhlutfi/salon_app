import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect' 

async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const result = await query(`SELECT * FROM kategori`)
            return res.json(result)
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'POST') {
        const {nama} = req.body
        try {
            await query(`INSERT INTO kategori (nama_kategori) VALUES (?)`, [nama])
            return res.send('Kategori berhasil ditambahkan.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)