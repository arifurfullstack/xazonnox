import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../../shared/utils/utils.service';
import {
  AddCouponDto,
  CheckCouponDto,
  FilterAndPaginationCouponDto,
  OptionCouponDto,
  UpdateCouponDto,
} from './dto/coupon.dto';
import { Coupon } from './interfaces/coupon.interface';
import { User } from '../../user/interfaces/user.interface';
import { ResponsePayload } from '../../../interfaces/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import { Vendor } from '../../vendor/interfaces/vendor.interface';
import { Shop } from '../../shop/interfaces/shop.interface';
import { FilterAndPaginationProductDto } from '../../product/dto/product.dto';

const ObjectId = Types.ObjectId;

@Injectable()
export class CouponService {
  private logger = new Logger(CouponService.name);

  constructor(
    @InjectModel('Coupon') private readonly couponModel: Model<Coupon>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addCoupon()
   * insertManyCoupon()
   * getAllCouponsBasic()
   * getAllCouponsByShop()
   * getAllCoupons()
   * getCouponById()
   * updateCouponById()
   * updateMultipleCouponById()
   * deleteCouponById()
   * deleteMultipleCouponById()
   * checkCouponAvailability()
   */
  async addCoupon(
    vendor: Vendor,
    shop: string,
    addCouponDto: AddCouponDto,
  ): Promise<ResponsePayload> {
    const { name } = addCouponDto;

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

    const defaultData = {
      slug: this.utilsService.transformToSlug(name),
      shop: shop,
    };
    const mData = { ...addCouponDto, ...defaultData };

    const newData = new this.couponModel(mData);
    try {
      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };
      return {
        success: true,
        message: 'Data Added Success',
        data,
      } as ResponsePayload;
    } catch (error) {
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async insertManyCoupon(
    addCouponsDto: AddCouponDto[],
    optionCouponDto: OptionCouponDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionCouponDto;
    if (deleteMany) {
      await this.couponModel.deleteMany({});
    }
    const mData = addCouponsDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.name),
        },
      };
    });
    try {
      const saveData = await this.couponModel.insertMany(mData);
      return {
        success: true,
        message: `${
          saveData && saveData.length ? saveData.length : 0
        }  Data Added Success`,
      } as ResponsePayload;
    } catch (error) {
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async getAllCouponsBasic() {
    try {
      const pageSize = 10;
      const currentPage = 3;
      const data = await this.couponModel
        .find()
        .skip(pageSize * (currentPage - 1))
        .limit(Number(pageSize));
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllCouponsByShop(
    shop: string,
    filterCouponDto: FilterAndPaginationCouponDto,
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
      const { filter } = filterCouponDto;
      filterCouponDto.filter = { ...filter, ...{ shop: shop } };

      return this.getAllCoupons(filterCouponDto, searchQuery);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllCoupons(
    filterCouponDto: FilterAndPaginationCouponDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterCouponDto;
    const { pagination } = filterCouponDto;
    const { sort } = filterCouponDto;
    const { select } = filterCouponDto;
    // Aggregate Stages
    const aggregateScoupones = [];
    // Essential Variables
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      if (filter['shop']) {
        filter['shop'] = new ObjectId(filter['shop']);
      }

      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
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

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateScoupones.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateScoupones.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateScoupones.push({ $project: mSelect });
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

      aggregateScoupones.push(mPagination);

      aggregateScoupones.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates =
        await this.couponModel.aggregate(aggregateScoupones);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
        } as ResponsePayload;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getCouponById(
    shop: string,
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.couponModel.findOne({ _id: id, shop: shop });

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateCouponById(
    vendor: Vendor,
    shop: string,
    id: string,
    updateCouponDto: UpdateCouponDto,
  ): Promise<ResponsePayload> {
    try {
      const finalData = { ...updateCouponDto };

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
      await this.couponModel.findByIdAndUpdate(id, {
        $set: finalData,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleCouponById(
    vendor: Vendor,
    shop: string,
    ids: string[],
    updateCouponDto: UpdateCouponDto,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
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
      await this.couponModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateCouponDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteCouponById(
    vendor: Vendor,
    shop: string,
    id: string,
    checkUsage: boolean,
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

      await this.couponModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleCouponById(
    vendor: Vendor,
    shop: string,
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));

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

      await this.couponModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async checkCouponAvailability(
    shop: string,
    user: User,
    checkCouponDto: CheckCouponDto,
  ): Promise<ResponsePayload> {
    try {
      const { couponCode, subTotal } = checkCouponDto;

      const couponRegex = this.utilsService.createRegexFromString(couponCode);

      const couponData = await this.couponModel.findOne({
        couponCode: couponRegex,
        shop,
      });

      if (couponData) {
        const isExpired = this.utilsService.getDateDifference(
          new Date(),
          new Date(couponData.endDateTime),
          'seconds',
        );

        const isStartDate = this.utilsService.getDateDifference(
          new Date(),
          new Date(couponData.startDateTime),
          'seconds',
        );

        if (isStartDate > 0) {
          return {
            success: false,
            message: 'Sorry! Coupon offer is not start yet',
            data: null,
          } as ResponsePayload;
        }

        if (isExpired <= 0) {
          return {
            success: false,
            message: 'Sorry! Coupon Expired',
            data: null,
          } as ResponsePayload;
        } else {
          if (couponData['minimumAmount'] > subTotal) {
            return {
              success: false,
              message: `Sorry! Coupon minimum amount is ${couponData['minimumAmount']}`,
              data: null,
            } as ResponsePayload;
          } else {
            return {
              success: true,
              message: 'Success! Coupon added.',
              data: {
                _id: couponData._id,
                discountAmount: couponData['discountAmount'],
                discountType: couponData['discountType'],
                couponCode: couponData['couponCode'],
              },
            } as ResponsePayload;
          }
        }
      } else {
        return {
          success: false,
          message: 'Sorry! Invalid coupon code',
          data: null,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
