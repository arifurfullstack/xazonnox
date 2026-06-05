import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
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
import { AffiliateAuthResponse } from './interfaces/affiliate.interface';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { AffiliateAuthGuard } from './guards/affiliate-auth.guard';
import { VendorAuthGuard } from '../vendor/guards/vendor-auth.guard';

@Controller('affiliate')
export class AffiliateController {
  private logger = new Logger(AffiliateController.name);

  constructor(private affiliateService: AffiliateService) {}

  /**
   * checkAffiliateWithPhoneNo()
   * affiliateSignup()
   * affiliateLogin()
   * affiliateSignupAndLogin()
   * getLoggedInAffiliateData()
   * getAllAffiliates()
   * getAffiliateById()
   * updateLoggedInAffiliateInfo()
   * changeLoggedInAffiliatePassword()
   * updateAffiliateById()
   * updateMultipleAffiliateById()
   * deleteAffiliateById()
   * deleteMultipleAffiliateById()
   */

  @Post('/check-affiliate-with-phone-no')
  @UsePipes(ValidationPipe)
  async checkAffiliateWithPhoneNo(
    @Body()
    checkAffiliateDto: CheckAffiliateDto,
    @Query('shop', MongoIdValidationPipe) shop: string,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.checkAffiliateWithPhoneNo(
      shop,
      checkAffiliateDto,
      true,
    );
  }

