import {IsNotEmpty, IsString} from "class-validator";

export class GenerateRecommendationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    problemDesc: string;
}