const config = {
    api: "http://127.0.0.1:3002/v1",
    version: "0.1.0",
    websiteTitle: "Relux",
    websiteDescription: "Relux project @ ETHBrussels 2024",
    contactMail: "contact@mail.me",
    chains: {
        arbitrumSepolia: {
            contract_marketplace: '0x19a87E91c1BE5650fa4f487A9BB8020DdC6bfBAD',
        },
        baseSepolia: {
            contract_marketplace: '0x29F9a489df33fadce2e92d36e4098bc6B2aCe7E1',
        },
    }
}

export default config;