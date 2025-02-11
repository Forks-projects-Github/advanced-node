import { JwtTokenGenerator } from '@/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let key: string
  let secret: string
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    key = 'any_key'
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
  })

  it('should call sing with corecct params', async () => {
    await sut.generateToken({ key, expirationInMs: 1000 })
    expect(fakeJwt.sign).toHaveBeenCalledWith(
      { key },
      secret,
      { expiresIn: 1 })
  })

  it('should return a token', async () => {
    const token = await sut.generateToken({ key, expirationInMs: 1000 })
    expect(token).toBe('any_token')
  })

  it('should rethrow if get throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })
    const promise = sut.generateToken({ key, expirationInMs: 1000 })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
