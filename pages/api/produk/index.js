import { query } from "../../../lib/db";
import { upload } from "../../../lib/multer";
import withProtect from '../../../middleware/withProtect'

export const config = {
    api: {
      bodyParser: false,
    },
  }

async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const result = await query(`SELECT p.id_produk, p.nama_produk, p.harga_jual, p.qty, p.gambar_produk, p.deskripsi, k.nama_kategori, k.id_kategori AS kategori FROM produk p
                INNER JOIN kategori k ON p.id_kategori = k.id_kategori `)
            return res.json(result)
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'POST') {
        upload.single('produk-img')(req, {}, async err => {
            if (err) {
                return res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
            }
            
            const {kategori, nama, harga, qty, deskripsi} = req.body
            const filename = req.file.filename
            try {
                await query(`INSERT INTO produk (id_kategori, nama_produk, harga_jual, qty, gambar_produk, deskripsi) VALUES (?,?,?,?,?,?)`, [kategori, nama, harga, qty, filename, deskripsi])
                return res.send('Produk berhasil ditambahkan.')
            } catch (e) {
                res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
            }
        })
    }
}

export default withProtect(handler)