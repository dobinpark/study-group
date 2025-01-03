/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileUploadService } from '../common/services/file-upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private fileUploadService: FileUploadService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['posts', 'followers', 'following'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const { password, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    Object.assign(user, updateProfileDto);
    await this.usersRepository.save(user);

    const { password, ...updatedProfile } = user;
    return updatedProfile;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 기존 아바타 파일 삭제
    if (user.avatarUrl) {
      await this.fileUploadService.deleteFile(user.avatarUrl);
    }

    // 새 아바타 파일 저장
    const fileName = await this.fileUploadService.saveFile(file);
    user.avatarUrl = fileName;
    await this.usersRepository.save(user);

    return { avatarUrl: fileName };
  }

  async getDashboardStats(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['posts', 'comments', 'likes'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      totalPosts: user.posts?.length || 0,
      totalComments: user.comments?.length || 0,
      totalLikes: user.likes?.length || 0,
      recentActivities: [], // TODO: 최근 활동 내역 구현
    };
  }
}
