import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AddAffiliateProductDto,
  FilterAndPaginationAffiliateProductDto,
  GetAffiliateProductByIdsDto,
  UpdateAffiliateProductDto,
} from './dto/affiliate-product.dto';
import { AffiliateProduct } from './interfaces/affiliate-product.interface';
import { Affiliate } from 'src/pages/affiliate/interfaces/affiliate.interface';
import { UtilsService } from 'src/shared/utils/utils.service';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { Shop } from '../shop/interfaces/shop.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class AffiliateProductService {
  private logger = new Logger(AffiliateProductService.name);

  constructor(
    @InjectModel('AffiliateProduct')
    private readonly affiliateProductModel: Model<AffiliateProduct>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
    @InjectModel('Affiliate') private readonly affiliateModel: Model<Affiliate>,
    private utilsService: UtilsService,
  ) {}

  /**
   * addAffiliateProduct()
   * getAllAffiliateProductByShop()
   * getAffiliateProductById()
   * getAllAffiliateProducts()
   * getAffiliateProductBySlug()
   * getAffiliateProductByIds()
   * updateAffiliateProductById()
   * updateMultipleAffiliateProductById()
   * updateMultipleAffiliateAffiliateProductById()
   * deleteMultipleTrashAffiliateProduct()
   * deleteMultipleAffiliateProductByIdByAffiliate()
   * deleteMultipleAffiliateProductById()
   */
  async addAffiliateProduct(
    affiliate: Affiliate,
    addAffiliateProductDto: AddAffiliateProductDto,
  ): Promise<ResponsePayload> {
    try {
      const { quantity, name, shop,url } = addAffiliateProductDto;

      const fSlug = this.utilsService.transformToSlug(name);
      const fData = await this.affiliateProductModel.exists({ slug: fSlug });

      const finalSlug = fData
        ? this.utilsService.transformToSlug(name, true)
        : fSlug;

      if (url) {
        const isExists = await this.affiliateProductModel.exists({
          url: url,
        });
        if (isExists) {
          return {
            success: false,
            message: 'Sorry! Url not unique.',
          } as ResponsePayload;
        }
      }

      const defaultData = {
        slug: finalSlug,
        quantity: quantity ? quantity : 0,
        dateString: this.utilsService.getDateString(new Date()),
      };

      const finalData = {
        ...addAffiliateProductDto,
        ...defaultData,
      };

      const saveData = await this.affiliateProductModel.create(finalData);
      const data = {
        _id: saveData._id,
      };

      return {
        success: true,
        message: 'Success! AffiliateProduct added successfully.',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAffiliateProductByShop(
    shop: string,
    filterAffiliateProductDto: FilterAndPaginationAffiliateProductDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    try {
      if (!shop) {
        return {
          success: false,
          message: 'Sorry! no data found.',
        } as ResponsePayload;
      }

      // Modify Filter
      const { filter } = filterAffiliateProductDto;
      filterAffiliateProductDto.filter = {
        ...filter,
        ...{ ownerId: shop, ownerType: 'shop' },
      };

      return this.getAllAffiliateProducts(
        filterAffiliateProductDto,
        searchQuery,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAffiliateProductById(
    affiliate: Affiliate,
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.affiliateProductModel.findOne({ _id: id });

      return {
        success: true,
        message: 'Success! Data fetch successfully.',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllAffiliateProducts(
    filterAffiliateProductDto: FilterAndPaginationAffiliateProductDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterAffiliateProductDto;
    const { pagination } = filterAffiliateProductDto;
    const { sort } = filterAffiliateProductDto;
    const { select } = filterAffiliateProductDto;
    const { filterGroup } = filterAffiliateProductDto;

    // Aggregate Stages
    const aggregateStages = [];
    const aggregateCategoryGroupStages = [];
    const aggregateBrandGroupStages = [];
    const aggregateSubCategoryGroupStages = [];

    // Essential Variables
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      if (filter['category._id']) {
        filter['category._id'] = new ObjectId(filter['category._id']);
      }

      if (filter['subCategory._id']) {
        filter['subCategory._id'] = new ObjectId(filter['subCategory._id']);
      }

      if (filter['brand._id']) {
        filter['brand._id'] = new ObjectId(filter['brand._id']);
      }

      if (filter['tags']) {
        filter['tags'] = new ObjectId(filter['tags']);
      }

      if (filter['shop']) {
        filter['shop'] = new ObjectId(filter['shop']);
      }
      if (filter['ownerId']) {
        filter['ownerId'] = new ObjectId(filter['ownerId']);
      }
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      // const mSearchQuery = searchQuery.replace(/[^a-zA-Z0-9 ]/g, '');

      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { name: this.utilsService.createRegexFromString(searchQuery) },
              // { name: { $regex: mSearchQuery, $options: 'i' } },
            ],
          },
        ],
      };
    }
    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      mSelect = { ...select };
    } else {
      mSelect = { name: 1 };
    }

    // GROUPING FOR FILTER PRODUCTS
    let groupCategory: any;
    let groupBrand: any;
    let groupSubCategory: any;

    if (filterGroup && filterGroup.isGroup) {
      if (filterGroup.category) {
        groupCategory = {
          $group: {
            _id: { category: '$category._id' },
            name: { $first: '$category.name' },
            slug: { $first: '$category.slug' },
            total: { $sum: 1 },
          },
        };
      }

      if (filterGroup.brand) {
        groupBrand = {
          $group: {
            _id: { brand: '$brand._id' },
            name: { $first: '$brand.name' },
            slug: { $first: '$brand.slug' },
            total: { $sum: 1 },
          },
        };
      }

      if (filterGroup.subCategory) {
        groupSubCategory = {
          $group: {
            _id: { subCategory: '$subCategory._id' },
            name: { $first: '$subCategory.name' },
            slug: { $first: '$subCategory.slug' },
            total: { $sum: 1 },
          },
        };
      }
    }

    // Search A-Z
    if (searchQuery) {
      aggregateStages.push({
        $addFields: {
          sortBySearch: {
            $indexOfCP: ['$name', searchQuery.toLowerCase()],
          },
        },
      });
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      // Main
      aggregateStages.push({ $match: mFilter });

      // Category Groups
      if (groupCategory) {
        // aggregateCategoryGroupStages.push({ $match: mFilter });
        aggregateCategoryGroupStages.push(groupCategory);
      }

      // Sub Category Groups
      if (groupSubCategory) {
        // aggregateSubCategoryGroupStages.push({ $match: mFilter });
        aggregateSubCategoryGroupStages.push(groupSubCategory);
      }

      // Brand Groups
      if (groupBrand) {
        // aggregateBrandGroupStages.push({ $match: mFilter });
        aggregateBrandGroupStages.push(groupBrand);
      }
    } else {
      if (groupCategory) {
        aggregateCategoryGroupStages.push(groupCategory);
      }
      if (groupSubCategory) {
        aggregateSubCategoryGroupStages.push(groupSubCategory);
      }
      if (groupBrand) {
        aggregateBrandGroupStages.push(groupBrand);
      }
    }

    if (Object.keys(mSort).length) {
      aggregateStages.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateStages.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      if (Object.keys(mSelect).length) {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: mSelect },
            ],
          },
        };
      } else {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
            ],
          },
        };
      }

      aggregateStages.push(mPagination);

      aggregateStages.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      // Main
      const dataAggregates = await this.affiliateProductModel.aggregate(
        aggregateStages,
        { allowDiskUse: true },
      );

      // GROUP FILTER PRODUCTS DATA
      let categoryAggregates: any;
      let subCategoryAggregates: any;
      let brandAggregates: any;
      // Category
      if (filterGroup && filterGroup.isGroup && filterGroup.category) {
        categoryAggregates = await this.affiliateProductModel.aggregate(
          aggregateCategoryGroupStages,
          { allowDiskUse: true },
        );
      }

      // Sub Category
      if (filterGroup && filterGroup.isGroup && filterGroup.subCategory) {
        subCategoryAggregates = await this.affiliateProductModel.aggregate(
          aggregateSubCategoryGroupStages,
          { allowDiskUse: true },
        );
      }

      // Brand
      if (filterGroup && filterGroup.isGroup && filterGroup.brand) {
        brandAggregates = await this.affiliateProductModel.aggregate(
          aggregateBrandGroupStages,
          { allowDiskUse: true },
        );
      }

      // Main Filter Data
      let allFilterGroups: any;
      if (filterGroup && filterGroup.isGroup) {
        allFilterGroups = {
          categories:
            categoryAggregates && categoryAggregates.length
              ? categoryAggregates
              : [],
          subCategories:
            subCategoryAggregates && subCategoryAggregates.length
              ? subCategoryAggregates
              : [],
          brands:
            brandAggregates && brandAggregates.length ? brandAggregates : [],
        };
      } else {
        allFilterGroups = null;
      }

      if (pagination) {
        if (
          pagination.currentPage < 1 &&
          filter == null &&
          JSON.stringify(sort) == JSON.stringify({ createdAt: -1 })
        ) {
        }

        return {
          ...{ ...dataAggregates[0] },
          ...{
            success: true,
            message: 'Success',
            filterGroup: allFilterGroups,
          },
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
          filterGroup: allFilterGroups,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getAffiliateProductBySlug(
    shop: string,
    slug: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.affiliateProductModel
        .findOne({ slug: slug })
        .select(select);

      // Increment view count
      if (data) {
        await this.affiliateProductModel.findByIdAndUpdate(data._id, {
          $inc: {
            totalView: 1,
          },
        });
      }

      return {
        success: true,
        message: 'Success! data fetch successfully.',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAffiliateProductByIds(
    shop: string,
    getAffiliateProductByIdsDto: GetAffiliateProductByIdsDto,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const mIds = getAffiliateProductByIdsDto.ids.map((m) => new ObjectId(m));
      const data = await this.affiliateProductModel
        .find({ _id: mIds })
        .select(select);

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * updateAffiliateProductById
   * updateMultipleAffiliateProductById
   */
  async updateAffiliateProductById(
    affiliate: Affiliate,
    id: string,
    updateAffiliateProductDto: UpdateAffiliateProductDto,
  ): Promise<ResponsePayload> {
    try {
      const { name, url } = updateAffiliateProductDto;

      let finalSlug: string;
      const fData: any = await this.affiliateProductModel.findOne({ _id: id });

      // Check Slug
      if (fData?.name.trim() !== name.trim()) {
        const newSlug = this.utilsService.transformToSlug(name);

        const isExists = await this.affiliateProductModel.exists({
          slug: newSlug,
        });
        if (isExists) {
          finalSlug = this.utilsService.transformToSlug(name, true);
        } else {
          finalSlug = newSlug;
        }
      } else {
        finalSlug = fData.slug;
      }

      if (updateAffiliateProductDto.url !== fData.url) {
        const isExists = await this.affiliateProductModel.exists({
          url: url,
        });
        if (isExists) {
          return {
            success: false,
            message: 'Sorry! Url not unique.',
          } as ResponsePayload;
        }
      }

      const finalData = {
        ...updateAffiliateProductDto,
        ...{
          slug: finalSlug,
        },
      };

      await this.affiliateProductModel.findByIdAndUpdate(id, {
        $set: finalData,
      });

      return {
        success: true,
        message: 'Success! data updated successfully.',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleAffiliateProductById(
    affiliate: Affiliate,
    ids: string[],
    updateAffiliateProductDto: UpdateAffiliateProductDto,
  ): Promise<ResponsePayload> {
    try {
      if (ids && ids.length) {
        const mIds = ids.map((m) => new ObjectId(m));

        // Delete No Multiple Action Data
        if (updateAffiliateProductDto.slug) {
          delete updateAffiliateProductDto.slug;
        }
        await this.affiliateProductModel.updateMany(
          { _id: { $in: mIds } },
          { $set: updateAffiliateProductDto },
        );

        return {
          success: true,
          message: 'Success! multiple data updated successfully',
        } as ResponsePayload;
      } else {
        return {
          success: true,
          message: 'Sorry! no id found',
        } as ResponsePayload;
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleTrashAffiliateProduct(
    affiliate: Affiliate,
    shop: string,
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      await this.affiliateProductModel.deleteMany({
        _id: ids,
        status: 'trash',
      });
      return {
        success: true,
        message: 'Success! AffiliateProduct permanently deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleAffiliateProductByIdByAffiliate(
    affiliate: Affiliate,
    shop: string,
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      await this.affiliateProductModel.updateMany(
        { _id: ids },
        {
          $set: {
            status: 'trash',
            deleteDateString: this.utilsService.getDateString(new Date()),
          },
        },
      );
      return {
        success: true,
        message: 'Success! AffiliateProduct deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleAffiliateProductById(
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      await this.affiliateProductModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
