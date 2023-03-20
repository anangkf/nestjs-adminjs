import { AdminModule } from '@adminjs/nestjs';
import { Module } from '@nestjs/common';
import * as AdminJSPrisma from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma.service';
import { DMMFClass } from '@prisma/client/runtime';

// register prisma adapter
AdminJS.registerAdapter(AdminJSPrisma);

const DEFAULT_ADMIN = {
  email: 'admin@borneo.biz.id',
  password: 'admin123',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    ProductModule,
    AdminModule.createAdminAsync({
      useFactory: () => {
        const prisma = new PrismaService();
        const dmmf = (prisma as any)._baseDmmf as DMMFClass;
        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: { model: dmmf.modelMap.Product, client: prisma },
                options: {},
              },
            ],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