  @Post('/check-affiliate-with-phone-no-for-reset-password')
  @UsePipes(ValidationPipe)
  async checkAffiliateWithPhoneNoForResetPassword(
    // @Query('shop', MongoIdValidationPipe) shop: string,
    @Body()
    checkAffiliateDto: CheckAffiliateDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.checkAffiliateWithPhoneNoForResetPassword(
      checkAffiliateDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/reset-affiliate-password')
  @UsePipes(ValidationPipe)
  async resetAffiliatePassword(
    @Body() resetAffiliatePasswordDto: ResetAffiliatePasswordDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.resetAffiliatePassword(
      resetAffiliatePasswordDto,
    );
  }

  /**
   * VENDOR API
   */

  @Post('/add')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async addAffiliateByAuth(
    @Body()
    createAffiliateDto: CreateAffiliateDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.addAffiliateByAuth(
      req.user,
      createAffiliateDto,
    );
  }

  @Post('/add-owner')
  @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN, AdminRoles.EDITOR)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.EDIT)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminAuthGuard)
  async affiliateSignupOwner(
    @Body()
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.affiliateSignupOwner(createAffiliateDto);
  }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN, AdminRoles.EDITOR)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.EDIT)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminAuthGuard)
  async affiliateUserSignupByAdmin(
    @Body()
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.affiliateSignupOwner(createAffiliateDto);
  }

  @Post('/signup-by-shop')
  @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN, AdminRoles.EDITOR)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.EDIT)
  // @UseGuards(AdminPermissionGuard)
  @UseGuards(VendorAuthGuard)
  async affiliateUserSignupByShop(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body()
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.affiliateUserSignupByShop(
      shop,
      createAffiliateDto,
    );
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async affiliateLogin(
    @Body() authAffiliateDto: AuthAffiliateDto,
  ): Promise<AffiliateAuthResponse> {
    return await this.affiliateService.affiliateLogin(authAffiliateDto);
  }

  @Post('/signup-and-login')
  @UsePipes(ValidationPipe)
  async affiliateSignupAndLogin(
    @Body()
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.affiliateSignupAndLogin(
      createAffiliateDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/logged-in-affiliate-data')
  @UseGuards(AffiliateAuthGuard)
  async getLoggedInAffiliateData(
    @Query(ValidationPipe) affiliateSelectFieldDto: AffiliateSelectFieldDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return this.affiliateService.getLoggedInAffiliateData(
      req.user,
      affiliateSelectFieldDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/all-affiliates-by-shop')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async getAllAffiliatesByShop(
    @Query('shop', MongoIdValidationPipe) shop: string,
    @Body() filterAffiliateDto: FilterAndPaginationAffiliateDto,
    @Query('q') searchString: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return this.affiliateService.getAllAffiliatesByShop(
      shop,
      req.user,
      filterAffiliateDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/all-affiliates')
  @UsePipes(ValidationPipe)
  async getAllAffiliates(
    @Body() filterAffiliateDto: FilterAndPaginationAffiliateDto,
    @Query('q') searchString?: string,
  ): Promise<ResponsePayload> {
    return this.affiliateService.getAllAffiliates(
      filterAffiliateDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('send-request/:productId/:affiliateId')
  async sendRequestForAffiliateAccessFromAdminOrShop(
    @Param('productId') productId: string,
    @Param('affiliateId') affiliateId: string,
  ) {
    return this.affiliateService.sendRequestForAffiliateAccessFromAdminOrShop(
      affiliateId,
      productId,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('send-request-by-admin/:productId/:affiliateId')
  async sendRequestForAffiliateAccessFromAdmin(
    @Param('productId') productId: string,
    @Param('affiliateId') affiliateId: string,
  ) {
    return this.affiliateService.sendRequestForAffiliateAccessFromAdmin(
      affiliateId,
      productId,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('request-withdrawal-from-affiliate')
  requestWithdrawal(
    @Body()
    body: {
      affiliateId: string;
      ownerId: string;
      ownerType: 'shop' | 'admin';
    },
  ) {
    return this.affiliateService.requestWithdrawal(
      body.affiliateId,
      body.ownerId,
      body.ownerType,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-by/:id')
  @UsePipes(ValidationPipe)
  async getAffiliateById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query(ValidationPipe) affiliateSelectFieldDto: AffiliateSelectFieldDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.getAffiliateById(
      id,
      affiliateSelectFieldDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-all-job-opportunity/:affiliateId')
  async getAllJobOpportunityForAffiliate(
    @Param('affiliateId') affiliateId: string,
    @Query('search') search?: string,
  ) {
    return this.affiliateService.getAllJobOpportunityForAffiliate(
      affiliateId,
      search,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-all-approved-my-jobs/:affiliateId')
  async getAllMyJobs(
    @Param('affiliateId') affiliateId: string,
    @Query('search') search?: string,
  ) {
    return this.affiliateService.getAllMyJobs(affiliateId, search);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-all-unapproved-my-jobs/:affiliateId')
  async getAllUnapprovedMyJobs(
    @Param('affiliateId') affiliateId: string,
    @Query('search') search?: string,
  ) {
    return this.affiliateService.getAllUnapprovedMyJobs(affiliateId, search);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-all-pending-affiliates/:ownerType/:ownerId')
  async getAllPendingAffiliates(
    @Param('ownerType') ownerType: 'shop' | 'admin',
    @Param('ownerId') ownerId: string,
    @Query('search') search?: string,
  ) {
    return this.affiliateService.getAllPendingAffiliates(
      ownerType,
      ownerId,
      search,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-all-approved-affiliates/:ownerType/:ownerId')
  async getAllApprovedAffiliates(
    @Param('ownerType') ownerType: 'shop' | 'admin',
    @Param('ownerId') ownerId: string,
    @Query('search') search?: string,
  ) {
    return this.affiliateService.getAllApprovedAffiliates(
      ownerType,
      ownerId,
      search,
    );
  }

  // Get All Affiliate Payment Info
  @Version(VERSION_NEUTRAL)
  @Get('/get-affiliate-payment-info-by-ownerId/:ownerType/:ownerId')
  async getAffiliatePaymentInfo(
    @Param('ownerType') ownerType: 'shop' | 'admin',
    @Param('ownerId') ownerId: string,
  ) {
    return this.affiliateService.getApprovedAffiliatesWithPaymentInfo(
      ownerId,
      ownerType,
    );
  }

  // Get Single Affiliate Payment Info
  @Version(VERSION_NEUTRAL)
  @Get(
    '/get-payment-info-by-owner-by-affiliateId/:ownerType/:ownerId/:affiliateId',
  )
  async getAffiliatePaymentInfoSingle(
    @Param('ownerType') ownerType: 'shop' | 'admin',
    @Param('ownerId') ownerId: string,
    @Param('affiliateId') affiliateId: string,
  ) {
    return this.affiliateService.getSingleAffiliatePaymentInfo(
      ownerId,
      ownerType,
      affiliateId,
    );
  }

  // Update And Payment Clear Withdrawal Request
  @Version(VERSION_NEUTRAL)
  @Put('/update-and-payment-clear-from-owner/:reportId')
  async updateAndPaymentClearWithdrawalRequest(
    @Param('reportId') reportId: string,
    @Body()
    body: {
      ownerId: string;
      ownerType: 'admin' | 'shop';
      method: string;
      note?: string;
      image?: string;
    },
  ) {
    return this.affiliateService.updateAndPaymentClearWithdrawalRequest(
      reportId,
      body,
    );
  }

  // Affiliate er status change
  @Version(VERSION_NEUTRAL)
  @Put('approved-affiliate-and-change-status/:ownerType/:ownerId/:affiliateId')
  async updateAffiliateStatus(
    @Param('ownerType') ownerType: 'shop' | 'admin',
    @Param('ownerId') ownerId: string,
    @Param('affiliateId') affiliateId: string,
    @Body('status') status: 'approved' | 'blocked' | 'unblocked',
  ) {
    return this.affiliateService.updateAffiliateStatus(
      ownerType,
      ownerId,
      affiliateId,
      status,
    );
  }

  // affiliator-update-payment-info
  @Version(VERSION_NEUTRAL)
  @Put('/affiliate-payment-info/:affiliateId')
  async updatePaymentInfo(
    @Param('affiliateId') affiliateId: string,
    @Body() updatePaymentInfoDto: any,
  ) {
    return this.affiliateService.updateAffiliatePaymentInfo(
      affiliateId,
      updatePaymentInfoDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-logged-in-affiliate')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async updateLoggedInAffiliateInfo(
    @Req() req: any,
    @Body() updateAffiliateDto: UpdateAffiliateDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.updateLoggedInAffiliateInfo(
      req.user,
      updateAffiliateDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/change-logged-in-affiliate-password')
  @UsePipes(ValidationPipe)
  @UseGuards(AffiliateAuthGuard)
  async changeLoggedInAffiliatePassword(
    @Req() res: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.changeLoggedInAffiliatePassword(
      res.user,
      changePasswordDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-affiliate-by-vendor/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(VendorAuthGuard)
  async updateAffiliateByVendorById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateAffiliateDto: UpdateAffiliateDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.updateAffiliateById(
      id,
      updateAffiliateDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-affiliate-by-id/:id')
  @UseGuards(AffiliateAuthGuard)
  async updateAffiliateByAffiliateId(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateAffiliateDto: UpdateAffiliateDto,
  ): Promise<ResponsePayload> {
    return await this.affiliateService.updateAffiliateById(
      id,
      updateAffiliateDto,
    );
  }
}
