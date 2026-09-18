import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Business, BusinessDocument } from '../../database/schemas/business.schema';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) {}

  async findAll(category?: string, capitalBand?: string): Promise<Business[]> {
    const filter: any = {};
    if (category) filter.category = category;
    if (capitalBand) filter.capitalBand = capitalBand;
    return this.businessModel.find(filter).exec();
  }

  async findBySlug(slug: string): Promise<Business> {
    const biz = await this.businessModel.findOne({ slug }).exec();
    if (!biz) {
      throw new NotFoundException(`Business with slug '${slug}' not found`);
    }
    return biz;
  }

  async getCategories(): Promise<string[]> {
    return this.businessModel.distinct('category').exec();
  }
}
