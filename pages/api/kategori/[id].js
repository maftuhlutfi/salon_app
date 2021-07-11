import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect' 

async function handler(req, res) {
    const {id} = req.query
    if (req.method == 'GET') {
        try {
            const result = await query(`SELECT * FROM kategori WHERE id_kategori=?`, [id])
            return res.json(result[0])
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'PUT') {
        if (req.user.role != 'admin') {
            return res.status(403).send('Kamu bukan admin.')
        }

        const {nama} = req.body
        try {
            await query(`UPDATE kategori SET nama_kategori=? WHERE id_kategori=?`, [nama, id])
            return res.send('Kategori berhasil diubah.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'DELETE') {
        if (req.user.role != 'admin') {
            return res.status(403).send('Kamu bukan admin.')
        }
        
        try {
            await query(`DELETE FROM kategori WHERE id_kategori=?`, [id])
            return res.send('Kategori berhasil dihapus.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)