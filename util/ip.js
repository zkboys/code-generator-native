const { networkInterfaces } = require('os');
const defaultGateway = require('default-gateway');
const ip = require('ipaddr.js');

function findIp(gateway) {
    const gatewayIp = ip.parse(gateway);

    // Look for the matching interface in all local interfaces.
    for (const addresses of Object.values(networkInterfaces())) {
        for (const { cidr } of addresses) {
            const net = ip.parseCIDR(cidr);

            // eslint-disable-next-line unicorn/prefer-regexp-test
            if (net[0] && net[0].kind() === gatewayIp.kind() && gatewayIp.match(net)) {
                return net[0].toString();
            }
        }
    }
}

async function async(family) {
    try {
        const { gateway } = await defaultGateway[family]();
        return findIp(gateway);
    } catch {
    }
}

function sync(family) {
    try {
        const { gateway } = defaultGateway[family].sync();
        return findIp(gateway);
    } catch {
    }
}

module.exports = {
    internalIpV6: () => async('v6'),
    internalIpV4: () => async('v4'),
    internalIpV6Sync: () => sync('v6'),
    internalIpV4Sync: () => sync('v4'),
};
