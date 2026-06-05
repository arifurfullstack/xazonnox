import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import { User } from '../user/interfaces/user.interface';

import { Order } from '../order/interfaces/order.interface';
import { Vendor } from '../vendor/interfaces/vendor.interface';
import { UtilsService } from '../../shared/utils/utils.service';
import { Product } from '../product/interfaces/product.interface';
import { FilterAndPaginationOrderDto } from '../order/dto/order.dto';
import { Shop } from '../shop/interfaces/shop.interface';
import { ErrorCodes } from '../../enum/error-code.enum';
import { Category } from '../catalog/category/interfaces/category.interface';
import { AffiliateProduct } from '../affiliate-product/interfaces/affiliate-product.interface';

import { Affiliate } from '../affiliate/interfaces/affiliate.interface';
import { AffiliateConnection } from '../affiliate/interfaces/affiliate-connection.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class DashboardService {
  private logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,

    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
    @InjectModel('AffiliateProduct')
    private readonly affiliateProductModel: Model<AffiliateProduct>,
    @InjectModel('AffiliateConnection')
    private readonly affiliateConnectionModel: Model<AffiliateConnection>,
    @InjectModel('Affiliate')
    private readonly affiliateModel: Model<Affiliate>,
    private utilsService: UtilsService,
  ) {}

  async getVendorDashboard(shop: any): Promise<ResponsePayload> {
    try {
      // Date Modify
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const last7Days = new Date(
        this.utilsService.getNextDateString(new Date(), -7),
      );

      last7Days.setHours(23, 59, 59, 999);

      const totalProducts = await this.productModel.countDocuments({
        shop: shop,
      });

      const todayProducts = await this.productModel.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
        shop: shop,
      });

      const last7DaysProducts = await this.productModel.countDocuments({
        createdAt: { $gte: last7Days, $lte: startDate },
        shop: shop,
      });

      const data = {
        totalProducts,
        todayProducts,
        last7DaysProducts,
      };

      return {
        success: true,
        message: 'Data Retrieve Success',
        data,
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAffiliate(
    filterDto: any,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    try {
      const { filter } = filterDto;
      const affiliateId = filter.affiliate;
      const search = searchQuery?.toLowerCase() || '';

      // Step 1: Load all affiliate products
      const allProducts: any[] = await this.affiliateProductModel.find();

      // Step 2: Load approved connections (to exclude from count)
      const approvedConnections = await this.affiliateConnectionModel.find({
        affiliate: affiliateId,
      });

      const approvedOwnerSet = new Set(
        approvedConnections.map(
          (conn) => `${conn.ownerType}_${conn.ownerId.toString()}`,
        ),
      );

      // Step 3: Group unapproved products by owner
      let availableAffiliateProductCount = 0;

      for (const product of allProducts) {
        const key = `${product.ownerType}_${product.ownerId?.toString()}`;

        // Skip if already approved
        if (approvedOwnerSet.has(key)) continue;

        // Optional search by product name or ownerId (string match)
        if (search) {
          const nameMatch = product.name?.toLowerCase()?.includes(search);
          const ownerMatch = product.ownerId?.toString()?.includes(search);
          if (!nameMatch && !ownerMatch) continue;
        }

        availableAffiliateProductCount++;
      }

      // Step 4: Earnings & Withdrawals from affiliateReportModel
      const earningFilter = { ...filter, type: 'earning' };
      const withdrawalFilter = {
        ...filter,
        type: 'withdrawal',
        status: 'paid',
      };

      // const earningReports: any[] =
      //   await this.affiliateReportModel.find(earningFilter);
      // const withdrawalReports: any[] =
      //   await this.affiliateReportModel.find(withdrawalFilter);
      //
      // const totalEarnings = earningReports.reduce(
      //   (sum, report) => sum + (report.amount || 0),
      //   0,
      // );
      // const totalPayment = withdrawalReports.reduce(
      //   (sum, report) => sum + (report.amount || 0),
      //   0,
      // );

      // Step 5: Final summary
      const finalData = {
        // totalEarning: totalEarnings,
        // totalRefers: earningReports.length,
        // paidAmount: totalPayment,
        // dueAmount: totalEarnings - totalPayment,
        availableAffiliate: availableAffiliateProductCount,
      };

      // Optional: Update balance in background
      this.updateAffiliateBalance(affiliateId);

      return {
        data: finalData,
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (error) {
      console.error('Error in getAllAffiliate:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAffiliateInfoForOwner(
    filterDto: any,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    try {
      const { filter } = filterDto;
      const affiliateId = filter.affiliate;
      const search = searchQuery?.toLowerCase() || '';

      // Step 1: Load approved shop connections with populated shop info
      const shopConnections = await this.affiliateConnectionModel
        .find({
          affiliate: affiliateId,
          status: 'approved',
          ownerType: 'shop',
        })
        .populate({
          path: 'ownerId',
          model: 'Shop',
          select: 'websiteName',
        });

      // Step 2: Load approved admin connections with populated admin info
      const adminConnections = await this.affiliateConnectionModel
        .find({
          affiliate: affiliateId,
          status: 'approved',
          ownerType: 'admin',
        })
        .populate({
          path: 'ownerId',
          model: 'any',
          select: 'name',
        });

      // Step 3: Merge all approved connections
      const allConnections = [...shopConnections, ...adminConnections];

      // Step 4: Apply search filter if needed
      const filteredConnections = allConnections.filter((conn) => {
        const owner: any = conn.ownerId;
        const name =
          conn.ownerType === 'shop' ? owner?.websiteName : owner?.name;
        return !search || name?.toLowerCase().includes(search);
      });

      // Step 5: Count connected shops and admins
      const connectedShopCount = filteredConnections.filter(
        (c) => c.ownerType === 'shop',
      ).length;

      const connectedAdminCount = filteredConnections.filter(
        (c) => c.ownerType === 'admin',
      ).length;

      const totalConnected = connectedShopCount + connectedAdminCount;

      // Step 6: Get affiliate earnings and paid withdrawals
      // const earningReports: any[] = await this.affiliateReportModel.find({
      //   ...filter,
      //   type: 'earning',
      // });
      //
      // const withdrawalReports: any[] = await this.affiliateReportModel.find({
      //   ...filter,
      //   type: 'withdrawal',
      //   status: 'paid',
      // });

      // const totalEarnings = earningReports.reduce(
      //   (sum, report) => sum + (report.amount || 0),
      //   0,
      // );
      //
      // const totalPayment = withdrawalReports.reduce(
      //   (sum, report) => sum + (report.amount || 0),
      //   0,
      // );

      const finalData = {
        // totalEarning: totalEarnings,
        // totalRefers: earningReports.length,
        // paidAmount: totalPayment,
        // dueAmount: totalEarnings - totalPayment,
        availableAffiliate: totalConnected,
      };

      this.updateAffiliateBalance(affiliateId); // Optional async balance update

      return {
        data: finalData,
        success: true,
        message: 'Success',
      };
    } catch (error) {
      console.error('Error in getAllAffiliateInfoForOwner:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllOrderByShop(
    vendor: Vendor,
    shop: string,
    filterAndPaginationOrderDto: FilterAndPaginationOrderDto,
    searchQuery?: string,
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

      // Modify Filter
      const { filter } = filterAndPaginationOrderDto;
      filterAndPaginationOrderDto.filter = { ...filter, ...{ shop: shop } };

      return this.getAllOrders(filterAndPaginationOrderDto, searchQuery);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllOrders(
    filterOrderDto: FilterAndPaginationOrderDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterOrderDto;
    const { sort } = filterOrderDto;
    const { select } = filterOrderDto;
    let gteDate;
    let lteDate;
    if (filter['checkoutDate']) {
      gteDate = new Date(filter['checkoutDate']['$gte']);
      lteDate = new Date(filter['checkoutDate']['$lte']);
      gteDate.setHours(0, 0, 0, 0);
      lteDate.setHours(23, 59, 59, 999);
    }
    // Essential Variables
    const aggregatesOrders = [];
    const aggregatesOrdersCourier = [];
    let mFilter = {};
    const mFilterCourier = {};

    let mSort = {};

    // Match
    if (filter) {
      if (filter['user']) {
        filter['user'] = new ObjectId(filter['user']);
      }
      if (filter['shop']) {
        filter['shop'] = new ObjectId(filter['shop']);
      }
      mFilter = { ...mFilter, ...filter };
      mFilterCourier['shop'] = new ObjectId(filter['shop']);
    }

    if (searchQuery) {
      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { name: { $regex: searchQuery, $options: 'i' } },
              { phoneNo: { $regex: searchQuery, $options: 'i' } },
              { email: { $regex: searchQuery, $options: 'i' } },
            ],
          },
        ],
      };
    }

    // Always exclude 'trash' status orders
    const statusExclusion = { status: { $ne: 'trash' } };

    if (Object.keys(mFilter).length) {
      aggregatesOrders.push({
        $match: {
          $and: [mFilter, statusExclusion],
        },
      });
    } else {
      aggregatesOrders.push({
        $match: statusExclusion,
      });
    }
    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregatesOrders.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregatesOrders.push({ $sort: mSort });
    }

    // Grouping for Dashboard Data
    aggregatesOrders.push({
      $group: {
        _id: null,
        allOrders: { $sum: 1 },
        orderAmount: { $sum: '$grandTotal' },
        confirmOrders: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0],
          },
        },
        confirmOrdersAmount: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, '$grandTotal', 0],
          },
        },
        deliveredOrders: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0],
          },
        },
        deliveredOrdersAmount: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'delivered'] }, '$grandTotal', 0],
          },
        },
        pendingOrders: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0],
          },
        },
        pendingOrdersAmount: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'pending'] }, '$grandTotal', 0],
          },
        },
        cancelOrders: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0],
          },
        },
        cancelOrdersAmount: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, '$grandTotal', 0],
          },
        },
        refundOrders: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'refund'] }, 1, 0],
          },
        },
        refundOrdersAmount: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'refund'] }, '$grandTotal', 0],
          },
        },
        activeOrders: {
          $sum: {
            $cond: [{ $ne: ['$orderStatus', 'cancelled'] }, 1, 0],
          },
        },
        activeOrdersAmount: {
          $sum: {
            $cond: [{ $ne: ['$orderStatus', 'cancelled'] }, '$grandTotal', 0],
          },
        },
      },
    });
    aggregatesOrdersCourier.push({
      $match: {
        $and: [mFilterCourier, { status: { $ne: 'trash' } }],
      },
    });

    aggregatesOrdersCourier.push({
      $addFields: {
        courierCreatedAt: {
          $cond: [
            {
              $and: [
                { $ifNull: ['$courierData.createdAt', false] },
                { $eq: [{ $type: '$courierData.createdAt' }, 'string'] },
              ],
            },
            {
              $dateFromString: {
                dateString: '$courierData.createdAt',
                format: '%Y-%m-%d',
              },
            },
            '$courierData.createdAt',
          ],
        },
      },
    });

    aggregatesOrdersCourier.push({
      $group: {
        _id: null,
        courierOrders: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$courierCreatedAt', null] },
                  { $gte: ['$courierCreatedAt', gteDate] },
                  { $lte: ['$courierCreatedAt', lteDate] },
                ],
              },
              1,
              0,
            ],
          },
        },
        courierOrdersAmount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$courierCreatedAt', null] },
                  { $gte: ['$courierCreatedAt', gteDate] },
                  { $lte: ['$courierCreatedAt', lteDate] },
                ],
              },
              '$grandTotal',
              0,
            ],
          },
        },
      },
    });

    try {
      const dataAggregates = await this.orderModel.aggregate(aggregatesOrders);
      const dataAggregatesCourier = await this.orderModel.aggregate(
        aggregatesOrdersCourier,
      );

      return {
        data: dataAggregates[0] || {}, // Return the grouped data
        courier: dataAggregatesCourier[0] || {}, // Return the grouped data
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Orderion mismatch');
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getDashboardCategoryByProduct(
    vendor: Vendor,
    shop: any,
  ): Promise<ResponsePayload> {
    try {
      // Initialize the data array
      const data: { categoryName: string; productCount: number }[] = [];

      // Find categories by shop
      const categoryData = await this.categoryModel.find({ shop: shop });

      // Iterate through each category
      for (const cData of categoryData) {
        // Count products associated with the category
        const productCount = await this.orderModel.countDocuments({
          'orderedItems.category._id': cData._id,
        });

        // Only add categories with productCount > 0
        if (productCount > 0) {
          data.push({
            categoryName: cData.name,
            productCount: productCount,
          });
        }
      }

      // Sort the data array in descending order by productCount
      data.sort((a, b) => b.productCount - a.productCount);

      return {
        success: true,
        message: 'Data Retrieved Successfully',
        data,
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSalesData(period: string, shopId: string): Promise<any> {
    let startDate: Date;
    const endDate = new Date(); // Current date as the end date

    // Define the start date based on the period
    if (period === 'yearly') {
      startDate = new Date(endDate.getFullYear() - 2, 0, 1); // Start from 2 years ago
    } else if (period === 'monthly') {
      startDate = new Date(endDate.getFullYear(), 0, 1); // Start of the current year
    } else if (period === 'weekly') {
      // Calculate the start of the current week (Monday to Sunday)
      const currentDay = endDate.getDay();
      const daysToStartOfWeek = currentDay === 0 ? 6 : currentDay - 1; // If it's Sunday (0), go back 6 days
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - daysToStartOfWeek); // Move to Monday of the same week
      startDate.setHours(0, 0, 0, 0); // Set start of the day
    } else {
      throw new Error('Invalid period');
    }

    // Fetch sales data
    const salesData = await this.orderModel.aggregate([
      {
        $match: {
          shop: new ObjectId(shopId), // Filter by shop ID
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          orderStatus: {
            $ne: 'cancelled', // Exclude cancelled orders
          },
          status: {
            $ne: 'trash', // Exclude status orders
          },
        },
      },
      {
        $addFields: {
          // Calculate orderProfit for each document
          orderProfit: {
            $reduce: {
              input: '$orderedItems', // Access orderedItems array
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  {
                    $multiply: [
                      {
                        $subtract: ['$$this.regularPrice', '$$this.costPrice'],
                      }, // Reference array fields
                      '$$this.quantity',
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          // Calculate totalProfit by subtracting discount
          totalProfit: {
            $subtract: ['$orderProfit', { $ifNull: ['$discount', 0] }], // Ensure discount is handled
          },
        },
      },
      {
        $group: {
          _id:
            period === 'yearly'
              ? { $year: '$createdAt' }
              : period === 'monthly'
                ? { $month: '$createdAt' }
                : { $dayOfWeek: '$createdAt' },
          totalRevenue: { $sum: '$grandTotal' },
          totalProfit: { $sum: '$totalProfit' }, // Sum totalProfit
        },
      },
      {
        $sort: { _id: 1 }, // Sort by the grouped field (year, month, or day of the week)
      },
    ]);

    // Prepare data for chart display
    let labels: string[] = [];
    const revenueData: number[] = [];
    const profitData: number[] = [];

    if (period === 'yearly') {
      // Handle yearly data
      labels = [
        String(endDate.getFullYear() - 2),
        String(endDate.getFullYear() - 1),
        String(endDate.getFullYear()),
      ];
      labels.forEach((year) => {
        const data = salesData.find((item) => String(item._id) === year);
        revenueData.push(data ? data.totalRevenue : 0);
        profitData.push(data ? data.totalProfit : 0);
      });
    } else if (period === 'monthly') {
      // Handle monthly data
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      labels = months;
      labels.forEach((_, index) => {
        const data = salesData.find((item) => item._id === index + 1); // Month index starts from 1
        revenueData.push(data ? data.totalRevenue : 0);
        profitData.push(data ? data.totalProfit : 0);
      });
    } else if (period === 'weekly') {
      // Handle weekly data
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      labels = days;
      labels.forEach((_, index) => {
        const data = salesData.find((item) => item._id === index + 1); // $dayOfWeek starts from 1 (Sunday)
        revenueData.push(data ? data.totalRevenue : 0);
        profitData.push(data ? data.totalProfit : 0);
      });
    }

    const data = {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueData,
          borderColor: '#5457cd',
          backgroundColor: '#5457cd',
        },
        {
          label: 'Profit',
          data: profitData,
          borderColor: '#dadafc',
          backgroundColor: '#dadafc',
        },
      ],
    };
    return {
      data,
    };
  }

  private async updateAffiliateBalance(affiliateId: any) {
    // 6. Earning & withdrawal data from affiliateReportModel
    const earningFilter = { affiliate: affiliateId, type: 'earning' };
    const withdrawalFilter = {
      affiliate: affiliateId,
      type: 'withdrawal',
      status: 'paid',
    };

    // const earningReports: any[] =
    //   await this.affiliateReportModel.find(earningFilter);
    // const withdrawalReports: any[] =
    //   await this.affiliateReportModel.find(withdrawalFilter);

    // const totalEarnings = earningReports.reduce(
    //   (sum, report) => sum + (report.amount || 0),
    //   0,
    // );
    // const totalPayment = withdrawalReports.reduce(
    //   (sum, report) => sum + (report.amount || 0),
    //   0,
    // );

    // Final response
    const finalData = {
      // totalEarning: totalEarnings,
      // totalRefers: earningReports.length,
      // paidAmount: totalPayment,
      // dueAmount: totalEarnings - totalPayment,
    };

    await this.affiliateModel.findByIdAndUpdate(
      affiliateId,
      { $set: finalData },
      { new: true, upsert: true },
    );
  }

  async getAffiliateData(period: string, affiliateId: string): Promise<any> {
    let startDate: Date;
    const endDate = new Date();

    // Calculate start date based on period
    if (period === 'yearly') {
      startDate = new Date(endDate.getFullYear() - 2, 0, 1);
    } else if (period === 'monthly') {
      startDate = new Date(endDate.getFullYear(), 0, 1);
    } else if (period === 'weekly') {
      const currentDay = endDate.getDay();
      const daysToStartOfWeek = currentDay === 0 ? 6 : currentDay - 1;
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - daysToStartOfWeek);
      startDate.setHours(0, 0, 0, 0);
    } else {
      throw new Error('Invalid period');
    }

    // const reports = await this.affiliateReportModel.aggregate([
    //   {
    //     $match: {
    //       affiliate: new ObjectId(affiliateId),
    //       createdAt: { $gte: startDate, $lte: endDate },
    //       $or: [
    //         { type: 'earning' },
    //         { type: 'withdrawal', status: 'paid' }, // ✅ Only paid withdrawals
    //       ],
    //     },
    //   },
    //   {
    //     $group: {
    //       _id:
    //         period === 'yearly'
    //           ? { $year: '$createdAt' }
    //           : period === 'monthly'
    //             ? { $month: '$createdAt' }
    //             : { $dayOfWeek: '$createdAt' },
    //       totalEarning: {
    //         $sum: {
    //           $cond: [{ $eq: ['$type', 'earning'] }, '$amount', 0],
    //         },
    //       },
    //       totalWithdrawal: {
    //         $sum: {
    //           $cond: [
    //             {
    //               $and: [
    //                 { $eq: ['$type', 'withdrawal'] },
    //                 { $eq: ['$status', 'paid'] },
    //               ],
    //             },
    //             '$amount',
    //             0,
    //           ],
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $sort: { _id: 1 },
    //   },
    // ]);

    // Prepare output
    let labels: string[] = [];
    const earningData: number[] = [];
    const withdrawalData: number[] = [];

    if (period === 'yearly') {
      labels = [
        String(endDate.getFullYear() - 2),
        String(endDate.getFullYear() - 1),
        String(endDate.getFullYear()),
      ];
      // labels.forEach((year) => {
      //   const data = reports.find((item) => String(item._id) === year);
      //   earningData.push(data ? data.totalEarning : 0);
      //   withdrawalData.push(data ? data.totalWithdrawal : 0);
      // });
    } else if (period === 'monthly') {
      labels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      // labels.forEach((_, index) => {
      //   const data = reports.find((item) => item._id === index + 1);
      //   earningData.push(data ? data.totalEarning : 0);
      //   withdrawalData.push(data ? data.totalWithdrawal : 0);
      // });
    } else if (period === 'weekly') {
      labels = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      // labels.forEach((_, index) => {
      //   const data = reports.find((item) => item._id === index + 1);
      //   earningData.push(data ? data.totalEarning : 0);
      //   withdrawalData.push(data ? data.totalWithdrawal : 0);
      // });
    }

    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Affiliate Earning',
            data: earningData,
            borderColor: '#36b37e',
            backgroundColor: '#36b37e',
          },
          {
            label: 'Withdrawal',
            data: withdrawalData,
            borderColor: '#ff595e',
            backgroundColor: '#ff595e',
          },
        ],
      },
    };
  }
}
