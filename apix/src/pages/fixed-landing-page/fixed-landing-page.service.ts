import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AddFixedLandingPageDto,
  FilterAndPaginationFixedLandingPageDto,
  GetFixedLandingPageByIdsDto,
  UpdateFixedLandingPageDto,
} from './dto/fixed-landing-page.dto';
import { FixedLandingPage } from './interfaces/fixed-landing-page.interface';
import { Vendor } from 'src/pages/vendor/interfaces/vendor.interface';
import { UtilsService } from 'src/shared/utils/utils.service';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { Shop } from 'src/pages/shop/interfaces/shop.interface';
import { Product } from '../product/interfaces/product.interface';
import * as schedule from 'node-schedule';
import { ErrorCodes } from '../../enum/error-code.enum';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
const ObjectId = Types.ObjectId;

@Injectable()
export class FixedLandingPageService {
  private logger = new Logger(FixedLandingPageService.name);

  constructor(
    @InjectModel('FixedLandingPage')
    private readonly fixedLandingPageModel: Model<FixedLandingPage>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private utilsService: UtilsService,
    private readonly httpService: HttpService,
  ) {
    this.checkExpireEveryday();
  }

  /**
   * addFixedLandingPage()
   * getAllFixedLandingPageByShop()
   * getFixedLandingPageById()
   * getAllFixedLandingPages()
   * getFixedLandingPageBySlug()
   * getFixedLandingPageByIds()
   * updateFixedLandingPageById()
   * updateMultipleFixedLandingPageById()
   * updateMultipleVendorFixedLandingPageById()
   * deleteMultipleTrashFixedLandingPage()
   * deleteMultipleFixedLandingPageByIdByVendor()
   * deleteMultipleFixedLandingPageById()
   */
  async addFixedLandingPage(
    vendor: Vendor,
    shop: string,
    addFixedLandingPageDto: AddFixedLandingPageDto,
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
        addFixedLandingPageDto?.product,
      );

      const finalData = {
        ...addFixedLandingPageDto,
        ...{
          shop: shop,
          product: fProduct,
          productInfo: fProduct,
          slug: this.utilsService.transformToSlug(fProduct?.name),
        },
      };

      const saveData = await this.fixedLandingPageModel.create(finalData);
      const data = {
        _id: saveData._id,
      };

