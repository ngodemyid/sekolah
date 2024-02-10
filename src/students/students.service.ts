import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DeleteResult, Like, Repository } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
  ) {}
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const { classId } = createStudentDto;
    const studentClass = await this.classRepository.findOneBy({ id: classId });
    const newStudent = this.studentRepository.create({
      ...createStudentDto,
      class: studentClass,
    });

    return await this.studentRepository.save(newStudent);
  }

  findOne(id: number): Promise<Student | null> {
    return this.studentRepository.findOne({
      where: { id },
      relations: ['class'],
    });
  }

  async findStudents(filterData?: {
    classId?: number;
    name?: string;
    email?: string;
  }) {
    if (!filterData) {
      return await this.studentRepository.find();
    }
    const { classId, name, email } = filterData;
    const query = this.studentRepository.createQueryBuilder('student');
    if (classId) {
      query.andWhere('student.classId = :classId', { classId });
    }
    if (name) {
      query.andWhere('lower(student.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }
    if (email) {
      query.andWhere('lower(student.email) LIKE :email', {
        email: `%${email.toLowerCase()}%`,
      });
    }
    return await query.getMany();
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.studentRepository.findOneBy({ id });
    const studentUpdate = { ...student, ...updateStudentDto };
    return await this.studentRepository.save(studentUpdate);
  }

  async remove(id: number): Promise<Student> {
    const result = await this.studentRepository.findOneBy({ id });
    this.studentRepository.delete(id);
    return result;
  }
}
