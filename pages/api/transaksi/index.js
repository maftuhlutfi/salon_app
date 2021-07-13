import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect'

async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const result = await query(`SELECT t.*, u.nama as nama_pelanggan, SUM(dt.jumlah * p.harga_jual) AS total_bayar
            FROM transaksi t 
            INNER JOIN user u ON t.id_pelanggan = u.id
            INNER JOIN detail_transaksi dt ON dt.id_transaksi = t.id_transaksi
            INNER JOIN produk p ON p.id_produk = dt.id_produk
            ${req.user.role == 'pelanggan' ? 'WHERE t.id_pelanggan=' + req.user.id : ''}
            GROUP BY dt.id_transaksi`)
            return res.json(result)
        } catch (e) {
            console.log(e)
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'POST') {
        const {id_pelanggan, tipe_bayar, alamat_kirim} = req.body
        try {
            const result = await query(`INSERT INTO transaksi (id_pelanggan, tipe_bayar, alamat_kirim) VALUES (?,?,?)`, [id_pelanggan, tipe_bayar, alamat_kirim])
            return res.json({message: 'Transaksi berhasil ditambahkan.', insertedId: result.insertId})
        } catch (e) {
            console.log(e)
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)