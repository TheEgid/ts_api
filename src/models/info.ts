import { IsDefined } from 'class-validator'

export default class Info {
  @IsDefined()
  country: string

  @IsDefined()
  city: string
}
