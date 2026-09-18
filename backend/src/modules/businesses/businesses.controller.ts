import { Controller, Get, Param, Query } from '@nestjs/common';
import { BusinessesService } from './businesses.service';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('capitalBand') capitalBand?: string,
  ) {
    return this.businessesService.findAll(category, capitalBand);
  }

  @Get('categories')
  async getCategories() {
    return this.businessesService.getCategories();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.businessesService.findBySlug(slug);
  }
}
