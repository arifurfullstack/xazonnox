import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AddAffiliateReportDto,
  FilterAndPaginationAffiliateReportDto,
  GetAffiliateReportByIdsDto,
  UpdateAffiliateReportDto,
} from './dto/affiliate-report.dto';
import { AffiliateReport } from './interfaces/affiliate-report.interface';
import { Affiliate } from 'src/pages/affiliate/interfaces/affiliate.interface';
import { UtilsService } from 'src/shared/utils/utils.service';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { Shop } from '../shop/interfaces/shop.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class AffiliateReportService {
  private logger = new Logger(AffiliateReportService.name);

  constructor(
    @InjectModel('AffiliateReport')
    private readonly affiliateReportModel: Model<AffiliateReport>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
    private utilsService: UtilsService,
  ) {}

  /**
   * addAffiliateReport()
   * getAllAffiliateReportByShop()
   * getAffiliateReportById()
   * getAllAffiliateReports()
   * getAffiliateReportBySlug()
   * getAffiliateReportByIds()
   * updateAffiliateReportById()
   * updateMultipleAffiliateReportById()
   * updateMultipleAffiliateAffiliateReportById()
   * deleteMultipleTrashAffiliateReport()
   * deleteMultipleAffiliateReportByIdByAffiliate()
   * deleteMultipleAffiliateReportById()
   */
  async addAffiliateReport(
    affiliate: Affiliate,
    addAffiliateReportDto: AddAffiliateReportDto,
  ): Promise<ResponsePayload> {
    try {
      const { quantity, name, shop } = addAffiliateReportDto;

      const fSlug = this.utilsService.transformToSlug(name);
      const fData = await this.affiliateReportModel.exists({
        slug: fSlug,
      });

      const finalSlug = fData
        ? this.utilsService.transformToSlug(name, true)
        : fSlug;

      const defaultData = {
        slug: finalSlug,
        quantity: quantity ? quantity : 0,
        dateString: this.utilsService.getDateString(new Date()),
      };

      const finalData = {
        ...addAffiliateReportDto,
        ...defaultData,
      };

      const saveData = await this.affiliateReportModel.create(finalData);
      const data = {
        _id: saveData._id,
      };

      return {
        success: true,
        message: 'Success! Affiliate Payment Report added successfully.',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAffiliateReportByShop(
    shop: string,
    filterAffiliateReportDto: FilterAndPaginationAffiliateReportDto,
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
      const { filter } = filterAffiliateReportDto;
      filterAffiliateReportDto.filter = { ...filter };

      return this.getAllAffiliateReports(filterAffiliateReportDto, searchQuery);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAffiliateReportById(
    affiliate: Affiliate,
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {

      const data = await this.affiliateReportModel.findOne({ _id: id });

      return {
        success: true,
        message: 'Success! Data fetch successfully.',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllAffiliateReports(
    filterAffiliateReportDto: FilterAndPaginationAffiliateReportDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter, pagination, sort, select } = filterAffiliateReportDto;

    const aggregateStages: any[] = [];

    let mFilter: any = {};
    let mSort: any = {};
    let mSelect: any = {};

    // Match filter
    if (filter) {
      if (filter['shop']) {
        filter['shop'] = new ObjectId(filter['shop']);
      }
      if (filter['shopId']) {
        filter['shopId'] = new ObjectId(filter['shopId']);
      }
      if (filter['affiliate']) {
        filter['affiliate'] = new ObjectId(filter['affiliate']);
      }
      if (filter['product']) {
        filter['product'] = new ObjectId(filter['product']);
      }
      if (filter['ownerId']) {
        filter['ownerId'] = new ObjectId(filter['ownerId']);
      }

      mFilter = { ...mFilter, ...filter };
    }

    // Search filter
    if (searchQuery) {
      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              {
                status: this.utilsService.createRegexFromString(searchQuery),
              },
              {
                method: this.utilsService.createRegexFromString(searchQuery),
              },
            ],
          },
        ],
      };
    }

    // Sort
    mSort = sort || { createdAt: -1 };

    // Select fields
    const defaultSelect = {
      shopId: 1,
      shop: 1,
    };
    mSelect = { ...defaultSelect, ...(select || {}) };

    // Add $match stage
    if (Object.keys(mFilter).length) {
      aggregateStages.push({ $match: mFilter });
    }

    // Lookups for populate
    aggregateStages.push(
      {
        $lookup: {
          from: 'affiliates',
          localField: 'affiliate',
          foreignField: '_id',
          as: 'affiliate',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                username: 1,
                phoneNo: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: '$affiliate', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'affiliateproducts',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                slug: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'shops',
          localField: 'shopId',
          foreignField: '_id',
          as: 'shopId',
          pipeline: [
            {
              $lookup: {
                from: 'vendors', // assuming 'vendors' is your collection name
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      phoneNo: 1,
                      email: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$owner',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                websiteName: 1,
                domainType: 1,
                owner: 1, // now it's populated
              },
            },
          ],
        },
      },
      {
        $unwind: { path: '$shopId', preserveNullAndEmptyArrays: true },
      },


      {
        $lookup: {
          from: 'admins',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'ownerId',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                phoneNo: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: '$ownerId', preserveNullAndEmptyArrays: true } },
    );

    // Sort
    aggregateStages.push({ $sort: mSort });

    // Pagination or all data
    if (pagination) {
      aggregateStages.push({
        $facet: {
          metadata: [{ $count: 'total' }],
          totalAmount: [{ $group: { _id: null, total: { $sum: '$amount' } } }],
          nonLinkedTotalAmount: [
            {
              $match: {
                $or: [
                  { linkedWithdrawalId: { $exists: false } },
                  { linkedWithdrawalId: null },
                ],

              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' },
              },
            },
          ],
          data: [
            { $skip: pagination.pageSize * pagination.currentPage },
            { $limit: pagination.pageSize },
            { $project: mSelect },
          ],
        },
      });
      aggregateStages.push({
        $project: {
          data: 1,
          count: { $ifNull: [{ $arrayElemAt: ['$metadata.total', 0] }, 0] },
          totalAmount: {
            $ifNull: [{ $arrayElemAt: ['$totalAmount.total', 0] }, 0],
          },
          nonLinkedTotalAmount: {
            $ifNull: [{ $arrayElemAt: ['$nonLinkedTotalAmount.total', 0] }, 0],
          },
        },
      });
    } else {
      aggregateStages.push({
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          nonLinkedTotalAmount: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$linkedWithdrawalId', null] },
                    { $not: ['$linkedWithdrawalId'] }, // In case field is missing
                  ],
                },
                '$amount',
                0,
              ],
            },
          },
          data: { $push: '$$ROOT' },
        },
      });
      aggregateStages.push({
        $project: {
          totalAmount: { $ifNull: ['$totalAmount', 0] },
          nonLinkedTotalAmount: { $ifNull: ['$nonLinkedTotalAmount', 0] },
          data: 1,
          count: { $size: '$data' },
        },
      });
    }

    // Run aggregation
    try {
      const dataAggregates = await this.affiliateReportModel.aggregate(
        aggregateStages,
        {
          allowDiskUse: true,
        },
      );

      const finalResult = dataAggregates[0] || {
        data: [],
        count: 0,
        totalAmount: 0,
        nonLinkedTotalAmount: 0,
      };

      return {
        ...finalResult,
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAffiliateReportBySlug(
    shop: string,
    slug: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.affiliateReportModel
        .findOne({ slug: slug })
        .select(select);

      // Increment view count
      if (data) {
        await this.affiliateReportModel.findByIdAndUpdate(data._id, {
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

  async getAffiliateReportByIds(
    shop: string,
    getAffiliateReportByIdsDto: GetAffiliateReportByIdsDto,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const mIds = getAffiliateReportByIdsDto.ids.map((m) => new ObjectId(m));
      const data = await this.affiliateReportModel
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
   * updateAffiliateReportById
   * updateMultipleAffiliateReportById
   */
  async updateAffiliateReportById(
    affiliate: Affiliate,
    id: string,
    updateAffiliateReportDto: UpdateAffiliateReportDto,
  ): Promise<ResponsePayload> {
    try {
      const { name } = updateAffiliateReportDto;

      let finalSlug: string;
      const fData = await this.affiliateReportModel.findOne({ _id: id });

      // Check Slug
      if (fData?.name.trim() !== name.trim()) {
        const newSlug = this.utilsService.transformToSlug(name);

        const isExists = await this.affiliateReportModel.exists({
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

      const finalData = {
        ...updateAffiliateReportDto,
        ...{
          slug: finalSlug,
        },
      };

      await this.affiliateReportModel.findByIdAndUpdate(id, {
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

  async updateMultipleAffiliateReportById(
    affiliate: Affiliate,
    ids: string[],
    updateAffiliateReportDto: UpdateAffiliateReportDto,
  ): Promise<ResponsePayload> {
    try {
      if (ids && ids.length) {
        const mIds = ids.map((m) => new ObjectId(m));

        // Delete No Multiple Action Data
        if (updateAffiliateReportDto.slug) {
          delete updateAffiliateReportDto.slug;
        }
        await this.affiliateReportModel.updateMany(
          { _id: { $in: mIds } },
          { $set: updateAffiliateReportDto },
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

  async deleteMultipleTrashAffiliateReport(
    affiliate: Affiliate,
    shop: string,
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      await this.affiliateReportModel.deleteMany({
        _id: ids,
        status: 'trash',
      });
      return {
        success: true,
        message:
          'Success! Affiliate Payment Report permanently deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleAffiliateReportByIdByAffiliate(
    affiliate: Affiliate,
    shop: string,
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      await this.affiliateReportModel.updateMany(
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
        message: 'Success! AffiliateReport deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleAffiliateReportById(
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      await this.affiliateReportModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleAffiliatePaymentReportById(
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      // Step 1: Convert string IDs to ObjectId
      const objectIds = ids.map((id) => new Types.ObjectId(id));

      // Step 2: Update all earnings where linkedWithdrawalId matches any of the given ids
      await this.affiliateReportModel.updateMany(
        { linkedWithdrawalId: { $in: objectIds } },
        { $set: { linkedWithdrawalId: null } },
      );

      await this.affiliateReportModel.deleteMany({ _id: ids });

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
