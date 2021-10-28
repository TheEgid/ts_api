import { createConnections } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import Postgres from './postgres'

export default class DatabaseConnectionFacade {
  static async multipleConnections(): Promise<void> {
    const pg = Postgres.getConnection()
    await createConnections([pg as PostgresConnectionOptions])
  }
}
