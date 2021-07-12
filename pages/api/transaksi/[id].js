import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect'

async function handler(req, res) {
    const {id} = req.query
    if (req.method == 'GET') {
        try {
            const result = await query(`SELECT t.*, u.nama as nama_pelanggan, u.telepon FROM transaksi t INNER JOIN user u ON t.id_pelanggan = u.id WHERE t.id_transaksi=?`, [id])
            return res.json(result[0])
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'PUT') {
        const {status_transaksi, status_pembayaran, tgl_bayar} = req.body
        try {
            const result = await query(`UPDATE transaksi SET status_transaksi=?, status_pembayaran=?, tgl_bayar=? WHERE id_transaksi=?`, 
                [status_transaksi, status_pembayaran, tgl_bayar, id])
            return res.send('Transaksi berhasil diupdate.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'DELETE') {
        try {
            const result = await query(`DELETE FROM transaksi WHERE id_transaksi=?`, [id])
            return res.send('Transaksi berhasil dihapus.')
        } catch (e) {
            console.log(id, e)
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)