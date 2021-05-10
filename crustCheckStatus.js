/* Crust JS */
const {ApiPromise, WsProvider} = require('@polkadot/api') ;
const {typesBundleForPolkadot} = require('@crustio/type-definitions');

const getStatusByCrustJs = async (CID) => {
    const api = new ApiPromise({
      provider: new WsProvider('wss://api.crust.network'),
      typesBundle: typesBundleForPolkadot,
    });
    await api.isReady;
    const fileInfo = await api.query.market.files(CID);
    console.log(fileInfo.toHuman());
    return (fileInfo.toHuman());
}
for (var i = 0; i<10; i++){
    //setTimeout(function(){getStatusByCrustJs('QmbGjffeUwQHdycGcX1w6Ha1JSYjQyrVUk1HGRdpkK3L6y');},10000)
    setTimeout(function(){getStatusByCrustJs('Qmf6BZSfp5uzLSXSXF7okdrAcTHLfo2kQpNC2tYZBe5hiw');},10000)
    //setTimeout(function(){getStatusByCrustJs('QmVrVezLyotF6Jwym4n9DpYWQnFApkUcTrEdNDU9JcFzvw');},10000)

    //getStatusByCrustJs('QmbGjffeUwQHdycGcX1w6Ha1JSYjQyrVUk1HGRdpkK3L6y');

}
