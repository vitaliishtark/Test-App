import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            transaction: {
              create: jest.fn(),
              createMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should deposit money', async () => {
    const user = { id: 'user-1', balance: 500 };
    prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
    prismaService.user.update = jest
      .fn()
      .mockResolvedValue({ ...user, balance: 600 });

    const transaction = await service.deposit('user-1', 100);
    expect(transaction.balance).toBe(600);
  });

  it('should withdraw money', async () => {
    const user = { id: 'user-1', balance: 500 };
    prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
    prismaService.user.update = jest
      .fn()
      .mockResolvedValue({ ...user, balance: 400 });

    const transaction = await service.withdraw('user-1', 100);
    expect(transaction.balance).toBe(400);
  });

  it('should throw error when transferring to own IBAN', async () => {
    const sender = { id: 'user-1', iban: 'DE1234567890', balance: 500 };
    const receiver = { id: 'user-1', iban: 'DE1234567890', balance: 500 };

    prismaService.user.findUnique = jest
      .fn()
      .mockImplementationOnce(() => sender)
      .mockImplementationOnce(() => receiver);

    await expect(
      service.transfer(sender.id, receiver.iban, 100),
    ).rejects.toThrowError(
      new BadRequestException('You cannot send money to your own IBAN'),
    );
  });

  it('should transfer money', async () => {
    const sender = { id: 'user-1', iban: 'DE1234567890', balance: 500 };
    const receiver = { id: 'user-2', iban: 'DE0987654321', balance: 1000 };

    prismaService.user.findUnique = jest
      .fn()
      .mockImplementationOnce(() => sender)
      .mockImplementationOnce(() => receiver);
    prismaService.user.update = jest
      .fn()
      .mockResolvedValueOnce({ ...sender, balance: 400 })
      .mockResolvedValueOnce({ ...receiver, balance: 1100 });
    prismaService.transaction.createMany = jest.fn().mockResolvedValue([]);

    await service.transfer(sender.id, receiver.iban, 100);

    expect(prismaService.user.update).toHaveBeenCalledTimes(2);
    expect(prismaService.transaction.createMany).toHaveBeenCalledTimes(1);
  });
});
