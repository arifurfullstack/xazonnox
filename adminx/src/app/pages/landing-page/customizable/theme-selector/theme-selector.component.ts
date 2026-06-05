import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
  standalone: true
})
export class ThemeSelectorComponent implements OnInit {
  selectedTheme: any;
  themeSelected: any;

  constructor(private dialogRef: MatDialogRef<ThemeSelectorComponent>) {

  }

  ngOnInit() {
    this.templateData();
  }

  saveTemplate() {
    console.log('Template saved!'); // Handle save logic here
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }


  private templateData() {
    this.themeSelected = [
      {
        _id:'5674567546',
        image: '/assets/page/34.webp',
        name: 'Natural Powder',
        link: '/assets/page/landing-page2.html',
        theme: `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Page</title>
    <style>

              .section1 {
            background-color: #013220;
            color: white;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
              }
        .theme-container{
            max-width: 1200px;
            margin: 0 auto;
            padding: 60px 20px;
            text-align: center;
        }

        .section1 .content-box {
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 20px;
        }

        .section1 .highlight {
            color: #ffcc00;
        }

        .section1 .button {
            background-color: #ffcc00;
            color: #013220;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
        }
       .section1 .button:hover {
            background-color: #e6b800;
        }
        .section1 .video-container {
            position: relative;
            border: 6px solid #28a745;
            border-radius: 10px;
            overflow: hidden;
        }
        .section1 .video-container iframe {
            width: 100%;
            height: 400px;
        }
        .section1 .play-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            animation: pulse 2s infinite;
        }
        .section1 .play-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            border: 2px solid rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        .section1 .play-button svg {
            width: 36px;
            height: 36px;
            fill: #013220;
        }
        @keyframes pulse {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(1.5);
                opacity: 0;
            }
        }
        @media (max-width: 768px) {
            .section1 .video-container iframe {
                height: 200px;
            }
        }
        .section1 .border-box {
            border: 2px solid #01632a;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
  .section2 {
         display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
             padding: 60px 20px;
  }
      .section2 .container1 {
            background-color: #218838;
            padding: 60px 20px;
            border-radius: 10px;
            max-width:1200px;
            width:100%;
            margin: 0;
            text-align: center;
        }

.section2 .header {
            background-color:rgb(243, 19, 41);
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .section2 .header span {
            font-weight: bold;
        }
        .section2 .content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;

        }
        .section2 .content p {
            color: #28a745;
            margin: 0;
        }
        .section2 .content p.line-through {
            text-decoration: line-through;
            margin-bottom: 10px;
        }
        .section2 .button-container {
            display: flex;
            justify-content: center;
        }
        .section2 .button-container a {
            background-color: #fd7e14;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .section2 .button-container button:hover {
            background-color: #e67e22;
        }


 .section3{
      display: flex;
            align-items: center;
            justify-content: center;
            background-color: #28a745;
            margin: 0;
 }

 .section3 {
     background-color: #f0f9e8;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;

 }
 .section3 .container3 {
            padding: 60px 20px;
            border-radius: 10px;
            max-width: 1000px;
            width: 100%;
        }
        .section3 .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }
        @media (min-width: 768px) {
             .section3 .grid {
                grid-template-columns: 1fr 1fr;
            }
        }
         .section3 .box {
            background-color: white;
            border: 4px solid #2f9e44;
            border-radius: 10px;
            padding: 20px;
        }
         .section3 .box h2 {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
         .section3 .box ul {
            list-style-type: none;
            padding: 0;
        }
         .section3 .box ul li {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
        }
         .section3 .button-container {
            text-align: center;
            margin-top: 20px;
        }
         .section3 .button-container a {
            background-color: #ff922b;
            color: white;
            font-size: 18px;
            font-weight: bold;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
         .section3 .button-container button:hover {
            background-color: #e07b24;
        }

 .section4{
    background-color: #013220;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
 }
   .section4 .container4 {
            text-align: center;
            padding: 60px 20px;
        }
         .section4 .header {
            background-color: #2E8B57;
            border: 4px solid #00FF00;
            border-radius: 8px;
            display: inline-block;
            padding: 10px 20px;
            margin-bottom: 20px;
        }
         .section4  .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
        }
         .section4 .content p {
            margin: 10px 0;
        }
         .section4 .button {
            background-color: #FFA500;
            color: white;
            font-weight: bold;
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            margin-top: 20px;
        }
         .section4 .button:hover {
            background-color: #FF8C00;
        }

         .section5{
             background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
         }

 .section5 .container5 {
      padding: 60px 20px;
            border-radius: 10px;
            max-width: 1000px;
            width: 100%;
            text-align: center;
        }
        .section5 .title {
            font-size: 1.5rem;
            border-radius: 5px;
            font-weight: bold;
            color: #006400;
            border: 2px solid #006400;
            display: inline-block;
            padding: 10px 20px;
            margin-bottom: 20px!important;
        }
        .section5 .grid {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: max-content;
            gap: 10px;
            align-items: center;
            margin-bottom: 20px;
        }
        @media (min-width: 768px) {
            .section5 .grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
        .section5 .grid-item {
            border: 2px solid #006400;
            padding: 20px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
        }


        .section5 .button {
            background-color: #FFA500;
            color: white;
            font-weight: bold;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .section5 .button:hover {
            background-color: #FF8C00;
        }

         .section6 {
             display: flex;
            align-items: center;
            justify-content: center;
             background-color:rgb(255, 255, 255);
         }

 .section6 .container6 {
            border: 4px dotted #16a34a;
            padding: 60px 20px;
            border-radius: 10px;
            max-width: 1000px;
            text-align: center;
 }
            .section6 .title {
            color: #15803d;
            font-size: 1.5rem;
            font-weight: bold;
        }
         .section6 .subtitle {
            color: #15803d;
        }
         .section6 .offer {
            background-color: #dc2626;
            color: white;
            padding: 16px;
            margin-top: 16px;
            border-radius: 8px;
        }
         .section6 .offer p {
            margin: 0;
        }
         .section6 .offer .highlight {
            font-size: 1.25rem;
            font-weight: bold;
            margin-top: 8px;
        }

 </style>
</head>
<body>
    <div class="section1">
    <div class="theme-container">
        <div class="border-box">
            <p class="text-2xl" >
                প্রতিদিন ১ গ্রাম সজনে পাতার জুস আপনাকে ও আপনার পরিবারকে <span class="highlight">৩০০টি রোগ</span> থেকে রক্ষা করবে যা গবেষণায় পরীক্ষিত !!
            </p>
        </div>
        <div class="content-box">
            <p class="text-lg" >
                ৫৫ গ্রাম প্রিমিয়াম সজিনা পাউডার + ১০০ গ্রাম কালোজিরা মধু ফ্রি।
            </p>
            <a id="link" href="#payment" class="link button">অর্ডার করতে ক্লিক করুন</a>
        </div>
        <div class="video-container">
            <iframe id="video" src="https://www.youtube.com/embed/0IHfyRidDlE" frameborder="0" allowfullscreen></iframe>
<!--            <div class="play-button">-->
<!--                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">-->
<!--                    <path d="M8 5v14l11-7z"/>-->
<!--                </svg>-->
<!--            </div>-->
        </div>
    </div>
    </div>
     <div class="section2">
<div class="container1">
        <div class="header" >
            আমাদের থেকে বিস্তারিত জানতে এই নাম্বারে কল করুন <span>1234567890</span>
        </div>
        <div class="content">
            <p class="line-through" >৪০০ গ্রাম সজিনা পাতার পাউডারের রেগুলার প্রাইস- ১৫০০/=</p>
            <p >৪০০ গ্রাম সজিনা পাতার পাউডারের অফার প্রাইস- ১০৫০/=</p>
        </div>
        <div class="button-container">
              <a id="link" href="#payment" class="link button">অর্ডার করতে ক্লিক করুন</a>
        </div>
    </div>
    </div>

<div class="section3">
<div class="container3">
        <div class="grid">
            <div class="box">
                <h2 >সজিনা পাতার উপকারিতা</h2>
                <ul>
                    <li  >উচ্চ রক্তচাপ নিয়ন্ত্রণে রাখে।</li>
                    <li >এটি এন্টি-ব্যাকটেরিয়াল বৈশিষ্ট্য বিদ্যমান। এটি ফ্লুতে ও কিডনী সুস্থ রাখতে এবং রক্তের সেলেনিয়াম বৃদ্ধি করতে সাহায্য করে।</li>
                    <li  >রক্তে কোলেস্টেরল কমায়।</li>
                    <li   >এন্টিডিপ্রেসেন্ট বা গ্যাস্ট্রিক নিয়ন্ত্রণে রাখে।</li>
                    <li   >শরীরে কোলেস্টেরল এর মাত্রা নিয়ন্ত্রণেও অনন্য অবদান রাখে।</li>
                    <li   >রক্ত শর্করা দূর করে।</li>
                    <li   >মানুষের শরীরের যে ৯ টি এমাইনো এসিড খাদ্যের মাধ্যমে সরবরাহ করতে হয়, তার সবগুলোই এই সজিনা পাতা গুড়ার মধ্যে বিদ্যমান।</li>
                    <li   >শরীরে সুরক্ষার মাত্রা নিয়ন্ত্রণে রাখার জন্য অ্যান্টিঅক্সিডেন্ট মত কঠিন রোগের বিরুদ্ধে কাজ করে থাকে।</li>
                    <li   >চোখের জন্য উপকারী।</li>
                    <li   >ঠান্ডা জ্বরের সমস্যা দূর করে।</li>
                </ul>
            </div>
            <div class="box">
                <h2   >সেবনে সঠিক নিয়ম</h2>
                <ul>
                    <li   >খালি পেটে এক গ্লাস পানিতে ২ চা চামচ সজিনা পাতা মিশ্র করে খেতে পারেন।</li>
                    <li   >মধুর সাথে মিশ্র করে খেতে পারেন।</li>
                    <li   >দুধের সাথে মিশ্র করে খেতে পারেন।</li>
                    <li   >ডালের সাথে মিশ্র করে খেতে পারেন।</li>
                    <li   >বিভিন্ন ধরনের ভাজির সাথে মিশ্রিত খাওয়া যায়।</li>
                    <li   >পেয়ারার সাথে মিশ্র করে খেতে পারেন।</li>
                    <li   >আমড়ার সাথে মিশ্র করে খেতে পারেন।</li>
                    <li   >কাঁঠা আমের সাথে মিশ্রিত খেতে পারেন।</li>
                    <li   >তরকারির সাথে মিশ্র করে খেতে পারেন।</li>
                    <li   >চোখের জন্য উপকারী।</li>
                    <li   >ঠান্ডা জ্বরের সমস্যা দূর করে।</li>
                </ul>
            </div>
        </div>
        <div class="button-container">
             <a id="link" href="#payment" class="link button">অর্ডার করতে ক্লিক করুন</a>
        </div>
    </div>
      </div>

<div class="section4">
 <div class="container4">
        <div class="header">
            <h1   >আমাদের উপর কেন আস্থা রাখবেন ??</h1>
        </div>
        <div class="content">
            <p   >মূলানুসৃত শতভাগ হাইড্রোজেনিক মেইনটেইন করে, সম্পূর্ণ নিজস্ব তত্ত্বাবধানে প্রস্তুতকৃত প্রিমিয়াম সজিনা পাতা গুড়া</p>
            <p   >প্রোডাক্ট হাতে পেয়ে, দেখে, কোয়ালিটি চেক করে পেমেন্ট করার সুবিধা ।</p>
            <p   >সারা বাংলাদেশে কুরিয়ারের মাধ্যমে হোম ডেলিভারি পাবেন ।</p>
            <p   >যে কোন সময় আমাদের সাথে যোগাযোগ করতে পারবেন ।</p>
            <p   >অথবা এক টাকাও দিতে হবে না। ডেলিভারি ম্যান এর কাছ থেকে প্রোডাক্ট বুঝে পেয়ে তারপর টাকা দিবেন।</p>
        </div>
          <a id="link" href="#payment" class="link button">অর্ডার করতে ক্লিক করুন</a>
    </div>
 </div>

<div class="section5">
<div class="container5">
        <h1 class="title"   >এতকিছু থাকতে সজিনা পাতার গুড়া কেনা খাবেন ?</h1>
        <div class="grid">
            <div class="grid-item">
                <p   >শরীরের সুগারের মাত্রা নিয়ন্ত্রণের মাধ্যমে ডায়াবেটিসের মত কঠিন রোগের বিরুদ্ধে কাজ করে থাকে।</p>
            </div>
            <div class="grid-item">
                <p   >নিয়মিত সজিনার পাতা খেলে মুখে রুচি বাড়ে।</p>
            </div>
            <div class="grid-item">
                <p   >লিভার ও কিডনি সুস্থ রাখতে সহায়তা করে।</p>
            </div>
            <div class="grid-item">
                <p   >উচ্চ রক্ত চাপ নিয়ন্ত্রণে থাকে।</p>
            </div>
            <div class="grid-item">
                <p   >শরীরে ময়েশ্চারের ছাপ সহজে পড়ে না।</p>
            </div>
            <div class="grid-item">
                <p   >রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে।</p>
            </div>
            <div class="grid-item">
                <p   >ওজন কমানোর জন্য দারুণ সহায়ক হবে।</p>
            </div>
            <div class="grid-item">
                <p   >জ্বর,কাশি ও ঠান্ডা জনিত সমস্যা দূর করে।</p>
            </div>
        </div>
        <a  id="link" href="#payment" class="link button">অর্ডার করতে ক্লিক করুন</a>
    </div>
    </div>

<div class="section6">
 <div class="container6">
        <h1 class="title"   >মরিসা পাউডার প্রাইস</h1>
        <p class="subtitle"   >সাশ্রয়ী দামে সেরা পণ্য</p>
        <div class="offer">
            <p   >৫০০ গ্রাম মরিসা পাউডার এর পূর্ব মূল্যঃ ১২৫০ টাকা</p>
            <p class="highlight"   >১০৫০ টাকার প্যাকেজটি ৮৫০ টাকা অফারটি সীমিত সময়ের জন্য</p>
        </div>
    </div>
</div>

</body>
</html>`
      },

      {
        _id:'5674567546',
        image: '/assets/page/36.webp',
        name: 'Beauty',
        link: '/assets/page/landing-page.html',
        theme: `
        <html lang="en">
 <head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>
   Web Page Design
  </title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  <style>
   body {
            font-family: Arial, sans-serif;
       margin: 0;
       padding: 0;
       box-sizing: border-box;
        }

        .section1 {
            background: #008037;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            padding: 30px 0 60px;
        }
        .section1 .theme-container {
            text-align: center;
            max-width: 800px;
            width: 100%;
            padding: 20px;
            /*margin: 0 15px;*/
            border-radius: 40px;
            background-color: hsla(0, 0%, 100%, .08);
            box-shadow: 0 20px 20px 0 rgba(0, 0, 0, .1);
            @media(max-width: 768px){
                width: 85%;
            }
        }
        .section1 .header {
            background-color: #fff1b7;
            color: #cc0000;
            font-weight: bold;
            font-size: 22px;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            border: 8px solid #ffcc00;
        }
        .section1 .content {
            padding: 20px 5px;
        }
        .section1 .content p {
            color: #ffffff;
            margin-bottom: 20px;
        }
        .section1 .image-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        .section1 .image-container img {
            width: 200px;
            height: auto;
        }
        .section1 .price {
            padding-left: 10px;
            color: #ffffff;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 17px;
            margin-bottom: 20px;
            border-radius: 16px 0;
            border-width: 1px;
            border-style: solid;
            border-color: rgb(242, 211, 53);
            @media(max-width: 768px) {
                flex-direction: column;
                gap: 20px;
                padding: 15px 10px;
            }
        }
        .section1 .price span {
            text-align: right;
            background-color: #cc0000;
            color: #ffffff;
            text-wrap: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            padding:10px;
            height: 100%;
            border-radius: 0 0 16px;
            @media(max-width: 768px) {
            border-radius: 5px;
            padding: 14px 25px;
            }
        }
        .btn-area{
        display: flex;
        justify-content: center;
        align-items: center;
        }
     .button {
            text-align: center;
            font-size: 20px;
            line-height: 45px;
            font-weight: 700;
            display: inline-block;
            width: auto;
            margin-top: 15px;
            box-shadow: rgba(0, 0, 0, 0.1) 0 20px 20px 0;
            background: linear-gradient(90deg, rgb(242, 211, 53) 0px, rgb(242, 211, 53) 51%, rgb(201, 172, 31)) 0% 0% / 200%;
            transition: 0.5s;
            padding: 5px 15px;
            border-radius: 10px;
            border-width: 3px;
            border-style: solid;
            border-color: rgb(242, 68, 29);
            border-image: initial;
            text-wrap: nowrap;
            text-decoration: none;
        }

        /*.section3 {*/
        /*    margin: 60px 0;*/
        /*}*/

        .section3{
            background-color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 60px 15px;
        }

        .section3 .header {
            background-color: #E6F4EA;
            border: 2px solid #38A169;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin-bottom: 24px;
        }
        .section3 .header h1 {
            color: #E53E3E;
            font-size: 1.25rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            @media(max-width: 768px) {
                font-size: 1rem;
            }
        }
        .section3 .header h1 i {
            margin: 0 8px;
        }
        .section3 .content {
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            /*margin-bottom: 24px;*/
            max-width: 1024px;
            margin: 0 auto;
            @media(max-width: 768px) {
                padding: 0;
            }
        }
        .section3 .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            text-align: center;
        }
        @media (min-width: 768px) {
            .section3 .grid {
                grid-template-columns: 1fr 1fr;
                text-align: start;
            }
        }
        .section3 .grid div {
            border: 1px solid #E2E8F0;
            padding: 16px;
        }
        .section3 .btn-container{
            text-align: center;
            display: flex;
            justify-content: center;
        }

        .section3 .footer {
            color: #E53E3E;
            text-align: center;
        }

        .section6 {
            margin: 60px 0;
        }

        .section6 .container {
            background-color: #1b5e20;
            color: white;
            border-radius: 10px;
            padding: 20px;
            width: 90%;
            margin: 0 auto;
            max-width: 800px;
        }
        .section6  .header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        .section6  .header i {
            color: #ff5722;
            margin-right: 10px;
        }
        .section6 .header h1 {
            font-size: 1.5rem;
            font-weight: bold;
        }
        .section6  .content {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
        }
        .section6  .content div {
            display: flex;
            align-items: center;
        }
        .section6  .content i {
            color: #4caf50;
            margin-right: 10px;
        }
        @media (max-width: 768px) {
            .section6 .header {
                flex-direction: column;
                text-align: center;
            }
            .section6 .header i {
                font-size: 40px;
            }
        }
        @media (min-width: 768px) {
            .section6 .content {
                grid-template-columns: 1fr 1fr;
            }
        }

        .section7 {
            margin: 60px 0!important;
            padding-bottom: 35px;
        }
   .section7 .container {
       color: white;
       border-radius: 10px;
       width: 90%;
       margin: 0 auto;
       max-width: 800px;
   }

        .section7 .offer-container {
            margin: 0 auto;
            background-color: #d1fae5;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            @media(max-width: 768px) {
                padding: 20px 0;
            }
        }
        .section7 .offer-container p {
            color: #065f46;
            margin-bottom: 16px;
            font-size: 16px;
        }
        .section7 .offer-container .regular-price {
            color: #dc2626;
            font-size: 24px;
            font-weight: bold;
            text-decoration: line-through;
            margin-bottom: 8px;
        }
        .section7 .offer-container .offer-price {
            color: #065f46;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 16px;
            @media(max-width: 768px) {
                font-size: 20px;
            }
        }
        .section7 .offer-container .contact-button {
            background-color: #f97316;
            color: white;
            padding: 10px 20px;
            border-radius: 9999px;
            font-size: 15px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            @media(max-width: 768px) {
                padding: 10px 20px;
                width: 80%;
            }
        }
        .section7 .offer-container .contact-button i {
            margin-right: 8px;
        }


        .section4 .container1 {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .section4 .video-section {
            margin-bottom: 20px;
        }
        .section4 .info-offer-section {
            background-color: #4CAF50;
            color: #FFD700;
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            border: 4px solid #006400;
            margin-bottom: 20px;
        }
        .section4 .info-offer-section p {
            margin: 10px 0;
            font-size: 1.2em;
            font-weight: bold;
        }
        .section4 .offer-box {
            background-color: #C8E6C9;
            color: #2E7D32;
            padding: 20px;
            border-radius: 10px;
            border: 4px solid #4CAF50;
            display: inline-block;
        }
        .section4 .offer-box span {
            background-color: #FF5722;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            margin-left: 10px;
            @media (max-width: 768px) {
                display: block;
                margin-top: 14px;
            }
        }

        .swing {
          transform-origin: top center!important;
          animation-name: swing!important;
          animation-duration: 1.25s!important;
          display: inline-block;
        }
        @keyframes swing {
          20% {
            transform: rotate3d(0, 0, 1, 15deg);
          }
          40% {
            transform: rotate3d(0, 0, 1, -10deg);
          }
          60% {
            transform: rotate3d(0, 0, 1, 5deg);
          }
          80% {
            transform: rotate3d(0, 0, 1, -5deg);
          }
          to {
            transform: rotate3d(0, 0, 1, 0deg);
          }
        }

  </style>
 </head>
 <body>
  <div class="section1">
    <div class="theme-container">
        <div class="header">
         ঔষধ ছাড়া ন্যাচারালি গ্যাস্ট্রিক নিয়ন্ত্রণ করুন
        </div>
        <div class="content">
         <p>
          দীর্ঘ ১০বছর ইউরোপ এবং আমেরিকার চিকিৎসক দ্বারা পরিক্ষিত। এখন পর্যন্ত অনলাইনে প্রায় ৮০০০+ মানুষের এর মাধ্যমে উপকার হয়েছে।
         </p>
         <div class="image-container">
          <img #imageElement (click)="openModal()"  id="image" class="swing" alt="product image" height="300" src="https://storage.googleapis.com/a1aa/image/hGWOwM92DsOoO1L3YyFbyOR2XfXsgGkpv1jOMhTpUFg.jpg" width="200"/>
<!--          <input class="ignore" type="file" accept="image/*" />-->
         </div>
         <div class="price">
          এখনি অর্ডার করলে পাচ্ছেন ১১০০ টাকার প্যাকেজ
          <span>
           এখন ৯৫০ টাকা
          </span>
         </div>
         <p>
          এই অফারটি গ্রহণ করুন গ্যরান্টি ১০০০ টাকার মধ্যে গ্যাস্ট্রিক থেকে মুক্তি
         </p>
             <div class="btn-area">
             <a class="link button" id="link" href="#payment">অর্ডার করতে ক্লিক করুন</a>
            </div>
        </div>
       </div>
  </div>

  <div class="section4">
    <div class="container1">
        <!-- Video Section -->
        <div class="video-section">
            <iframe id="video" class="w-full h-64 md:h-96" width="100%" height="400" src="https://www.youtube.com/embed/0IHfyRidDlE" title="Funnel Liner Logo Launching Video | The First Automated E Commerce Sales Funnel in Bangladesh." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        </div>

        <!-- Info and Offer Section -->
        <div class="info-offer-section">
            <p><i class="fas fa-phone-alt"></i> আরও কোন প্রশ্ন থাকলে কল করুন</p>
            <div class="offer-box">
                <p>এখনি অর্ডার করলে পাচ্ছেন ১১০০ টাকার প্যাকেজ <span>মাত্র ৯৫০ টাকা</span></p>
            </div>
        </div>

        <!-- Order Button -->
       <div class="btn-area">
             <a class="link button" id="link" href="#payment">অর্ডার করতে ক্লিক করুন</a>
            </div>
    </div>
  </div>

  <div class="section3">
      <div class="container1">
    <div class="header">
        <h1>
             কেন আপনি গ্যাস ক্লিয়ার পাউডার সেবন করবেন ?
        </h1>
    </div>
    <div class="content">
        <div class="grid">
            <div>
                <p>১০০% প্রাকৃতিক উপাদান গ্যাসট্রিক নিরাময়ে প্রাকৃতিক ভাবে ইনশাআল্লাহ</p>
            </div>
            <div>
                <p>এটি ফুল কোর্স আসা সেবন করায় গ্যাসট্রিক সমস্যার আর ফিরে আসার ভয় থাকে না।</p>
            </div>
            <div>
                <p>এটি গ্যাস ক্লিয়ার পাউডার, ল্যাবটেষ্ট করা, কোন প্রকার সাইড ইফেক্ট নেই। গ্যাসট্রিক, বুক জ্বালা, বমি, পেট ফাঁপা দূর করে।</p>
            </div>
            <div>
                <p>এটি সেবনে কোন পার্শ্বপ্রতিক্রিয়া নেই।</p>
            </div>
            <div>
                <p>এটি গ্যাস ক্লিয়ার পাউডার সেবনে গ্যাসট্রিক নিরাময়ে ক্ষতিগ্রস্ত কোষ পুনরায় তৈরি হয়।</p>
            </div>
            <div>
                <p>এটি পাকস্থলী এবং শরীরের অন্যান্য অঙ্গকে শক্তিশালী করে।</p>
            </div>
        </div>
    </div>
               <div class="btn-area">
             <a class="link button" id="link" href="#payment">অর্ডার করতে ক্লিক করুন</a>
            </div>
    <p class="footer">
        উপাদান সমূহঃ আমলকি, হরিতকি, বহেড়া, সোনাপাতা, মেথি, শিমুল মূল, বিট লবন সহ ১০ টি ভেষজ উপাদান
    </p>
  </div>
  </div>


  <div class="section6">
    <div class="container">
        <div class="header">
            <i class="fas fa-fire"></i>
            <h1>কেনো আপনি গ্যাস ক্লিয়ার পাউডার সেবন করবেন ?</h1>
        </div>
        <div class="content">
            <div>
                <i class="fas fa-check"></i>
                <p>৩-৫ ঘন্টার ভিতরে গ্যাঁস-ফাঁপ থেকে মুক্তি পাবেন।</p>
            </div>
            <div>
                <i class="fas fa-check"></i>
                <p>খাওয়ার রুচি বাড়াবে।</p>
            </div>
            <div>
                <i class="fas fa-check"></i>
                <p>এটি পেটের এসিড নিয়ন্ত্রণ করে হজমশক্তি বৃদ্ধি করে।</p>
            </div>
            <div>
                <i class="fas fa-check"></i>
                <p>বমি বমি ভাব দূর হবে</p>
            </div>
        </div>
    </div>
  </div>

  <div class="section7">
      <div class="container">
    <div class="offer-container">
        <p>
            গ্যাস্ট্রিক-কের মত অসস্থিকর রোগ থেকে নিজে ও পরিবারকে মুক্ত রাখতে আজই অর্ডার করুন। প্রোডাক্ট হাতে পেয়ে মূল্য পরিশোধ করতে পারবেন। তাই নিশ্চিন্তে অর্ডার করতে পারেন।
        </p>
        <p class="regular-price">১ফাইল-রেগুলার মূল্য-৯৯০/-টাকা</p>
        <p class="offer-price">অফার মূল্য = ৮৫০/-টাকা (ডেলিভারী চার্জ ফ্রী)</p>
        <a id="phone" href="tel:+8801894844452" class="contact-button">
            <i class="fas fa-phone-alt"></i> আরও কোন প্রশ্ন থাকলে কল করুনঃ +8801894844452
        </a>
    </div>
      <div class="btn-area">
             <a class="link button" id="link" href="#payment">অর্ডার করতে ক্লিক করুন</a>
            </div>
      </div>
      </div>
 </body>
</html>
        `
      },
      {
        _id: '543543534',
        image: '/assets/page/page33.png',
        name: 'Natural Powder',
        link: '/assets/page/landing-page3.html',
        theme: `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>মুখাল্লাত আহমার</title>
  <style>
    body {
      /*text-align: center;*/
      /*color: white;*/
    }
    /* Dark Section */
    .dark-section {
      text-align: center;
      background-color: #0a2240;
      padding: 50px 20px;
    }
    /* Light Section */
    .light-section {
      text-align: center;
      background-color: #1e304d;
      color: #0a2240;
      padding: 50px 20px;
    }
    h1 {
      font-size: 30px;
      color: #ffcc00;
      position: relative;
      display: inline-block;
      margin-bottom: 25px!important;
    }
    h1::after {
      content: "";
      width: 80px;
      height: 3px;
      background: #ffcc00;
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
    }
    h3 {
      font-size: 16px;
      margin-bottom: 20px;
      color: white;
    }
    .product-container {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
    .product-box {
      border: 2px solid #ffcc00;
      border-radius: 10px;
      padding: 10px;
      background-color: #0a2240;
      display: inline-block;
    }
    .product-box img {
      width: 100%;
      max-width: 650px;
      border-radius: 10px;
    }
    h2 {
      font-size: 24px;
      margin-bottom: 20px!important;
      color: #ffcc00;
      position: relative;
      display: inline-block;
    }
    h2::after {
      content: "";
      width: 80px;
      height: 3px;
      background: #ffcc00;
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      max-width: 1000px;
      margin: auto auto 30px;
    }
    .feature-box {
      border: 1px solid #ffcc00;
      padding: 20px;
      border-radius: 8px;
      color:white;
      text-align: center;
    }
    .feature-box svg {
      width: 40px;
      fill: #FFB700;
      color: #FFB700;
      border-color: #FFB700;
      margin-bottom: 10px;
    }
    .button {
      display: inline-block;
      background-color: #ffcc00;
      color: #0a2240;
      border:3px solid #fff;
      padding: 12px 20px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      transition: 0.3s;
    }
    .button:hover {
      background-color: #e6b800;
    }
    /* Why Choose Us Section */
    .container-page3 {
      display: flex;
      flex-wrap: wrap;
      max-width: 900px;
      margin: 30px auto;
      border-radius: 10px;
      overflow: hidden;
      background-color: #0a2240;
    }
    .left {
      width: 50%;
    }
    .left img {
      width: 100%;
      height: auto;
    }
    .right {
      width: 50%;
      padding: 30px;
      background-color: #0a2240;
      color: white;
    }
    .right h2 {

      font-size: 22px;
      margin-bottom: 15px;
      color: #ffcc00;
    }
    .right ul {
      list-style: none;
      margin-bottom: 20px;
    }
    .right ul li {
      font-size: 16px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    .right ul li::before {
      content: "✔";
      color: #ffcc00;
      font-weight: bold;
      margin-right: 10px;
    }
     /* Responsive Fix for Mobile */
        @media (max-width: 768px) {
            .container-page3 {
                flex-direction: column;
            }
            .left, .right {
                width: 100%;
            }
            .right {
                padding: 20px 0;
                text-align: center;
            }
            .right ul {
                padding-left: 0;
            }
        }
  </style>
</head>
<body>

<!-- Dark Section - Product Intro -->
<div class="dark-section">
  <h1>মুখাল্লাত আহমার</h1>
  <h3>লক্ষ টাকার বাতাসের ইউনিক মিষ্টি সৌরভ মুগ্ধ করুন সবাইকে</h3>

  <div class="product-container">
    <div class="product-box">
      <img id="image" src="https://storage.googleapis.com/a1aa/image/UxV7aLlJRqDox9_v5weVQ4X2Aj0CDIB1JSi5A3hJYlM.jpg" alt="Perfume Image">
    </div>
  </div>
  <a id="link" href="#payment" class="link button">অর্ডার করতে ক্লিক করুন</a>
</div>

<!-- Light Section - Features -->
<div class="light-section">
  <h2>মুখাল্লাত আহমার এর বৈশিষ্ট্য।</h2>

  <div class="features">
    <div class="feature-box">
      <svg aria-hidden="true" class="e-font-icon-svg e-fab-viadeo" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M276.2 150.5v.7C258.3 98.6 233.6 47.8 205.4 0c43.3 29.2 67 100 70.8 150.5zm32.7 121.7c7.6 18.2 11 37.5 11 57 0 77.7-57.8 141-137.8 139.4l3.8-.3c74.2-46.7 109.3-118.6 109.3-205.1 0-38.1-6.5-75.9-18.9-112 1 11.7 1 23.7 1 35.4 0 91.8-18.1 241.6-116.6 280C95 455.2 49.4 398 49.4 329.2c0-75.6 57.4-142.3 135.4-142.3 16.8 0 33.7 3.1 49.1 9.6 1.7-15.1 6.5-29.9 13.4-43.3-19.9-7.2-41.2-10.7-62.5-10.7-161.5 0-238.7 195.9-129.9 313.7 67.9 74.6 192 73.9 259.8 0 56.6-61.3 60.9-142.4 36.4-201-12.7 8-27.1 13.9-42.2 17zM418.1 11.7c-31 66.5-81.3 47.2-115.8 80.1-12.4 12-20.6 34-20.6 50.5 0 14.1 4.5 27.1 12 38.8 47.4-11 98.3-46 118.2-90.7-.7 5.5-4.8 14.4-7.2 19.2-20.3 35.7-64.6 65.6-99.7 84.9 14.8 14.4 33.7 25.8 55 25.8 79 0 110.1-134.6 58.1-208.6z"></path></svg>
      <p>জাফরান আর বাতাসের অদ্ভুত মিষ্টি ঘ্রাণ যে কাউকে মুগ্ধ করবে</p>
    </div>
    <div class="feature-box">
      <svg aria-hidden="true" class="e-font-icon-svg e-fab-viadeo" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M276.2 150.5v.7C258.3 98.6 233.6 47.8 205.4 0c43.3 29.2 67 100 70.8 150.5zm32.7 121.7c7.6 18.2 11 37.5 11 57 0 77.7-57.8 141-137.8 139.4l3.8-.3c74.2-46.7 109.3-118.6 109.3-205.1 0-38.1-6.5-75.9-18.9-112 1 11.7 1 23.7 1 35.4 0 91.8-18.1 241.6-116.6 280C95 455.2 49.4 398 49.4 329.2c0-75.6 57.4-142.3 135.4-142.3 16.8 0 33.7 3.1 49.1 9.6 1.7-15.1 6.5-29.9 13.4-43.3-19.9-7.2-41.2-10.7-62.5-10.7-161.5 0-238.7 195.9-129.9 313.7 67.9 74.6 192 73.9 259.8 0 56.6-61.3 60.9-142.4 36.4-201-12.7 8-27.1 13.9-42.2 17zM418.1 11.7c-31 66.5-81.3 47.2-115.8 80.1-12.4 12-20.6 34-20.6 50.5 0 14.1 4.5 27.1 12 38.8 47.4-11 98.3-46 118.2-90.7-.7 5.5-4.8 14.4-7.2 19.2-20.3 35.7-64.6 65.6-99.7 84.9 14.8 14.4 33.7 25.8 55 25.8 79 0 110.1-134.6 58.1-208.6z"></path></svg>
      <p>প্রিয়জনকে গিফট করার জন্য একটি অনন্য সুগন্ধি</p>
    </div>
    <div class="feature-box">
      <svg aria-hidden="true" class="e-font-icon-svg e-fab-viadeo" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M276.2 150.5v.7C258.3 98.6 233.6 47.8 205.4 0c43.3 29.2 67 100 70.8 150.5zm32.7 121.7c7.6 18.2 11 37.5 11 57 0 77.7-57.8 141-137.8 139.4l3.8-.3c74.2-46.7 109.3-118.6 109.3-205.1 0-38.1-6.5-75.9-18.9-112 1 11.7 1 23.7 1 35.4 0 91.8-18.1 241.6-116.6 280C95 455.2 49.4 398 49.4 329.2c0-75.6 57.4-142.3 135.4-142.3 16.8 0 33.7 3.1 49.1 9.6 1.7-15.1 6.5-29.9 13.4-43.3-19.9-7.2-41.2-10.7-62.5-10.7-161.5 0-238.7 195.9-129.9 313.7 67.9 74.6 192 73.9 259.8 0 56.6-61.3 60.9-142.4 36.4-201-12.7 8-27.1 13.9-42.2 17zM418.1 11.7c-31 66.5-81.3 47.2-115.8 80.1-12.4 12-20.6 34-20.6 50.5 0 14.1 4.5 27.1 12 38.8 47.4-11 98.3-46 118.2-90.7-.7 5.5-4.8 14.4-7.2 19.2-20.3 35.7-64.6 65.6-99.7 84.9 14.8 14.4 33.7 25.8 55 25.8 79 0 110.1-134.6 58.1-208.6z"></path></svg>
      <p>এই সুগন্ধি তাদের জন্য যারা প্রিয়জনের কমপ্লিমেন্ট চান</p>
    </div>
    <div class="feature-box">
      <svg aria-hidden="true" class="e-font-icon-svg e-fab-viadeo" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M276.2 150.5v.7C258.3 98.6 233.6 47.8 205.4 0c43.3 29.2 67 100 70.8 150.5zm32.7 121.7c7.6 18.2 11 37.5 11 57 0 77.7-57.8 141-137.8 139.4l3.8-.3c74.2-46.7 109.3-118.6 109.3-205.1 0-38.1-6.5-75.9-18.9-112 1 11.7 1 23.7 1 35.4 0 91.8-18.1 241.6-116.6 280C95 455.2 49.4 398 49.4 329.2c0-75.6 57.4-142.3 135.4-142.3 16.8 0 33.7 3.1 49.1 9.6 1.7-15.1 6.5-29.9 13.4-43.3-19.9-7.2-41.2-10.7-62.5-10.7-161.5 0-238.7 195.9-129.9 313.7 67.9 74.6 192 73.9 259.8 0 56.6-61.3 60.9-142.4 36.4-201-12.7 8-27.1 13.9-42.2 17zM418.1 11.7c-31 66.5-81.3 47.2-115.8 80.1-12.4 12-20.6 34-20.6 50.5 0 14.1 4.5 27.1 12 38.8 47.4-11 98.3-46 118.2-90.7-.7 5.5-4.8 14.4-7.2 19.2-20.3 35.7-64.6 65.6-99.7 84.9 14.8 14.4 33.7 25.8 55 25.8 79 0 110.1-134.6 58.1-208.6z"></path></svg>
      <p>২-৩ ফুট দূর পর্যন্ত ছড়াবে</p>
    </div>
    <div class="feature-box">
      <svg aria-hidden="true" class="e-font-icon-svg e-fab-viadeo" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M276.2 150.5v.7C258.3 98.6 233.6 47.8 205.4 0c43.3 29.2 67 100 70.8 150.5zm32.7 121.7c7.6 18.2 11 37.5 11 57 0 77.7-57.8 141-137.8 139.4l3.8-.3c74.2-46.7 109.3-118.6 109.3-205.1 0-38.1-6.5-75.9-18.9-112 1 11.7 1 23.7 1 35.4 0 91.8-18.1 241.6-116.6 280C95 455.2 49.4 398 49.4 329.2c0-75.6 57.4-142.3 135.4-142.3 16.8 0 33.7 3.1 49.1 9.6 1.7-15.1 6.5-29.9 13.4-43.3-19.9-7.2-41.2-10.7-62.5-10.7-161.5 0-238.7 195.9-129.9 313.7 67.9 74.6 192 73.9 259.8 0 56.6-61.3 60.9-142.4 36.4-201-12.7 8-27.1 13.9-42.2 17zM418.1 11.7c-31 66.5-81.3 47.2-115.8 80.1-12.4 12-20.6 34-20.6 50.5 0 14.1 4.5 27.1 12 38.8 47.4-11 98.3-46 118.2-90.7-.7 5.5-4.8 14.4-7.2 19.2-20.3 35.7-64.6 65.6-99.7 84.9 14.8 14.4 33.7 25.8 55 25.8 79 0 110.1-134.6 58.1-208.6z"></path></svg>
      <p>সুটি কাপড়ে টানা ১২ ঘন্টা+ থাকবে</p>
    </div>
    <div class="feature-box">
      <svg aria-hidden="true" class="e-font-icon-svg e-fab-viadeo" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M276.2 150.5v.7C258.3 98.6 233.6 47.8 205.4 0c43.3 29.2 67 100 70.8 150.5zm32.7 121.7c7.6 18.2 11 37.5 11 57 0 77.7-57.8 141-137.8 139.4l3.8-.3c74.2-46.7 109.3-118.6 109.3-205.1 0-38.1-6.5-75.9-18.9-112 1 11.7 1 23.7 1 35.4 0 91.8-18.1 241.6-116.6 280C95 455.2 49.4 398 49.4 329.2c0-75.6 57.4-142.3 135.4-142.3 16.8 0 33.7 3.1 49.1 9.6 1.7-15.1 6.5-29.9 13.4-43.3-19.9-7.2-41.2-10.7-62.5-10.7-161.5 0-238.7 195.9-129.9 313.7 67.9 74.6 192 73.9 259.8 0 56.6-61.3 60.9-142.4 36.4-201-12.7 8-27.1 13.9-42.2 17zM418.1 11.7c-31 66.5-81.3 47.2-115.8 80.1-12.4 12-20.6 34-20.6 50.5 0 14.1 4.5 27.1 12 38.8 47.4-11 98.3-46 118.2-90.7-.7 5.5-4.8 14.4-7.2 19.2-20.3 35.7-64.6 65.6-99.7 84.9 14.8 14.4 33.7 25.8 55 25.8 79 0 110.1-134.6 58.1-208.6z"></path></svg>
      <p>এটি খুবই আনকমন একটি সুগন্ধি যা যেকোনো জায়গায় পাবেন না</p>
    </div>
  </div>
  <a id="link" href="#payment" class="link button">অর্ডার করতে ক্লিক করুন</a>
</div>

<!-- Dark Section - Why Choose Us -->
<div class="dark-section">
  <div class="container-page3">
    <div class="left">
      <img id="image" src="https://storage.googleapis.com/a1aa/image/UxV7aLlJRqDox9_v5weVQ4X2Aj0CDIB1JSi5A3hJYlM.jpg" alt="Perfume Promotion">
    </div>
    <div class="right">
      <h2>আমরা কেন অন্যদের চেয়ে আলাদা</h2>
      <ul>
        <li>আমরা দেশি লোকাল কোন সুগন্ধি সেল করি না</li>
        <li>আফটার সেল সার্ভিস আমাদের সুদীর্ঘ দীর্ঘদিনের</li>
        <li>পণ্য হাতে পাওয়ার ৩ দিনের মধ্যে গ্রহনযোগ্য সুবিধা</li>
        <li>প্রোডাক্ট পছন্দ না হলে রিটার্ন সুবিধা</li>
        <li>আমাদের রয়েছে ৭০+ প্রিমিয়াম সুগন্ধি যা থেকে আপনি আপনার পছন্দ মতো বাছাই করতে পারবেন</li>
      </ul>
      <a id="link" href="#payment" class="link button">অর্ডার করতে ক্লিক করুন</a>
    </div>
  </div>
</div>

</body>
</html>
`
      },

      {
        _id: '543543534',
        image: '/assets/page/page-44.png',
        name: 'Natural Beauty',
        link: '/assets/page/landing-page4.html',
        theme: `
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>
        Web Page Design
    </title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
        }

        /*.container {*/
        /*    @media (min-width: 1400px) {max-width: 1320px;}*/
        /*    @media (min-width: 1200px) {max-width: 1140px;}*/
        /*    @media (min-width: 992px) {max-width: 1320px;}*/
        /*    @media (min-width: 768px) {max-width: 720px;}*/
        /*    @media (min-width: 576px) {max-width: 540px;}*/
        /*}*/

        .section0 {
            background: #2a3a8a;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .section0 .top-heading {
            color: white;
            max-width: 992px;

            h3 {
                font-size: clamp(1rem, 2.5vw, 2.5rem);
                line-height: clamp(1.5rem, 4vw, 4.2rem);
                text-align: center;
            }
        }

        .section1 {
            /*background-image: url("/assets/page/bg.png");*/
            /*  background-position: center;*/
            /*  background-size: cover;*/
            /* background-repeat: no-repeat;*/
            background: #d9edf4;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin: 0;
            padding: 0 10px 10px 10px;
        }

        .section1 .use-time {
            padding-bottom: 60px;
            text-align: center;
            max-width: 1024px;
            width: 100%;
        }


        .section1 .use-time h3 {
            font-size: clamp(1rem, 2.5vw, 2rem);
            line-height: clamp(1.5rem, 2.5vw, 2.5rem);
            background: #f2d468;
            margin: 0;
            padding: 20px 0;
            border-radius: 0 0 16px 16px;
        }

        .section1 .theme-container {
            text-align: center;
            max-width: 990px;
            width: 88%;
            padding: 20px;
            margin: 0 auto;
            border-radius: 24px;
            background-color: white;
            box-shadow: 0 -1px 24px 0 #1e85d6;
        }

        .section1 .header {
            background-color: #fff1b7;
            color: #cc0000;
            font-weight: bold;
            font-size: 22px;
            padding: 15px;
            border-radius: 10px 10px 0 0;
            border: 8px solid #ffcc00;
        }

        /* .section1 .content {
            padding: 20px;
        } */
        .section1 .content p {
            color: #ffffff;
            margin-bottom: 20px;
        }

        .section1 .image-container {
            display: flex;
            justify-content: center;
            /* margin-bottom: 20px; */
        }

        .section1 .image-container img {
            width: 100%;
            /* height: auto; */
            max-height: 600px;
            height: 100%;
            border-radius: 8px;
        }

        .section1 .price {
            padding-left: 10px;
            color: #ffffff;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 17px;
            margin-bottom: 20px;
            border-radius: 16px 0;
            border-width: 1px;
            border-style: solid;
            border-color: rgb(242, 211, 53);
        }

        .section1 .price span {
            text-align: right;
            background-color: #cc0000;
            color: #ffffff;
            text-wrap: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            height: 100%;
            border-radius: 0 0 16px;
        }

        .section1 .button {
            text-align: center;
            font-size: 20px;
            line-height: 45px;
            font-weight: 700;
            display: inline-block;
            width: auto;
            margin-top: 30px;
            box-shadow: rgba(0, 0, 0, 0.1) 0 20px 20px 0;
            background: linear-gradient(90deg, rgb(242, 211, 53) 0px, rgb(242, 211, 53) 51%, rgb(201, 172, 31)) 0% 0% / 200%;
            transition: 0.5s;
            padding: 5px 15px;
            border-radius: 10px;
            border-width: 3px;
            border-style: solid;
            border-color: rgb(242, 68, 29);
            border-image: initial;
        }

        .section3 {
            background-color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 0;
        }

        .section3 .header-container {
            padding: 0 20px;
        }
        .section3 .single-card{
            padding: 20px;
        }

        .section3 .header {
            background-color: #2a3a8a;
            /*border: 2px solid #38A169;*/
            box-shadow: 0 -1px 24px 0 #1e85d6;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin-bottom: 24px;
            max-width: 1024px;
            width: 100%;
        }

        .section3 .header h1 {
            color: white;
            font-size: clamp(1.5rem, 2.5vw, 30px);
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .section3 .header h1 i {
            margin: 0 8px;
        }

        .section3 .content {
            background-color: white;
            border-radius: 8px;
            padding: 0;
            margin-bottom: 24px;
            width: 100%;
            max-width: 1024px;
        }

        .section3 .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 20px;
        }

        @media (min-width: 768px) {
            .section3 .grid {
                grid-template-columns: 1fr 1fr;
            }

            .section3 .header-container .grid-container {
                padding: 0;
            }

            .section3 .content {
                padding: 24px;
            }

            .section3 {
                padding: 60px 0;
            }
        }

        .section3 .grid .single-card {
            /*border: 1px solid #E2E8F0;*/
            box-shadow: 0 -1px 24px 0 #1e85d6;
            border-radius: 24px;
            padding: 30px;
        }

        .section3 .grid .single-card .product-title {
            h3 {
                font-size: clamp(1rem, 2.5vw, 30px);
                color: #2a3a8a;
                padding-bottom: 20px;
                margin-bottom: 10px;
                border-bottom: 1px dashed #2a3a8a;
            }

            h4 {
                color: #2a3a8a;
                font-size: clamp(1rem, 2.5vw, 24px);
            }
        }

        .section3 .grid .single-card .single-content {
            color: #7a7a7a;
            font-size: clamp(1rem, 2.5vw, 22px);
            font-weight: 600;
        }

        .section3 .button {
            background: linear-gradient(to right, #ffcc00, #ff9900);
            color: #ffffff;
            font-weight: bold;
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            margin-top: 24px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .section3 .button:hover {
            background: linear-gradient(to right, #ff9900, #ffcc00);
        }

        .section3 .footer {
            color: #E53E3E;
            text-align: center;
        }

        .section6 {
            margin: 60px 0;
        }

        .section6 .container {
            background-color: #1b5e20;
            color: white;
            border-radius: 10px;
            padding: 20px;
            width: 80%;
            margin: 0 auto;
            max-width: 800px;
        }

        .section6 .header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }

        .section6 .header i {
            color: #ff5722;
            margin-right: 10px;
        }

        .section6 .header h1 {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .section6 .content {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
        }

        .section6 .content div {
            display: flex;
            align-items: start;
        }

        .section6 .content i {
            color: #4caf50;
            margin-right: 10px;
        }

        @media (min-width: 768px) {
            .section6 .content {
                grid-template-columns: 1fr 1fr;
            }
        }

        .section7 {
            max-width: 800px;
            width: 100%;
            margin-top: 50px;
        }

        .section7 .offer-container {
            margin: 0 auto;
            background-color: #f2f4ff;
            border: 6px solid #2a3a8a;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            /*max-width: 600px;*/
            /*width: 100%;*/
        }

        .section7 .offer-container p {
            color: #065f46;
            margin-bottom: 16px;
            font-size: 16px;
            line-height: 2.5em;
        }

        .section7 .offer-container .regular-price {
            color: #000000;
            font-size: clamp(1rem, 2.5vw, 30px);
            /*font-weight: bold;*/
            margin-bottom: 8px;
        }

        .section7 .offer-container .free-home-delivery {
            color: #000000;
            font-size: clamp(1rem, 2.5vw, 24px);
        }

        .section7 .offer-container .offer-price {
            color: #f82d6f;
            font-size: clamp(1rem, 2.5vw, 32px);
            line-height: 2px;
            font-weight: bold;
            margin-bottom: 16px;
        }

        .section7 .offer-container .contact-button {
            background-color: #f97316;
            color: white;
            padding: 10px 20px;
            border-radius: 9999px;
            font-size: 18px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }

        .section7 .offer-container .contact-button i {
            margin-right: 8px;
        }

        @media (max-width: 768px) {
            .section7 {
                width: 90%;
                margin: 30px auto;
            }

            .section1 .theme-container {
                width: 100%;
            }
        }

        .section4 {
            background: #2a3a8a;
            width: 100%;
        }

        .section4 .container {
            max-width: 1024px;
            width: 100%;
            margin: 0 auto;
            padding: 60px 20px;

            .top-heading {
                h3 {
                    color: #e8a878;
                    font-size: clamp(1.3rem, 2.5vw, 32px);
                    text-align: center;
                    line-height: 1.7em;
                }
            }
        }

        /*.section4 .video-section {*/
        /*    margin-bottom: 20px;*/
        /*    background: white;*/
        /*    padding: 20px;*/
        /*}*/
        .section4 .info-offer-section {
            background-color: #4CAF50;
            color: #FFD700;
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            border: 4px solid #006400;
            margin-bottom: 20px;
        }

        .section4 .info-offer-section p {
            margin: 10px 0;
            font-size: 1.2em;
            font-weight: bold;
        }

        .section4 .offer-box {
            background-color: #C8E6C9;
            color: #2E7D32;
            padding: 20px;
            border-radius: 10px;
            border: 4px solid #4CAF50;
            display: inline-block;
        }

        .section4 .offer-box span {
            background-color: #FF5722;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            margin-left: 10px;
        }

        .section4 .order-button {
            text-align: center;
        }

        .section4 .order-button button {
            background-color: #FFEB3B;
            color: #D32F2F;
            font-size: 1.2em;
            font-weight: bold;
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
        }

        .video-container {
            margin: 50px 0;
            padding: 10px;
            width: 100%;
            background: #fff;

            iframe {
                height: 100%;
                width: 100%;
                min-height: 250px;
            }
        }

        @media (min-width: 768px) {
            .video-container {
                height: 450px;
                padding: 25px;
            }
        }

        .section8 {
            background: linear-gradient(rgb(255, 225, 202), rgba(255, 225, 202, 0));

            padding-top: 80px;
            width: 100%;

            .container {
                max-width: 1024px;
                width: 100%;
                margin: 0 auto;
                padding: 20px;
            }

            .list {
                margin-top: 60px;
                padding: 20px 0;
                background: #fff;
                box-shadow: 0 11px 16px -11px rgba(0, 0, 0, 0.06);
                border-radius: 20px;
                svg {
                    fill: #F2D368;
                    width: 60px;
                    height: 50px;
                }

                .list-item {
                    font-size: clamp(1.2em, 2.5vw, 25px);
                    font-weight: 600;
                    color: #2A3AA8;
                    border-bottom: 1px solid #c4c4c4;
                    list-style-type: none;
                    padding: 15px 36px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: start;

                    &:last-child {
                        border-bottom: none;
                        padding-bottom: 0;
                    }
                }
            }

        }

        @media (max-width: 768px) {
            .section8{
                padding-top: 40px;
            }
            .section8 .list {
                padding-top: 30px;
                .list-item {
                    padding: 5px 10px 10px;
                    margin: 16px 0;
                    align-items: start;
                    svg {
                        width: 50px;
                        height: 40px;
                    }
                }
            }
        }
    </style>
</head>
<body>

<div class="section0">
    <div class="top-heading">
        <h3>আপনার সৌন্দর্যের জন্য সেরা কম্বো প্যাকেজ একটাই প্রাকৃতিক সমাধান</h3>
    </div>
</div>

<div class="section1">
    <div class="use-time">
        <h3>কমপক্ষে ১ বছর ঘরে বসে ব্যবহার করুন</h3>
    </div>
    <div class="theme-container">
        <div class="content">
            <div class="image-container">
                <img id="image" alt="Two bottles of a health supplement with a red ribbon around them" height="300"
                     src="https://storage.googleapis.com/a1aa/image/hGWOwM92DsOoO1L3YyFbyOR2XfXsgGkpv1jOMhTpUFg.jpg"
                     width="200"/>
            </div>

            <!--         <button class="button">-->
            <!--          অর্ডার করতে ক্লিক করুন-->
            <!--         </button>-->
        </div>
    </div>

    <div style="border: 2px solid #003366;margin-top: 50px; margin-bottom: 30px; padding: 20px; border-radius: 10px; text-align: center; background: transparent; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
        <p style="color: red; font-size: clamp(1rem, 2.5vw, 24px); text-decoration: line-through; margin: 0;">
            প্রথম অর্ডার করলে পাচ্ছেন ১৯৯০ টাকার প্যাকেজ
        </p>
        <p style="color: #003366; font-size: clamp(1rem, 2.5vw, 30px); font-weight: bold; margin: 10px 0;">
            অফার প্রাইসঃ মাত্র ১২৫০ টাকা।
        </p>
        <div style="display: flex; justify-content: center; align-items: center">
            <button style="background-color: #fdd835; color: white; margin-top: 20px; font-size: clamp(1rem, 2.5vw, 22px); font-weight: bold; padding: 12px 16px; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 3px solid #e91e63; display: flex; align-items: center; gap: 10px">
                অর্ডার করতে ক্লিক করুন
                <span>
                  <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                       xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 902.86 902.86"
                       xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier"
                                                                                              stroke-linecap="round"
                                                                                              stroke-linejoin="round"></g><g
                          id="SVGRepo_iconCarrier"> <g> <g> <path
                          d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path> <path
                          d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path> </g> </g> </g></svg>
              </span>
            </button>
        </div>
    </div>
</div>


<div class="section3">
    <div class="header-container">
        <div class="header">
            <h1>
                <i class="fas fa-angle-double-left"></i> বাংলাদেশে তৈরি একমাত্র আমাদের হাতে তৈরি সাবান
                <i class="fas fa-angle-double-right"></i>
            </h1>
        </div>
    </div>

    <div class="content">
        <div class="grid-container">
            <div class="grid">
                <div class="single-card">
                    <div class="product-title">
                        <h3>দারুচিনি সাবান বার</h3>
                        <h4>উপকারিতাঃ</h4>
                    </div>
                    <p class="single-content">ব্রণ ও ব্রণের দাগ দূর করে।</p>
                    <p class="single-content">ডার্ক সার্কেল রিমুভ করে ভুক টাইট করে।</p>
                    <p class="single-content">ত্বকের যে কোন দাগ রিমুভ করে।</p>
                    <p class="single-content">প্রাকৃতিকভাবে চেহারা ফর্সা করে ৫ শেড পর্যন্ত।</p>
                    <p class="single-content">সঠিক পুষ্টি যুগিয়ে ত্বকে ময়শ্চারাইজিং আনে।</p>
                    <div>
                    </div>
                </div>
                <div class="single-card">
                    <div class="product-title">
                        <h3>পেঁপে সাদা করার সাবান</h3>
                        <h4>উপকারিতাঃ</h4>
                    </div>
                    <p class="single-content">ত্বক ফর্সা করে।</p>
                    <p class="single-content">ত্বকের উজ্জলতা বৃদ্ধি করে।</p>
                    <p class="single-content">ব্রণ ও ব্রণের দাগ দূর করে।</p>
                    <p class="single-content">রোদ্রে পোড়া দাগ দূর করে।</p>
                    <p class="single-content">আগুনে পোড়া দাগ দূর করে।</p>
                    <p class="single-content">ব্রনের দাগ দূর করে।</p>
                    <div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: center; align-items: center">
            <a class="link" id="link" href="#payment" style="background-color: #fdd835; color: white; margin-top: 20px; font-size: clamp(1rem, 2.5vw, 22px); font-weight: bold; padding: 12px 16px; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 3px solid #e91e63; display: flex; align-items: center; gap: 10px">
                অর্ডার করতে ক্লিক করুন
                <span>
                  <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                       xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 902.86 902.86"
                       xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier"
                                                                                              stroke-linecap="round"
                                                                                              stroke-linejoin="round"></g><g
                          id="SVGRepo_iconCarrier"> <g> <g> <path
                          d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path> <path
                          d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path> </g> </g> </g></svg>
              </span>
            </a>
        </div>

    </div>


    <div class="section4">
        <div class="container">
            <div class="top-heading">
                <h3>ফেস কেয়ার সেট কম্বো সব সমস্যা সমাধানে প্রাকৃতিক সেরা কম্বো প্যাকেজ অম্পর্ক আরো জানুন</h3>
            </div>
            <!-- Video Section -->
            <div class="video-container">
                <iframe id="video" src="https://www.youtube.com/embed/0IHfyRidDlE" frameborder="0"
                        allowfullscreen></iframe>
            </div>

            <!-- Order Button -->
            <div style="display: flex; justify-content: center; align-items: center">
                <a class="link" id="link" href="#payment" style="background-color: #fdd835; color: white; margin-top: 20px; font-size: clamp(1rem, 2.5vw, 22px); font-weight: bold; padding: 12px 16px; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 3px solid #e91e63; display: flex; align-items: center; gap: 10px">
                    অর্ডার করতে ক্লিক করুন
                    <span>
                  <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                       xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 902.86 902.86"
                       xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier"
                                                                                              stroke-linecap="round"
                                                                                              stroke-linejoin="round"></g><g
                          id="SVGRepo_iconCarrier"> <g> <g> <path
                          d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path> <path
                          d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path> </g> </g> </g></svg>
              </span>
                </a>
            </div>
        </div>
    </div>

    <div class="section8">
        <div class="container">
            <div class="header">
                <h1>
                    <i class="fas fa-angle-double-left"></i> বাংলাদেশে তৈরি একমাত্র আমাদের হাতে তৈরি সাবান
                    <i class="fas fa-angle-double-right"></i>
                </h1>
            </div>
            <ul class="list">
                <li class="list-item">
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#434343">
                        <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Zm80-207Zm0 134 210-134-210-134v268Z"/>
                    </svg>
                        </span>
                    <span>আকর্ষনীয় প্যাকিং সুবিধা।</span></li>

                <li class="list-item">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#434343">
                        <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Zm80-207Zm0 134 210-134-210-134v268Z"/>
                    </svg>
                        </span>
                    <span>সাশ্রয়ী মূল্যে বাংলাদেশে হাতে তৈরি কোয়ালিটি প্রোডাক্ট।</span></li>
                <li class="list-item">
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#434343">
                        <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Zm80-207Zm0 134 210-134-210-134v268Z"/>
                    </svg>
                        </span>
                    <span>১০০% কোয়ালিটি এবং ৩ দিনের রিটার্ন গ্যারান্টি। সার্বক্ষনিক কল</span></li>
                <li class="list-item">
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#434343">
                        <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Zm80-207Zm0 134 210-134-210-134v268Z"/>
                    </svg>
                        </span>
                    <span>সারাদেশে ২৪ থেকে ৭২ ঘন্টায় হোম ডেলিভারি।</span></li>
            </ul>
        </div>

    </div>

    <div class="section7">
        <div class="offer-container">
            <p class="regular-price">৪০০ গ্রামের রেগুলার মূল্য ১২০০ টাকা।</p>
            <p class="offer-price">অফার মূল্য = ৮৫০/-টাকা</p>
            <p class="free-home-delivery">(ফ্রি হোম ডেলিভারি!!)</p>
            <div style="display: flex; justify-content: center; align-items: center">
                <a class="link" id="link" href="#payment" style="background-color: #fdd835; color: white; margin-top: 20px; font-size: clamp(1rem, 2.5vw, 22px); font-weight: bold; padding: 12px 16px; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 3px solid #e91e63; display: flex; align-items: center; gap: 10px">
                    অর্ডার করতে ক্লিক করুন
                    <span>
                  <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                       xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 902.86 902.86"
                       xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier"
                                                                                              stroke-linecap="round"
                                                                                              stroke-linejoin="round"></g><g
                          id="SVGRepo_iconCarrier"> <g> <g> <path
                          d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path> <path
                          d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path> </g> </g> </g></svg>
              </span>
                </a>
            </div>
        </div>
    </div>
</div>
</body>
</html>

`
      },

      {
        _id: '543543535',
        image: '/assets/page/landing-page5 (2).png',
        name: 'Skin Care',
        link: '/assets/page/landing-page5.html',
        theme: `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Hind Siliguri', sans-serif;
    }

    ul li {
        list-style: none;
    }

    ul.list {
        margin-bottom: 30px;

        @media (max-width: 768px) {
            width: 100%;
        }

        .list-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 5px 0 5px 20px;
            border-bottom: 3px solid rgba(0, 0, 0, 0.1);

            svg {
                width: 3.25em !important;
                height: 2.25em !important;
                fill: aqua;
                @media (max-width: 768px) {
                    width: 2.25em !important;
                    height: 1.85em !important;
                }
            }

            p {
                font-size: 25px;
                font-weight: 600;
                @media (max-width: 768px) {
                    font-size: 16px;
                }
            }

            .option {
                color: #e4047c;
            }
        }
    }

    .top-section {
        text-align: center;
        @media (max-width: 768px) {
            margin: 0 auto;
        }

        img {
            width: 80%;
            height: 100%;
            margin-top: 50px;
            @media (max-width: 768px) {
                width: 90%;
            }
        }
    }

    .container {
        max-width: 1440px;
        margin: 0 auto;

        @media (max-width: 768px) {
            padding: 0 20px;
        });
    }

    .section {
        padding: 0 100px;

        @media (max-width: 1025px) {
            padding: 0 20px;
        });
        @media (max-width: 768px) {
            /*padding: 0 20px;*/
            padding: 0;
        });
    }

    .heading {
        font-size: clamp(25px, 8vw, 50px);
        line-height: 1.3em;
        text-align: center;
    }

    .title {
        font-size: 20px;
        line-height: 1.4em;
        font-weight: 600;
        margin-bottom: 30px;

    }

    .area {
        padding: 20px 150px;
        @media (max-width: 1200px) {
            padding: 20px;
        });
        @media (max-width: 768px) {
            padding: 10px;
        });
    }


    .text-green {
        color: #368C29;
    }

    .btn-primary {
        background-color: #e4047c;
        font-size: 22px;
        font-weight: 600;
        border-style: double;
        border-width: 7px;
        padding: 14px 20px;
        max-width: 263px;
        margin: 0 auto;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            display: inline;
            fill: white;
            width: 37px;
            height: 24px;
        }

        &:hover {
            animation: scale 1s linear infinite alternate;
        }

        @media (max-width: 768px) {
            font-size: 15px;
            padding: 10px 15px;
            max-width: 200px;
        }
    }

    @keyframes scale {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.08);
        }
        100% {
            transform: scale(1.15);
        }
    }

    .button-container {
        margin: 30px 0;
    }

    .heading-title {
        font-size: clamp(20px, 5vw, 35px);
        background-color: #004111;
        padding: 12px 20px 12px 20px;
        text-align: center;
        color: white;
        margin-bottom: 30px;
    }

    .content-area {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        gap: 20px;
        @media (max-width: 768px) {
            flex-direction: column;
            .headline {
                text-align: center;
            }

            p {
                text-align: justify;
            }

        ;
        }
    }

    .headline {
        font-size: clamp(20px, 5vw, 40px);
        line-height: 1.2;
        color: #54595F;
        padding: 30px 0 50px 0;
        font-weight: 900;
    }

    p {
        font-size: clamp(17px, 2vw, 40px);

        font-weight: 600;
        line-height: 2em;
        color: #000000;
    }

    .headline-text-wrapper {
        position: relative;
        display: inline-block;

        svg {
            position: absolute;
            top: 104%;
            left: 33%;
            width: calc(80%);
            height: calc(100% + 20px);
            transition: transform 0.5s ease-in-out;
            transform: rotate(37deg) translate(-51%, -43%);
            overflow: visible;
            fill: #61ce70;
            z-index: -1;
        }
    }

    .headline-text-wrapper span svg {
        path {
            stroke: #5d3030;
            stroke-width: 9;
            fill: none;
            opacity: 0;
            stroke-dasharray: 0 1500;
            transition: .3s
        }
    }


    .offer-pricing {
        background-color: #121212;
        padding: 50px 0 15px 0;
        text-align: center;
        /*font-size: 30px;*/
        font-size: clamp(17px, 3vw, 30px);
        margin-bottom: 20px;

        .regular-price {
            color: #fff;
            position: relative;
            z-index: 1;
        }

        .discount-price {
            color: #FFFF00;
        }
    }

    .contact-banner {
        background-color: #6EC1E4;
        padding: 50px 0 15px 0;
        text-align: center;
        font-size: 30px;
        margin-bottom: 20px;

        .call-btn {
            background-color: #17C607;
            font-size: 24px;
            font-weight: 700;
            fill: #000000;
            color: #000000;
            border: none;
            border-radius: 5px;
            padding: 15px 40px;
            box-shadow: 1px 2px 10px 0 rgba(0, 0, 0, 0.5);
            outline: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            margin: 0 auto;

            svg {
                width: 40px;
                height: 40px;
                fill: #121212;
            }
        }


        .regular-price {
            color: #fff;
        }

        .discount-price {
            color: #FFFF00;
        }
    }

    .border-none {
        border: none !important
    }

    .trusted {
        padding: 50px 0;
    }


    .cross-container {
        position: absolute;
        top: 80%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 140%;
        height: 140%;
        z-index: -3;

    }

    .svg-cross path {
        stroke: red;
        stroke-width: 15; /* Increased stroke width for bold effect */
        fill: none;
        stroke-dasharray: 500;
        stroke-dashoffset: 500;
        animation: drawCross 1s linear forwards;
    }

    @keyframes drawCross {
        from {
            stroke-dashoffset: 500;
        }
        to {
            stroke-dashoffset: 0;
        }
    }

    .elementor-video-iframe {
        border: none;
        outline: none;
        min-height: 400px;
        @media screen and (max-width: 1024px) {
            height: 100%;
            min-height: 300px;
        }
        @media screen and (max-width: 768px) {
            height: 100%;
            min-height: 200px;
        }
    }

</style>
<body>
<div class="top-section section">
    <div class=" ">
        <h1 class="heading area"><span class="text-green">আপনার ত্বকের উজ্জ্বলতা বাড়ানোর সেরা সমাধান!</span> একটি সিরামে
            পেয়ে
            যান উজ্জ্বল ত্বক এবং দাগহীন লুক</h1>
        <img src="https://shop.skintrin.com/wp-content/uploads/2024/11/6525f295d9e38521b759a73e-the-ordinary-ascorbic-acid-8-alpha-1024x1024.jpg"
             alt="photo">
        <h4 class="title area">সিরামটি একত্রিত করেছে দুটি শক্তিশালী উপাদান — এস্করবিক অ্যাসিড (ভিটামিন C) এবং আলফা
            আরবুটিন,
            যা আপনার ত্বকের উজ্জ্বলতা এবং স্বাভাবিক রঙ ফিরিয়ে আনতে সাহায্য করে।</h4>
        <div class="button-container">
            <a class="link btn-primary" id="link" href="#payment">
                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
                    <path d="M24,3H4.242L4.2,2.649A3,3,0,0,0,1.222,0H0V2H1.222a1,1,0,0,1,.993.883L3.8,16.351A3,3,0,0,0,6.778,19H20V17H6.778a1,1,0,0,1-.993-.884L5.654,15H21.836Z"/>
                    <circle cx="7" cy="22" r="2"/>
                    <circle cx="17" cy="22" r="2"/>
                </svg>
                অর্ডার করতে চাই</a>
        </div>

    </div>
</div> <!--Top Section End-->

<div class="section area">
    <div class="">
        <iframe id="video" class="elementor-video-iframe" width="100%" allowfullscreen="" allow="autoplay"
                title="vimeo Video Player"
                src="https://www.youtube.com/embed/0IHfyRidDlE?autoplay=1&amp;playsinline=1&amp;color&amp;autopause=0&amp;loop=0&amp;muted=0&amp;title=1&amp;portrait=1&amp;byline=1#t="></iframe>
    </div>

    <h2 class="heading-title">কি আছে এই সিরামে?</h2>
    <div class="content-area">
        <div>
            <h2 class="headline">Ascorbic Acid
                <span class="headline-text-wrapper">
                        <span>8%</span>
                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24"><path d="m1,24c-.552,0-1-.447-1-1C0,10.317,10.318,0,23,0c.553,0,1,.447,1,1s-.447,1-1,1C11.42,2,2,11.421,2,23c0,.553-.448,1-1,1Z"/></svg>
            </h2>
            <p>এটি একটি শক্তিশালী অ্যান্টি-অক্সিডেন্ট যা ত্বকের উজ্জ্বলতা বাড়ায়, রক্ত সঞ্চালন উন্নত করে এবং ত্বকের কোষ পুনর্নবীকরণে সহায়তা করে। এটি ত্বককে সূর্যের ক্ষতিকর রশ্মি থেকে সুরক্ষা দেয় এবং ত্বককে স্বাস্থ্যকর এবং উজ্জ্বল রাখে।</p>
        </div>
        <div>
            <h2 class="headline">Alpha Arbutin
                <span class="headline-text-wrapper">
                        <span>2%</span>
                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24"><path d="m1,24c-.552,0-1-.447-1-1C0,10.317,10.318,0,23,0c.553,0,1,.447,1,1s-.447,1-1,1C11.42,2,2,11.421,2,23c0,.553-.448,1-1,1Z"/></svg>
            </h2>
            <p>একটি প্রাকৃতিক উপাদান যা ত্বকের অতিরিক্ত মেলানিন উৎপাদন নিয়ন্ত্রণ করে, ফলে ত্বক থেকে দাগ, ফ্রেইকলস এবং পিগমেন্টেশন কমাতে সাহায্য করে। এটি ত্বকে প্রাকৃতিক উজ্জ্বলতা ফিরিয়ে আনে এবং স্কিন টোন সমান করে।</p>
        </div>
    </div>
</div>
<div class=" area">
    <h2 class="heading-title">কি আছে এই সিরামে?</h2>
    <ul class="list section">
        <li class="list-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
            </svg>
            <p><span class="option">উজ্জ্বলতা বৃদ্ধি:</span> আপনার ত্বককে প্রাকৃতিকভাবে উজ্জ্বল এবং গ্লোইং করুন!
            </p>
        </li>
        <li class="list-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
            </svg>
            <p><span class="option">উজ্জ্বলতা বৃদ্ধি:</span> আপনার ত্বককে প্রাকৃতিকভাবে উজ্জ্বল এবং গ্লোইং করুন!
            </p>
        </li>
        <li class="list-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
            </svg>
            <p><span class="option">পিগমেন্টেশন কমানো:</span> ত্বকের দাগ, পিগমেন্টেশন ও ফ্রেইকলস দূর করতে সহায়তা
                করে।</p>
        </li>
        <li class="list-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
            </svg>
            <p><span class="option">অ্যান্টি-এজিং উপকারিতা: </span> অ্যান্টি-অক্সিডেন্ট উপাদানগুলি ত্বককে বয়সের
                ছাপ থেকে রক্ষা করে।</p>
        </li>
        <li class="list-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
            </svg>
            <p><span class="option">ত্বককে মসৃণ ও সুস্থ রাখে:  </span> নিয়মিত ব্যবহারে ত্বক হয়ে ওঠে মসৃণ, কোমল
                এবং স্বাস্থ্যকর।</p>
        </li>
    </ul>
</div>
<div class="button-container">
    <a class="link btn-primary" id="link" href="#payment">
        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
            <path d="M24,3H4.242L4.2,2.649A3,3,0,0,0,1.222,0H0V2H1.222a1,1,0,0,1,.993.883L3.8,16.351A3,3,0,0,0,6.778,19H20V17H6.778a1,1,0,0,1-.993-.884L5.654,15H21.836Z"/>
            <circle cx="7" cy="22" r="2"/>
            <circle cx="17" cy="22" r="2"/>
        </svg>
        অর্ডার করতে চাই</a>
</div>

<div class="">
    <div class="section offer-pricing">
        <h2 class="regular-price">30ml রেগুলার মূল্য <span
                style="position: relative; display: inline-block; z-index: -1">১৯৪০
        <span class="cross-container">
            <svg class="svg-cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" preserveAspectRatio="none">
                <path d="M497.4,23.9C301.6,40,155.9,80.6,4,144.4"></path>
                <path d="M14.1,27.6c204.5,20.3,393.8,74,467.3,111.7"></path>
            </svg>
        </span>
      </span> টাকা
        </h2>
        <h2 class="discount-price">অফার মূল্য ১৩৫০ টাকা</h2>
    </div>
</div>

<div class="section area">
    <h2 class="heading-title ">কীভাবে ব্যবহার করবেন?</h2>
    <ul class="list">
        <li class="list-item border-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
            </svg>
            <p> ফেসওয়াশ দিয়ে ভালোভাবে মুখ পরিস্কার করে নিন</p>
        </li>
        <li class="list-item border-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
            </svg>
            <p> পরিমাণমতো সিরাম হাতে নিয়ে পুরো মুখে নিন।</p>
        </li>
        <li class="list-item border-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
            </svg>
            <p> হালকা হাতে ম্যাসাজ করুন এবং ভালোভাবে শোষিত হতে দিন।</p>
        </li>
        <li class="list-item border-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
            </svg>
            <p> দিনে ১-২ বার ব্যবহার করুন, বিশেষত সকালে বা রাতে।</p>
        </li>
    </ul>
</div>
<div class="section area">
    <div class=" contact-banner ">
        <h2 class="regular-price">প্রয়োজনে কল করুন</h2>
        <a href="tel-01000000000" id="phone" class="call-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f">
                <path d="M796-120q-119 0-240-55.5T333-333Q231-435 175.5-556T120-796q0-18.67 12.67-31.33Q145.33-840 164-840h147.33q14 0 24.34 9.83Q346-820.33 349.33-806L376-675.33q2 14.66-.67 26Q372.67-638 364.67-630l-99 100q24 41.67 52.5 78.5T381-381.33q35 35.66 73.67 65.5Q493.33-286 536-262.67l94.67-96.66q9.66-10.34 23.16-14.5 13.5-4.17 26.84-2.17L806-349.33q14.67 4 24.33 15.5Q840-322.33 840-308v144q0 18.67-12.67 31.33Q814.67-120 796-120Z"/>
            </svg>
            <span>01000000000</span></a>
    </div>
</div>
<div style="background: url('https://shop.skintrin.com/wp-content/uploads/2024/11/bg.jpeg') no-repeat center/cover;"
     class="section area">
    <div class="trusted">
        <h2 class="heading-title ">আমাদের উপর কেন আস্থা রাখবেন? 🤝</h2>
        <ul class="list">
            <li class="list-item border-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBBA12">
                    <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
                </svg>
                <p> আমরা কেবলমাত্র ব্র্যান্ডের আসল এবং গুণগত মানসম্পন্ন পণ্য সরবরাহ করি।</p>
            </li>
            <li class="list-item border-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBBA12">
                    <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
                </svg>
                <p> আমাদের প্রতিটি গ্রাহকের সন্তুষ্টি আমাদের সর্বোচ্চ অগ্রাধিকার।</p>
            </li>
            <li class="list-item border-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBBA12">
                    <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
                </svg>
                <p> আমাদের পণ্য শতভাগ অথেনটিক এবং অরজিনাল।</p>
            </li>
            <li class="list-item border-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBBA12">
                    <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
                </svg>
                <p>
                    ত্বকের যত্ন সম্পর্কিত যেকোনো প্রশ্নে আমাদের বিশেষজ্ঞদের পরামর্শ নিতে পারেন।</p>
            </li>
            <li class="list-item border-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBBA12">
                    <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
                </svg>
                <p>
                    আমাদের টিম আপনার ত্বকের যত্নে সেরা সেবা নিশ্চিত করতে সর্বদা প্রস্তুত।</p>
            </li>
            <li class="list-item border-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FBBA12">
                    <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
                </svg>
                <p>
                    আপনাদের নিশ্চয়তা এই যে, আমাদের প্রতিষ্ঠান কখনোই ভেজাল পণ্য প্রদান করবে না শতভাগ নিশ্চিত!।</p>
            </li>
        </ul>
        <div class="button-container">
            <a class="link btn-primary" id="link" href="#payment">
                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
                    <path d="M24,3H4.242L4.2,2.649A3,3,0,0,0,1.222,0H0V2H1.222a1,1,0,0,1,.993.883L3.8,16.351A3,3,0,0,0,6.778,19H20V17H6.778a1,1,0,0,1-.993-.884L5.654,15H21.836Z"/>
                    <circle cx="7" cy="22" r="2"/>
                    <circle cx="17" cy="22" r="2"/>
                </svg>
                অর্ডার করতে চাই</a>
        </div>
    </div>
</div>

</body>
</html>

`
      },
    ]
  }



  selectTheme(theme: any) {
    this.selectedTheme = theme;
    // console.log('Selected theme:', theme);
    this.dialogRef.close(this.selectedTheme); // Send back selected theme to parent
  }


}
