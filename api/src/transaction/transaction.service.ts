import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async deposit(userId: string, amount: number) {
    if (amount <= 0)
      throw new BadRequestException('Amount must be greater than zero');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const newBalance = user.balance + amount;

    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'deposit',
        amount,
        balance: newBalance,
      },
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
  }

  async withdraw(userId: string, amount: number) {
    if (amount <= 0)
      throw new BadRequestException('Amount must be greater than zero');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    if (user.balance < amount)
      throw new BadRequestException('Insufficient balance');

    const newBalance = user.balance - amount;

    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'withdrawal',
        amount: -amount,
        balance: newBalance,
      },
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
  }

  async transfer(senderId: string, receiverIban: string, amount: number) {
    if (amount <= 0)
      throw new BadRequestException('Amount must be greater than zero');
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(receiverIban)) {
      throw new BadRequestException('Invalid IBAN format');
    }

    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
    });
    if (!sender) throw new BadRequestException('Sender not found');
    if (sender.balance < amount)
      throw new BadRequestException('Insufficient balance');

    const receiver = await this.prisma.user.findUnique({
      where: { iban: receiverIban },
    });
    if (!receiver) throw new BadRequestException('Receiver not found');
    if (sender.id === receiver.id) {
      throw new BadRequestException('You cannot send money to your own IBAN');
    }

    const senderNewBalance = sender.balance - amount;
    const receiverNewBalance = receiver.balance + amount;

    await this.prisma.transaction.createMany({
      data: [
        {
          userId: senderId,
          type: 'transfer',
          amount: -amount,
          balance: senderNewBalance,
        },
        {
          userId: receiver.id,
          type: 'transfer',
          amount,
          balance: receiverNewBalance,
        },
      ],
    });

    await this.prisma.user.update({
      where: { id: senderId },
      data: { balance: senderNewBalance },
    });

    await this.prisma.user.update({
      where: { id: receiver.id },
      data: { balance: receiverNewBalance },
    });
  }

  async getStatement(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return transactions;
  }
}
