import { Account } from '../../types/models/Account';

export class AccountHandler {
  static async ensureAccount(id: string) {
    const account = await Account.get(id);

    if (!account) {
      const acc = new Account(id);

      acc.transferTotalCount = 0;
      acc.contributedTotalCount = 0;
      acc.contributedTotal = BigInt(0);
      acc.save();

      return acc;
    }
  }

  static async getAccountById(id: string) {
    await this.ensureAccount(id);

    const account = await Account.get(id);

    return account;
  }

  static async updateAccount(id: string, data: Record<string, any>) {
    const account = await this.getAccountById(id);

    Object.entries(data).forEach(([key, value]) => {
      account[key] = value;
    });

    await account.save();
  }

  static async updateTransferStatistic(id: string) {
    const account = await this.getAccountById(id);

    await this.updateAccount(id, { transferTotalCount: account.transferTotalCount + 1 });
  }

  static async updateCrowdloanStatistic(id: string, balance: bigint) {
    const account = await this.getAccountById(id);

    await this.updateAccount(id, {
      contributedTotalCount: account.contributedTotalCount + 1,
      contributedTotal: account.contributedTotal + balance,
    });
  }
}
