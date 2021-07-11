import multer from "multer"

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/produk")
  },
  filename: function (req, file, cb) {
    cb(null, `${makeid(10)}.${file.mimetype.split('/')[1]}`)
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
