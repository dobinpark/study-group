import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    validateSync,
} from 'class-validator';
import { plainToClass } from 'class-transformer';

export class EnvironmentVariables {
    @IsString()
    @IsNotEmpty()
    DB_HOST!: string;

    @IsNumber()
    @IsNotEmpty()
    DB_PORT!: number;

    @IsString()
    @IsNotEmpty()
    DB_USERNAME!: string;

    @IsString()
    @IsNotEmpty()
    DB_PASSWORD!: string;

    @IsString()
    @IsNotEmpty()
    DB_DATABASE!: string;

    @IsString()
    @IsNotEmpty()
    JWT_SECRET!: string;

    @IsNumber()
    @IsOptional()
    PORT: number = 3000;

    @IsString()
    @IsNotEmpty()
    UPLOAD_DIR: string = 'uploads';

    @IsNumber()
    @IsOptional()
    MAX_FILE_SIZE: number = 5 * 1024 * 1024;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
