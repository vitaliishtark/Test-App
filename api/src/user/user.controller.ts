
import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async createUser(
    @Body()
    { name, iban, balance }: { name: string; iban: string; balance: number },
  ) {
    return this.userService.createUser(name, iban, balance);
  }

  @Get('')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('get-by-iban/:iban')
  async getUserByIban(@Param('iban') iban: string) {
    return this.userService.getUserByIban(iban);
  }

  @Post('login')
  async loginUser(@Body() { iban }: { iban: string }) {
    return this.userService.getUserByIban(iban);
  }
}
