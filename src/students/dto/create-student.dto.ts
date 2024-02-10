import { Class } from 'src/classes/entities/class.entity';

export class CreateStudentDto {
  name: string;
  email: string;
  classId?: number;
  class?: Class;
}
