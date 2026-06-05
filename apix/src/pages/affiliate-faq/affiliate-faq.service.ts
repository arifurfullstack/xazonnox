import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AddAffiliateFaqDto,
  FilterAndPaginationAffiliateFaqDto,
  OptionAffiliateFaqDto,
  UpdateAffiliateFaqDto,
} from './dto/affiliate-faq.dto';
import { AffiliateFaq } from './interfaces/affiliate-faq.interface';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { UtilsService } from '../../shared/utils/utils.service';

const ObjectId = Types.ObjectId;

@Injectable()
export class AffiliateFaqService {
  private logger = new Logger(AffiliateFaqService.name);

  constructor(
    @InjectModel('AffiliateFaq') private readonly affiliateFaqModel: Model<AffiliateFaq>,
    private utilsService: UtilsService,
  ) {}

  /**
   * addAffiliateFaq()
   * insertManyAffiliateFaq()
   * getAllAffiliateFaqs()
   * getAffiliateFaqById()
   * updateAffiliateFaqById()
   * updateMultipleAffiliateFaqById()
   * deleteAffiliateFaqById()
   * deleteMultipleAffiliateFaqById()
   */
  async addAffiliateFaq(addAffiliateFaqDto: AddAffiliateFaqDto): Promise<ResponsePayload> {
    try {
      const saveData = await this.affiliateFaqModel.create(addAffiliateFaqDto);
      const data = {
        _id: saveData._id,
      };
      return {
        success: true,
        message: 'Data Added Success',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async insertManyAffiliateFaq(
    addAffiliateFaqsDto: AddAffiliateFaqDto[],
  ): Promise<ResponsePayload> {
    try {
      const bulkOps = addAffiliateFaqsDto.map((data) => ({
        updateOne: {
          filter: { name: data.name },
          update: { $set: data },
          upsert: true,
        },
      }));

      const d = await this.affiliateFaqModel.bulkWrite(bulkOps);
      // Convert the values to a string array
      const dataArr = Object.values(d.upsertedIds);

      return {
        success: true,
        message: `${
          dataArr && dataArr.length ? dataArr.length : 0
        }  Data Added Success`,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAffiliateFaqByShop(
    shop: string,
    filterAffiliateFaqDto: FilterAndPaginationAffiliateFaqDto,
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
      const { filter } = filterAffiliateFaqDto;
      filterAffiliateFaqDto.filter = { ...filter };

      return this.getAllAffiliateFaqs(filterAffiliateFaqDto, searchQuery);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAffiliateFaqs(
    filterAffiliateFaqDto: FilterAndPaginationAffiliateFaqDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterAffiliateFaqDto;
    const { pagination } = filterAffiliateFaqDto;
    const { sort } = filterAffiliateFaqDto;
    const { select } = filterAffiliateFaqDto;

    // Essential Variables
    const aggregateStages = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter, readOnly: null };
    } else {
      mFilter = { readOnly: null };
    }
    if (searchQuery) {
      // const mSearchQuery = searchQuery.replace(/[^a-zA-Z0-9 ]/g, '');

      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { name: this.utilsService.createRegexFromString(searchQuery) },
              { keyword: this.utilsService.createRegexFromString(searchQuery) },
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
      const dataAggregates =
        await this.affiliateFaqModel.aggregate(aggregateStages);
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
      throw new InternalServerErrorException();
    }
  }

  async getAffiliateFaqById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.affiliateFaqModel.findById(id).select(select);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateAffiliateFaqById(
    id: string,
    updateAffiliateFaqDto: UpdateAffiliateFaqDto,
  ): Promise<ResponsePayload> {
    try {
      await this.affiliateFaqModel.findByIdAndUpdate(id, {
        $set: updateAffiliateFaqDto,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleAffiliateFaqById(
    ids: string[],
    updateAffiliateFaqDto: UpdateAffiliateFaqDto,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.affiliateFaqModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateAffiliateFaqDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteAffiliateFaqById(id: string): Promise<ResponsePayload> {
    try {
      await this.affiliateFaqModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleAffiliateFaqById(ids: string[]): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.affiliateFaqModel.deleteMany({ _id: mIds });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException(err.message);
    }
  }
}
