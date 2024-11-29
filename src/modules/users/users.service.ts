import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from '@/helpers/utils';
import { SortType } from './users.type';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    return user ? true : false;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    // Check email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại.`);
    }

    const passwordHashed = await hashPassword(password);
    const user = await this.userModel.create({
      name,
      email,
      password: passwordHashed,
    });
    return {
      _id: user._id
    }
  }

  async findAll(
    name: string,
    email: string,
    pageCurrent: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortType: SortType = SortType.DESC) {

    const filter = {
      ...(name && { name }),
      ...(email && { email }),
    };

    const totalUsers = await this.userModel.countDocuments(filter);
    const totalPage = Math.round(totalUsers / pageSize) + 1;
    const users = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip((pageCurrent - 1) * pageSize)
      .select("-password")
      .sort({
        [sortBy]: sortType
      })

    return {
      users,
      pageCurrent,
      pageSize,
      totalUsers,
      totalPage
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
