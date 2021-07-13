import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect'

async function handler(req, res) {
    const {id} = req.query
    if (req.method == 'PUT') {
        try {
            const result = await query(`UPDATE user SET role="admin" WHERE id=?`, 
                [id])
            return res.send('Akun berhasil diupdate.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'DELETE') {
        try {
            const result = await query(`DELETE FROM user WHERE id=?`, [id])
            return res.send('Akun berhasil dihapus.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)