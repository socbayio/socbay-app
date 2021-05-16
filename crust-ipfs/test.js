const pin = require('./pin').default;
const publish = require('./publish').default;
const status = require('./status').default;


// const cid = pin('.\\tt\\')
// cid.then((cid)=>{
//     console.log(cid);
// })

const publishFolder = async ()=>{
    const cid = await pin('.\\tt\\');
    //const publishRes = await publish(cid, 0.001);
    const statusRes = await status(cid);
    console.log(statusRes);
}
//publish('QmSEHiQnj9pzhwPXoxzTZr5tSYigWLfPhqjcJACiZuDLhP')
// const fileStat = status('QmSEHiQnj9pzhwPXoxzTZr5tSYigWLfPhqjcJACiZuDLhP');

// fileStat.then((fileStat)=>{
//     console.log(fileStat);
// })
publishFolder();

