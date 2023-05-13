import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entity/post.entity';
import { PostDto } from '../dto/post.dto';
import { unixTime } from 'src/utils/date';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  getPosts(): Promise<Array<Post>> {
    return this.postRepository.find({ where: { isDeleted: false } });
  }

  getPost(id: number): Promise<Post> {
    return this.postRepository.findOneBy({ id, isDeleted: false });
  }

  createPost(createPostDto: PostDto): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      createdAt: unixTime,
    });
    return this.postRepository.save(post);
  }

  async deletePost(id: number, postDetails: Post): Promise<void> {
    await this.postRepository.update(
      { id },
      { ...postDetails, isDeleted: true },
    );
  }
}
