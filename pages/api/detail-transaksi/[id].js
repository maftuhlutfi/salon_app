import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect'

async function handler(req, res) {
    const {id} = req.query
    if (req.method == 'GET') {
        try {
            const result = await query(`SELECT dt.id_transaksi, dt.id_produk, p.nama_produk, dt.jumlah, p.harga_jual as harga, (p.harga_jual*dt.jumlah) as total_harga 
                FROM detail_transaksi dt INNER JOIN produk p 
                WHERE dt.id_produk = p.id_produk AND dt.id_transaksi = ?
            `, [id])
            return res.json(result) 
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'PUT') {
        const {id_produk, jumlah} = req.body
        try {
            await query(`UPDATE detail_transaksi SET jumlah=? WHERE id_transaksi=? AND id_produk=?`, [jumlah, id, id_produk])
            return res.send('Detail transaksi berhasil diupdate.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'DELETE') {
        const {id_produk} = req.body
        try {
            await query(`DELETE FROM detail_transaksi WHERE id_transaksi=? AND id_produk=?`, [id, id_produk])
            return res.send('Detail transaksi berhasil ditambahkan.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)