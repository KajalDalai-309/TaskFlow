import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Organization } from './modules/organization/organization.entity';
import { User } from './modules/users/user.entity';
import { Role } from './modules/roles/role.entity';
import { UserRole } from './modules/userRoles/user-role.entity';
import { UserStatus } from './common/enums/user-status.enum';

@Controller()
export class AppController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  findAll(): string {
    return 'Welcome to TaskFlow Management API 🚀';
  }

  @Get('seed')
  async seedAdmin() {
    try {
      const orgRepo = this.dataSource.getRepository(Organization);
      const userRepo = this.dataSource.getRepository(User);
      const roleRepo = this.dataSource.getRepository(Role);
      const userRoleRepo = this.dataSource.getRepository(UserRole);

      // 1. Organization
      let organization = await orgRepo.findOne({
        where: { name: 'Default Organization' },
      });
      if (!organization) {
        organization = orgRepo.create({ name: 'Default Organization' });
        await orgRepo.save(organization);
      }

      // 2. Admin Role
      let adminRole = await roleRepo.findOne({
        where: { key: 'ADMIN', organizationId: organization.id },
      });
      if (!adminRole) {
        adminRole = roleRepo.create({
          key: 'ADMIN',
          name: 'Administrator',
          isSystemRole: true,
          organizationId: organization.id,
        });
        await roleRepo.save(adminRole);
      }

      // 3. Admin User: kajal2005dalai@gmail.com / Kajal@123
      const adminEmail = 'kajal2005dalai@gmail.com';
      const adminPassword = 'Kajal@123';
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      let adminUser = await userRepo.findOne({
        where: { email: adminEmail },
      });

      if (!adminUser) {
        adminUser = userRepo.create({
          email: adminEmail,
          passwordHash,
          status: UserStatus.ACTIVE,
          organizationId: organization.id,
        });
        await userRepo.save(adminUser);
      } else {
        adminUser.passwordHash = passwordHash;
        adminUser.status = UserStatus.ACTIVE;
        await userRepo.save(adminUser);
      }

      // 4. Assign Role
      let userRole = await userRoleRepo.findOne({
        where: { userId: adminUser.id, roleId: adminRole.id },
      });
      if (!userRole) {
        userRole = userRoleRepo.create({
          userId: adminUser.id,
          roleId: adminRole.id,
          organizationId: organization.id,
          assignedBy: adminUser.id,
        });
        await userRoleRepo.save(userRole);
      }

      return {
        success: true,
        message: 'Admin account created/updated successfully!',
        email: adminEmail,
        status: adminUser.status,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
