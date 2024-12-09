import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(name: string, iban: string, balance: number) {
    return this.prisma.user.create({
      data: {
        name,
        iban,
        balance,
      },
    });
  }

  async getUserByIban(iban: string) {
    const user = await this.prisma.user.findUnique({
      where: { iban },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' }, 
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User with this IBAN not found');
    }

    return {
      user,
      transactions: user.transactions,
    };
  }

  async loginUser(iban: string) {
    const user = await this.prisma.user.findUnique({ where: { iban } });
    if (!user) {
      throw new NotFoundException('Invalid IBAN or user not found');
    }
    return user;
  }
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
