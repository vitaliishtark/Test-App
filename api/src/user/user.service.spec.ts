import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {
      id: 'user-1',
      name: 'John Doe',
      iban: 'DE1234567890',
      balance: 1000,
    };
    prismaService.user.create = jest.fn().mockResolvedValue(user);

    const createdUser = await service.createUser(
      'John Doe',
      'DE1234567890',
      1000,
    );
    expect(createdUser).toEqual(user);
  });

  it('should get user by IBAN', async () => {
    const user = {
      id: 'user-1',
      name: 'John Doe',
      iban: 'DE1234567890',
      balance: 1000,
    };
    prismaService.user.findUnique = jest.fn().mockResolvedValue(user);

    const foundUser = await service.getUserByIban('DE1234567890');
    expect(foundUser).toEqual(user);
  });
});
