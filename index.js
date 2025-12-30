const express = require('express')
const multer  = require('multer')
const docxtopdf = require('docx-pdf')
const path= require('path')


const app = express()
const port = 3000

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
app.post('/convertfile', upload.single('file'), (req, res, next)=> {
    try {
        if(!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }

        let outputFilePath = path.join(__dirname, 'output', `${path.parse(req.file.originalname).name}.pdf`);
        docxtopdf(req.file.path,outputFilePath,function(err,result){
  if(err){
    console.log(err);
    return res.status(500).send('Error converting file.');
  }
  res.download(outputFilePath,()=>{
    console.log('File  downloaded');
  });
});
    } catch (error) {
       console.log(error) 
       res.status(500).send("internal server error")
    }
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
