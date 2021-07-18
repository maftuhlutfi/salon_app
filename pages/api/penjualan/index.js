import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect'

async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const result = await query(`SELECT p.id_produk, p.nama_produk, p.deskripsi, k.nama_kategori, p.qty, SUM(dt.jumlah) as terjual, p.harga_jual
            FROM transaksi t
            INNER JOIN detail_transaksi dt ON dt.id_transaksi = t.id_transaksi
            RIGHT JOIN produk p ON dt.id_produk = p.id_produk
            INNER JOIN kategori k ON p.id_kategori = k.id_kategori
            GROUP BY p.id_produk`)
            return res.json(result)
        } catch (e) {
            console.log(e)
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)