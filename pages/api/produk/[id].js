import { query } from "../../../lib/db";
import { upload } from "../../../lib/multer";
import withProtect from '../../../middleware/withProtect'
import fs from 'fs'

export const config = {
    api: {
      bodyParser: false,
    },
  }

async function handler(req, res) {
    const {id} = req.query
    if (req.method == 'GET') {
        try {
            const result = await query(`SELECT p.id_produk, p.nama_produk, p.harga_jual, p.qty, p.gambar_produk, p.deskripsi, k.nama_kategori AS kategori, k.id_kategori FROM produk p
                INNER JOIN kategori k ON p.id_kategori = k.id_kategori WHERE p.id_produk=?`, [id])
            return res.json(result[0])
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'PUT') {
        if (req.user.role != 'admin') {
            return res.status(403).send('Kamu bukan admin.')
        }

        try {
            const result = await query(`SELECT gambar_produk as gambar FROM produk WHERE id_produk=?`, [id])
            const gambar = await result[0].gambar
            upload.single('produk-img')(req, {}, async err => {
                if (err) {
                    return res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
                }

                const {kategori, nama, harga, qty, deskripsi, isUpdatePicture} = req.body
                console.log(kategori)

                const filename = isUpdatePicture == 'true' ? req.file.filename : gambar
                
                try {
                    const result1 = await query(`UPDATE produk SET id_kategori=?, nama_produk=?, harga_jual=?, qty=?, gambar_produk=?, deskripsi=? WHERE id_produk=?`, [kategori, nama, harga, qty, filename, deskripsi, id])
                    console.log(result1)
                    if (isUpdatePicture == 'true') {
                        fs.unlinkSync('./public/uploads/produk/'+gambar)
                    }
                    return res.send('Produk berhasil diupdate.')
                } catch (e) {
                    console.log(e)
                    res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
                }
            })
        } catch (e) {
            console.log(e)
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
    if (req.method == 'DELETE') {
        if (req.user.role != 'admin') {
            return res.status(403).send('Kamu bukan admin.')
        }
        
        try {
            await query(`DELETE FROM produk WHERE id_produk=?`, [id])
            return res.send('Produk berhasil dihapus.')
        } catch (e) {
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)