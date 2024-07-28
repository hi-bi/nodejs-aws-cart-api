import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { User } from '../models';

import { PgService } from 'src/storage/pg.service';

@Injectable()
export class UsersPgService {

    constructor (private db: PgService) {}

    async findOne(userId: string): Promise< User | undefined > {

        if (!userId) {
            return
        }

        const query = 'SELECT id , name, password, email \
        FROM users \
        WHERE name = $1;';
        const values = [userId];
        const rows = await this.db.executeQuery(query,values);
    
        if (rows.length > 0) {
        
            return {
            id: rows[0]?.id,
            name: rows[0]?.name,
            password: rows[0]?.password,
            email: rows[0]?.email,
            }
        } else {
            return
        }
    }

    async createOne({ name, password }: User): Promise < User > {
        const id = v4();

        const values = [id, name, password];
        const query = 'INSERT INTO cart.users (id, name, password) VALUES($1, $2, $3);';

        const rows = await this.db.executeQuery(query,values);

        return await this.findOne(id)
    }

}
