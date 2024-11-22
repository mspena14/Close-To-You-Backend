import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAllUsers();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() reqWithUser: RequestWithUser) {
    return this.usersService.updateUser(id, updateUserDto, reqWithUser.user.user_id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() reqWithUser: RequestWithUser) {
    return this.usersService.removeUser(id, reqWithUser.user.user_id);
  }
}
