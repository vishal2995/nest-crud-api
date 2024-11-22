import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import * as admin from 'firebase-admin';

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(require('../config/firebase-service-account.json')),
});

@Module({
  controllers: [UsersController],
  providers: [UsersService, {
    provide: 'FIREBASE_APP',
    useValue: firebaseApp,
  },],
  exports: ['FIREBASE_APP'],
})
export class UsersModule {}
