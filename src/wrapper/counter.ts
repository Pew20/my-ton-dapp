import { Address, beginCell, Cell, contractAddress, SendMode, toNano } from '@ton/core';
import type { Contract, ContractProvider, Sender } from '@ton/core';

// 合约地址 EQAg3pn6KPnCIHjiGuGLUPtTbP6Izt-fPO70rkQoLCbeXqny
export type CounterConfig = {
  id: number;
  counter: number;
};

export function counterConfigToCell(config: CounterConfig): Cell {
  return beginCell().storeUint(config.id, 32).storeUint(config.counter, 64).endCell();
}

// export const Opcodes = {
//   increase: 0x7e8764ef,
// };

export class Counter implements Contract {
  readonly address: Address;
  readonly init?: { code: Cell; data: Cell };
  constructor(address: Address, init?: { code: Cell; data: Cell }) {
    this.address = address;
    this.init = init;
  }

  static createFromAddress(address: Address) {
    return new Counter(address);
  }

  static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
    const data = counterConfigToCell(config);
    const init = { code, data };
    return new Counter(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendOp1(
    provider: ContractProvider,
    via: Sender,
  ) {
    await provider.internal(via, {
      value: toNano('0.01'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(1, 32)
        .endCell(),
    });
  }
  async sendOp2(
    provider: ContractProvider,
    via: Sender,
  ) {
    await provider.internal(via, {
      value: toNano('0.01'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(2, 32)
        .endCell(),
    });
  }

  async getCounter(provider: ContractProvider) {
    const result = await provider.get('get_counter', []);
    return result.stack.readNumber();
  }

  async getID(provider: ContractProvider) {
    const result = await provider.get('get_id', []);
    return result.stack.readNumber();
  }
}
