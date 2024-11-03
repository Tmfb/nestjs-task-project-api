import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
  @ApiProperty({
    example: "DemoUser",
    description: "An username from 4 to 20 characters long",
    type: "string",
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: "DemoPassw0rd!",
    description: "Password from 8 to 32 characters long containing at least one upper case letter, at least one lower case letter and at least one digit/special character",
    type: "string",
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password is to weak",
  })
  password: string;
}
