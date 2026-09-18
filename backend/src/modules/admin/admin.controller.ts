import { Controller, Get, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('applicants')
  async getApplicants() {
    return this.adminService.getAllApplicants();
  }

  @Get('applications')
  async getApplications() {
    return this.adminService.getAllApplications();
  }

  @Get('applications/:id')
  async getApplicationDetails(@Param('id') id: string) {
    return this.adminService.getApplicationDetails(id);
  }

  @Get('journeys')
  async getJourneys() {
    return this.adminService.getAllJourneys();
  }

  @Get('grow-intakes')
  async getGrowIntakes() {
    return this.adminService.getGrowIntakes();
  }
}
