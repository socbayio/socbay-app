const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client');
const { globSource, create } = IpfsHttpClient;
const { ipfsTimeout } = require('./consts');

module.exports = { 
    default: async (path) => {
        try {
            // 1. Check local ipfs is alive
            const ipfs = create({
                timeout: ipfsTimeout
            });

            // 2. Check legality of path
            if (!fs.existsSync(path)) {
                console.error(`File/directory is not exists: ${path}`);
                return;
            }

            // 3. Pin it
            const { cid } = await ipfs.add(globSource(path, { recursive: true }));

            // 4. Check local pin
            if (cid) {
                console.log(`Pin success: ${cid}`);
            } else {
                console.error(`Pin failed, please try it again`);
            }

            return cid.toString();
        } catch (e) {
            console.error(`IPFS is offline, please start it over, error detail: ${e}`);
        }
    }
}