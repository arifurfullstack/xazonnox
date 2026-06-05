import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AddOfferPageDto,
  FilterAndPaginationOfferPageDto,
  GetOfferPageByIdsDto,
  UpdateOfferPageDto,
} from './dto/offer-page.dto';
import { OfferPage } from './interfaces/offer-page.interface';
import { Vendor } from 'src/pages/vendor/interfaces/vendor.interface';
import { UtilsService } from 'src/shared/utils/utils.service';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { Shop } from 'src/pages/shop/interfaces/shop.interface';
import { Product } from '../product/interfaces/product.interface';
import * as schedule from 'node-schedule';
const ObjectId = Types.ObjectId;

@Injectable()
export class OfferPageService {
  private logger = new Logger(OfferPageService.name);

  constructor(
    @InjectModel('OfferPage') private readonly offerPageModel: Model<OfferPage>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private utilsService: UtilsService,
  ) {
    this.checkExpireEveryday();
  }

  /**
   * addOfferPage()
   * getAllOfferPageByShop()
   * getOfferPageById()
   * getAllOfferPages()
   * getOfferPageBySlug()
   * getOfferPageByIds()
   * updateOfferPageById()
   * updateMultipleOfferPageById()
   * updateMultipleVendorOfferPageById()
   * deleteMultipleTrashOfferPage()
   * deleteMultipleOfferPageByIdByVendor()
   * deleteMultipleOfferPageById()
   */
  async addOfferPage(
    vendor: Vendor,
    shop: string,
    addOfferPageDto: AddOfferPageDto,
  ): Promise<ResponsePayload> {
    try {
      const fShop = await this.shopModel.exists({
        _id: shop,
        'users._id': vendor._id,
      });

      if (!fShop) {
        return {
          success: false,
          message: 'Sorry! you have no access in this shop',
        } as ResponsePayload;
      }
      const fProduct = await this.productModel.findById(
        addOfferPageDto?.product,
      );

      const finalData = {
        ...addOfferPageDto,
        ...{
          shop: shop,
          product: fProduct,
          // slug: this.utilsService.transformToSlug(addOfferPageDto.name),
        },
      };

      const saveData = await this.offerPageModel.create(finalData);
      const data = {
        _id: saveData._id,
      };

      return {
        success: true,
        message: 'Success! OfferPage added successfully.',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOfferPageForUi(shop: string): Promise<ResponsePayload> {
    try {
      const data = await this.offerPageModel
        .findOne({ shop: shop, status: 'publish' })
        .sort({ createdAt: -1 });
      // .select('url type images product')
      return {
        success: true,
        message: 'Success! Data fetch successfully.',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllOfferPageByShop(
    shop: string,
    filterOfferPageDto: FilterAndPaginationOfferPageDto,
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
      const { filter } = filterOfferPageDto;
      filterOfferPageDto.filter = { ...filter, ...{ shop: shop } };

      return this.getAllOfferPages(filterOfferPageDto, searchQuery);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOfferPageById(
    vendor: Vendor,
    shop: string,
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const fShop = await this.shopModel.exists({
        _id: shop,
        'users._id': vendor._id,
      });

      if (!fShop) {
        return {
          success: false,
          message: 'Sorry! you have no access in this shop',
        } as ResponsePayload;
      }

      const data = await this.offerPageModel
        .findOne({ _id: id, shop: shop })
        .select(select);

      return {
        success: true,
        message: 'Success! Data fetch successfully.',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllOfferPages(
    filterOfferPageDto: FilterAndPaginationOfferPageDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterOfferPageDto;
    const { pagination } = filterOfferPageDto;
    const { sort } = filterOfferPageDto;
    const { select } = filterOfferPageDto;
    const { filterGroup } = filterOfferPageDto;

    // Aggregate Stages
    const aggregateStages = [];
    const aggregateOfferPageGroupStages = [];
    const aggregateSubOfferPageGroupStages = [];

    // Essential Variables
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      if (filter['offerPage._id']) {
        filter['offerPage._id'] = new ObjectId(filter['offerPage._id']);
      }

      if (filter['subOfferPage._id']) {
        filter['subOfferPage._id'] = new ObjectId(filter['subOfferPage._id']);
      }

      if (filter['offerPage._id']) {
        filter['offerPage._id'] = new ObjectId(filter['offerPage._id']);
      }

      if (filter['tags']) {
        filter['tags'] = new ObjectId(filter['tags']);
      }

      if (filter['shop']) {
        filter['shop'] = new ObjectId(filter['shop']);
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
    let groupOfferPage: any;
    let groupSubOfferPage: any;

    if (filterGroup && filterGroup.isGroup) {
      if (filterGroup.offerPage) {
        groupOfferPage = {
          $group: {
            _id: { offerPage: '$offerPage._id' },
            name: { $first: '$offerPage.name' },
            slug: { $first: '$offerPage.slug' },
            total: { $sum: 1 },
          },
        };
      }

      if (filterGroup.offerPage) {
        groupOfferPage = {
          $group: {
            _id: { offerPage: '$offerPage._id' },
            name: { $first: '$offerPage.name' },
            slug: { $first: '$offerPage.slug' },
            total: { $sum: 1 },
          },
        };
      }

      if (filterGroup.subOfferPage) {
        groupSubOfferPage = {
          $group: {
            _id: { subOfferPage: '$subOfferPage._id' },
            name: { $first: '$subOfferPage.name' },
            slug: { $first: '$subOfferPage.slug' },
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

      // OfferPage Groups
      if (groupOfferPage) {
        // aggregateOfferPageGroupStages.push({ $match: mFilter });
        aggregateOfferPageGroupStages.push(groupOfferPage);
      }

      // Sub OfferPage Groups
      if (groupSubOfferPage) {
        // aggregateSubOfferPageGroupStages.push({ $match: mFilter });
        aggregateSubOfferPageGroupStages.push(groupSubOfferPage);
      }

      // OfferPage Groups
      if (groupOfferPage) {
        // aggregateOfferPageGroupStages.push({ $match: mFilter });
        aggregateOfferPageGroupStages.push(groupOfferPage);
      }
    } else {
      if (groupOfferPage) {
        aggregateOfferPageGroupStages.push(groupOfferPage);
      }
      if (groupSubOfferPage) {
        aggregateSubOfferPageGroupStages.push(groupSubOfferPage);
      }
      if (groupOfferPage) {
        aggregateOfferPageGroupStages.push(groupOfferPage);
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
      const dataAggregates = await this.offerPageModel.aggregate(
        aggregateStages,
        { allowDiskUse: true },
      );

      // GROUP FILTER PRODUCTS DATA
      let offerPageAggregates: any;
      let subOfferPageAggregates: any;
      // OfferPage
      if (filterGroup && filterGroup.isGroup && filterGroup.offerPage) {
        offerPageAggregates = await this.offerPageModel.aggregate(
          aggregateOfferPageGroupStages,
          { allowDiskUse: true },
        );
      }

      // Sub OfferPage
      if (filterGroup && filterGroup.isGroup && filterGroup.subOfferPage) {
        subOfferPageAggregates = await this.offerPageModel.aggregate(
          aggregateSubOfferPageGroupStages,
          { allowDiskUse: true },
        );
      }

      // OfferPage
      if (filterGroup && filterGroup.isGroup && filterGroup.offerPage) {
        offerPageAggregates = await this.offerPageModel.aggregate(
          aggregateOfferPageGroupStages,
          { allowDiskUse: true },
        );
      }

      // Main Filter Data
      let allFilterGroups: any;
      if (filterGroup && filterGroup.isGroup) {
        allFilterGroups = {
          categories:
            offerPageAggregates && offerPageAggregates.length
              ? offerPageAggregates
              : [],
          subCategories:
            subOfferPageAggregates && subOfferPageAggregates.length
              ? subOfferPageAggregates
              : [],
          offerPages:
            offerPageAggregates && offerPageAggregates.length
              ? offerPageAggregates
              : [],
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

  async getOfferPageBySlug(
    shop: string,
    slug: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.offerPageModel
        .findOne({ slug: slug, shop: shop })
        .select(select);

      // Increment view count
      if (data) {
        await this.offerPageModel.findByIdAndUpdate(data._id, {
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

  async getOfferPageByIds(
    shop: string,
    getOfferPageByIdsDto: GetOfferPageByIdsDto,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const mIds = getOfferPageByIdsDto.ids.map((m) => new ObjectId(m));
      const data = await this.offerPageModel
        .find({ _id: mIds, shop: shop })
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
   * updateOfferPageById
   * updateMultipleOfferPageById
   */
  async updateOfferPageById(
    vendor: Vendor,
    shop: string,
    id: string,
    updateOfferPageDto: UpdateOfferPageDto,
  ): Promise<ResponsePayload> {
    try {
      // const { name } = updateOfferPageDto;

      const fShop = await this.shopModel.exists({
        _id: shop,
        'users._id': vendor._id,
      });

      if (!fShop) {
        return {
          success: false,
          message: 'Sorry! you have no access in this shop',
        } as ResponsePayload;
      }

      let finalSlug: string;
      const fData = await this.offerPageModel.findOne({ _id: id, shop: shop });

      // Check Slug
      // if (fData?.name.trim() !== name.trim()) {
      //   const newSlug = this.utilsService.transformToSlug(name);

      //   const isExists = await this.offerPageModel.exists({ slug: newSlug });
      //   if (isExists) {
      //     finalSlug = this.utilsService.transformToSlug(name, true);
      //   } else {
      //     finalSlug = newSlug;
      //   }
      // } else {
      //   finalSlug = fData.slug;
      // }

      const finalData = {
        ...updateOfferPageDto,
      };

      await this.offerPageModel.findByIdAndUpdate(id, {
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

  async updateMultipleOfferPageById(
    vendor: Vendor,
    shop: string,
    ids: string[],
    updateOfferPageDto: UpdateOfferPageDto,
  ): Promise<ResponsePayload> {
    try {
      const fShop = await this.shopModel.exists({
        _id: shop,
        'users._id': vendor._id,
      });

      if (!fShop) {
        return {
          success: false,
          message: 'Sorry! you have no access in this shop',
        } as ResponsePayload;
      }

      if (ids && ids.length) {
        const mIds = ids.map((m) => new ObjectId(m));

        // Delete No Multiple Action Data
        // if (updateOfferPageDto.slug) {
        //   delete updateOfferPageDto.slug;
        // }
        await this.offerPageModel.updateMany(
          { _id: { $in: mIds } },
          { $set: updateOfferPageDto },
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

  async deleteMultipleTrashOfferPage(
    vendor: Vendor,
    shop: string,
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      const fShop = await this.shopModel.exists({
        _id: shop,
        'users._id': vendor._id,
      });

      if (!fShop) {
        return {
          success: false,
          message: 'Sorry! you have no access in this shop',
        } as ResponsePayload;
      }

      await this.offerPageModel.deleteMany({ _id: ids, status: 'trash' });
      return {
        success: true,
        message: 'Success! OfferPage permanently deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteAllTrashByShop(shop: string): Promise<ResponsePayload> {
    try {
      const fShop = await this.shopModel.exists({
        _id: shop,
      });

      if (!fShop) {
        return {
          success: false,
          message: 'Sorry! you have no access in this shop',
        } as ResponsePayload;
      }

      await this.offerPageModel.deleteMany({ shop: shop, status: 'trash' });
      return {
        success: true,
        message: 'Success! order permanently deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleOfferPageByIdByVendor(
    vendor: Vendor,
    shop: string,
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      const fShop = await this.shopModel.exists({
        _id: shop,
        'users._id': vendor._id,
      });

      if (!fShop) {
        return {
          success: false,
          message: 'Sorry! you have no access in this shop',
        } as ResponsePayload;
      }

      await this.offerPageModel.updateMany(
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
        message: 'Success! OfferPage deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleOfferPageById(ids: string[]): Promise<ResponsePayload> {
    try {
      await this.offerPageModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  private async checkExpireEveryday() {
    schedule.scheduleJob('30 3 * * *', async () => {
      await this.checkExpireFromDb();
    });
  }

  private async checkExpireFromDb() {
    try {
      // Calculate the date 10 days ago
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      console.log(tenDaysAgo.toISOString().split('T')[0]);
      // Perform deletion of orders with status 'trash' and deleteDateString <= 10 days ago
      await this.offerPageModel.deleteMany({
        status: 'trash',
        deleteDateString: {
          $lte: tenDaysAgo.toISOString().split('T')[0], // Compare as ISO string for date format matching
        },
      });

      // console.log('Auto-deletion task executed successfully.');
    } catch (err) {
      console.error('Error during auto-deletion:', err);
    }
  }
}
