export class CreateUserDto {
  name: string;
  email: string;
  umur?: number;
  tanggal_lahir?: string;
  status?: boolean;
  password: string;
}
