import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/bukti-transaksi")
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`)
  },
})

const fileFilter = (req, file, cb) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
        cb(null, true);
    } else{
        cb(null, false);

    }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter })