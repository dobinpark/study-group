/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { FileUploadService } from '../../../common/services/file-upload.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private fileUploadService: FileUploadService,
  ) { }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['posts'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const { password, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    Object.assign(user, updateProfileDto);
    await this.userRepository.save(user);

    const { password, ...updatedProfile } = user;
    return updatedProfile;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
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
    await this.userRepository.save(user);

    return { avatarUrl: fileName };
  }
}
