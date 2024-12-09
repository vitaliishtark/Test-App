import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

const mockTransactionService = {
  deposit: jest.fn(),
  withdraw: jest.fn(),
  transfer: jest.fn(),
  getStatement: jest.fn(),
};

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call deposit method of transactionService', async () => {
    const depositData = { userId: 'user-1', amount: 100 };
    mockTransactionService.deposit.mockResolvedValue({ balance: 600 });

    const result = await controller.deposit(depositData);
    expect(result.balance).toBe(600);
    expect(mockTransactionService.deposit).toHaveBeenCalledWith(
      depositData.userId,
      depositData.amount,
    );
  });

  it('should call withdraw method of transactionService', async () => {
    const withdrawData = { userId: 'user-1', amount: 100 };
    mockTransactionService.withdraw.mockResolvedValue({ balance: 400 });

    const result = await controller.withdraw(withdrawData);
    expect(result.balance).toBe(400);
    expect(mockTransactionService.withdraw).toHaveBeenCalledWith(
      withdrawData.userId,
      withdrawData.amount,
    );
  });

  it('should call transfer method of transactionService', async () => {
    const transferData = {
      senderId: 'user-1',
      receiverIban: 'DE1234567890',
      amount: 100,
    };

    mockTransactionService.transfer.mockResolvedValue(undefined);

    const result = await controller.transfer(transferData);

    expect(mockTransactionService.transfer).toHaveBeenCalledWith(
      transferData.senderId,
      transferData.receiverIban,
      transferData.amount,
    );
  });

  it('should call statement method of transactionService', async () => {
    const userId = 'user-1';
    mockTransactionService.getStatement.mockResolvedValue([
      { transactionId: '1', amount: 100 },
    ]);

    const result = await controller.statement(userId);
    expect(result).toEqual([{ transactionId: '1', amount: 100 }]);
    expect(mockTransactionService.getStatement).toHaveBeenCalledWith(userId);
  });
});
