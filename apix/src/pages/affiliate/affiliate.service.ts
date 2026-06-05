import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ErrorCodes } from '../../enum/error-code.enum';
import * as bcrypt from 'bcryptjs';
import {
  Affiliate,
  AffiliateAuthResponse,
  AffiliateJwtPayload,
} from './interfaces/affiliate.interface';
import {
  AffiliateSelectFieldDto,
  AuthAffiliateDto,
  CheckAffiliateDto,
  CreateAffiliateDto,
  FilterAndPaginationAffiliateDto,
  ResetAffiliatePasswordDto,
  UpdateAffiliateDto,
} from './dto/affiliate.dto';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import { UtilsService } from '../../shared/utils/utils.service';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { OtpService } from '../otp/otp.service';
import { Shop } from '../shop/interfaces/shop.interface';

import { ObjectId } from 'mongodb';
import { UniqueUserId } from '../../interfaces/unique-user-id.interface';
import { AffiliateProduct } from '../affiliate-product/interfaces/affiliate-product.interface';

import { ShopInformation } from '../customization/shop-information/interfaces/shop-information.interface';
import { AffiliateConnection } from './interfaces/affiliate-connection.interface';
import { Setting } from '../customization/setting/interface/setting.interface';

@Injectable()
export class AffiliateService {
  private logger = new Logger(AffiliateService.name);

  constructor(
    @InjectModel('Affiliate') private readonly affiliateModel: Model<Affiliate>,

    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
    @InjectModel('UniqueUserId')
    private readonly uniqueUserIdModel: Model<UniqueUserId>,


    @InjectModel('AffiliateProduct')
    private readonly affiliateProductModel: Model<AffiliateProduct>,
    @InjectModel('ShopInformation')
    private readonly shopInformationModel: Model<ShopInformation>,

    @InjectModel('Setting')
    private readonly settingModel: Model<Setting>,

    @InjectModel('AffiliateConnection')
    private readonly affiliateConnectionModel: Model<AffiliateConnection>,

    protected jwtService: JwtService,
    private configService: ConfigService,
    private utilsService: UtilsService,
    private otpService: OtpService,
  ) {}

  /**
   * Affiliate Methods
   * checkAffiliateWithPhoneNo()
   */

