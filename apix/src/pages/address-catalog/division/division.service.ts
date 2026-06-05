import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorCodes } from '../../../enum/error-code.enum';
import { OptionPayloadDto } from '../../../dto/api-response.dto';
import { ResponsePayload } from '../../../interfaces/response-payload.interface';
import { Division } from './interfaces/division.interface';
import {
  AddDivisionDto,
  FilterAndPaginationDivisionDto,
  UpdateDivisionDto,
} from './dto/division.dto';
import { UtilsService } from '../../../shared/utils/utils.service';

const ObjectId = Types.ObjectId;

@Injectable()
export class DivisionService {
  private logger = new Logger(DivisionService.name);

  constructor(
    @InjectModel('Division') private readonly divisionModel: Model<Division>,
    private readonly utilsService: UtilsService,
  ) {}

  /**
   * addDivision()
   * insertManyDivision()
   * getAllDivisions()
   * getAllDivisionsBasic()
   * getDivisionById()
   * updateDivisionById()
   * updateMultipleDivisionById()
   * deleteDivisionById()
   * deleteMultipleDivisionById()
   */
  async addDivision(addDivisionDto: AddDivisionDto): Promise<ResponsePayload> {
    try {
      let mData = addDivisionDto;

      const newData = new this.divisionModel(mData);

      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };
      return {
        success: true,
        message: 'Data Added Successfully',
        data,
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

  async insertManyDivision(
    addDivisionsDto: AddDivisionDto[],
    optionDivisionDto: OptionPayloadDto,
  ): Promise<ResponsePayload> {
    try {
      const { deleteMany } = optionDivisionDto;
      if (deleteMany) {
        await this.divisionModel.deleteMany({});
      }
      const saveData = await this.divisionModel.insertMany(addDivisionsDto);
      return {
        success: true,
        message: `${
          saveData && saveData.length ? saveData.length : 0
        }  Data Added Success`,
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

  async getAllDivisions(
    filterDivisionDto: FilterAndPaginationDivisionDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterDivisionDto;
    const { pagination } = filterDivisionDto;
    const { sort } = filterDivisionDto;
    const { select } = filterDivisionDto;

    // Essential Variables
    const aggregateSdivisiones = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};
    // Match
    if (filter) {
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
      mSelect = {
        name: 1,
      };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateSdivisiones.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSdivisiones.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSdivisiones.push({ $project: mSelect });
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

      aggregateSdivisiones.push(mPagination);

      aggregateSdivisiones.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.divisionModel.aggregate(
        aggregateSdivisiones,
      );
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
        throw new BadRequestException('Error! Divisionion mismatch');
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getAllDivisionsBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;

      const data = await this.divisionModel
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

  async getDivisionById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.divisionModel.findById(id).select(select);
      return {
        success: true,
        message: 'Single profile get Successfully',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getDivisionBySingleId(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.divisionModel.findById(id).select(select);
      return {
        success: true,
        message: 'Single profile get Successfully',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateDivisionById(
    id: string,
    updateDivisionDto: UpdateDivisionDto,
  ): Promise<ResponsePayload> {
    try {
      let mData = updateDivisionDto;

      const fData = await this.divisionModel.findById(id);
      const jData: Division = JSON.parse(JSON.stringify(fData));

      await this.divisionModel.findByIdAndUpdate(id, {
        $set: mData,
      });
      return {
        success: true,
        message: 'Update Successfully',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleDivisionById(
    ids: string[],
    updateDivisionDto: UpdateDivisionDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.divisionModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateDivisionDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteDivisionById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      await this.divisionModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Delete Successfully',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleDivisionById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.divisionModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
