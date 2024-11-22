import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userCreated = await this.usersRepository.create(createUserDto);
    
    if (!userCreated) throw new BadRequestException('There was an error creating the user');
    return await this.usersRepository.save(userCreated);
  }

  // async findAllUsers(): Promise<User[]> {
  //   const usersFound = await this.usersRepository.find();
  //   if (usersFound.length === 0) throw new NotFoundException('There are no users')
  //   return usersFound;
  // }

  async findOneById(id: string): Promise<User | null> {
    const userFound = await this.usersRepository.findOne({where: {id}})
    return userFound || null
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const userFound = await this.usersRepository.findOne({ where: { email } });

    return userFound || null;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, userId: string): Promise<User> {

    if (id !== userId) throw new UnauthorizedException()

    const userFound = await this.findOneById(id);
    if (!userFound) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    const userUpdated = Object.assign(userFound, updateUserDto);

    return await this.usersRepository.save(userUpdated);
  }

  async removeUser(id: string, userId: string): Promise<User> {
    if (id !== userId) throw new UnauthorizedException()

    const userFound = await this.findOneById(id);
    if (!userFound) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    await this.usersRepository.softRemove(userFound);
    return userFound;
  }
}
