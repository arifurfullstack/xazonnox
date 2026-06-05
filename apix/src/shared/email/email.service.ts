import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    // TODO IF NEED
  }

  /**
   * EMAIL METHODS
   * sendEmail
   */

  async sendEmail(
    email: string,
    subject: string,
    htmlBody: string,
    shopData?: any,
  ) {
    try {
      const gmail = this.configService.get<string>('gmail');
      const googleClientId = this.configService.get<string>('googleClientId');
      const googleClientSecret =
        this.configService.get<string>('googleClientSecret');
      const googleClientRedirectUrl = this.configService.get<string>(
        'googleClientRedirectUrl',
      );
      const googleRefreshToken =
        this.configService.get<string>('googleRefreshToken');

      const oAuth2Client = new google.auth.OAuth2(
        googleClientId,
        googleClientSecret,
        googleClientRedirectUrl,
      );
      oAuth2Client.setCredentials({ refresh_token: googleRefreshToken });

      const gmailAPI = google.gmail({ version: 'v1', auth: oAuth2Client });

      // Raw MIME Message Build করতে হবে
      const MailComposer = require('nodemailer/lib/mail-composer');

      const mail = new MailComposer({
        to: email,
        from: `${shopData?.domain ?? shopData?.websiteName ?? 'Logihubmobile'} <${gmail}>`,
        subject: subject,
        html: htmlBody,
      });

      const message = await mail.compile().build();

      const encodedMessage = message
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await gmailAPI.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      console.log('Email sent:', response.data.id);
      return response.data.id;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  // async sendEmail(
  //   email: string,
  //   subject: string,
  //   htmlBody: string,
  //   shopData?: any,
  // ) {
  //   try {
  //     const gmail = this.configService.get<string>('gmail');
  //     const googleClientId = this.configService.get<string>('googleClientId');
  //     const googleClientSecret =
  //       this.configService.get<string>('googleClientSecret');
  //     const googleClientRedirectUrl = this.configService.get<string>(
  //       'googleClientRedirectUrl',
  //     );
  //     const googleRefreshToken =
  //       this.configService.get<string>('googleRefreshToken');
  //
  //     const oAuth2Client = new google.auth.OAuth2(
  //       googleClientId,
  //       googleClientSecret,
  //       googleClientRedirectUrl,
  //     );
  //     oAuth2Client.setCredentials({ refresh_token: googleRefreshToken });
  //
  //     const accessToken = await oAuth2Client.getAccessToken();
  //
  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         type: 'OAuth2',
  //         user: gmail,
  //         clientId: googleClientId,
  //         clientSecret: googleClientSecret,
  //         refreshToken: googleRefreshToken,
  //         accessToken: accessToken,
  //       },
  //     });
  //
  //     const emailFrom = gmail;
  //     const toReceiver = email;
  //
  //
  //
  //     const info = await transporter.sendMail({
  //       from: ` ${shopData?.domain ? shopData?.domain : (shopData?.websiteName ?? 'SaleEcom')} <${emailFrom}>`,
  //       replyTo: emailFrom,
  //       to: toReceiver, //receiver
  //       subject: subject, // Subject line
  //       // text: "Hello this is text body", // plain text body
  //       html: htmlBody, // html body
  //     });
  //
  //     return {
  //       success: true,
  //       message: `Success! OTP code has been sent to your email.`,
  //     } as ResponsePayload;
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async sendEmail(name, email, file): Promise<ResponsePayload> {
  //   try {
  //     const gmail = this.configService.get<string>('gmail');
  //     const googleClientId = this.configService.get<string>('googleClientId');
  //     const googleClientSecret =
  //       this.configService.get<string>('googleClientSecret');
  //     const googleClientRedirectUrl = this.configService.get<string>(
  //       'googleClientRedirectUrl',
  //     );
  //     const googleRefreshToken =
  //       this.configService.get<string>('googleRefreshToken');
  //
  //     const oAuth2Client = new google.auth.OAuth2(
  //       googleClientId,
  //       googleClientSecret,
  //       googleClientRedirectUrl,
  //     );
  //     oAuth2Client.setCredentials({ refresh_token: googleRefreshToken });
  //
  //     const accessToken = await oAuth2Client.getAccessToken();
  //
  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         type: 'OAuth2',
  //         user: 'info@mkshippinglines.com',
  //         clientId: googleClientId,
  //         clientSecret: googleClientSecret,
  //         refreshToken: googleRefreshToken,
  //         accessToken: accessToken,
  //       },
  //     });
  //
  //     const emailFrom = gmail;
  //     const toReceiver = email;
  //
  //     const info = await transporter.sendMail({
  //       from: `"MK shipping Lines" <${emailFrom}>`,
  //       replyTo: emailFrom,
  //       to: toReceiver, //receiver
  //       subject: 'Thanks for your Cabin rentals.', // Subject line
  //       // text: "Hello this is text body", // plain text body
  //       html: `
  //           <p>Hi: (${name})</p>
  //           <p>We have completed your Cabin rentals. We hope you will enjoy travelling with us.</p>
  //           <p>Thanks for travelling with us.</p>
  //           <p>MK Shipping Lines</p>
  //           <p>Download App: <a href="https://rb.gy/aia3mx">https://rb.gy/aia3mx</a></p>
  //           `, // html body
  //       attachments: [
  //         {
  //           filename: `.pdf`, //my pdf name
  //           path: file, // the pdf content
  //           contentType: 'application/pdf', //Content type
  //         },
  //       ],
  //     });
  //
  //     return {
  //       success: true,
  //       message: 'Data Added Success',
  //     } as ResponsePayload;
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
