const IPFS = require("ipfs-http-client");
const ipfs = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https", apiPath: '/api/v0' });
export default ipfs;