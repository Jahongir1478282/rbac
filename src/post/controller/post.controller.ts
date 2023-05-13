/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { Roles } from 'src/auth/decorator/roles.decorator';
import { date } from 'src/utils/date';
import { encryptPassword } from 'src/utils/bcrypt';
import { PostService } from '../service/post.service';
import { PostDto } from '../dto/post.dto';
import { Role } from 'src/user/entity/user.entity';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @Roles([
    Role.Student,
    Role.Lecturer,
    Role.Author,
    Role.Staff,
    Role.Superadmin,
  ])
  async getPosts() {
    const posts = await this.postService.getPosts();
    const result = posts.map((item) => {
      const { createdAt, updatedAt, ...result } = item;
      return {
        ...result,
        createdAt: date(createdAt),
        updatedAt: updatedAt ? date(updatedAt) : null,
      };
    });
    return result;
  }

  @Roles([
    Role.Student,
    Role.Lecturer,
    Role.Author,
    Role.Staff,
    Role.Superadmin,
  ])
  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.getPost(id);
    if (!post) {
      throw new NotFoundException();
    }
    const { createdAt, updatedAt, ...result } = post;
    return {
      ...result,
      createdAt: date(createdAt),
      updatedAt: updatedAt ? date(updatedAt) : null,
    };
  }

  @Post('')
  @Roles([Role.Lecturer, Role.Author, Role.Staff, Role.Superadmin])
  async createPost(@Body() createPostDto: PostDto) {
    await this.postService.createPost(createPostDto);
  }

  @Delete(':id')
  @Roles([Role.Author, Role.Staff, Role.Superadmin])
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.getPost(id);

    if (!post) {
      throw new NotFoundException();
    }

    await this.postService.deletePost(id, post);
  }
}
