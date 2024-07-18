import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PgService {

  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async executeQuery(queryText: string, values: any[] = []): Promise<any[]> {
    const result = await this.pool.query(queryText, values);
    return result.rows;
  }
}
