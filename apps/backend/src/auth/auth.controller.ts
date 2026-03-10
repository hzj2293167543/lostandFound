import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RegisterDtoSchema, LoginDtoSchema } from '@lostfound/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    const validatedDto = RegisterDtoSchema.safeParse(dto);
    if (!validatedDto.success) {
      throw new BadRequestException(validatedDto.error.issues);
    }
    return this.authService.register(
      validatedDto.data.name,
      validatedDto.data.email,
      validatedDto.data.password
    );
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    const validatedDto = LoginDtoSchema.safeParse(dto);
    if (!validatedDto.success) {
      throw new BadRequestException(validatedDto.error.issues);
    }
    return this.authService.login(validatedDto.data);
  }
}
