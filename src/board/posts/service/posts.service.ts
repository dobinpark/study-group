import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '../repository/post.repository';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostRepository)
        private postRepository: PostRepository,
    ) { }

    async getPost(id: string) {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }
        return post;
    }

    async createPost(createPostDto: CreatePostDto) {
        const post = this.postRepository.create(createPostDto);
        return this.postRepository.save(post);
    }
}
