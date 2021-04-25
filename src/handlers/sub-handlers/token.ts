import { Token } from '../../types/models/Token';

export class TokenHandler {
  static async ensureToken(id: string, decimal = 9) {
    const token = await Token.get(id);

    if (!token) {
      const token = new Token(id);

      token.name = id;
      token.decimal = decimal;

      await token.save();
    }
  }
  
}
