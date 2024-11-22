import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        status: "success",
        message: 'User has been created successfully.',
        payload: {
          data: user,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: 'Error creating user',
        error: error.message,
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: 'User has been retrieved successfully.',
        payload: {
          data: users,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: 'Error retrieving users',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: "error",
          message: 'User not found',
        });
      }
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: 'User has been retrieved successfully.',
        payload: {
          data: user,
        }
      });
    } catch (error) {
      return res.status(error.status).json({
        status: "error",
        message: 'Error retrieving user',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: 'User has been updated successfully.',
        payload: {
          data: updatedUser,
        }
      });
    } catch (error) {
      return res.status(error.status).json({
        status: "error",
        message: 'Error updating user',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result: any = await this.usersService.remove(id);
      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: "error",
          message: 'User not found or already deleted',
        });
      }
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: 'User has been deleted successfully.',
      });
    } catch (error) {
      return res.status(error.status).json({
        status: "error",
        message: 'Error deleting user',
        error: error.message,
      });
    }
  }

}
