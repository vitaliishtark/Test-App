import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('deposit')
  async deposit(
    @Body() { userId, amount }: { userId: string; amount: number },
  ) {
    return this.transactionService.deposit(userId, amount);
  }

  @Post('withdraw')
  async withdraw(
    @Body() { userId, amount }: { userId: string; amount: number },
  ) {
    return this.transactionService.withdraw(userId, amount);
  }

  @Post('transfer')
  async transfer(
    @Body()
    {
      senderId,
      receiverIban,
      amount,
    }: {
      senderId: string;
      receiverIban: string;
      amount: number;
    },
  ) {
    return this.transactionService.transfer(senderId, receiverIban, amount);
  }

  @Get('statement/:userId')
  async statement(@Param('userId') userId: string) {
    return this.transactionService.getStatement(userId);
  }
}
