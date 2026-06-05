import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AddExpenseDto,
  FilterAndPaginationExpenseDto,
  GetExpenseByIdsDto,
  UpdateExpenseDto,
} from './dto/expense.dto';
import { Expense } from './interfaces/expense.interface';
import { Vendor } from 'src/pages/vendor/interfaces/vendor.interface';
import { UtilsService } from 'src/shared/utils/utils.service';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { Shop } from 'src/pages/shop/interfaces/shop.interface';
import * as schedule from 'node-schedule';
import { MAX_CATEGORY_UPLOAD } from '../../config/global-variables';
import { Product } from '../product/interfaces/product.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class ExpenseService {
  private logger = new Logger(ExpenseService.name);

  constructor(
    @InjectModel('Expense') private readonly expenseModel: Model<Expense>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private utilsService: UtilsService,
  ) {
    this.checkExpireEveryday();
  }

  /**
   * addExpense()
   * getAllExpenseByShop()
   * getExpenseById()
   * getAllExpenses()
   * getExpenseBySlug()
   * getExpenseByIds()
   * updateExpenseById()
   * updateMultipleExpenseById()
   * updateMultipleVendorExpenseById()
   * deleteMultipleTrashExpense()
   * deleteMultipleExpenseByIdByVendor()
   * deleteMultipleExpenseById()
   */
  async addExpense(
    vendor: Vendor,
    shop: string,
    addExpenseDto: AddExpenseDto,
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

      const totalExpense = await this.expenseModel.countDocuments({
        shop: shop,
      });

      if (totalExpense && totalExpense > MAX_CATEGORY_UPLOAD) {
        return {
          success: false,
          message: 'Sorry! exists your expense upload limit with this shop.',
        } as ResponsePayload;
      }

      const finalData = {
        ...addExpenseDto,
        ...{
          shop: shop,
          slug: this.utilsService.transformToSlug(addExpenseDto.name),
        },
      };

      const saveData = await this.expenseModel.create(finalData);
      const data = {
        _id: saveData._id,
      };

      return {
        success: true,
        message: 'Success! Expense added successfully.',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllExpenseForUi(shop: string): Promise<ResponsePayload> {
    try {
      const data = await this.expenseModel
        .find({ shop: shop, status: 'publish' })
        .select('name slug images')
        .sort({ priority: -1 });

      return {
        success: true,
        message: 'Success! Data fetch successfully.',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllExpenseByShop(
    shop: string,
    filterExpenseDto: FilterAndPaginationExpenseDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    try {
      if (!shop) {
        return {
          success: false,
          message: 'Sorry! no data found.',
        } as ResponsePayload;
      }

      await this.updateAllExpenseProductCounts(shop);

      // Modify Filter
      const { filter } = filterExpenseDto;
      filterExpenseDto.filter = { ...filter, ...{ shop: shop } };

      return this.getAllExpenses(filterExpenseDto, searchQuery);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getExpenseById(
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

      const data = await this.expenseModel
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

  async getAllExpenses(
    filterExpenseDto: FilterAndPaginationExpenseDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterExpenseDto;
    const { pagination } = filterExpenseDto;
    const { sort } = filterExpenseDto;
    const { select } = filterExpenseDto;
    const { filterGroup } = filterExpenseDto;

    // Date filter variables
    let gteDate, lteDate, gteDate1, lteDate1;
    if (filter['createdAt']) {
      gteDate = new Date(filter['createdAt']['$gte']);
      lteDate = new Date(filter['createdAt']['$lte']);
      gteDate1 = filter['createdAt']['$gte'];
      lteDate1 = filter['createdAt']['$lte'];
      gteDate.setHours(0, 0, 0, 0);
      lteDate.setHours(23, 59, 59, 999);
      delete filter['createdAt'];
    }
    
    // Handle checkoutDate filter (for compatibility)
    if (filter['checkoutDate']) {
      gteDate = new Date(filter['checkoutDate']['$gte']);
      lteDate = new Date(filter['checkoutDate']['$lte']);
      gteDate1 = filter['checkoutDate']['$gte'];
      lteDate1 = filter['checkoutDate']['$lte'];
      gteDate.setHours(0, 0, 0, 0);
      lteDate.setHours(23, 59, 59, 999);
      delete filter['checkoutDate'];
    }

    // Aggregate Stages
    const aggregateStages = [];
    const aggregateExpenseGroupStages = [];
    const aggregateBrandGroupStages = [];
    const aggregateSubExpenseGroupStages = [];

    // Essential Variables
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      if (filter['expense._id']) {
        filter['expense._id'] = new ObjectId(filter['expense._id']);
      }

      if (filter['subExpense._id']) {
        filter['subExpense._id'] = new ObjectId(filter['subExpense._id']);
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
    let groupExpense: any;
    let groupBrand: any;
    let groupSubExpense: any;

    if (filterGroup && filterGroup.isGroup) {
      if (filterGroup.expense) {
        groupExpense = {
          $group: {
            _id: { expense: '$expense._id' },
            name: { $first: '$expense.name' },
            slug: { $first: '$expense.slug' },
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

      if (filterGroup.subExpense) {
        groupSubExpense = {
          $group: {
            _id: { subExpense: '$subExpense._id' },
            name: { $first: '$subExpense.name' },
            slug: { $first: '$subExpense.slug' },
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
      // Add date filtering if dates are provided
      if (gteDate && lteDate) {
        mFilter = {
          $and: [
            mFilter,
            {
              createdAt: {
                $gte: gteDate,
                $lte: lteDate
              }
            }
          ]
        };
      }
      
      // Main
      aggregateStages.push({ $match: mFilter });

      // Expense Groups
      if (groupExpense) {
        // aggregateExpenseGroupStages.push({ $match: mFilter });
        aggregateExpenseGroupStages.push(groupExpense);
      }

      // Sub Expense Groups
      if (groupSubExpense) {
        // aggregateSubExpenseGroupStages.push({ $match: mFilter });
        aggregateSubExpenseGroupStages.push(groupSubExpense);
      }

      // Brand Groups
      if (groupBrand) {
        // aggregateBrandGroupStages.push({ $match: mFilter });
        aggregateBrandGroupStages.push(groupBrand);
      }
    } else {
      // Handle case when no other filters but date filter exists
      if (gteDate && lteDate) {
        const dateFilter = {
          createdAt: {
            $gte: gteDate,
            $lte: lteDate
          }
        };
        aggregateStages.push({ $match: dateFilter });
      }
      
      if (groupExpense) {
        aggregateExpenseGroupStages.push(groupExpense);
      }
      if (groupSubExpense) {
        aggregateSubExpenseGroupStages.push(groupSubExpense);
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
      // Calculate total cost for expenses with status "publish"
      const totalCostAggregation = [];
      
      // Apply the same filters for total cost calculation
      if (Object.keys(mFilter).length) {
        // Add date filtering if dates are provided
        let costFilter = { ...mFilter };
        if (gteDate && lteDate) {
          costFilter = {
            $and: [
              costFilter,
              {
                createdAt: {
                  $gte: gteDate,
                  $lte: lteDate
                }
              }
            ]
          };
        }
        totalCostAggregation.push({ $match: costFilter });
      } else {
        // Handle case when no other filters but date filter exists
        if (gteDate && lteDate) {
          const dateFilter = {
            createdAt: {
              $gte: gteDate,
              $lte: lteDate
            }
          };
          totalCostAggregation.push({ $match: dateFilter });
        }
      }
      
      // Add status filter for publish expenses
      totalCostAggregation.push({
        $match: { status: 'publish' }
      });
      
      // Group to calculate total cost
      totalCostAggregation.push({
        $group: {
          _id: null,
          totalCost: { $sum: { $ifNull: ['$cost', 0] } }
        }
      });
      
      // Execute total cost aggregation
      const totalCostResult = await this.expenseModel.aggregate(totalCostAggregation);
      const totalCost = totalCostResult.length > 0 ? totalCostResult[0].totalCost : 0;

      // Main
      const dataAggregates = await this.expenseModel.aggregate(
        aggregateStages,
        { allowDiskUse: true },
      );

      // GROUP FILTER PRODUCTS DATA
      let expenseAggregates: any;
      let subExpenseAggregates: any;
      let brandAggregates: any;
      // Expense
      if (filterGroup && filterGroup.isGroup && filterGroup.expense) {
        expenseAggregates = await this.expenseModel.aggregate(
          aggregateExpenseGroupStages,
          { allowDiskUse: true },
        );
      }

      // Sub Expense
      if (filterGroup && filterGroup.isGroup && filterGroup.subExpense) {
        subExpenseAggregates = await this.expenseModel.aggregate(
          aggregateSubExpenseGroupStages,
          { allowDiskUse: true },
        );
      }

      // Brand
      if (filterGroup && filterGroup.isGroup && filterGroup.brand) {
        brandAggregates = await this.expenseModel.aggregate(
          aggregateBrandGroupStages,
          { allowDiskUse: true },
        );
      }

      // Main Filter Data
      let allFilterGroups: any;
      if (filterGroup && filterGroup.isGroup) {
        allFilterGroups = {
          categories:
            expenseAggregates && expenseAggregates.length
              ? expenseAggregates
              : [],
          subCategories:
            subExpenseAggregates && subExpenseAggregates.length
              ? subExpenseAggregates
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
            totalCost: totalCost,
          },
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
          filterGroup: allFilterGroups,
          totalCost: totalCost,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getExpenseBySlug(
    shop: string,
    slug: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.expenseModel
        .findOne({ slug: slug, shop: shop })
        .select(select);

      // Increment view count
      if (data) {
        await this.expenseModel.findByIdAndUpdate(data._id, {
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

  async getExpenseByIds(
    shop: string,
    getExpenseByIdsDto: GetExpenseByIdsDto,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const mIds = getExpenseByIdsDto.ids.map((m) => new ObjectId(m));
      const data = await this.expenseModel
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
   * updateExpenseById
   * updateMultipleExpenseById
   */
  async updateExpenseById(
    vendor: Vendor,
    shop: string,
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<ResponsePayload> {
    try {
      const { name } = updateExpenseDto;

      // Check if vendor has access to the shop
      const fShop = await this.shopModel.exists({
        _id: shop,
        'users._id': vendor._id,
      });

      if (!fShop) {
        return {
          success: false,
          message: 'Sorry! You do not have access to this shop.',
        };
      }

      let finalSlug: string;
      const fData = await this.expenseModel.findOne({ _id: id, shop: shop });

      if (!fData) {
        return {
          success: false,
          message: 'Expense not found!',
        };
      }

      // Check if expense name is changed
      const isNameChanged = fData.name.trim() !== name.trim();

      // Generate slug only if name is changed
      if (isNameChanged) {
        const newSlug = this.utilsService.transformToSlug(name);

        const isExists = await this.expenseModel.exists({ slug: newSlug });
        if (isExists) {
          finalSlug = this.utilsService.transformToSlug(name, true);
        } else {
          finalSlug = newSlug;
        }
      } else {
        finalSlug = fData.slug;
      }

      const finalData = {
        ...updateExpenseDto,
        slug: finalSlug,
      };

      // Update the expense
      await this.expenseModel.findByIdAndUpdate(id, {
        $set: finalData,
      });

      // Only update products if the name has changed
      if (isNameChanged) {
        await this.productModel.updateMany(
          {
            'expense._id': fData._id,
            shop: shop,
          },
          {
            $set: {
              'expense.name': name,
              'expense.slug': finalSlug,
            },
          },
        );
      }

      return {
        success: true,
        message: 'Success! Expense updated successfully.',
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleExpenseById(
    vendor: Vendor,
    shop: string,
    ids: string[],
    updateExpenseDto: UpdateExpenseDto,
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
        if (updateExpenseDto.slug) {
          delete updateExpenseDto.slug;
        }
        await this.expenseModel.updateMany(
          { _id: { $in: mIds } },
          { $set: updateExpenseDto },
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

  async deleteMultipleTrashExpense(
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

      await this.expenseModel.deleteMany({ _id: ids, status: 'trash' });
      return {
        success: true,
        message: 'Success! Expense permanently deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleExpenseByIdByVendor(
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

      // await this.expenseModel.updateMany(
      //   { _id: ids },
      //   {
      //     $set: {
      //       status: 'trash',
      //       deleteDateString: this.utilsService.getDateString(new Date()),
      //     },
      //   },
      // );

      await this.expenseModel.deleteMany({ _id: ids });

      return {
        success: true,
        message: 'Success! Expense deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleExpenseById(ids: string[]): Promise<ResponsePayload> {
    try {
      await this.expenseModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
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

      await this.expenseModel.deleteMany({ shop: shop, status: 'trash' });
      return {
        success: true,
        message: 'Success! order permanently deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
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
      await this.expenseModel.deleteMany({
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

  async updateAllExpenseProductCounts(shop: string): Promise<void> {
    const result = await this.productModel.aggregate([
      {
        $match: {
          shop: new Types.ObjectId(shop), // যদি shop ফিল্ড ObjectId হয়
        },
      },
      {
        $group: {
          _id: '$expense._id',
          productCount: { $sum: 1 },
        },
      },
    ]);

    const bulkOps = result.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { expenseProducts: item.productCount } },
      },
    }));

    if (bulkOps.length) {
      await this.expenseModel.bulkWrite(bulkOps);
    }
  }
}
