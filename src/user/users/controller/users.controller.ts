import {
    Controller,
    Get,
    Put,
    Post,
    UseGuards,
    Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UsersService } from '../service/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { FindPasswordDto } from '../dto/find-password.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@GetUser() user: User) {
        return this.usersService.getUserProfile(user.username);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/profile')
    updateProfile(
        @GetUser() user: User,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.updateUserProfile(user.username, updateUserDto);
    }

    @Post('find-password')
    async findPassword(@Body() findPasswordDto: FindPasswordDto) {
        return this.usersService.findPassword(findPasswordDto);
    }
}
