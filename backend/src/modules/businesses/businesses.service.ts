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

  async findBySlug(rawSlug: string): Promise<Business> {
    if (!rawSlug) {
      throw new NotFoundException('Business slug is required');
    }

    const decoded = decodeURIComponent(rawSlug).trim();

    // 1. Try exact match first
    let biz = await this.businessModel.findOne({ slug: decoded }).exec();
    if (biz) return biz;

    // 2. Try normalized slug with hyphens (e.g. "virtual assistant services" -> "virtual-assistant-services")
    const hyphenated = decoded
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    biz = await this.businessModel.findOne({ slug: hyphenated }).exec();
    if (biz) return biz;

    // 3. Try case-insensitive slug match
    biz = await this.businessModel.findOne({
      slug: { $regex: new RegExp(`^${hyphenated}$`, 'i') }
    }).exec();
    if (biz) return biz;

    // 4. Try matching by business name (case-insensitive)
    const nameSearch = decoded.replace(/-/g, ' ');
    biz = await this.businessModel.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${nameSearch}$`, 'i') } },
        { name: { $regex: new RegExp(decoded, 'i') } },
        { nameSw: { $regex: new RegExp(decoded, 'i') } }
      ]
    }).exec();
    if (biz) return biz;

    throw new NotFoundException(`Business with slug '${rawSlug}' not found`);
  }

  async getCategories(): Promise<string[]> {
    return this.businessModel.distinct('category').exec();
  }
}
