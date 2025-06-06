import { IsString, Matches } from 'class-validator';

export class CreateSchedulerConfigDto {
  @IsString()
  @Matches(/^(\*|([0-9]|[1-5][0-9]))(\s+(\*|([0-9]|1[0-9]|2[0-3]))){1}(\s+(\*|([1-9]|[1-2][0-9]|3[0-1]))){1}(\s+(\*|([1-9]|1[0-2]))){1}(\s+(\*|([0-6]))){1}$/, {
    message: 'Invalid cron expression format',
  })
  cronExpr: string;
}