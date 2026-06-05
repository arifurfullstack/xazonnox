import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LandingPage2Component } from '../../../pages/landing-page2/landing-page2.component';
import { SafeHtmlCustomPipe } from '../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-landing-page-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    LandingPage2Component,
    SafeHtmlCustomPipe
  ],
  templateUrl: './landing-page-preview-dialog.component.html',
  styleUrl: './landing-page-preview-dialog.component.scss'
})
export class LandingPagePreviewDialogComponent implements OnInit {
  
  previewData: any;
  mockLandingPageData: any;
  isCustomizableLandingPage: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LandingPagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.previewData = data;
    
    // Configure dialog to prevent aria-hidden issues
    this.dialogRef.disableClose = false;
    this.dialogRef.backdropClick().subscribe(() => {
      this.onClose();
    });
  }

  ngOnInit(): void {
    // Transform the form data to match the expected structure for landing page 2
    this.transformDataForPreview();
  }

  private transformDataForPreview(): void {
    // Check if this is a customizable landing page (has theme property)
    const isCustomizable = this.previewData.theme || this.previewData.isHtml;
    this.isCustomizableLandingPage = isCustomizable;
    
    if (isCustomizable) {
      // Handle customizable landing page data
      this.mockLandingPageData = {
        // Basic landing page data
        name: this.previewData.name,
        shortDes: this.previewData.shortDes,
        description: this.previewData.description,
        images: this.previewData.images,
        background: this.previewData.background,
        theme: this.previewData.theme,
        isHtml: this.previewData.isHtml,
        htmlBase: this.previewData.htmlBase,
        
        // Product data
        product: this.previewData.allTableData?.[0] || null,
        
        // Mock slug for preview
        slug: 'preview',
        
        // Status
        status: this.previewData.status || 'publish'
      };
    } else {
      // Handle fixed landing page data (existing logic)
      this.mockLandingPageData = {
        // Basic landing page data
        name: this.previewData.name,
        whyBuy: this.previewData.whyBuy,
        description: this.previewData.description,
        offerText: this.previewData.offerText,
        videoUrl: this.previewData.videoUrl,
        images: this.previewData.images,
        reviewScreenShoot: this.previewData.certificateImage,
        specificationImage: this.previewData.specificationImage,
        backgroundColor: this.previewData.backgroundColor,
        textColor: this.previewData.textColor,
        title: this.previewData.title,
        faqTitle: this.previewData.faqTitle,
        reviewTitle: this.previewData.reviewTitle,
        paymentTitle: this.previewData.paymentTitle,
        whyBuyDescription: this.previewData.whyBuyDescription,
        whyBestDescription: this.previewData.whyBestDescription,
        
        // Arrays
        specifications: this.previewData.specifications || [],
        faqList: this.previewData.faqList || [],
        reviews: this.previewData.reviews || [],
        
        // Product data
        product: this.previewData.allTableData?.[0] || null,
        
        // Mock slug for preview
        slug: 'preview',
        
        // Status
        status: 'publish'
      };
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
} 