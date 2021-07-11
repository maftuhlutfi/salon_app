import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect'

async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const result = await query(`SELECT dt.id_transaksi, dt.id_produk, p.nama_produk, dt.jumlah, p.harga_jual as harga, (p.harga_jual*dt.jumlah) as total_harga FROM detail_transaksi dt INNER JOIN produk p WHERE dt.id_produk = p.id_produk`)
            return res.json(result) 
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'POST') {
        const {id_transaksi, id_produk, jumlah} = req.body
        try {
            await query(`INSERT INTO detail_transaksi (id_transaksi, id_produk, jumlah) VALUES (?,?,?)`, [id_transaksi, id_produk, jumlah])
            return res.send('Detail transaksi berhasil ditambahkan.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)