import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_APP') private readonly firebaseApp: admin.app.App) {
    this.firestore = this.firebaseApp.firestore();
  }

  async create(createUserDto: CreateUserDto) {
    const userRef = await this.firestore.collection('users').add(createUserDto);
    const userSnapshot = await this.firestore.collection('users').doc(userRef.id).get();

    const userData = userSnapshot.data();
    return {
      id: userRef.id,
      name: userData.name,
    };
  }

  async findAll(): Promise<any[]> {
    const snapshot = await this.firestore.collection('users').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(id: string): Promise<any> {
    const doc = await this.firestore.collection('users').doc(id).get();
    if (!doc.exists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { id: doc.id, ...doc.data() };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const doc = await this.firestore.collection('users').doc(id).get();
    if (!doc.exists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const plainUpdateData = JSON.parse(JSON.stringify(updateUserDto));

    await this.firestore.collection('users').doc(id).update(plainUpdateData);

    const userSnapshot = await this.firestore.collection('users').doc(id).get();

    const userData = userSnapshot.data();
    if (!userData) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      id: id,
      name: userData.name,
    };
  }

  async remove(id: string): Promise<any> {

    const doc = await this.firestore.collection('users').doc(id).get();
    if (!doc.exists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.firestore.collection('users').doc(id).delete();

    return { id };

  }
}
