import { query } from "../../../lib/db";
import withProtect from '../../../middleware/withProtect'
import { upload } from "../../../lib/multerBuktiTransaksi";

export const config = {
    api: {
      bodyParser: false,
    },
  }

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
        let status_transaksi, status_pembayaran, tgl_bayar = ''

        upload.single('bukti-transaksi-img')(req, {}, async err => {
            if (err) {
                return res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
            }

            const {action, tanggal} = req.body

            let queryText = ''

            switch (action) {
                case 'upload bukti':
                    queryText = 'UPDATE transaksi SET tgl_bayar=? WHERE id_transaksi=?'
                    break;
                case 'dibayar':
                    queryText = 'UPDATE transaksi SET status_transaksi="proses", status_pembayaran="dibayar", tgl_bayar=? WHERE id_transaksi=?'
                    break;
                case 'selesai':
                    queryText = 'UPDATE transaksi SET status_transaksi="selesai", status_pembayaran="dibayar", tgl_bayar=? WHERE id_transaksi=?'
                    break;
                default:
                    break;
            }

            try {
            const result = await query(queryText, 
                [tanggal, id])
                return res.send('Transaksi berhasil diupdate.')
            } catch (e) {
                res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
            }
        })
    }
    if (req.method == 'DELETE') {
        try {
            const result = await query(`UPDATE transaksi SET status_transaksi="batal" WHERE id_transaksi=?`, [id])
            return res.send('Transaksi berhasil dibatalkan.')
        } catch (e) {
            console.log(id, e)
            res.status(500).send('Terjadi kesalahan. Coba lagi beberapa saat.')
        }
    }
}

export default withProtect(handler)