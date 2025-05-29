import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CheckUrlDto {
    @IsString()
    @IsUrl()
    @IsNotEmpty()
    url: string;
}