  async checkAffiliateWithPhoneNo(
    shop: string,
    checkAffiliateDto: CheckAffiliateDto,
    handleOtp?: boolean,
  ): Promise<ResponsePayload> {
    try {
      const { phoneNo, countryCode } = checkAffiliateDto;

      const fAffiliate = await this.affiliateModel.findOne({
        username: `${countryCode}${phoneNo}`,
      });

      if (!fAffiliate) {
        if (handleOtp) {
          await this.otpService.generateOtpWithPhoneNo(shop, {
            phoneNo: phoneNo,
          });
          return {
            success: true,
            message: 'Affiliate available with this username and sent otp',
            data: { type: 'signup' },
          } as ResponsePayload;
        } else {
          return {
            success: true,
            message: 'Affiliate available with this username',
            data: { type: 'signup' },
          } as ResponsePayload;
        }
      } else {
        return {
          success: true,
          message: 'Affiliate already exists in this username',
          data: { _id: fAffiliate._id, type: 'login' },
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async affiliateSignup(
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    try {
      const {
        isPasswordLess,
        password,
        registrationType,
        phoneNo,
        username,
        email,
        shops,
        role,
        ownerId,
        ownerType,
      } = createAffiliateDto;

      if (registrationType === 'default') {
        if (username) {
          const existingUsername = await this.affiliateModel.findOne({
            username,
          });
          if (existingUsername) {
            return {
              success: false,
              message: `Sorry! Username already exists`,
              data: null,
            } as ResponsePayload;
          }
        }

        if (email) {
          const existingEmail = await this.affiliateModel.findOne({ email });
          if (existingEmail) {
            return {
              success: false,
              message: `Sorry! Email already exists`,
              data: null,
            } as ResponsePayload;
          }
        }

        if (phoneNo) {
          const existingPhoneNo = await this.affiliateModel.findOne({
            phoneNo,
          });
          if (existingPhoneNo) {
            return {
              success: false,
              message: `Sorry! Phone number already exists`,
              data: null,
            } as ResponsePayload;
          }
        }

        let hashedPass: string;
        if (!isPasswordLess) {
          const salt = await bcrypt.genSalt();
          hashedPass = await bcrypt.hash(password, salt);
        } else {
          return {
            success: false,
            message: `Sorry! Password less login is not acceptable here.`,
            data: null,
          } as ResponsePayload;
        }

        const defaultData = {
          password: hashedPass,
          registrationAt: this.utilsService.getDateString(new Date()),
          lastLoggedIn: null,
          status: 'active',
          role: role,
        };

        const finalData = { ...createAffiliateDto, ...defaultData };

        const saveData = await this.affiliateModel.create(finalData);
        const data = {
          username: saveData.username,
          email: saveData.email,
          phoneNo: saveData.phoneNo,
          name: saveData.name,
          _id: saveData._id,
          role: saveData.role,
        };

        if (saveData && ownerId && ownerType) {
          await this.sendRequestForAffiliateRegistrationByOwner(
            ownerId,
            ownerType,
            saveData._id.toString(),
          );
        }

        if (shops && shops.length) {
          for (const shop of shops) {
            await this.shopModel.findByIdAndUpdate(shop._id, {
              $addToSet: {
                users: {
                  _id: saveData._id,
                  username: saveData.username,
                  role: saveData.role,
                },
              },
            });
          }
        }

        return {
          success: true,
          message: 'Success',
          data: data,
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Sorry! Only default registration is available',
          data: null,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  private async sendRequestForAffiliateRegistrationByOwner(
    ownerId: string,
    ownerType: string,
    affiliateId: string,
  ): Promise<{ message: string }> {
    if (!ownerId || !ownerType || !affiliateId) {
      return {
        message:
          'Missing ownerId, ownerType, or affiliateId. Skipping connection creation.',
      };
    }

    const existingConnection = await this.affiliateConnectionModel.findOne({
      affiliate: affiliateId,
      ownerId,
      ownerType,
    });

    if (existingConnection) {
      await this.affiliateConnectionModel.updateOne(
        {
          affiliate: affiliateId,
          ownerId,
          ownerType,
        },
        {
          $set: {
            status: 'pending',
            updatedAt: new Date(),
          },
        },
      );
    } else {
      await this.affiliateConnectionModel.create({
        affiliate: affiliateId,
        ownerId,
        ownerType,
        status: 'pending',
        updatedAt: new Date(),
      });
    }

    return { message: 'Request sent and pending approval.' };
  }

  private async affiliateSignupBase(
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    try {
      const {
        isPasswordLess,
        password,
        registrationType,
        phoneNo,
        username,
        email,
        role,
      } = createAffiliateDto;

      if (registrationType === 'default') {
        if (username) {
          const existingUsername = await this.affiliateModel.findOne({
            username,
          });
          if (existingUsername) {
            return {
              success: false,
              message: `Sorry! Username already exists`,
              data: null,
            } as ResponsePayload;
          }
        }

        if (email) {
          const existingEmail = await this.affiliateModel.findOne({ email });
          if (existingEmail) {
            return {
              success: false,
              message: `Sorry! Email already exists`,
              data: null,
            } as ResponsePayload;
          }
        }

        if (phoneNo) {
          const existingPhoneNo = await this.affiliateModel.findOne({
            phoneNo,
          });
          if (existingPhoneNo) {
            return {
              success: false,
              message: `Sorry! Phone number already exists`,
              data: null,
            } as ResponsePayload;
          }
        }

        let hashedPass: string;
        if (!isPasswordLess) {
          const salt = await bcrypt.genSalt();
          hashedPass = await bcrypt.hash(password, salt);
        } else {
          return {
            success: false,
            message: `Sorry! Password less login is not acceptable here.`,
            data: null,
          } as ResponsePayload;
        }

        // Create user Id
        const userIdUnique = await this.getUniqueUserId();

        const defaultData = {
          password: hashedPass,
          registrationAt: this.utilsService.getDateString(new Date()),
          lastLoggedIn: null,
          status: 'active',
          userId: userIdUnique,
        };

        const finalData = { ...createAffiliateDto, ...defaultData };

        // const saveData:any = {  };
        const saveData = await this.affiliateModel.create(finalData);
        const data = {
          username: saveData.username,
          email: saveData.email,
          phoneNo: saveData.phoneNo,
          name: saveData.name,
          _id: saveData._id,
          role: saveData.role,
        };

        return {
          success: true,
          message: 'Success',
          data: data,
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Sorry! Only default registration is available',
          data: null,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async affiliateSignupOwner(
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    try {
      createAffiliateDto.role = 'owner';
      return this.affiliateSignupBase(createAffiliateDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async affiliateUserSignupByShop(
    shop: string,
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    try {
      createAffiliateDto.role = 'owner';
      createAffiliateDto.shop = shop;
      return this.affiliateSignupBase(createAffiliateDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async affiliateLogin(
    authAffiliateDto: AuthAffiliateDto,
  ): Promise<AffiliateAuthResponse> {
    try {
      const { identifier } = authAffiliateDto;
      console.log('identifier', identifier);
      const fAffiliate = await this.affiliateModel
        .findOne({
          $or: [
            { username: identifier },
            { phoneNo: identifier },
            { email: identifier },
          ],
        })
        .select(
          'password username status isPasswordLess failedLoginStartTime failedLoginCount role hasAccess',
        );

      if (!fAffiliate) {
        return {
          success: false,
          message: 'Sorry! No account found.',
        } as AffiliateAuthResponse;
      }

      // Check Failed Login
      if (fAffiliate.failedLoginCount && fAffiliate.failedLoginCount >= 10) {
        const diff = this.utilsService.getDateDifference(
          fAffiliate.failedLoginStartTime,
          new Date(),
          'minutes',
        );

        if (diff <= 30) {
          return {
            success: false,
            message: `Sorry! Many Failed login. Please try after ${
              30 - diff
            } minutes`,
          } as AffiliateAuthResponse;
        } else {
          await this.affiliateModel.findByIdAndUpdate(fAffiliate._id, {
            $set: {
              failedLoginCount: 0,
              failedLoginStartTime: null,
            },
          });
          fAffiliate.failedLoginStartTime = null;
          fAffiliate.failedLoginCount = 0;
        }
      }

      if (fAffiliate.status !== 'active') {
        return {
          success: false,
          message: `No Access for Login. account status: ${fAffiliate.status}`,
        } as AffiliateAuthResponse;
      }
      if (!fAffiliate.hasAccess) {
        return {
          success: false,
          message: `No Access for Login. account status: ${fAffiliate.hasAccess}`,
        } as AffiliateAuthResponse;
      }

      if (!fAffiliate.isPasswordLess) {
        const isMatch = await bcrypt.compare(
          authAffiliateDto.password,
          fAffiliate.password,
        );

        if (isMatch) {
          const payload: AffiliateJwtPayload = {
            _id: fAffiliate._id,
            username: fAffiliate.username,
          };
          const jwtSecret =
            this.configService.get<string>('affiliateJwtSecret');
          const expiresInDays = this.configService.get<string>(
            'affiliateTokenExpiredTime',
          );

          const accessToken = this.jwtService.sign(payload, {
            secret: jwtSecret,
            expiresIn: expiresInDays,
          });
          // Update Login Info
          await this.affiliateModel.findByIdAndUpdate(fAffiliate._id, {
            $set: {
              failedLoginStartTime: null,
              failedLoginCount: 0,
              lastLoggedIn: new Date(),
            },
          });

          // Find Shops
          const shops = await this.shopModel.find({
            'users._id': fAffiliate._id,
          });
          const jShops = JSON.parse(JSON.stringify(shops));
          const mShops = jShops.map((m: Shop) => {
            return {
              _id: m._id,
              websiteName: m.websiteName,
              subDomain: m.subDomain,
              domain: m.domain,
              dateString: m.dateString,
              user: m.users.find(
                (f) => f._id.toString() === fAffiliate._id.toString(),
              ),
            };
          });

          return {
            success: true,
            message: 'Login success!',
            data: {
              _id: fAffiliate._id,
              role: fAffiliate.role,
            },
            token: accessToken,
            tokenExpiredInDays: expiresInDays,
            shops: mShops,
          } as AffiliateAuthResponse;
        } else {
          await this.affiliateModel.findByIdAndUpdate(
            fAffiliate._id,
            {
              $set: {
                failedLoginStartTime:
                  fAffiliate.failedLoginStartTime ?? new Date(),
              },
              $inc: {
                failedLoginCount: 1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );

          return {
            success: false,
            message: 'Password not matched!',
            data: null,
            token: null,
            tokenExpiredIn: null,
          } as AffiliateAuthResponse;
        }
      } else {
        return {
          success: false,
          message: 'Sorry! Password less login is not available.',
          data: null,
          token: null,
          tokenExpiredIn: null,
        } as AffiliateAuthResponse;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async addAffiliateByAuth(
    affiliate: Affiliate,
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    try {
      createAffiliateDto.phoneNo = null;
      createAffiliateDto.email = null;
      return this.affiliateSignup(createAffiliateDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // async affiliateSignupAndLogin(
  //   createAffiliateDto: CreateAffiliateDto,
  // ): Promise<ResponsePayload> {
  //   try {
  //     const { phoneNo, registrationType, countryCode, password } =
  //       createAffiliateDto;
  //
  //     if (registrationType === 'default') {
  //       createAffiliateDto.role = 'owner';
  //       const signupRes = await this.affiliateSignup({
  //         ...createAffiliateDto,
  //
  //
  //       });
  //       // if (signupRes.success) {
  //       //   return this.affiliateLogin({
  //       //     identifier: signupRes.data.username,
  //       //     password: password,
  //       //   });
  //       // } else {
  //       //   return signupRes;
  //       // }
  //       return signupRes
  //     } else {
  //       return {
  //         success: false,
  //         message: 'Sorry! Only phone no registration is available',
  //         data: null,
  //       } as ResponsePayload;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  async affiliateSignupAndLogin(
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    try {
      const { phoneNo, registrationType, countryCode, password } =
        createAffiliateDto;

      if (registrationType === 'default') {
        createAffiliateDto.role = 'owner';
        const signupRes = await this.affiliateSignup({
          ...createAffiliateDto,
        });
        if (signupRes.success) {
          return this.affiliateLogin({
            identifier: signupRes.data.username,
            password: password,
          });
        } else {
          return signupRes;
        }
      } else {
        return {
          success: false,
          message: 'Sorry! Only phone no registration is available',
          data: null,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Logged-in Affiliate Info
   * Get All Affiliates V3 (Filter, Pagination, Select, Sort, Search Query with Aggregation) ** Recommended
   * Get All Affiliates by Search
   */

  async getLoggedInAffiliateData(
    affiliate: Affiliate,
    selectQuery: AffiliateSelectFieldDto,
  ): Promise<ResponsePayload> {
    try {
      let { select } = selectQuery;
      if (!select) {
        select = '-password';
      }
      const data = await this.affiliateModel
        .findById(affiliate._id)
        .select(select);
      return {
        data,
        success: true,
      } as ResponsePayload;
    } catch (err) {
      this.logger.error(`${affiliate.username} is failed to retrieve data`);
      // console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getAllAffiliatesByShop(
    shop: string,
    affiliate: Affiliate,
    filterAffiliateDto: FilterAndPaginationAffiliateDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    if (!shop) {
      return {
        success: false,
        message: 'Sorry! no data found.',
      } as ResponsePayload;
    }

    // Modify Filter
    const { filter } = filterAffiliateDto;
    filterAffiliateDto.filter = { ...filter, ...{ shop: shop } };

    return this.getAllAffiliates(filterAffiliateDto, searchQuery);
  }

  async getAllAffiliates(
    filterAffiliateDto: FilterAndPaginationAffiliateDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterAffiliateDto;
    const { pagination } = filterAffiliateDto;
    const { sort } = filterAffiliateDto;
    const { select } = filterAffiliateDto;

    // Update Calculation
    // const updataData = await this.updateCalculation();

    // Essential Variables
    const aggregateStages = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }

    if (searchQuery) {
      mFilter = { ...mFilter, ...{ shopName: new RegExp(searchQuery, 'i') } };
    }
    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      // Remove Sensitive Select
      delete select.password;
      mSelect = { ...mSelect, ...select };
    } else {
      mSelect = { password: 0 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateStages.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateStages.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateStages.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      // Remove Sensitive Select
      delete mSelect['password'];
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
              { $project: { password: 0 } },
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
      const dataAggregates =
        await this.affiliateModel.aggregate(aggregateStages);
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
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Get Affiliate by ID
   * Update Logged In Affiliate Info
   * Change Logged In Affiliate Password
   * Update Affiliate by Id
   * Update Multiple Affiliate By Id
   * Delete Affiliate by Id
   * Delete Multiple Affiliate By Id
   */
  async getAffiliateById(
    id: string,
    affiliateSelectFieldDto: AffiliateSelectFieldDto,
  ): Promise<ResponsePayload> {
    try {
      let { select } = affiliateSelectFieldDto;
      if (!select) {
        select = '-password';
      }
      const data = await this.affiliateModel.findById(id).select(select);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async getAllMyJobs(affiliateId: string, search?: string) {
    // Step 1: Get all approved affiliate connections
    const approvedConnections = await this.affiliateConnectionModel.find({
      affiliate: affiliateId,
      status: 'approved',
    });

    if (!approvedConnections.length) {
      return { data: [] };
    }

    // Step 2: Prepare owner filters for products
    const shopOwnerIds = approvedConnections
      .filter((c) => c.ownerType === 'shop')
      .map((c) => c.ownerId);

    const adminOwnerIds = approvedConnections
      .filter((c) => c.ownerType === 'admin')
      .map((c) => c.ownerId);

    // Step 3: Fetch all matching published products
    const allProducts: any = await this.affiliateProductModel.find({
      status: 'publish',
      $or: [
        { ownerType: 'shop', ownerId: { $in: shopOwnerIds } },
        { ownerType: 'admin', ownerId: { $in: adminOwnerIds } },
      ],
    });

    // Step 4: Group products by owner
    const grouped = new Map<
      string,
      { ownerId: string; ownerType: string; products: any[] }
    >();

    for (const product of allProducts) {
      const key = `${product.ownerType}_${product.ownerId}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          ownerId: product.ownerId,
          ownerType: product.ownerType,
          products: [],
        });
      }
      grouped.get(key)!.products.push(product);
    }

    // Step 5: Build result array with optional search
    const results: any[] = [];

    for (const [key, group] of grouped.entries()) {
      const { ownerId, ownerType, products } = group;
      let name = '';
      let image = '';

      if (ownerType === 'shop') {
        const shop = await this.shopModel.findById(ownerId);
        if (!shop) continue;

        if (
          search &&
          !shop.websiteName?.toLowerCase().includes(search.toLowerCase())
        ) {
          continue;
        }

        const shopInfo = await this.shopInformationModel
          .findOne({ shop: ownerId })
          .select('logoPrimary');

        name = shop.websiteName || '';
        image = shopInfo?.logoPrimary || '';
      }
      // else if (ownerType === 'admin') {
      //   const admin = await this.adminModel.findById(ownerId);
      //   if (!admin) continue;
      //
      //   if (
      //     search &&
      //     !admin.name?.toLowerCase().includes(search.toLowerCase())
      //   ) {
      //     continue;
      //   }
      //
      //   name = admin.name || '';
      //   image = admin.profileImg || '';
      // }

      results.push({
        type: ownerType,
        ownerId,
        ownerName: name,
        name,
        image,
        products: products.map((p) => ({
          id: p._id,
          name: p.name,
          slug: p.slug,
          url: p.url,
          price: p.price,
          regularPrice: p.regularPrice,
          discountAmount: p.discountAmount,
          ownerId: p.ownerId,
          ownerType: p.ownerType,
          description: p.description,
          image: p.image,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      });
    }

    return { data: results };
  }

  async getAllUnapprovedMyJobs(affiliateId: string, search?: string) {
    // Step 1: Get all approved affiliate connections
    const approvedConnections = await this.affiliateConnectionModel.find({
      affiliate: affiliateId,
      status: 'pending',
    });

    if (!approvedConnections.length) {
      return { data: [] };
    }

    // Step 2: Prepare owner filters for products
    const shopOwnerIds = approvedConnections
      .filter((c) => c.ownerType === 'shop')
      .map((c) => c.ownerId);

    const adminOwnerIds = approvedConnections
      .filter((c) => c.ownerType === 'admin')
      .map((c) => c.ownerId);

    // Step 3: Fetch all matching published products
    const allProducts: any = await this.affiliateProductModel.find({
      status: 'publish',
      $or: [
        { ownerType: 'shop', ownerId: { $in: shopOwnerIds } },
        { ownerType: 'admin', ownerId: { $in: adminOwnerIds } },
      ],
    });

    // Step 4: Group products by owner
    const grouped = new Map<
      string,
      { ownerId: string; ownerType: string; products: any[] }
    >();

    for (const product of allProducts) {
      const key = `${product.ownerType}_${product.ownerId}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          ownerId: product.ownerId,
          ownerType: product.ownerType,
          products: [],
        });
      }
      grouped.get(key)!.products.push(product);
    }

    // Step 5: Build result array with optional search
    const results: any[] = [];

    for (const [key, group] of grouped.entries()) {
      const { ownerId, ownerType, products } = group;
      let name = '';
      let image = '';

      if (ownerType === 'shop') {
        const shop = await this.shopModel.findById(ownerId);
        if (!shop) continue;

        if (
          search &&
          !shop.websiteName?.toLowerCase().includes(search.toLowerCase())
        ) {
          continue;
        }

        const shopInfo = await this.shopInformationModel
          .findOne({ shop: ownerId })
          .select('logoPrimary');

        name = shop.websiteName || '';
        image = shopInfo?.logoPrimary || '';
      } else if (ownerType === 'admin') {
        // const admin = await this.adminModel.findById(ownerId);
        // if (!admin) continue;

        // if (
        //   search &&
        //   !admin.name?.toLowerCase().includes(search.toLowerCase())
        // ) {
        //   continue;
        // }
        //
        // name = admin.name || '';
        // image = admin.profileImg || '';
      }

      results.push({
        type: ownerType,
        ownerId,
        ownerName: name,
        name,
        image,
        products: products.map((p) => ({
          id: p._id,
          name: p.name,
          slug: p.slug,
          url: p.url,
          price: p.price,
          ownerId: p.ownerId,
          ownerType: p.ownerType,
          regularPrice: p.regularPrice,
          discountAmount: p.discountAmount,
          description: p.description,
          image: p.image,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      });
    }

    return { data: results };
  }

  async getAllJobOpportunityForAffiliate(affiliateId: string, search?: string) {
    // Step 1: Get all published products
    const allProducts: any[] = await this.affiliateProductModel.find({
      status: 'publish',
    });

    // Step 2: Get all affiliate connections for this affiliate
    const existingConnections = await this.affiliateConnectionModel.find({
      affiliate: affiliateId,
    });

    // Step 3: Make a Set of connected owners (to skip them)
    const connectedOwnerKeys = new Set(
      existingConnections.map(
        (conn) => `${conn.ownerType}_${conn.ownerId?.toString()}`,
      ),
    );


    // Step 4: Group products by ownerType + ownerId
    const groupedMap = new Map<
      string,
      { ownerId: string; ownerType: string; products: any[] }
    >();

    for (const product of allProducts) {
      if (!product.ownerId || !product.ownerType) {
        // console.warn('Skipping product due to missing owner info', product._id);
        continue;
      }

      const ownerIdStr = product.ownerId.toString();
      const key = `${product.ownerType}_${ownerIdStr}`;

      if (connectedOwnerKeys.has(key)) continue;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          ownerId: ownerIdStr,
          ownerType: product.ownerType,
          products: [],
        });
      }

      groupedMap.get(key)!.products.push(product);
    }

    // Step 5: Prepare requestable list with owner info
    const requestable: any[] = [];

    for (const entry of groupedMap.values()) {
      const { ownerId, ownerType, products } = entry;

      let name = '';
      let image = '';

      if (ownerType === 'shop') {
        const shop: any = await this.shopModel.findOne({
          _id: ownerId,
          affiliateAccess: true,
        });
        if (!shop) continue;

        const setting: any = await this.settingModel.findOne({
          shop: shop._id,
        });
        if (!setting.affiliate.isAffiliate) continue;

        const shopInfo = await this.shopInformationModel
          .findOne({ shop: shop._id })
          .select('logoPrimary');

        name = shop.websiteName || '';
        image = shopInfo?.logoPrimary || '';
      }
      // else if (ownerType === 'admin') {
      //   const admin: any = await this.adminModel.findOne({
      //     _id: ownerId,
      //     affiliateAccess: true,
      //   });
      //   if (!admin) continue;
      //
      //   name = admin.name || '';
      //   image = admin.profileImg || '';
      // }

      requestable.push({
        id: ownerId,
        name,
        type: ownerType,
        productCount: products.length,
        image,
        productId: products[0]._id,
        matchedProducts: products,
      });
    }

    // Step 6: Search by owner name (if provided)
    const filtered = search
      ? requestable.filter((entry) =>
          entry.name?.toLowerCase().includes(search.toLowerCase()),
        )
      : requestable;

    // Step 7: Return results
    return { data: filtered };
  }

  async getAllPendingAffiliates(
    ownerType: 'shop' | 'admin',
    ownerId: string,
    search?: string,
  ) {
    // Step 1: Find all pending affiliate connections for this owner
    const connections: any = await this.affiliateConnectionModel
      .find({
        ownerType,
        ownerId,
        status: 'pending',
      })
      .populate('affiliate', 'name email phoneNo nidImg nidBackImg profileImg'); // Populate affiliate details (name, email, etc.)
    let pendingList = connections;

    // Step 2: Apply search filter (if provided)
    if (search) {
      const keyword = search.toLowerCase();
      pendingList = pendingList.filter((item) => {
        const aff = item.affiliate;
        return (
          aff?.name?.toLowerCase().includes(keyword) ||
          aff?.email?.toLowerCase().includes(keyword) ||
          aff?.phoneNo?.toLowerCase().includes(keyword)
        );
      });
    }

    // Step 3: Return result
    return {
      total: pendingList.length,
      data: pendingList,
    };
  }

  async getAllApprovedAffiliates(
    ownerType: 'shop' | 'admin',
    ownerId: string,
    search?: string,
  ) {
    // Step 1: Find all non-pending affiliate connections for this owner
    const connections: any = await this.affiliateConnectionModel
      .find({
        ownerType,
        ownerId,
        status: { $ne: 'pending' },
      })
      .populate('affiliate', 'name email phoneNo nidImg nidBackImg profileImg');

    let filteredList = connections;

    // Step 2: Apply search filter (if provided)
    if (search) {
      const keyword = search.toLowerCase();
      filteredList = filteredList.filter((item) => {
        const aff = item.affiliate;
        return (
          aff?.name?.toLowerCase().includes(keyword) ||
          aff?.email?.toLowerCase().includes(keyword) ||
          aff?.phoneNo?.toLowerCase().includes(keyword) ||
          aff?.profileImg?.toLowerCase().includes(keyword)
        );
      });
    }

    // Step 3: Return results
    return {
      total: filteredList.length,
      data: filteredList,
    };
  }

  async getApprovedAffiliatesWithPaymentInfo(
    ownerId: string,
    ownerType: 'shop' | 'admin',
  ) {
    // const model: any = ownerType === 'shop' ? this.shopModel : this.adminModel;
    // const owner: any = await model.findById(ownerId);
    // if (!owner) throw new NotFoundException(`${ownerType} not found`);

    // const approvedAffiliates: any = owner.affiliateStatusList.filter(
    //   (entry) => entry.status === 'approved',
    // );

    // const affiliateIds: any = approvedAffiliates.map((a) => a.affiliate);

    // const affiliates: any = await this.affiliateModel.find({
    //   _id: { $in: affiliateIds },
    // });

    // return affiliates.map((a) => {
    //   const payment: any = a.paymentInfo.find(
    //     (p) => p.ownerId.toString() === ownerId && p.ownerType === ownerType,
    //   );
    //
    //   return {
    //     id: a._id,
    //     name: a.name,
    //     phoneNo: a.phoneNo,
    //     email: a.email,
    //     paymentInfo: payment
    //       ? {
    //           paymentType: payment.paymentType,
    //           accountInfo: payment.accountInfo,
    //         }
    //       : null,
    //   };
    // });
  }

  async getSingleAffiliatePaymentInfo(
    ownerId: string,
    ownerType: 'shop' | 'admin',
    affiliateId: string,
  ) {
    // Step 1: Check if approved connection exists
    const connection: any = await this.affiliateConnectionModel
      .findOne({
        ownerId,
        ownerType,
        affiliate: affiliateId,
        status: 'approved',
      })
      .populate('affiliate', 'name phoneNo email');

    if (!connection) {
      throw new NotFoundException('Approved affiliate connection not found.');
    }

    // Step 2: Return affiliate basic info with payment fields
    return {
      data: {
        id: connection.affiliate._id,
        name: connection.affiliate.name,
        phoneNo: connection.affiliate.phoneNo,
        email: connection.affiliate.email,
        paymentInfo: {
          paymentType: connection.paymentType || null,
          accountInfo: connection.accountInfo || null,
        },
      },
    };
  }

  // ✅ Affiliator requests product access

  async sendRequestForAffiliateAccessFromAdminOrShop(
    affiliateId: string,
    productId: string,
  ) {
    // Step 1: Find the affiliate product
    const product: any = await this.affiliateProductModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    // Step 2: Determine ownerType and ownerId
    const ownerId = product.ownerId;
    const ownerType = product.ownerType; // 'shop' or 'admin'

    // Step 3: Check if a connection already exists
    const existingConnection = await this.affiliateConnectionModel.findOne({
      affiliate: affiliateId,
      ownerId,
      ownerType,
    });

    if (existingConnection) {
      // Step 4a: If exists, update status and timestamp using updateOne
      await this.affiliateConnectionModel.updateOne(
        {
          affiliate: affiliateId,
          ownerId,
          ownerType,
        },
        {
          $set: {
            status: 'pending',
            updatedAt: new Date(),
          },
        },
      );
    } else {
      // Step 4b: Else create a new affiliate connection
      await this.affiliateConnectionModel.create({
        affiliate: affiliateId,
        ownerId,
        ownerType,
        status: 'pending',
        updatedAt: new Date(),
      });
    }

    // Step 5: Return success
    return { message: 'Request sent and pending approval.' };
  }


  // ✅ Affiliator requests from admin access
  async sendRequestForAffiliateAccessFromAdmin(
    affiliateId: string,
    productId: string,
  ) {
    // Step 1: Find the affiliate product
    const product: any = await this.affiliateProductModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    // Step 2: Determine ownerType and ownerId
    const ownerId = product.ownerId;
    const ownerType = product.ownerType; // 'shop' or 'admin'

    // Step 3: Check if a connection already exists
    const existingConnection = await this.affiliateConnectionModel.findOne({
      affiliate: affiliateId,
      ownerId,
      ownerType,
    });

    if (existingConnection) {
      // Step 4a: If exists, update status and timestamp using updateOne
      await this.affiliateConnectionModel.updateOne(
        {
          affiliate: affiliateId,
          ownerId,
          ownerType,
        },
        {
          $set: {
            status: 'approved',
            updatedAt: new Date(),
          },
        },
      );
    } else {
      // Step 4b: Else create a new affiliate connection
      await this.affiliateConnectionModel.create({
        affiliate: affiliateId,
        ownerId,
        ownerType,
        status: 'approved',
        updatedAt: new Date(),
      });
    }

    // Step 5: Return success
    return { message: 'Request sent and approved.' };
  }

  async requestWithdrawal(
    affiliateId: string,
    ownerId: string,
    ownerType: 'shop' | 'admin',
  ): Promise<any> {
    // Step 1: Calculate total withdrawable earnings
    // const totalEarnings = await this.affiliateReportModel.aggregate([
    //   {
    //     $match: {
    //       type: 'earning',
    //       affiliate: new mongoose.Types.ObjectId(affiliateId),
    //       ownerId: new mongoose.Types.ObjectId(ownerId),
    //       ownerType,
    //       $or: [
    //         { linkedWithdrawalId: null },
    //         { linkedWithdrawalId: { $exists: false } },
    //       ],
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       total: { $sum: '$amount' },
    //     },
    //   },
    // ]);

    // const available = totalEarnings?.[0]?.total || 0;

    // Step 2: Find affiliate connection instead of shop/admin
    const connection = await this.affiliateConnectionModel.findOne({
      affiliate: affiliateId,
      ownerId,
      ownerType,
    });

    if (!connection) {
      throw new NotFoundException('Affiliate connection not found.');
    }

    // // Step 3: Optional minWithdrawAmount check
    // const minWithdrawAmount = connection.minWithdrawAmount || 1000;
    // if (available < minWithdrawAmount) {
    //   throw new BadRequestException(
    //     `Minimum ${minWithdrawAmount}৳ required to withdraw. Your current: ${available}৳`
    //   );
    // }

    // Step 4: Create withdrawal request
    const baseData: any = {
      type: 'withdrawal',
      affiliate: affiliateId,
      ownerType,
      ownerId,
      // amount: available,
      status: 'requested',
      dateString: new Date().toISOString().split('T')[0],
    };

    if (ownerType === 'shop') {
      baseData.shopId = ownerId;
    }

    // const report = await this.affiliateReportModel.create(baseData);

    // Step 5: Find and link earnings
    // let remaining = available;

    // const earnings: any = await this.affiliateReportModel
    //   .find({
    //     type: 'earning',
    //     affiliate: affiliateId,
    //     ownerId,
    //     ownerType,
    //     $or: [
    //       { linkedWithdrawalId: null },
    //       { linkedWithdrawalId: { $exists: false } },
    //     ],
    //   })
    //   .sort({ createdAt: 1 });

    // for (const earn of earnings) {
    //   if (remaining <= 0) break;
    //
    //   // await this.affiliateReportModel.updateOne(
    //   //   { _id: earn._id },
    //   //   { $set: { linkedWithdrawalId: report._id } },
    //   // );
    //
    //   remaining -= earn.amount;
    // }

    return {
      message: 'Withdrawal request sent.',
      // data: report,
    };
  }

  async updateAndPaymentClearWithdrawalRequest(
    reportId: string,
    body: any,
  ): Promise<ResponsePayload> {
    const { ownerId, ownerType, method, note, image } = body;

    // const report: any = await this.affiliateReportModel.findById(reportId);
    // if (!report) {
    //   throw new NotFoundException('Withdrawal request not found');
    // }

    // if (report.type !== 'withdrawal') {
    //   throw new BadRequestException('Only withdrawal requests can be cleared');
    // }

    // if (
    //   report.ownerId.toString() !== ownerId ||
    //   report.ownerType !== ownerType
    // ) {
    //   throw new ForbiddenException(
    //     'You are not authorized to update this report',
    //   );
    // }
    //
    // await this.affiliateReportModel.updateOne(
    //   { _id: reportId },
    //   {
    //     $set: {
    //       status: 'paid',
    //       method,
    //       note: note || '',
    //       image: image || '',
    //       updatedAt: new Date(),
    //     },
    //   },
    // );

    return {
      success: true,
      message: 'Withdrawal marked as paid successfully',
    };
  }

  async updateAffiliateStatus(
    ownerType: 'shop' | 'admin',
    ownerId: string,
    affiliateId: string,
    status: 'approved' | 'blocked' | 'unblocked',
  ) {
    // Step 1: Map "unblocked" to "pending" (or adjust based on your logic)
    let mappedStatus: 'approved' | 'blocked' | 'pending';

    if (status === 'approved') {
      mappedStatus = 'approved';
    } else if (status === 'blocked') {
      mappedStatus = 'blocked';
    } else if (status === 'unblocked') {
      mappedStatus = 'pending';
    } else {
      throw new BadRequestException('Invalid status value');
    }

    // Step 2: Update the affiliate connection
    const result = await this.affiliateConnectionModel.updateOne(
      {
        ownerType,
        ownerId,
        affiliate: affiliateId,
      },
      {
        $set: {
          status: mappedStatus,
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException(
        'Affiliate connection not found or already up to date',
      );
    }

    // Step 3: Return success
    return {
      success: true,
      message: `Affiliate status updated to '${mappedStatus}'`,
    };
  }

  async updateAffiliatePaymentInfo(
    affiliateId: string,
    updatePaymentInfo: any,
  ) {
    // Step 1: Check if approved connection exists
    const approvedConnection = await this.affiliateConnectionModel.findOne({
      affiliate: affiliateId,
      ownerId: updatePaymentInfo.ownerId,
      ownerType: updatePaymentInfo.ownerType,
      status: 'approved',
    });

    if (!approvedConnection) {
      throw new ForbiddenException('Affiliate is not approved by this owner.');
    }

    // Step 2: Update paymentType and accountInfo in that connection
    const result = await this.affiliateConnectionModel.updateOne(
      {
        affiliate: affiliateId,
        ownerId: updatePaymentInfo.ownerId,
        ownerType: updatePaymentInfo.ownerType,
        status: 'approved',
      },
      {
        $set: {
          paymentType: updatePaymentInfo.paymentType,
          accountInfo: updatePaymentInfo.accountInfo,
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      throw new InternalServerErrorException('Failed to update payment info.');
    }

    return { message: 'Payment info updated successfully' };
  }

  async updateLoggedInAffiliateInfo(
    affiliate: Affiliate,
    updateAffiliateDto: UpdateAffiliateDto,
  ): Promise<ResponsePayload> {
    const { password, username } = updateAffiliateDto;
    let user;
    try {
      user = await this.affiliateModel.findById(affiliate._id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!user) {
      throw new NotFoundException('No Affiliate found!');
    }
    try {
      // Remove Sensitive Fields
      if (updateAffiliateDto.role) {
        delete updateAffiliateDto.role;
      }
      if (updateAffiliateDto.permissions) {
        delete updateAffiliateDto.permissions;
      }

      // Check Username
      if (username) {
        const isExists = await this.affiliateModel.findOne({ username });
        if (isExists) {
          return {
            success: false,
            message: 'Username already exists',
          } as ResponsePayload;
        }
      }
      // Check Password
      if (password) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        await this.affiliateModel.findByIdAndUpdate(affiliate._id, {
          $set: { ...updateAffiliateDto, ...{ password: hashedPass } },
        });
        return {
          success: true,
          message: 'Data & Password changed success',
        } as ResponsePayload;
      }
      await this.affiliateModel.findByIdAndUpdate(affiliate._id, {
        $set: updateAffiliateDto,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async checkAffiliateWithPhoneNoForResetPassword(
    checkAffiliateDto: CheckAffiliateDto,
  ): Promise<ResponsePayload> {
    try {
      const { phoneNo, countryCode, username } = checkAffiliateDto;

      const fAffiliate = await this.affiliateModel.findOne({
        $or: [
          { username: username },
          { phoneNo: username },
          { email: username },
        ],
      });

      console.log('fAffiliate', fAffiliate);

      if (fAffiliate.role === 'owner') {
      } else {
        return {
          success: false,
          message: 'Please contact with admin',
          data: null,
        } as ResponsePayload;
      }

      if (fAffiliate) {
        await this.otpService.generateAffiliateOtpWithEmail({
          email: fAffiliate.email,
        });
        return {
          success: true,
          message: 'Success! an otp has been sent to your phone no',
          data: { type: 'password-reset' },
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'No data exists in this username',
          data: null,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async resetAffiliatePassword(
    resetAffiliatePasswordDto: ResetAffiliatePasswordDto,
  ): Promise<ResponsePayload> {
    try {
      const { countryCode, phoneNo, password, username } =
        resetAffiliatePasswordDto;
      // const fAffiliate = await this.affiliateModel.findOne({
      //   username: `${countryCode}${phoneNo}`,
      // });

      const fAffiliate = await this.affiliateModel.findOne({
        $or: [
          { username: username },
          { phoneNo: username },
          { email: username },
        ],
      });

      if (fAffiliate) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        await this.affiliateModel.findByIdAndUpdate(fAffiliate._id, {
          $set: { password: hashedPass, isPasswordLess: false },
        });
        return {
          success: true,
          message: 'Success! Password changed',
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Sorry! No data',
        } as ResponsePayload;
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async changeLoggedInAffiliatePassword(
    affiliated: Affiliate,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponsePayload> {
    const { password, oldPassword } = changePasswordDto;
    let affiliate;
    try {
      affiliate = await this.affiliateModel
        .findById(affiliated._id)
        .select('password');
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!affiliate) {
      throw new NotFoundException('No Affiliate found!');
    }
    try {
      // Check Old Password
      const isMatch = await bcrypt.compare(oldPassword, affiliate.password);

      // Change Password
      if (isMatch) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        await this.affiliateModel.findByIdAndUpdate(affiliate._id, {
          $set: { password: hashedPass },
        });
        return {
          success: true,
          message: 'Password changed success',
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Old password is incorrect!',
        } as ResponsePayload;
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async updateAffiliateById(
    id: string,
    updateAffiliateDto: UpdateAffiliateDto,
  ): Promise<ResponsePayload> {
    const { newPassword, username } = updateAffiliateDto;
    let user;
    try {
      user = await this.affiliateModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!user) {
      throw new NotFoundException('No Affiliate found!');
    }
    try {
      // Delete No Multiple Action Data
      delete updateAffiliateDto.password;

      // Check Username
      if (username) {
        if (user.username !== username) {
          const isExists = await this.affiliateModel.findOne({ username });
          if (isExists) {
            return {
              success: false,
              message: 'Username already exists',
            } as ResponsePayload;
          }
        }
      }
      // Check Password
      if (newPassword) {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(newPassword, salt);
        await this.affiliateModel.findByIdAndUpdate(id, {
          $set: { ...updateAffiliateDto, ...{ password: hashedPass } },
        });
        return {
          success: true,
          message: 'Data & Password changed success',
        } as ResponsePayload;
      }
      await this.affiliateModel.findByIdAndUpdate(id, {
        $set: updateAffiliateDto,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleAffiliateById(
    ids: string[],
    updateAffiliateDto: UpdateAffiliateDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updateAffiliateDto.password) {
      delete updateAffiliateDto.password;
    }
    if (updateAffiliateDto.username) {
      delete updateAffiliateDto.username;
    }
    if (updateAffiliateDto.ids) {
      delete updateAffiliateDto.ids;
    }

    try {
      await this.affiliateModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateAffiliateDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteAffiliateById(id: string): Promise<ResponsePayload> {
    let user;
    try {
      user = await this.affiliateModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    if (!user) {
      throw new NotFoundException('No Affiliate found!');
    }
    try {
      await this.affiliateModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async deleteMultipleAffiliateById(ids: string[]): Promise<ResponsePayload> {
    try {
      for (const id of ids) {
        const affiliateUserData: any = await this.affiliateModel
          .findById(id)
          .lean();

        // if (affiliateUserData) {
        //   // Get userId once
        //   const userId = affiliateUserData._id;
        //
        //   // Fetch and delete affiliate payment reports
        //   const affiliateReportsData = await this.affiliateReportModel
        //     .find({ affiliate: userId })
        //     .select('_id')
        //     .lean();
        //
        //   if (affiliateReportsData.length > 0) {
        //     const paymentReportIds = affiliateReportsData.map(
        //       (report) => report._id,
        //     );
        //     // await this.affiliateReportModel.deleteMany({
        //     //   _id: { $in: paymentReportIds },
        //     // });
        //   }
        // }
      }

      await this.affiliateModel.deleteMany({ _id: ids });

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Support Methods
   * getUniqueUserId()
   */
  private async getUniqueUserId() {
    const incOrder = await this.uniqueUserIdModel.findOneAndUpdate(
      {},
      { $inc: { userId: 1 } },
      { new: true, upsert: true, returnDocument: 'after' },
    );
    // return this.utilsService.padLeadingZeros(incOrder.userId);
    return this.generateAlphanumericId(incOrder.userId);
  }

  /**
   * Generate 6-character alphanumeric ID
   */
  private generateAlphanumericId(num: number): string {
    const base36 = num.toString(36).toUpperCase(); // Convert to Base36 (0-9, A-Z)
    return this.utilsService.padAlphanumeric(base36);
  }

  // Update Calculation
  // private async updateCalculation() {
  //   const affiliateData = JSON.parse(
  //     JSON.stringify(await this.affiliateModel.find()),
  //   );
  //
  //   for (const affiliate of affiliateData) {
  //     const saleReport: any = await this.affiliateSaleReportModel.find({
  //       refferId: affiliate.userId,
  //     });
  //     const paymentReport: any = await this.affiliateReportModel.find({
  //       refferId: affiliate.userId,
  //     });
  //
  //     // Calculate total earnings
  //     const totalEarnings = saleReport.reduce(
  //       (sum, sale) => sum + sale.amount,
  //       0,
  //     );
  //     // Calculate total paid payment
  //     const totalPayment = paymentReport.reduce(
  //       (sum, paid) => sum + paid.amount,
  //       0,
  //     );
  //
  //     const finalData = {
  //       totalEarning: totalEarnings,
  //       totalRefers: saleReport.length,
  //       paidAmount: totalPayment,
  //       dueAmount: totalEarnings - totalPayment,
  //     };
  //
  //     await this.affiliateModel.findByIdAndUpdate(affiliate._id, {
  //       $set: finalData,
  //     });
  //   }
  // }
}
