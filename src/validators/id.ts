import { IsNotEmpty, IsNumber } from 'class-validator';

export class Id {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
