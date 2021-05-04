const User = require('./models/userModel.js');
const Video = require('./models/videoModel.js');
//const videoTag = require('./models/videoTagModel.js');
const liveChat = require('./models/liveChatModel')
const subReferencesPopulate = require('mongoose-sub-references-populate');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const global = require('./models/globalModel')

mongoose.connect("mongodb://localhost:27028/socbay", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});

const uploadBlock = require('./models/uploadBlockModel');

const uploadFilesNumber = async (blockNumber,numberAddedFiles)=>{
    const blockFound = await uploadBlock.findOneAndUpdate({blockNumber: blockNumber},{$inc : {'uploadedFilesNumber' : numberAddedFiles}});
}
const uploadTotalSizeInByte = async (blockNumber,totalSizeInByteAdded)=>{
    const blockFound = await uploadBlock.findOneAndUpdate({blockNumber: blockNumber},{$inc : {'totalSizeInByte' : totalSizeInByteAdded}});
}
const addFileInfo = async (blockNumber,fileName,fileSizeInByte,CID)=>{
    const blockFound = await uploadBlock.findOneAndUpdate({blockNumber: blockNumber},{$push: {filesInfo:{fileName,fileSizeInByte,CID}}});
    await uploadTotalSizeInByte(blockNumber,fileSizeInByte);
}

global.create({currentBlock: 0})
//uploadBlock.create({blockNumber:00000,filesInfo:[{fileName:'abc',fileSizeInByte:123,CID:'1234xdf'}]})
//uploadBlock.findOneAndUpdate({blockNumber:1},{CID:'abc'},(error,res)=>{console.log(error,res)})

// User.findById('608bedc97ff1e9287cd2b8de',async (e,res)=>{
//     console.log(e,res)
//     const abc = res.uploadedFiles[0]
//     await abc.subPopulate('fileId')
//     console.log(abc)
// })


// const fileElementSchema = new Schema(
//     {
//         fileId: {
//             type: mongoose.Schema.Types.ObjectId,
//             subRef: 'uploadBlock.filesInfo'
//         }
//     }
// );

// const UserSchema = new Schema({
//     username: {
//         type: String,
//         required: false
//     },
//     profilePicture: {
//         type: String,
//         default: '/images/profilepicture/default.png'
//     },
//     uploadedFiles: [fileElementSchema]
// });

// fileElementSchema.plugin(subReferencesPopulate);

// const filex = mongoose.model('filex',UserSchema);
// //filex.create({username: 'nghia',uploadedFiles:[{fileId:'60901619af73e725a0d181fb'}]})

// filex.findById('609028dd131a0245ec08060c', async (error,file)=>{
//     file.uploadedFiles[0]
//     //await file.subPopulate('uploadedFiles.fileId')
//     console.log(file.uploadedFiles[0])
//     const xxx = file.uploadedFiles[0];
//     await xxx.subPopulate('fileId')
//     console.log(xxx)
// });
// abc.then(async (res)=>{
//     await res.subPopulate('fileId')
//     console.log(res)})
//uploadFilesNumber(1, 15)
//addFileInfo(1,'abc',12,'xyz')