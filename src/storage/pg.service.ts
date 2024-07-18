import { Injectable, OnModuleInit } from '@nestjs/common';
import 'dotenv/config';
import pg from "pg";
const { Client, Pool } = pg;

@Injectable()
export class PgService implements OnModuleInit {

  PgClient: any;
  PgPool: any;
  
  async onModuleInit() {

    const pgConfig = { 
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
  
      //ssl: true,
  
      // all valid client config options are also valid here
      // in addition here are the pool specific configuration parameters:
    
      // number of milliseconds to wait before timing out when connecting a new client
      // by default this is 0 which means no timeout, (int).
      connectionTimeoutMillis: 0,
    
      // number of milliseconds a client must sit idle in the pool and not be checked out
      // before it is disconnected from the backend and discarded
      // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients, (int).
      idleTimeoutMillis: 10000,
    
      // maximum number of clients the pool should contain
      // by default this is set to 10, (int).
      max: 10
    
      // Default behavior is the pool will keep clients open & connected to the backend 
      // until idleTimeoutMillis expire for each client and node will maintain a ref 
      // to the socket on the client, keeping the event loop alive until all clients are closed 
      // after being idle or the pool is manually shutdown with `pool.end()`.
      //
      // Setting `allowExitOnIdle: true` in the config will allow the node event loop to exit 
      // as soon as all clients in the pool are idle, even if their socket is still open 
      // to the postgres server.  This can be handy in scripts & tests 
      // where you don't want to wait for your clients to go idle before your process exits.
      //allowExitOnIdle?: boolean
  
    }

    this.PgPool = new Pool(
      pgConfig
    );

    this.PgClient = new Client({
      //host: 'localhost',
      //port: 5432,
      //database: 'hibi',
      //ssl: true,
      //user: 'hibiuser',
      //password: '7Htitybt'
  
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD    
  });
  
  await this.PgClient
    .connect()
    .then(() => console.log('dbClient connected to db'))
    .catch(err => console.log('dbClient connection error', err.stack))
  }
}
