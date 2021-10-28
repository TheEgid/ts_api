import request from 'supertest'
import express from 'express'
import bodyParser from 'body-parser'
import { useExpressServer } from 'routing-controllers'
import GlobalErrorHandler from '../../src/middleware/global-error-handler'
import Info from '../../src/models/info'
import UserController from '../../src/controller/user-controller'

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  let server
  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    server = express()
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    server.use(bodyParser.json())
    useExpressServer(server, {
      controllers: [UserController], // we specify controllers we want to use
      middlewares: [GlobalErrorHandler],
      defaultErrorHandler: false
    })
  })

  it('postOne', () => {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const userController = new UserController()
    const testBody = {
      // country: 'Russia',
      city: 'SPb'
    }
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const res = userController.postOne(1, testBody as Info)
    expect(res).toBeUndefined()
  })

  it('postOne with validations', (done) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    request(server)
      .post('/users/1')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .send({
        country: 'Tchad',
        city: 'Sarh'
      } as Info)
      .expect(204)
      .end((err, res) => {
        if (err) throw new Error(JSON.stringify(res.body))
        done()
      })
  })
})
