import { TokenDto } from './TokenDto';

export interface AuthResponseDto {
  isSuccess: boolean;
  message?: string;
  errors?: string[];
  token?: TokenDto;
}
