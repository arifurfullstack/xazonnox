import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ImageUploadResponse, ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {ImageConvertOption} from '../../interfaces/gallery/image-convert-option.interface';
import {UtilsService} from "../core/utils.service";

const API_UPLOAD = environment.ftpBaseLink + environment.ftpPrefix + '/upload/';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService,
  ) {
  }


  /**
   * UPLOAD IMAGE
   */

  uploadSingleImage(fileData: any) {
    const data = new FormData();
    data.append('folderPath', fileData.folderPath);
    data.append('image', fileData.file, fileData.fileName);
    return this.httpClient.post<ImageUploadResponse>(API_UPLOAD + 'single-image', data);

  }


  uploadMultiImage(files: File[] | FileList, option?: ImageConvertOption) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('imageMulti', files[i], files[i].name);
    }
    if (option) {
      formData.append('convert', option.convert);
      if (option.quality) {
        formData.append('quality', option.quality);
      }
      if (option.width) {
        formData.append('width', option.width);
      }
      if (option.height) {
        formData.append('height', option.height);
      }
    }
    return this.httpClient.post<ImageUploadResponse[]>(API_UPLOAD + 'multiple-image', formData);
  }


  /**
   * REMOVE IMAGE
   */

  deleteMultipleFile(data: string[]) {
    return this.httpClient.post<ResponsePayload>(API_UPLOAD + 'delete-multiple-image', {url: data});
  }

  removeSingleFile(url: string) {
    return this.httpClient.post<{ message: string }>(API_UPLOAD + 'delete-single-image', {url});
  }

  uploadMultiImageOriginal(files: File[]) {
    const data = new FormData();
    files.forEach((f) => {
      const fileName =
        this.utilsService.getImageName(f.name) +
        this.utilsService.getRandomInt(100, 5000) +
        '.' +
        f.name.split('.').pop();
      data.append('imageMulti', f);
    });
    return this.httpClient.post<ImageUploadResponse[]>(
      API_UPLOAD + 'multiple-image',
      data
    );
  }
}
