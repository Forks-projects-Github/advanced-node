import { TokenGenerator } from '@/data/contracts/crypto'
import { sign } from 'jsonwebtoken'

type Params = TokenGenerator.Params
type Result= TokenGenerator.Result

export class JwtTokenGenerator implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) { }

  async generateToken ({ key, expirationInMs }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key }, this.secret, { expiresIn: expirationInSeconds })
    return token
  }
}
