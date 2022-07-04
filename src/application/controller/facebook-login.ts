import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RequiresField } from '@/application/errors'

type HttpRequest = {
  token: string | undefined | null
}
type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuthentication
  ) { }

  async handle (httRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (httRequest.token === '' || httRequest.token === null || httRequest.token === undefined) {
        return badRequest(new RequiresField('token'))
      }
      const accessToken = await this.facebookAuth.perform({ token: httRequest.token })
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
