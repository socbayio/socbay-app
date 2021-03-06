const { ApiPromise, WsProvider } = require('@polkadot/api');
const { typesBundleForPolkadot } = require('@crustio/type-definitions');
const IpfsHttpClient = require('ipfs-http-client');

const { CID, create } = IpfsHttpClient;
const fs = require('fs');
const { chainAddr, ipfsTimeout } = require('../ipfsconfig');
const logger = require('../logger').Logger;

const { sendTx, parseObj } = require('./util');

module.exports = {
    default: async (seeds, cid, tip) => {
        try {
            // 1. Check cid locally
            const cidObj = new CID(cid);
            let existed = false;
            const ipfs = create({
                timeout: ipfsTimeout,
            });
            // eslint-disable-next-line no-restricted-syntax
            for await (const pin of ipfs.pin.ls({
                paths: cidObj,
                types: 'recursive',
            })) {
                if (cidObj.equals(pin.cid)) existed = true;
            }
            if (!existed) {
                logger.crustSocbayPinner(
                    `Cid ${cid} don't existed, please pin it first`
                );
                return;
            }

            // 2. Get file size
            const objInfo = parseObj(await ipfs.object.stat(cid));
            const fileSize = objInfo.CumulativeSize;

            // 3. Try connect to Crust Network
            const chain = new ApiPromise({
                provider: new WsProvider(chainAddr),
                typesBundle: typesBundleForPolkadot,
            });
            await chain.isReadyOrError;

            // 4. Load seeds info
            // const seeds = fs.readFileSync(seedsPath, 'utf8');

            // 5. Send place storage order tx
            const tx = chain.tx.market.placeStorageOrder(
                cid,
                fileSize,
                0.0,
                ''
            );
            const res = await sendTx(tx, seeds);
            if (res) {
                logger.crustSocbayPinner(`Publish ${cid} success`);
            } else {
                logger.crustSocbayPinner(
                    "Publish failed with 'Send transaction failed'"
                );
            }

            // 6. Disconnect with chain
            chain.disconnect();
        } catch (e) {
            logger.crustSocbayPinner(`Publish failed with: ${e}`);
        }
    },
};
