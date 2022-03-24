export const RPS_BIN = "608060405234801561001057600080fd5b50610113806100206000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806367ef4c13146044575b600080fd5b348015604f57600080fd5b506079600480360381019080803560ff169060200190929190803590602001909291905050506097565b60405180826000191660001916815260200191505060405180910390f35b60008282604051808360ff1660ff167f01000000000000000000000000000000000000000000000000000000000000000281526001018281526020019250505060405180910390209050929150505600a165627a7a72305820d2c1e45368df9f81dea14e61f2662418e73d6009c65891fd09bca64554f74d800029";
export enum Testnet {
  rinkedby = 'rinkedby',
};
export const NETWORK = Testnet.rinkedby;
export const CONTRACT_DEPLOYMENT = {
  rinkedby: {
    Hasher: '0xd9145CCE52D386f254917e481eB44e9943F39138',
  },
};