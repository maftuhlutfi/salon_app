import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect'

async function handler(req, res) {
    if (req.user.role != 'admin') {
        return res.status(403).send('Kamu bukan admin.')
    }

    try {
        const result = await query(`SELECT id, nama, email, role, telepon, alamat FROM user WHERE role="pelanggan"`)
        return res.json(result)
    } catch (e) {
        res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
    }
}

export default withProtect(handler)