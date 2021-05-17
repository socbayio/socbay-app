const pin = require('./pin').default;
const publish = require('./publish').default;
const status = require('./status').default;


const cid = pin('Chutich.mp4')
cid.then((cid)=>{
    console.log(cid);
})

const cid2 = pin('util.js')
cid2.then((cid)=>{
    console.log(cid);
})

const cid3 = pin('index.js')
cid3.then((cid)=>{
    console.log(cid);
})
// const seeds = 'trial portion crucial caught word amused slot struggle need scissors polar curtain'
// const publishFolder = async ()=>{
//     const cid = await pin('publish.js');
//     const publishRes = await publish(seeds, cid, 0.000);
//     const statusRes = await status(cid);
//     console.log(statusRes);
// }
//publish('QmSEHiQnj9pzhwPXoxzTZr5tSYigWLfPhqjcJACiZuDLhP')
// const fileStat = status('QmSEHiQnj9pzhwPXoxzTZr5tSYigWLfPhqjcJACiZuDLhP');

// fileStat.then((fileStat)=>{
//     console.log(fileStat);
// })
//publishFolder()

