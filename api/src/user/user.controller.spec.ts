import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest
              .fn()
              .mockResolvedValue({
                id: 'user-1',
                name: 'John Doe',
                iban: 'DE1234567890',
                balance: 1000,
              }),
            getUserByIban: jest
              .fn()
              .mockResolvedValue({
                id: 'user-1',
                name: 'John Doe',
                iban: 'DE1234567890',
                balance: 1000,
              }),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/users/create (POST) should create a user', () => {
    return request(app.getHttpServer())
      .post('/users/create')
      .send({ name: 'John Doe', iban: 'DE1234567890', balance: 1000 })
      .expect(201)
      .expect({
        id: 'user-1',
        name: 'John Doe',
        iban: 'DE1234567890',
        balance: 1000,
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