      return {
        success: true,
        message: 'Success! FixedLandingPage added successfully.',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async addFixedLandingPageFromGaget(
    vendor: Vendor,
    shop: string,
  ): Promise<ResponsePayload> {
    try {
      // Step 1: Check if vendor has access to this shop
      const fShop = await this.shopModel.exists({
        _id: shop,
        'users._id': vendor._id,
      });

      if (!fShop) {
        return {
          success: false,
          message: 'Sorry! you have no access in this shop',
        };
      }

      // Step 2: Get landing page data from external API
      const landingPageSlug = 'apple-20w-usb-c-power-adapter'; // Or make it dynamic later
      const landingPageShop = '67a8615b53a1da782b9acad9'; // Or make it dynamic later
      const response: any = await firstValueFrom(
        this.httpService.get(
          `https://api-client.saleecom.com/api/fixed-landing-page/get-by-slug/${landingPageSlug}?shop=${landingPageShop}`,
        ),
      );

      const landingPage = response?.data?.data;

      console.log('landing page name---', landingPage?.name);

      if (!landingPage || !landingPage.name) {
        return {
          success: false,
          message: 'Landing page template or name not found.',
        };
      }

      const baseSlug = this.utilsService.transformToSlug(landingPage.name);
      const uniqueSlug = `${baseSlug}-${Date.now()}`; // Unique every time

      // Step 3: Prepare final data
      const finalData = {
        name: landingPage.name,
        offerText: landingPage.offerText,
        backgroundColor: landingPage.backgroundColor,
        certificateImage: landingPage.certificateImage,
        images: landingPage.images,
        description: landingPage.description,
        faqList: landingPage.faqList,
        faqTitle: landingPage.faqTitle,
        paymentTitle: landingPage.paymentTitle,
        product: landingPage.product?._id,
        productInfo: landingPage.productInfo,
        reviewScreenShoot: landingPage.reviewScreenShoot,
        reviewTitle: landingPage.reviewTitle,
        reviews: landingPage.reviews,
        specificationImage: landingPage.specificationImage,
        specifications: landingPage.specifications,
        status: landingPage.status,
        textColor: landingPage.textColor,
        title: landingPage.title,
        type: landingPage.type,
        videoUrl: landingPage.videoUrl,
        whyBest: landingPage.whyBest,
        whyBestDescription: landingPage.whyBestDescription,
        whyBestImage: landingPage.whyBestImage,
        whyBestTitle: landingPage.whyBestTitle,
        whyBuy: landingPage.whyBuy,
        whyBuyDescription: landingPage.whyBuyDescription,
        shop: shop,
        slug: uniqueSlug,
      };

      // Step 4: Create new landing page
      const saveData = await this.fixedLandingPageModel.create(finalData);

      return {
        success: true,
        message: 'Success! Fixed Landing Page added successfully.',
        data: { _id: saveData._id },
      };
    } catch (error) {
      console.error(
        'Error in addFixedLandingPageFromGaget:',
        error?.response?.data || error.message,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getFixedLandingPageForUi(shop: string): Promise<ResponsePayload> {
    try {
      const data = await this.fixedLandingPageModel
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

  async getAllFixedLandingPageByShop(
    shop: string,
    filterFixedLandingPageDto: FilterAndPaginationFixedLandingPageDto,
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
      const { filter } = filterFixedLandingPageDto;
      filterFixedLandingPageDto.filter = { ...filter, ...{ shop: shop } };

      return this.getAllFixedLandingPages(
        filterFixedLandingPageDto,
        searchQuery,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getFixedLandingPageById(
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

      const data = await this.fixedLandingPageModel
        .findOne({ _id: id, shop: shop })
        .populate(
          'product',
          'name slug salePrice regularPrice totalSold variation variationOptions variation2 variation2Options variationList isVariation description salePrice sku tax discountType discountAmount images quantity category subCategory brand tags',
        )
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

  async getAllFixedLandingPages(
    filterFixedLandingPageDto: FilterAndPaginationFixedLandingPageDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterFixedLandingPageDto;
    const { pagination } = filterFixedLandingPageDto;
    const { sort } = filterFixedLandingPageDto;
    const { select } = filterFixedLandingPageDto;
    const { filterGroup } = filterFixedLandingPageDto;

    // Aggregate Stages
    const aggregateStages = [];
    const aggregateFixedLandingPageGroupStages = [];
    const aggregateSubFixedLandingPageGroupStages = [];

    // Essential Variables
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      if (filter['fixedLandingPage._id']) {
        filter['fixedLandingPage._id'] = new ObjectId(
          filter['fixedLandingPage._id'],
        );
      }

      if (filter['subFixedLandingPage._id']) {
        filter['subFixedLandingPage._id'] = new ObjectId(
          filter['subFixedLandingPage._id'],
        );
      }

      if (filter['fixedLandingPage._id']) {
        filter['fixedLandingPage._id'] = new ObjectId(
          filter['fixedLandingPage._id'],
        );
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
              {
                'productInfo?.name':
                  this.utilsService.createRegexFromString(searchQuery),
              },
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
    let groupFixedLandingPage: any;
    let groupSubFixedLandingPage: any;

    if (filterGroup && filterGroup.isGroup) {
      if (filterGroup.fixedLandingPage) {
        groupFixedLandingPage = {
          $group: {
            _id: { fixedLandingPage: '$fixedLandingPage._id' },
            name: { $first: '$fixedLandingPage.name' },
            slug: { $first: '$fixedLandingPage.slug' },
            total: { $sum: 1 },
          },
        };
      }

      if (filterGroup.fixedLandingPage) {
        groupFixedLandingPage = {
          $group: {
            _id: { fixedLandingPage: '$fixedLandingPage._id' },
            name: { $first: '$fixedLandingPage.name' },
            slug: { $first: '$fixedLandingPage.slug' },
            total: { $sum: 1 },
          },
        };
      }

      if (filterGroup.subFixedLandingPage) {
        groupSubFixedLandingPage = {
          $group: {
            _id: { subFixedLandingPage: '$subFixedLandingPage._id' },
            name: { $first: '$subFixedLandingPage.name' },
            slug: { $first: '$subFixedLandingPage.slug' },
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

      // FixedLandingPage Groups
      if (groupFixedLandingPage) {
        // aggregateFixedLandingPageGroupStages.push({ $match: mFilter });
        aggregateFixedLandingPageGroupStages.push(groupFixedLandingPage);
      }

      // Sub FixedLandingPage Groups
      if (groupSubFixedLandingPage) {
        // aggregateSubFixedLandingPageGroupStages.push({ $match: mFilter });
        aggregateSubFixedLandingPageGroupStages.push(groupSubFixedLandingPage);
      }

      // FixedLandingPage Groups
      if (groupFixedLandingPage) {
        // aggregateFixedLandingPageGroupStages.push({ $match: mFilter });
        aggregateFixedLandingPageGroupStages.push(groupFixedLandingPage);
      }
    } else {
      if (groupFixedLandingPage) {
        aggregateFixedLandingPageGroupStages.push(groupFixedLandingPage);
      }
      if (groupSubFixedLandingPage) {
        aggregateSubFixedLandingPageGroupStages.push(groupSubFixedLandingPage);
      }
      if (groupFixedLandingPage) {
        aggregateFixedLandingPageGroupStages.push(groupFixedLandingPage);
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
      const dataAggregates = await this.fixedLandingPageModel.aggregate(
        aggregateStages,
        { allowDiskUse: true },
      );

      // GROUP FILTER PRODUCTS DATA
      let fixedLandingPageAggregates: any;
      let subFixedLandingPageAggregates: any;
      // FixedLandingPage
      if (filterGroup && filterGroup.isGroup && filterGroup.fixedLandingPage) {
        fixedLandingPageAggregates = await this.fixedLandingPageModel.aggregate(
          aggregateFixedLandingPageGroupStages,
          { allowDiskUse: true },
        );
      }

      // Sub FixedLandingPage
      if (
        filterGroup &&
        filterGroup.isGroup &&
        filterGroup.subFixedLandingPage
      ) {
        subFixedLandingPageAggregates =
          await this.fixedLandingPageModel.aggregate(
            aggregateSubFixedLandingPageGroupStages,
            { allowDiskUse: true },
          );
      }

      // FixedLandingPage
      if (filterGroup && filterGroup.isGroup && filterGroup.fixedLandingPage) {
        fixedLandingPageAggregates = await this.fixedLandingPageModel.aggregate(
          aggregateFixedLandingPageGroupStages,
          { allowDiskUse: true },
        );
      }

      // Main Filter Data
      let allFilterGroups: any;
      if (filterGroup && filterGroup.isGroup) {
        allFilterGroups = {
          categories:
            fixedLandingPageAggregates && fixedLandingPageAggregates.length
              ? fixedLandingPageAggregates
              : [],
          subCategories:
            subFixedLandingPageAggregates &&
            subFixedLandingPageAggregates.length
              ? subFixedLandingPageAggregates
              : [],
          fixedLandingPages:
            fixedLandingPageAggregates && fixedLandingPageAggregates.length
              ? fixedLandingPageAggregates
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

  async getFixedLandingPageBySlug(
    shop: string,
    slug: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.fixedLandingPageModel
        .findOne({ slug: slug, shop: shop })
        .populate(
          'product',
          'name slug salePrice regularPrice totalSold variation variationOptions variation2 variation2Options variationList isVariation description salePrice sku tax discountType discountAmount images quantity category subCategory brand tags',
        )
        .select(select);

      // Increment view count
      if (data) {
        await this.fixedLandingPageModel.findByIdAndUpdate(data._id, {
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

  async getFixedLandingPageByIds(
    shop: string,
    getFixedLandingPageByIdsDto: GetFixedLandingPageByIdsDto,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const mIds = getFixedLandingPageByIdsDto.ids.map((m) => new ObjectId(m));
      const data = await this.fixedLandingPageModel
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
   * updateFixedLandingPageById
   * updateMultipleFixedLandingPageById
   */
  async cloneSingleLandingPage(
    vendor: Vendor,
    shop: string,
    id: string,
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

      const data = await this.fixedLandingPageModel.findById(id);
      const jData = JSON.stringify(data);
      const product = JSON.parse(jData);

      product.name = `${product.name}(Clone-${this.utilsService.getRandomInt(
        0,
        100,
      )})`;

      product.slug = this.utilsService.transformToSlug(product.name, true);

      delete product._id;
      delete product.createdAt;
      delete product.updatedAt;

      const newData = new this.fixedLandingPageModel(product);
      const saveData = await newData.save();

      const response = {
        _id: saveData._id,
      };

      return {
        success: true,
        message: 'Data Clone Success',
        data: response,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async updateFixedLandingPageById(
    vendor: Vendor,
    shop: string,
    id: string,
    updateFixedLandingPageDto: UpdateFixedLandingPageDto,
  ): Promise<ResponsePayload> {
    try {
      const { slug } = updateFixedLandingPageDto;

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
        updateFixedLandingPageDto?.product,
      );

      let finalSlug: string;
      const fData = await this.fixedLandingPageModel.findOne({
        _id: id,
        shop: shop,
      });

      // Check if category name is changed
      const isNameChanged = fData.slug.trim() !== slug.trim();
      // Generate slug only if name is changed
      if (isNameChanged) {
        const newSlug = this.utilsService.transformToSlug(slug);
        const isExists = await this.fixedLandingPageModel.exists({
          slug: newSlug,
        });
        if (isExists) {
          finalSlug = this.utilsService.transformToSlug(slug, true);
        } else {
          finalSlug = newSlug;
        }
      } else {
        finalSlug = fData.slug;
      }

      const finalData = {
        ...updateFixedLandingPageDto,
        slug: finalSlug,
        productInfo: fProduct,
      };

      // Update the category
      await this.fixedLandingPageModel.findByIdAndUpdate(id, {
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

  async updateMultipleFixedLandingPageById(
    vendor: Vendor,
    shop: string,
    ids: string[],
    updateFixedLandingPageDto: UpdateFixedLandingPageDto,
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
        // if (updateFixedLandingPageDto.slug) {
        //   delete updateFixedLandingPageDto.slug;
        // }
        await this.fixedLandingPageModel.updateMany(
          { _id: { $in: mIds } },
          { $set: updateFixedLandingPageDto },
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

  async deleteMultipleTrashFixedLandingPage(
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

      await this.fixedLandingPageModel.deleteMany({
        _id: ids,
        status: 'trash',
      });
      return {
        success: true,
        message: 'Success! FixedLandingPage permanently deleted successfully.',
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

      await this.fixedLandingPageModel.deleteMany({
        shop: shop,
        status: 'trash',
      });
      return {
        success: true,
        message: 'Success! order permanently deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleFixedLandingPageByIdByVendor(
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

      await this.fixedLandingPageModel.updateMany(
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
        message: 'Success! FixedLandingPage deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultiplePageByIdByVendor(
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

      await this.fixedLandingPageModel.deleteMany({ _id: ids });

      return {
        success: true,
        message: 'Success! FixedLandingPage deleted successfully.',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleFixedLandingPageById(
    ids: string[],
  ): Promise<ResponsePayload> {
    try {
      await this.fixedLandingPageModel.deleteMany({ _id: ids });
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
      await this.fixedLandingPageModel.deleteMany({
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
