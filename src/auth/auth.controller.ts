import { Controller } from "@nestjs/common";
import { Body } from "@nestjs/common/decorators";
import { Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller("auth")
@ApiResponse({ status: 400, description: "Bad request" })
@ApiResponse({ status: 404, description: "Not found" })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  @ApiOperation({
    summary: "Registers an user if username is not taken already",
  })
  @ApiResponse({
    status: 201,
    description: "Username registered",
  })
  singUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.singUp(authCredentialsDto);
  }

  @Post("/signin")
  @ApiOperation({
    summary: "Sign into an account if username and password are correct, returning a JWT token",
  })
  @ApiResponse({
    status: 201,
    description: "Logging  succesful",
  })
  @Post("/signin")
  singIn(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(authCredentialsDto);
  }
}
