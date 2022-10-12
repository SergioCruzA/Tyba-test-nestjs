import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
/* import { getConnection getConnectionManager } from 'typeorm'; */
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
// import entities from './../src/common/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  /* beforeAll(async () => {
    const connectionManager = getConnectionManager()
    const connection = connectionManager.create({
        "type": "postgres",
        "host": "localhost",
        "port": 5434,
        "username": "postgres",
        "password": "workdb123",
        "database": "nest_db",
        "entities": entities,
        "logging": false,
        "synchronize": true
    })
    await connection.connect()
}) */

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    /* // Fetch all the entities
    const entities = getConnection().entityMetadatas;

    console.log('entities: ', entities)
  
    for (const entity of entities) {
        const repository = getConnection().getRepository(entity.name); // Get repository
        await repository.clear(); // Clear each entity table's content
    } */
    await app.close();
  });

  describe('/ (GET)', () => {
    it('Retun a hello string', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('/users (POST)', () => {
    it('Create a new user correctly', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/users')
        .send({ username: 'SergioUsername', password: 'password' })
        .expect(201);

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('username');
      expect(body).toHaveProperty('password');

      // ensure password was hashed
      expect(body.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash regex
    });

    it('Create user failed with a username less than 5 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ username: 'Serg', password: 'password' })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error');

      expect(response.body.message).toEqual([
        'username must be longer than or equal to 5 characters',
      ]);
    });

    it('Create user failed with a username already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ username: 'SergioUsername', password: 'password' })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error');

      expect(response.body.message).toEqual('User Already Exists');
    });
  });

  describe('/auth/login (POST)', () => {
    it('Authenticates a user and includes a jwt token in the response', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'SergioUsername', password: 'password' })
        .expect(201);

      const jwtToken = response.body.access_token;

      // ensure a JWT token is included in the response
      expect(jwtToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      ); // jwt regex
    });

    it('Authenticates failed returning an Unauthorized error', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'Sergio', password: 'password' })
        .expect(401);

      expect(response.body.accessToken).not.toBeDefined();

      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('/resturants (GET)', () => {
    it('Should not get restaurants without any authentication, returns 401', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/restaurants')
        .expect(401);

      expect(body).toHaveProperty('statusCode', 401);
      expect(body).toHaveProperty('message');

      expect(body.message).toBe('Unauthorized');
    });

    it('Should get restaurants without sending any query', async () => {
      const {
        body: { access_token },
      } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'SergioUsername', password: 'password' });

      const { body } = await request(app.getHttpServer())
        .get('/restaurants')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);

      expect(body).toHaveProperty('results');
      expect(body).toHaveProperty('status', 'OK');

      expect(Array.isArray(body.results)).toBe(true);
      expect(body.results).toEqual(
        expect.arrayContaining([expect.any(Object)]),
      );
    });

    it('Should get restaurants sending city query Bucaramanga', async () => {
      const {
        body: { access_token },
      } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'SergioUsername', password: 'password' });

      const { body } = await request(app.getHttpServer())
        .get('/restaurants?city=Bucaramanga')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);

      expect(body).toHaveProperty('results');
      expect(body).toHaveProperty('status', 'OK');

      expect(Array.isArray(body.results)).toBe(true);
      body.results.every((item) =>
        expect(item.formatted_address).toContain('Bucaramanga'),
      );
    });

    it('Should get restaurants sending lattitude and longitude of Lima in queries', async () => {
      const {
        body: { access_token },
      } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'SergioUsername', password: 'password' });

      const { body } = await request(app.getHttpServer())
        .get('/restaurants?lattitude=-12.046374&longitude=-77.042793')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);

      expect(body).toHaveProperty('results');
      expect(body).toHaveProperty('status', 'OK');

      expect(Array.isArray(body.results)).toBe(true);
      body.results.every((item) =>
        expect(item.formatted_address).toContain('Lima'),
      );
    });
  });

  describe('/transactions (GET)', () => {
    it('Should get tranactions without sending any header', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/transactions')
        .expect(200);

      expect(body).toHaveProperty('items');
      expect(body).toHaveProperty('meta');
      expect(body).toHaveProperty('links');

      expect(Array.isArray(body.items)).toBe(true);
      expect(body.items).toEqual(expect.arrayContaining([expect.any(Object)]));
    });

    it('Should get tranactions sending header', async () => {
      const {
        body: { access_token },
      } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'SergioUsername', password: 'password' });

      const { body } = await request(app.getHttpServer())
        .get('/transactions')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);

      expect(body).toHaveProperty('items');
      expect(body).toHaveProperty('meta');
      expect(body).toHaveProperty('links');

      expect(Array.isArray(body.items)).toBe(true);
      expect(body.items).toEqual(expect.arrayContaining([expect.any(Object)]));
    });
  });
});
