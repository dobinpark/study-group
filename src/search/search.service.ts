import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async search(query: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, usersCount] = await this.usersRepository.findAndCount({
      where: [{ username: Like(`%${query}%`) }, { bio: Like(`%${query}%`) }],
      skip,
      take: limit,
    });

    const [posts, postsCount] = await this.postsRepository.findAndCount({
      where: [{ title: Like(`%${query}%`) }, { content: Like(`%${query}%`) }],
      relations: ['author'],
      skip,
      take: limit,
    });

    return {
      results: [
        ...users.map((user) => ({
          id: user.id,
          type: 'user',
          title: user.username,
          description: user.bio || '',
          createdAt: user.createdAt,
          url: `/profile/${user.id}`,
        })),
        ...posts.map((post) => ({
          id: post.id,
          type: 'post',
          title: post.title,
          description: post.content,
          createdAt: post.createdAt,
          url: `/posts/${post.id}`,
        })),
      ],
      pagination: {
        total: usersCount + postsCount,
        page,
        limit,
        totalPages: Math.ceil((usersCount + postsCount) / limit),
      },
    };
  }
}
