import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ResponsePayload } from 'src/interfaces/response-payload.interface';
import { Request } from 'express';
import { AnalyticsService } from '../../shared/analytics/analytics.service';
import {
  AddGtmThemePageViewDto,
  AddGtmThemeViewContentDto,
} from './dto/gtm.dto';
import { UtilsService } from '../../shared/utils/utils.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from '../customization/setting/interface/setting.interface';

@Injectable()
export class GtmService {
  private logger = new Logger(GtmService.name);

  constructor(
    @InjectModel('Setting')
    private readonly settingModel: Model<Setting>,
    private readonly analyticsService: AnalyticsService,
    private readonly utilsService: UtilsService,
  ) {}


  /**
   * Saleecom theme Analytics
   * trackPageView()
   * trackContentView()
   */
  async trackThemePageView(
    shop: string,
    req: Request,
    addGtmPageViewDto: AddGtmThemePageViewDto,
  ): Promise<ResponsePayload> {
    try {
      const fSetting = await this.settingModel
        .findOne({ shop: shop })
        .select('analytics');
      if (
        fSetting &&
        fSetting.analytics &&
        fSetting.analytics.facebookPixelId &&
        fSetting.analytics.facebookPixelAccessToken
      ) {
        if (
          !this.utilsService.isValidFacebookPixelId(
            fSetting.analytics.facebookPixelId,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Pixel ID',
          } as ResponsePayload;
        }

        if (
          !this.utilsService.isValidFacebookAccessTokenFormat(
            fSetting.analytics.facebookPixelAccessToken,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Access Token',
          } as ResponsePayload;
        }

        const clientIpAddress =
          req.headers['cf-connecting-ip'] ||
          req.headers['x-forwarded-for'] ||
          req.socket.remoteAddress;
        const clientUserAgent = req.headers['user-agent'];

        const hostname = req.hostname || '';
        console.log('Hostname: [PageView] ' + shop, hostname);

        const fbApiPayload: any = { ...addGtmPageViewDto };

        // Ensure user_data exists
        fbApiPayload.user_data = fbApiPayload.user_data || {};

        fbApiPayload.user_data.em =
          fbApiPayload.user_data.em && fbApiPayload.user_data.em !== 'null'
            ? fbApiPayload.user_data.em
            : undefined;
        fbApiPayload.user_data.ph =
          fbApiPayload.user_data.ph && fbApiPayload.user_data.ph !== 'null'
            ? fbApiPayload.user_data.ph
            : undefined;

        fbApiPayload.user_data.client_ip_address = clientIpAddress || undefined;
        fbApiPayload.user_data.client_user_agent = clientUserAgent || undefined;

        let payloadData = {};
        if (
          fSetting.analytics.isEnablePixelTestEvent &&
          fSetting.analytics.facebookPixelTestEventId
        ) {
          payloadData = {
            data: [fbApiPayload],
            test_event_code: fSetting.analytics.facebookPixelTestEventId,
          };
        } else {
          payloadData = { data: [fbApiPayload] };
        }

        const result = await this.analyticsService.trackFbConversionEventClient(
          fSetting.analytics.facebookPixelId,
          fSetting.analytics.facebookPixelAccessToken,
          payloadData,
        );
      }

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async trackThemeViewContent(
    shop: string,
    req: Request,
    addGtmViewContentDto: AddGtmThemeViewContentDto,
  ): Promise<ResponsePayload> {
    try {
      const fSetting = await this.settingModel
        .findOne({ shop: shop })
        .select('analytics');
      if (
        fSetting &&
        fSetting.analytics &&
        fSetting.analytics.facebookPixelId &&
        fSetting.analytics.facebookPixelAccessToken
      ) {
        if (
          !this.utilsService.isValidFacebookPixelId(
            fSetting.analytics.facebookPixelId,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Pixel ID',
          } as ResponsePayload;
        }

        if (
          !this.utilsService.isValidFacebookAccessTokenFormat(
            fSetting.analytics.facebookPixelAccessToken,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Access Token',
          } as ResponsePayload;
        }

        const clientIpAddress =
          req.headers['cf-connecting-ip'] ||
          req.headers['x-forwarded-for'] ||
          req.socket.remoteAddress;
        const clientUserAgent = req.headers['user-agent'];

        const hostname = req.hostname || '';
        console.log('Hostname: [ViewContent] ' + shop, hostname);

        const fbApiPayload: any = { ...addGtmViewContentDto };

        // Ensure user_data exists
        fbApiPayload.user_data = fbApiPayload.user_data || {};

        fbApiPayload.user_data.em =
          fbApiPayload.user_data.em && fbApiPayload.user_data.em !== 'null'
            ? fbApiPayload.user_data.em
            : undefined;
        fbApiPayload.user_data.ph =
          fbApiPayload.user_data.ph && fbApiPayload.user_data.ph !== 'null'
            ? fbApiPayload.user_data.ph
            : undefined;
        fbApiPayload.user_data.client_ip_address = clientIpAddress || undefined;
        fbApiPayload.user_data.client_user_agent = clientUserAgent || undefined;

        let payloadData = {};
        if (
          fSetting.analytics.isEnablePixelTestEvent &&
          fSetting.analytics.facebookPixelTestEventId
        ) {
          payloadData = {
            data: [fbApiPayload],
            test_event_code: fSetting.analytics.facebookPixelTestEventId,
          };
        } else {
          payloadData = { data: [fbApiPayload] };
        }

        const result = await this.analyticsService.trackFbConversionEventClient(
          fSetting.analytics.facebookPixelId,
          fSetting.analytics.facebookPixelAccessToken,
          payloadData,
        );
      }

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async trackThemeAddToCart(
    shop: string,
    req: Request,
    bodyData: any,
  ): Promise<ResponsePayload> {
    try {
      const fSetting = await this.settingModel
        .findOne({ shop: shop })
        .select('analytics');
      if (
        fSetting &&
        fSetting.analytics &&
        fSetting.analytics.facebookPixelId &&
        fSetting.analytics.facebookPixelAccessToken
      ) {
        if (
          !this.utilsService.isValidFacebookPixelId(
            fSetting.analytics.facebookPixelId,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Pixel ID',
          } as ResponsePayload;
        }

        if (
          !this.utilsService.isValidFacebookAccessTokenFormat(
            fSetting.analytics.facebookPixelAccessToken,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Access Token',
          } as ResponsePayload;
        }

        const clientIpAddress =
          req.headers['cf-connecting-ip'] ||
          req.headers['x-forwarded-for'] ||
          req.socket.remoteAddress;
        const clientUserAgent = req.headers['user-agent'];

        const hostname = req.hostname || '';
        console.log('Hostname: [AddToCart]: ' + shop, hostname);

        const fbApiPayload: any = { ...bodyData };
        // Ensure user_data exists
        fbApiPayload.user_data = fbApiPayload.user_data || {};

        fbApiPayload.user_data.em =
          fbApiPayload.user_data.em && fbApiPayload.user_data.em !== 'null'
            ? fbApiPayload.user_data.em
            : undefined;
        fbApiPayload.user_data.ph =
          fbApiPayload.user_data.ph && fbApiPayload.user_data.ph !== 'null'
            ? fbApiPayload.user_data.ph
            : undefined;

        fbApiPayload.user_data.client_ip_address = clientIpAddress || undefined;
        fbApiPayload.user_data.client_user_agent = clientUserAgent || undefined;

        let payloadData = {};
        if (
          fSetting.analytics.isEnablePixelTestEvent &&
          fSetting.analytics.facebookPixelTestEventId
        ) {
          payloadData = {
            data: [fbApiPayload],
            test_event_code: fSetting.analytics.facebookPixelTestEventId,
          };
        } else {
          payloadData = { data: [fbApiPayload] };
        }

        const result = await this.analyticsService.trackFbConversionEventClient(
          fSetting.analytics.facebookPixelId,
          fSetting.analytics.facebookPixelAccessToken,
          payloadData,
        );
      }

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message); //
    }
  }

  async trackThemeInitialCheckout(
    shop: string,
    req: Request,
    bodyData: any,
  ): Promise<ResponsePayload> {
    try {
      const fSetting = await this.settingModel
        .findOne({ shop: shop })
        .select('analytics');
      if (
        fSetting &&
        fSetting.analytics &&
        fSetting.analytics.facebookPixelId &&
        fSetting.analytics.facebookPixelAccessToken
      ) {
        if (
          !this.utilsService.isValidFacebookPixelId(
            fSetting.analytics.facebookPixelId,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Pixel ID',
          } as ResponsePayload;
        }

        if (
          !this.utilsService.isValidFacebookAccessTokenFormat(
            fSetting.analytics.facebookPixelAccessToken,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Access Token',
          } as ResponsePayload;
        }

        const clientIpAddress =
          req.headers['cf-connecting-ip'] ||
          req.headers['x-forwarded-for'] ||
          req.socket.remoteAddress;
        const clientUserAgent = req.headers['user-agent'];

        const hostname = req.hostname || '';
        console.log('Hostname: [InitialCheckout] ' + shop, hostname);

        const fbApiPayload: any = { ...bodyData };
        // Ensure user_data exists
        fbApiPayload.user_data = fbApiPayload.user_data || {};

        fbApiPayload.user_data.em =
          fbApiPayload.user_data.em && fbApiPayload.user_data.em !== 'null'
            ? fbApiPayload.user_data.em
            : undefined;
        fbApiPayload.user_data.ph =
          fbApiPayload.user_data.ph && fbApiPayload.user_data.ph !== 'null'
            ? fbApiPayload.user_data.ph
            : undefined;

        fbApiPayload.user_data.client_ip_address = clientIpAddress || undefined;
        fbApiPayload.user_data.client_user_agent = clientUserAgent || undefined;

        let payloadData = {};
        if (
          fSetting.analytics.isEnablePixelTestEvent &&
          fSetting.analytics.facebookPixelTestEventId
        ) {
          payloadData = {
            data: [fbApiPayload],
            test_event_code: fSetting.analytics.facebookPixelTestEventId,
          };
        } else {
          payloadData = { data: [fbApiPayload] };
        }

        const result = await this.analyticsService.trackFbConversionEventClient(
          fSetting.analytics.facebookPixelId,
          fSetting.analytics.facebookPixelAccessToken,
          payloadData,
        );
      }

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async trackThemePurchase(
    shop: string,
    req: Request,
    bodyData: any,
  ): Promise<ResponsePayload> {
    try {
      const fSetting = await this.settingModel
        .findOne({ shop: shop })
        .select('analytics');
      if (
        fSetting &&
        fSetting.analytics &&
        fSetting.analytics.facebookPixelId &&
        fSetting.analytics.facebookPixelAccessToken
      ) {
        if (
          !this.utilsService.isValidFacebookPixelId(
            fSetting.analytics.facebookPixelId,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Pixel ID',
          } as ResponsePayload;
        }

        if (
          !this.utilsService.isValidFacebookAccessTokenFormat(
            fSetting.analytics.facebookPixelAccessToken,
          )
        ) {
          return {
            success: false,
            message: 'Sorry! Invalid Facebook Access Token',
          } as ResponsePayload;
        }

        const clientIpAddress =
          req.headers['cf-connecting-ip'] ||
          req.headers['x-forwarded-for'] ||
          req.socket.remoteAddress;
        const clientUserAgent = req.headers['user-agent'];

        const hostname = req.hostname || '';
        console.log('Hostname: [Purchase] ' + shop, hostname);

        const fbApiPayload: any = { ...bodyData };
        // Ensure user_data exists
        fbApiPayload.user_data = fbApiPayload.user_data || {};

        fbApiPayload.user_data.em =
          fbApiPayload.user_data.em && fbApiPayload.user_data.em !== 'null'
            ? fbApiPayload.user_data.em
            : undefined;
        fbApiPayload.user_data.ph =
          fbApiPayload.user_data.ph && fbApiPayload.user_data.ph !== 'null'
            ? fbApiPayload.user_data.ph
            : undefined;

        fbApiPayload.user_data.client_ip_address = clientIpAddress || undefined;
        fbApiPayload.user_data.client_user_agent = clientUserAgent || undefined;

        let payloadData = {};
        if (
          fSetting.analytics.isEnablePixelTestEvent &&
          fSetting.analytics.facebookPixelTestEventId
        ) {
          payloadData = {
            data: [fbApiPayload],
            test_event_code: fSetting.analytics.facebookPixelTestEventId,
          };
        } else {
          payloadData = { data: [fbApiPayload] };
        }

        const result = await this.analyticsService.trackFbConversionEventClient(
          fSetting.analytics.facebookPixelId,
          fSetting.analytics.facebookPixelAccessToken,
          payloadData,
        );
        // console.log('result-purchase', result);
      }

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (error) {
      console.log('err', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
