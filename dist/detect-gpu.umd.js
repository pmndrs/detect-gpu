(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DetectGPU = {}));
}(this, (function (exports) { 'use strict';

  // !! AUTO-GENERATED FILE - DO NOT EDIT !!
  // Scraped from https://www.notebookcheck.net/
  // Mobile GPU benchmark: https://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html?type=&sort=&professional=2&showClassDescription=1&deskornote=3&perfrating=1&or=0&showBars=1&3dmark13_ice_gpu=1&3dmark13_cloud_gpu=1&3dmark13_fire_gpu=1&3dmark11_gpu=1&gpu_fullname=1&architecture=1&pixelshaders=1&vertexshaders=1&corespeed=1&boostspeed=1&memoryspeed=1&memorybus=1&memorytype=1&directx=1
  // Desktop GPU benchmark: https://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html?type=&sort=&showClassDescription=1&deskornote=4&perfrating=1&or=0&showBars=1&3dmark13_ice_gpu=1&3dmark13_cloud_gpu=1&3dmark13_fire_gpu=1&3dmark11_gpu=1&gpu_fullname=1&architecture=1&pixelshaders=1&vertexshaders=1&corespeed=1&boostspeed=1&memoryspeed=1&memorybus=1&memorytype=1&directx=1
  const GPU_BENCHMARK_SCORE_DESKTOP = [
      '992 - Silicon Motion SM502',
      '991 - ATI Mobility 128 M3',
      '990 - VIA S3 Graphics ProSavage8',
      '989 - SIS Mirage M661FX ',
      '988 - SIS Mirage 2 M760',
      '987 - VIA Castle Rock',
      '986 - VIA S3G UniChrome Pro',
      '985 - VIA S3G UniChrome Pro II',
      '984 - ATI Radeon IGP 320M',
      '983 - ATI Radeon IGP 340M',
      '982 - ATI Mobility Radeon 7000 IGP',
      '981 - Intel Extreme Graphics 2',
      '980 - VIA Chrome9 HC',
      '979 - ATI Mobility Radeon M6',
      '978 - ATI Mobility Radeon M7',
      '977 - ATI Mobility Radeon 9000 IGP',
      '976 - ATI Mobility Radeon 9100 IGP',
      '975 - NVIDIA GeForce 2 Go (200 / 100)',
      '974 - NVIDIA GeForce 3 Go',
      '965 - Intel Graphics Media Accelerator (GMA) 500',
      '963 - Intel Graphics Media Accelerator (GMA) 600',
      '952 - SIS Mirage 3 671MX',
      '951 - SIS Mirage 3+ 672MX',
      '950 - ATI Radeon Xpress 1100',
      '949 - ATI Radeon Xpress 200M',
      '948 - Intel Graphics Media Accelerator (GMA) 900',
      '947 - ATI Mobility FireGL 7800',
      '946 - ATI Mobility Radeon 7500',
      '934 - Intel Graphics Media Accelerator (GMA) 950',
      '933 - Intel Graphics Media Accelerator (GMA) 3150',
      '931 - NVIDIA GeForce 4 420 Go',
      '930 - NVIDIA GeForce 4 440 Go',
      '929 - NVIDIA GeForce 4 460 Go',
      '928 - NVIDIA GeForce 4 488 Go',
      '927 - ATI Mobility Radeon 9000',
      '926 - NVIDIA GeForce FX Go 5200',
      '925 - ATI Mobility FireGL 9000',
      '924 - ATI Mobility Radeon 9200',
      '923 - Intel Graphics Media Accelerator (GMA) 3600',
      '921 - NVIDIA GeForce 7000M',
      '920 - NVIDIA GeForce Go 6100',
      '919 - NVIDIA GeForce Go 6150',
      '918 - ATI Radeon Xpress 1150',
      '917 - NVIDIA GeForce 7150M',
      '916 - NVIDIA GeForce 7190M',
      '915 - Intel Graphics Media Accelerator (GMA) 3650',
      '904 - Intel Graphics Media Accelerator (GMA) X3100',
      '903 - ATI Radeon Xpress X1200',
      '902 - ATI Radeon Xpress 1250',
      '901 - ATI Radeon Xpress X1250',
      '900 - ATI Radeon Xpress X1270',
      '899 - NVIDIA GeForce FX Go 5600 / 5650',
      '898 - NVIDIA Quadro FX Go 1000',
      '897 - NVIDIA GeForce FX Go 5700',
      '896 - NVIDIA GeForce Go 6200',
      '895 - NVIDIA GeForce Go 6250',
      '894 - ATI Mobility Radeon X300',
      '893 - NVIDIA GeForce Go 6400',
      '892 - NVIDIA GeForce Go 7200',
      '891 - ATI Mobility Radeon 9550',
      '890 - ATI Mobility FireGL T2',
      '889 - ATI Mobility Radeon 9600',
      '888 - NVIDIA GeForce4 4200 Go',
      '887 - ATI Mobility Radeon X1300',
      '886 - ATI Mobility FireGL T2e',
      '885 - ATI Mobility Radeon 9700',
      '884 - ATI Mobility Radeon HD 2300',
      '883 - ATI Mobility Radeon X2300',
      '882 - ATI Mobility FireGL V3100',
      '881 - ATI Mobility FireGL V3200',
      '880 - ATI Mobility Radeon X600',
      '879 - NVIDIA Quadro NVS 110M',
      '874 - NVIDIA GeForce Go 7300',
      '873 - NVIDIA Quadro NVS 120M',
      '872 - NVIDIA Quadro FX 350M',
      '871 - NVIDIA GeForce Go 7400',
      '869 - Intel Graphics Media Accelerator (GMA) 4500M',
      '868 - Intel Graphics Media Accelerator (GMA) 4500MHD',
      '867 - Intel Graphics Media Accelerator (GMA) 4700MHD',
      '866 - NVIDIA GeForce 8200M G',
      '865 - NVIDIA Quadro NVS 130M',
      '862 - NVIDIA GeForce 8400M G',
      '861 - ATI Radeon HD 3100',
      '860 - ATI Mobility Radeon HD 3400',
      '851 - ATI Radeon HD 4100',
      '850 - ATI Radeon HD 4225',
      '849 - ATI Radeon HD 3200',
      '848 - ATI Mobility Radeon HD 2400',
      '847 - NVIDIA Quadro NVS 135M',
      '846 - NVIDIA GeForce 8400M GS',
      '845 - NVIDIA GeForce 9100M G',
      '844 - ATI Mobility Radeon X1400',
      '843 - ATI Mobility Radeon X1350',
      '842 - NVIDIA Quadro FX 360M',
      '841 - NVIDIA Quadro NVS 150M',
      '840 - AMD Radeon HD 6250',
      '839 - Intel Graphics Media Accelerator (GMA) HD Graphics',
      '838 - ATI Radeon HD 4200',
      '837 - ATI Radeon HD 4250',
      '836 - ATI Radeon HD 4270',
      '835 - ATI Mobility Radeon HD 2400 XT',
      '834 - ATI Mobility Radeon HD 3410',
      '833 - ATI Mobility Radeon HD 3430',
      '832 - ATI Mobility Radeon HD 3450',
      '831 - AMD Radeon HD 6290',
      '830 - AMD Radeon HD 7290',
      '829 - NVIDIA GeForce 9200M GS',
      '828 - NVIDIA Quadro NVS 160M',
      '827 - NVIDIA Quadro FX 370M',
      '826 - NVIDIA GeForce 9300M GS',
      '825 - NVIDIA ION 2',
      '824 - NVIDIA GeForce 9300M G',
      '823 - ATI Mobility Radeon HD 3470',
      '822 - NVIDIA GeForce 9400M GeForceBoost',
      '821 - ATI Mobility Radeon HD 3470 Hybrid X2',
      '820 - AMD Radeon HD 8180',
      '819 - AMD Radeon HD 6310',
      '818 - AMD Radeon HD 7310',
      '817 - AMD Radeon HD 6320',
      '816 - AMD Radeon HD 7340',
      '812 - Intel HD Graphics (Bay Trail)',
      '803 - Intel HD Graphics (Sandy Bridge)',
      '802 - NVIDIA GeForce 9400M (G) / ION (LE)',
      '801 - NVIDIA GeForce G 205M',
      '800 - NVIDIA GeForce G 102M',
      '799 - NVIDIA GeForce 9500M GE',
      '798 - NVIDIA GeForce G 103M',
      '797 - NVIDIA GeForce G 105M',
      '795 - Intel HD Graphics 2000',
      '794 - NVIDIA Quadro NVS 140M',
      '793 - NVIDIA GeForce 8400M GT',
      '792 - ATI Mobility Radeon HD 4330',
      '791 - AMD Radeon HD 6330M',
      '790 - NVIDIA GeForce G 110M',
      '789 - ATI Mobility FireGL V5000',
      '788 - ATI Mobility Radeon X700',
      '787 - ATI Mobility Radeon X1450',
      '786 - NVIDIA GeForce Go 6600',
      '785 - ATI Mobility Radeon 9800',
      '784 - ATI Mobility FireGL V5200',
      '783 - ATI Mobility Radeon X1600',
      '782 - ATI Mobility Radeon X800',
      '781 - NVIDIA Quadro NVS 300M',
      '780 - NVIDIA GeForce Go 7600',
      '779 - ATI Mobility Radeon X2500',
      '778 - ATI Mobility FireGL V5250',
      '777 - ATI Mobility Radeon X1700',
      '776 - NVIDIA GeForce 305M',
      '775 - ATI Mobility Radeon HD 530v',
      '774 - ATI Radeon HD 4350',
      '773 - ATI Mobility Radeon HD 4350',
      '772 - ATI Mobility Radeon HD 4530',
      '771 - AMD Radeon HD 6350M',
      '770 - AMD Radeon HD 7350M',
      '769 - Intel HD Graphics (Ivy Bridge)',
      '768 - Intel HD Graphics 2500',
      '767 - ATI Mobility Radeon HD 4550',
      '766 - ATI Mobility Radeon HD 540v',
      '765 - AMD Radeon HD 8210',
      '764 - ATI Mobility Radeon HD 5430',
      '763 - AMD Radeon HD 6380G',
      '762 - AMD Radeon HD 6430M',
      '761 - ATI Mobility Radeon X800XT',
      '760 - NVIDIA Quadro FX Go 1400',
      '759 - NVIDIA GeForce Go 6800',
      '758 - NVIDIA GeForce Go 7700',
      '757 - NVIDIA NVS 2100M',
      '756 - NVIDIA GeForce 8600M GS',
      '755 - NVIDIA GeForce 9500M G',
      '754 - NVIDIA GeForce Go 7600 GT',
      '753 - NVIDIA GeForce 315M',
      '752 - NVIDIA GeForce 405M',
      '751 - NVIDIA NVS 3100M',
      '750 - NVIDIA GeForce G210M',
      '749 - NVIDIA GeForce 310M',
      '748 - NVIDIA Quadro FX 380M',
      '747 - Intel HD Graphics 3000',
      '746 - ATI Mobility Radeon HD 2600',
      '745 - NVIDIA GeForce 8600M GT',
      '744 - ATI Mobility Radeon HD 5450',
      '743 - NVIDIA Quadro FX 570M',
      '742 - ATI Mobility Radeon HD 4570',
      '741 - Intel HD Graphics (Cherry Trail)',
      '740 - AMD Radeon HD 8250',
      '739 - AMD Radeon R6 (Mullins)',
      '738 - AMD Radeon HD 8240',
      '737 - ATI Mobility Radeon HD 545v',
      '736 - ATI Mobility Radeon HD 5145',
      '735 - ATI Mobility FireGL V5700',
      '734 - ATI Mobility Radeon HD 3650',
      '733 - AMD Radeon HD 7430M',
      '732 - AMD Radeon HD 6450M',
      '731 - ATI Mobility Radeon HD 5470',
      '730 - AMD Radeon HD 8280',
      '729 - AMD Radeon HD 6370M',
      '727 - AMD Radeon R2 (Mullins/Beema/Carrizo-L)',
      '723 - AMD Radeon HD 7370M',
      '722 - NVIDIA GeForce 410M',
      '721 - NVIDIA GeForce GT 415M',
      '720 - ATI Mobility Radeon HD 2700',
      '719 - AMD Radeon HD 6480G',
      '718 - AMD Radeon HD 7400G',
      '717 - NVIDIA GeForce 9500M GS',
      '716 - NVIDIA GeForce 9600M GS',
      '715 - NVIDIA GeForce Go 7800',
      '714 - NVIDIA GeForce Go 6800 Ultra',
      '713 - ATI Mobility Radeon X1800',
      '712 - ATI Mobility Radeon X1800XT',
      '711 - ATI Mobility Radeon X1900',
      '710 - ATI Mobility Radeon HD 2600 XT',
      '709 - NVIDIA GeForce GT 320M',
      '708 - NVIDIA GeForce 320M',
      '707 - AMD Radeon HD 8310G',
      '706 - AMD Radeon HD 6520G',
      '705 - Intel HD Graphics (Haswell)',
      '701 - ATI Mobility FireGL V5725',
      '700 - ATI Mobility Radeon HD 3670',
      '699 - AMD Radeon HD 7420G',
      '698 - NVIDIA GeForce GT 520M',
      '697 - AMD FirePro M3900',
      '696 - AMD Radeon HD 6470M',
      '695 - Intel HD Graphics 400 (Braswell)',
      '694 - Intel HD Graphics (Braswell)',
      '693 - Intel HD Graphics 405 (Braswell)',
      '690 - NVIDIA GeForce 705M',
      '689 - NVIDIA GeForce 610M',
      '688 - AMD Radeon HD 7450M',
      '687 - AMD Radeon HD 6510G2',
      '686 - NVIDIA GeForce GT 120M',
      '685 - NVIDIA Quadro FX 770M',
      '684 - NVIDIA GeForce GT 220M',
      '683 - NVIDIA GeForce 9600M GT',
      '682 - NVIDIA Quadro FX 1500M',
      '681 - NVIDIA Quadro NVS 320M',
      '680 - NVIDIA GeForce Go 7900 GS',
      '679 - NVIDIA GeForce Go 7800 GTX',
      '678 - NVIDIA Quadro FX 1600M',
      '677 - NVIDIA Quadro FX 1700M',
      '676 - NVIDIA GeForce 8700M GT',
      '675 - NVIDIA GeForce 9650M GT',
      '674 - NVIDIA GeForce 9650M GS',
      '673 - Intel HD Graphics 500',
      '672 - Intel UHD Graphics 600',
      '671 - AMD Radeon HD 8330',
      '670 - AMD Radeon HD 8350G',
      '669 - NVIDIA Quadro FX 2500M',
      '668 - NVIDIA GeForce Go 7900 GTX',
      '667 - NVIDIA NVS 4200M',
      '666 - NVIDIA GeForce GT 130M',
      '665 - NVIDIA GeForce Go 7900 GS SLI',
      '664 - NVIDIA GeForce 8600M GT SLI',
      '663 - NVIDIA GeForce Go 7800 GTX SLI',
      '662 - NVIDIA GeForce GT 325M',
      '661 - AMD Radeon HD 7520G',
      '660 - NVIDIA GeForce GT 520MX',
      '654 - AMD Radeon HD 8400',
      '653 - AMD Radeon HD 8410G',
      '652 - AMD Radeon HD 6490M',
      '651 - AMD Radeon HD 7470M',
      '650 - AMD Radeon HD 8450G',
      '649 - AMD Radeon HD 6515G2',
      '648 - AMD Radeon HD 6480G + HD 7450M Dual Graphics',
      '647 - AMD Radeon HD 7500G',
      '646 - AMD Radeon HD 6540G2',
      '645 - AMD Radeon HD 6520G + HD 7450M Dual Graphics',
      '644 - AMD Radeon HD 6545G2',
      '643 - AMD Radeon HD 6450 GDDR5',
      '642 - Intel HD Graphics (Skylake)',
      '641 - Intel HD Graphics 4200',
      '640 - Intel HD Graphics (Broadwell)',
      '639 - AMD Radeon R2 (Stoney Ridge)',
      '638 - AMD Radeon R3 (Mullins/Beema)',
      '637 - AMD Radeon R4 (Kaveri)',
      '636 - AMD Radeon R4 (Beema)',
      '635 - AMD Radeon R5 (Beema/Carrizo-L)',
      '633 - AMD Radeon R4 (Stoney Ridge)',
      '632 - AMD Radeon HD 6620G',
      '629 - Intel HD Graphics 4000',
      '628 - AMD Radeon HD 7480D',
      '627 - ATI Mobility Radeon HD 550v',
      '626 - NVIDIA GeForce GT 230M',
      '625 - NVIDIA GeForce 9700M GT',
      '624 - NVIDIA GeForce 8700M GT SLI',
      '623 - NVIDIA Quadro FX 3500M',
      '622 - NVIDIA GeForce Go 7950 GTX',
      '621 - AMD Radeon HD 7510M',
      '620 - Intel HD Graphics 5300',
      '619 - Intel HD Graphics 505',
      '618 - Intel UHD Graphics 605',
      '617 - AMD Radeon HD 7490M',
      '616 - NVIDIA GeForce GT 240M',
      '615 - NVIDIA Quadro NVS 5100M',
      '614 - NVIDIA Quadro FX 880M',
      '613 - NVIDIA GeForce GT 330M',
      '612 - ATI Mobility Radeon HD 3850',
      '611 - AMD Radeon HD 7530M',
      '610 - NVIDIA GeForce GT 420M',
      '609 - NVIDIA GeForce Go 7900 GTX SLI',
      '608 - NVIDIA GeForce GT 220',
      '607 - NVIDIA GeForce Go 7950 GTX SLI',
      '606 - ATI Mobility Radeon HD 4650',
      '605 - ATI Mobility Radeon HD 560v',
      '604 - ATI Mobility Radeon HD 5165',
      '603 - AMD Radeon HD 6640G2',
      '602 - AMD Radeon HD 6620G + HD 7450M Dual Graphics',
      '601 - ATI Mobility Radeon HD 3870',
      '600 - AMD Radeon HD 7600G',
      '599 - AMD Radeon HD 7500G + HD 7550M Dual Graphics',
      '598 - NVIDIA GeForce GT 335M',
      '597 - NVIDIA Quadro FX 2700M',
      '596 - AMD Radeon HD 6645G2',
      '595 - NVIDIA GeForce 9700M GTS',
      '594 - NVIDIA GeForce GT 425M',
      '593 - ATI Mobility Radeon HD 4670',
      '592 - AMD Radeon HD 7550M',
      '591 - ATI Mobility Radeon HD 565v',
      '590 - NVIDIA NVS 5200M',
      '589 - Intel HD Graphics 510',
      '588 - AMD Radeon HD 8610G',
      '587 - Intel HD Graphics 4400',
      '586 - Intel HD Graphics 610',
      '585 - Intel UHD Graphics 610',
      '584 - Intel HD Graphics 515',
      '576 - AMD Radeon HD 7640G',
      '575 - AMD Radeon HD 8470D',
      '574 - AMD Radeon HD 7620G',
      '573 - AMD Radeon HD 7610M',
      '572 - AMD Radeon HD 7640G + HD 7610M Dual Graphics',
      '571 - AMD Radeon HD 6550D',
      '570 - NVIDIA GeForce GT 525M',
      '569 - NVIDIA GeForce GT 620M',
      '568 - NVIDIA GeForce GT 625M',
      '567 - NVIDIA Quadro K500M',
      '566 - AMD Radeon HD 8550G',
      '565 - AMD Radeon HD 6530M',
      '564 - AMD Radeon HD 8510G',
      '563 - ATI Mobility Radeon HD 5650',
      '562 - NVIDIA Quadro FX 1800M',
      '561 - AMD Radeon HD 7630M',
      '560 - AMD Radeon HD 7570M',
      '559 - AMD FirePro M2000',
      '558 - AMD Radeon HD 7650M',
      '557 - AMD Radeon HD 6630M',
      '556 - NVIDIA GeForce GTS 250M',
      '555 - NVIDIA GeForce GTS 350M',
      '554 - AMD Radeon HD 7590M',
      '553 - AMD Radeon HD 6550M',
      '552 - ATI Radeon HD 5570',
      '551 - NVIDIA Quadro K510M',
      '550 - Intel HD Graphics 5000',
      '549 - AMD Radeon HD 6680G2',
      '548 - NVIDIA GeForce GT 435M',
      '547 - AMD Radeon HD 7660G',
      '546 - NVIDIA GeForce 710M',
      '545 - NVIDIA NVS 5400M',
      '544 - ATI FirePro M5800',
      '543 - AMD Radeon R5 (Kaveri)',
      '542 - AMD Radeon R5 (Carrizo)',
      '541 - Intel HD Graphics 615',
      '540 - Intel UHD Graphics 615',
      '539 - Intel UHD Graphics 617',
      '530 - Qualcomm Adreno 630',
      '526 - Intel HD Graphics 5500',
      '525 - ATI Mobility Radeon HD 5730',
      '524 - Intel HD Graphics 4600',
      '523 - AMD Radeon HD 6650M',
      '522 - AMD Radeon HD 6690G2',
      '521 - NVIDIA GeForce GT 540M',
      '520 - Intel Iris Graphics 5100',
      '519 - AMD Radeon HD 8550M',
      '518 - NVIDIA Quadro K610M',
      '517 - Intel HD Graphics 6000',
      '516 - AMD Radeon HD 8570M',
      '515 - AMD Radeon HD 8450G + Radeon HD 8570M Dual Graphics',
      '514 - AMD Radeon HD 6720G2',
      '513 - ATI Mobility Radeon HD 5750',
      '511 - AMD Radeon R5 (Stoney Ridge)',
      '510 - AMD Radeon RX Vega 2',
      '509 - AMD Radeon R5 M420',
      '508 - AMD Radeon R5 M315',
      '507 - AMD Radeon R5 M230',
      '506 - AMD Radeon R5 M320',
      '505 - AMD Radeon R5 M240',
      '504 - NVIDIA GeForce 8800M GTS',
      '503 - NVIDIA GeForce GT 720M',
      '502 - Intel UHD Graphics G4 (Lakefield GT1 48 EU)',
      '501 - Intel Iris Graphics 6100',
      '500 - Intel HD Graphics 520',
      '499 - NVIDIA GeForce 820M',
      '498 - NVIDIA GeForce 910M',
      '497 - NVIDIA Quadro 1000M',
      '496 - AMD Radeon RX Vega 3',
      '495 - AMD Radeon R5 M255',
      '494 - AMD Radeon R5 M430',
      '493 - AMD Radeon R5 M330',
      '492 - AMD Radeon R5 M335',
      '491 - NVIDIA GeForce GTS 150M',
      '490 - AMD Radeon HD 7560D',
      '489 - NVIDIA GeForce GT 630M',
      '488 - AMD Radeon HD 7670M',
      '487 - AMD Radeon HD 7520G + HD 7670M Dual Graphics',
      '486 - AMD Radeon HD 6620G + HD 7670M Dual Graphics',
      '485 - AMD Radeon HD 7640G + HD 7670M Dual Graphics',
      '484 - AMD Radeon HD 8650G',
      '483 - AMD Radeon HD 6570M',
      '482 - ATI Mobility Radeon HD 5770',
      '481 - ATI Mobility Radeon HD 4830',
      '480 - NVIDIA GeForce 9800M GS',
      '479 - AMD Radeon HD 6730M',
      '478 - AMD Radeon HD 6740G2',
      '477 - AMD Radeon HD 6760G2',
      '476 - ATI Mobility Radeon HD 5830',
      '475 - AMD Radeon HD 6830M',
      '474 - NVIDIA GeForce GT 430',
      '473 - NVIDIA GeForce 9800M GTS',
      '472 - NVIDIA GeForce GTS 160M',
      '471 - NVIDIA GeForce GTS 260M',
      '470 - AMD Radeon HD 8590M',
      '469 - NVIDIA GeForce GT 550M',
      '468 - NVIDIA Quadro K1000M',
      '467 - AMD Radeon HD 6750M',
      '466 - AMD Radeon HD 7660D',
      '465 - AMD Radeon R6 M255DX',
      '464 - AMD Radeon HD 8670M',
      '463 - AMD Radeon HD 8550G + HD 8670M Dual Graphics',
      '462 - AMD Radeon HD 7660G + HD 7670M Dual Graphics',
      '461 - AMD Radeon HD 8650G + HD 8570M Dual Graphics',
      '460 - AMD Radeon HD 8650G + HD 8670M Dual Graphics',
      '459 - AMD Radeon HD 8570D',
      '458 - Intel HD Graphics 5600',
      '457 - AMD Radeon HD 7690M',
      '456 - AMD Radeon HD 6755G2',
      '455 - NVIDIA GeForce GT 240 GDDR5',
      '454 - NVIDIA GeForce GTS 360M',
      '453 - NVIDIA GeForce GT 445M',
      '452 - NVIDIA Quadro FX 3600M',
      '451 - NVIDIA GeForce 8800M GTX',
      '450 - NVIDIA GeForce 9800M GT',
      '449 - NVIDIA Quadro 2000M',
      '448 - AMD FirePro W2100',
      '447 - AMD Radeon HD 6850M',
      '446 - ATI Mobility Radeon HD 5850',
      '445 - ATI Radeon HD 5670',
      '444 - NVIDIA GeForce GT 555M',
      '443 - NVIDIA GeForce GT 635M',
      '442 - AMD Radeon HD 6770M',
      '441 - AMD Radeon HD 8730M',
      '440 - AMD Radeon HD 8650M',
      '439 - AMD Radeon R6 (Kaveri)',
      '438 - NVIDIA GeForce GT 640M LE',
      '437 - AMD FirePro M5950',
      '436 - AMD Radeon HD 7690M XT',
      '435 - AMD Radeon HD 8670D',
      '434 - AMD Radeon HD 6775G2',
      '433 - NVIDIA Quadro FX 2800M',
      '432 - NVIDIA GeForce 9800M GTX',
      '431 - NVIDIA GeForce GTX 260M',
      '430 - ATI Mobility Radeon HD 4850',
      '429 - ATI FirePro M7740',
      '428 - ATI Mobility Radeon HD 4860',
      '427 - Qualcomm Adreno 680',
      '426 - Qualcomm Adreno 685',
      '425 - AMD Radeon R6 (Carrizo)',
      '424 - Intel HD Graphics 620',
      '423 - Intel UHD Graphics 620',
      '422 - AMD Radeon R5 (Bristol Ridge)',
      '420 - Intel HD Graphics P530',
      '419 - Intel HD Graphics 530',
      '418 - Intel UHD Graphics G7 (Lakefield GT2 64 EU)',
      '417 - Intel HD Graphics P630',
      '416 - Intel HD Graphics 630',
      '415 - Intel UHD Graphics P630',
      '414 - Intel UHD Graphics 630',
      '413 - Intel UHD Graphics G1 (Ice Lake 32 EU)',
      '412 - AMD Radeon RX Vega 5',
      '411 - AMD Radeon RX Vega 6 (Ryzen 2000/3000)',
      '410 - AMD Radeon R6 M340DX',
      '409 - AMD Radeon 610',
      '408 - AMD Radeon 520',
      '407 - AMD Radeon R7 M340',
      '406 - AMD Radeon R7 M260',
      '405 - NVIDIA Quadro FX 3700M',
      '404 - ATI Mobility Radeon HD 3850 X2',
      '403 - NVIDIA GeForce 8800M GTX SLI',
      '402 - ATI Mobility Radeon HD 3870 X2',
      '401 - NVIDIA GeForce 9800M GTS SLI',
      '400 - AMD Radeon R7 M440',
      '399 - AMD Radeon 620',
      '398 - AMD Radeon R8 M445DX',
      '397 - AMD Radeon HD 8690M',
      '396 - NVIDIA GeForce 9800M GT SLI',
      '395 - NVIDIA GeForce 920M',
      '394 - NVIDIA GeForce GTX 280M',
      '393 - AMD Radeon R7 M360',
      '391 - AMD Radeon HD 7730M',
      '390 - AMD Radeon R7 M460',
      '389 - AMD Radeon R8 M365DX',
      '388 - AMD Radeon R7 (Kaveri)',
      '387 - AMD Radeon R7 (Carrizo)',
      '386 - NVIDIA GeForce GT 640M',
      '385 - AMD Radeon R7 (Bristol Ridge)',
      '384 - ATI Mobility Radeon HD 4870',
      '383 - NVIDIA GeForce GTX 285M',
      '382 - NVIDIA Quadro FX 3800M',
      '381 - AMD Radeon R7 M265',
      '380 - AMD Radeon R7 M270',
      '379 - NVIDIA Quadro 3000M',
      '378 - AMD Radeon HD 8750M',
      '377 - AMD FirePro M4100',
      '376 - AMD Radeon HD 7750M',
      '375 - NVIDIA GeForce GT 645M',
      '374 - NVIDIA GeForce GT 730M',
      '373 - AMD Radeon HD 8550G + HD 8750M Dual Graphics',
      '372 - NVIDIA GeForce GTX 460M',
      '371 - AMD Radeon R7 M260X',
      '370 - AMD Radeon HD 8770M',
      '369 - AMD Radeon HD 8830M',
      '368 - NVIDIA GeForce 9800M GTX SLI',
      '367 - ATI Radeon HD 4850',
      '366 - AMD Radeon HD 6870M',
      '365 - ATI FirePro M7820',
      '364 - AMD FirePro M4000',
      '363 - NVIDIA Quadro 5000M',
      '362 - NVIDIA GeForce 825M',
      '361 - ATI Mobility Radeon HD 5870',
      '360 - NVIDIA GeForce GT 735M',
      '359 - NVIDIA GeForce GTX 260M SLI',
      '358 - NVIDIA GeForce GTS 450',
      '357 - NVIDIA Quadro K2000M',
      '352 - Intel Iris Graphics 540',
      '351 - NVIDIA GeForce 920MX',
      '350 - Intel Iris Plus Graphics 640',
      '349 - NVIDIA GeForce MX110',
      '348 - NVIDIA GeForce 830M',
      '346 - Intel Iris Plus Graphics 645',
      '345 - AMD Radeon RX Vega 6 (Ryzen 4000)',
      '344 - AMD Radeon 625',
      '343 - AMD Radeon 530',
      '342 - Intel Iris Graphics 550',
      '341 - NVIDIA GeForce 930M',
      '340 - Intel Iris Plus Graphics 650',
      '339 - NVIDIA GeForce GT 740M',
      '338 - AMD Radeon R7 384 Cores (Kaveri Desktop)',
      '337 - Intel Iris Pro Graphics 5200',
      '336 - AMD Radeon R7 512 Cores (Kaveri Desktop)',
      '335 - NVIDIA GeForce GTX 560M',
      '334 - AMD Radeon HD 7770M',
      '333 - NVIDIA GeForce GT 745M',
      '332 - AMD Radeon R7 M275DX',
      '331 - NVIDIA GeForce 840M',
      '330 - NVIDIA Quadro M500M',
      '329 - NVIDIA Quadro K620M',
      '328 - NVIDIA GeForce GT 650M',
      '327 - AMD Radeon R7 M370',
      '326 - AMD Radeon R7 M380',
      '325 - AMD Radeon R7 M445',
      '324 - Intel Iris Plus Graphics 655',
      '323 - AMD Radeon R9 M375',
      '322 - AMD FirePro W4190M',
      '321 - NVIDIA Quadro M600M',
      '318 - NVIDIA GeForce 930MX',
      '317 - Intel Iris Plus Graphics G4 (Ice Lake 48 EU)',
      '316 - NVIDIA GeForce 940M',
      '315 - AMD Radeon RX Vega 7',
      '314 - AMD Radeon RX Vega 8 (Ryzen 2000/3000)',
      '313 - NVIDIA Quadro K1100M',
      '312 - NVIDIA Quadro M520',
      '311 - NVIDIA GeForce 940MX',
      '310 - NVIDIA GeForce MX130',
      '309 - Intel Iris Pro Graphics 6200',
      '308 - NVIDIA GeForce GT 750M',
      '307 - NVIDIA GeForce GTX 480M',
      '306 - NVIDIA GeForce GTX 470M',
      '305 - NVIDIA Quadro 4000M',
      '304 - ATI Mobility Radeon HD 4870 X2',
      '303 - AMD FirePro W4100',
      '302 - AMD FirePro W4170M',
      '301 - AMD Radeon HD 8790M',
      '300 - AMD Radeon R7 M465',
      '299 - AMD Radeon HD 7850M',
      '298 - AMD Radeon R9 M265X',
      '297 - AMD Radeon R9 M365X',
      '296 - AMD Radeon HD 8850M',
      '295 - NVIDIA GeForce 845M',
      '294 - NVIDIA GeForce GTX 660M',
      '293 - NVIDIA GeForce GT 755M',
      '292 - AMD Radeon R7 250',
      '291 - AMD Radeon HD 6950M',
      '290 - NVIDIA GeForce GTX 280M SLI',
      '289 - NVIDIA GeForce GTX 550 Ti',
      '288 - ATI Radeon HD 5770',
      '287 - NVIDIA Quadro K2100M',
      '286 - AMD Radeon RX Vega 8 (Ryzen 4000)',
      '285 - NVIDIA GeForce MX230',
      '284 - AMD FirePro M5100',
      '283 - AMD FirePro M6000',
      '282 - Intel UHD Graphics Xe G4 48EUs',
      '281 - NVIDIA GeForce GTX 570M',
      '280 - NVIDIA Quadro K3000M',
      '279 - AMD Radeon HD 7870M',
      '278 - AMD Radeon HD 8870M',
      '277 - AMD Radeon R9 M270',
      '276 - AMD Radeon HD 6970M',
      '275 - AMD FirePro M8900',
      '274 - AMD FirePro W5130M',
      '273 - NVIDIA Maxwell GPU Surface Book',
      '272 - AMD Radeon RX Vega 9',
      '271 - NVIDIA GeForce GTX 670M',
      '270 - AMD Radeon R9 M275',
      '269 - NVIDIA GeForce GTX 760M',
      '268 - NVIDIA Quadro 5010M',
      '267 - NVIDIA GeForce GTX 670MX',
      '266 - AMD Radeon R9 M370X',
      '265 - AMD FirePro W5170M',
      '264 - NVIDIA Quadro K3100M',
      '263 - NVIDIA GeForce GTX 285M SLI',
      '262 - AMD Radeon HD 6790',
      '261 - NVIDIA GeForce GTX 460 768MB',
      '260 - NVIDIA GeForce GTX 485M',
      '259 - ATI Mobility Radeon HD 5870 Crossfire',
      '258 - NVIDIA GeForce GTX 460M SLI',
      '257 - NVIDIA GeForce GT 650M SLI',
      '256 - AMD Radeon HD 7770',
      '255 - AMD Radeon R9 M380',
      '254 - AMD Radeon R9 M385',
      '253 - AMD Radeon R9 M470',
      '252 - AMD Radeon HD 6990M',
      '251 - NVIDIA GeForce GTX 580M',
      '250 - NVIDIA GeForce GTX 675M',
      '249 - ATI Radeon HD 5850',
      '248 - Intel Iris Pro Graphics 580',
      '247 - Intel Iris Pro Graphics P580',
      '246 - AMD Radeon RX Vega 10',
      '245 - Intel Iris Plus Graphics G7 (Ice Lake 64 EU)',
      '244 - NVIDIA Quadro P500',
      '243 - NVIDIA Quadro K4000M',
      '242 - NVIDIA GeForce GTX 560M SLI',
      '241 - NVIDIA GeForce GTX 480M SLI',
      '240 - NVIDIA GeForce GTX 470M SLI',
      '239 - NVIDIA GeForce GTX 765M',
      '238 - NVIDIA GeForce 945M',
      '237 - NVIDIA GeForce GTX 470',
      '236 - AMD Radeon HD 6870',
      '235 - NVIDIA GeForce GTX 560 Ti',
      '234 - AMD Radeon HD 7950M',
      '233 - AMD Radeon R9 M280X',
      '232 - AMD Radeon RX Vega 11',
      '231 - NVIDIA Quadro M620',
      '230 - NVIDIA Quadro M1000M',
      '229 - NVIDIA GeForce GTX 850M',
      '228 - NVIDIA Quadro P520',
      '227 - AMD Radeon R9 M385X',
      '226 - AMD Radeon R9 M470X',
      '225 - AMD Radeon 540X',
      '224 - AMD Radeon 630',
      '223 - AMD Radeon Pro 450',
      '222 - NVIDIA GeForce GTX 950M',
      '221 - NVIDIA GeForce GT 750M SLI',
      '220 - NVIDIA GeForce GTX 675MX',
      '219 - AMD Radeon HD 6970M Crossfire',
      '218 - NVIDIA GeForce GTX 485M SLI',
      '217 - NVIDIA GeForce GT 755M SLI',
      '216 - AMD Radeon HD 6990M Crossfire',
      '215 - NVIDIA GeForce GTX 580M SLI',
      '214 - NVIDIA GeForce GTX 860M',
      '213 - AMD Radeon Pro WX 3100',
      '212 - AMD Radeon RX 540',
      '211 - AMD Radeon Pro WX 2100',
      '210 - AMD Radeon RX 540X',
      '209 - NVIDIA GeForce GTX 770M',
      '208 - Intel Iris Xe Graphics G7 80EUs',
      '207 - NVIDIA Quadro K4100M',
      '206 - NVIDIA Quadro K5000M',
      '205 - NVIDIA Quadro M2000M',
      '204 - NVIDIA GeForce MX330',
      '203 - NVIDIA GeForce MX150',
      '202 - NVIDIA GeForce MX250',
      '201 - NVIDIA Quadro P600',
      '200 - NVIDIA GeForce GT 1030',
      '199 - AMD Radeon Pro 455',
      '198 - AMD Radeon Pro 555',
      '197 - AMD Radeon Pro 555X',
      '196 - AMD Radeon Pro WX 3200',
      '195 - AMD Radeon RX 640',
      '194 - AMD Radeon RX 550',
      '193 - AMD Radeon RX 550X',
      '192 - NVIDIA Quadro P620',
      '191 - NVIDIA Quadro M1200',
      '190 - NVIDIA GeForce GTX 480',
      '189 - NVIDIA GeForce GTX 570',
      '188 - NVIDIA GeForce GTX 670MX SLI',
      '187 - NVIDIA GeForce GTX 750 Ti',
      '186 - NVIDIA GeForce GTX 960M',
      '185 - AMD Radeon Pro WX 4130',
      '184 - AMD Radeon Pro 460',
      '183 - AMD Radeon Pro 560',
      '182 - AMD Radeon Pro 560X',
      '181 - AMD Radeon HD 7970M',
      '180 - AMD FirePro M6100',
      '179 - AMD Radeon R9 M390',
      '178 - NVIDIA GeForce GTX 775M',
      '177 - NVIDIA GeForce GTX 680M',
      '176 - AMD Radeon RX 460',
      '175 - NVIDIA GeForce GTX 765M SLI',
      '174 - NVIDIA GeForce GTX 675M SLI',
      '173 - AMD Radeon HD 6970',
      '172 - NVIDIA GeForce GTX 580',
      '171 - AMD Radeon HD 8970M',
      '170 - AMD Radeon R9 M290X',
      '169 - NVIDIA GeForce GTX 870M',
      '168 - NVIDIA Quadro M2200',
      '167 - AMD Radeon RX 560',
      '166 - AMD Radeon RX 560X',
      '165 - NVIDIA GeForce GTX 965M',
      '164 - AMD Radeon HD 7870',
      '163 - AMD Radeon Pro WX 4150',
      '162 - AMD Radeon RX 460',
      '161 - NVIDIA GeForce GTX 680MX',
      '160 - NVIDIA GeForce MX350',
      '159 - NVIDIA Quadro P1000',
      '158 - NVIDIA Quadro K5100M',
      '157 - NVIDIA GeForce GTX 780M',
      '156 - NVIDIA GeForce GTX 760',
      '155 - NVIDIA GeForce GTX 660 Ti',
      '154 - AMD Radeon R9 270X',
      '153 - NVIDIA GeForce GTX 950',
      '152 - NVIDIA GeForce GTX 1050 Max-Q',
      '151 - NVIDIA GeForce GTX 880M',
      '150 - NVIDIA GeForce GTX 590',
      '149 - Intel Iris Xe Graphics G7 96EUs',
      '148 - AMD Radeon R7 370',
      '147 - AMD Radeon R9 M395',
      '146 - AMD FirePro W7170M',
      '145 - Intel Xe DG1 LP (iDG1LP) Mobile',
      '144 - NVIDIA GeForce GTX 1050 Mobile',
      '143 - NVIDIA GeForce GTX 1050',
      '142 - NVIDIA Quadro M3000M',
      '141 - AMD Radeon R9 M390X',
      '140 - AMD Radeon R9 M295X',
      '139 - AMD Radeon R9 M485X',
      '138 - AMD Radeon Pro Vega 16',
      '137 - AMD Radeon Pro WX Vega M GL',
      '136 - AMD Radeon RX Vega M GL / 870',
      '135 - NVIDIA GeForce GTX 1050 Ti Max-Q',
      '134 - AMD Radeon R9 M395X',
      '133 - NVIDIA GeForce GTX 770M SLI',
      '132 - AMD Radeon HD 7970',
      '131 - NVIDIA GeForce GTX 680',
      '130 - NVIDIA GeForce GTX 860M SLI',
      '129 - NVIDIA GeForce GTX 970M',
      '128 - NVIDIA Quadro M4000M',
      '127 - NVIDIA Quadro P2000 Max-Q',
      '126 - NVIDIA Quadro P2000',
      '125 - NVIDIA GeForce GTX 1050 Ti',
      '124 - NVIDIA GeForce GTX 1050 Ti Mobile',
      '123 - NVIDIA GeForce GTX 960',
      '122 - AMD Radeon R9 380',
      '121 - AMD Radeon R9 280X',
      '120 - NVIDIA Quadro M5000M',
      '119 - AMD Radeon Pro Vega 20',
      '118 - AMD Radeon RX Vega M GH',
      '117 - NVIDIA GeForce GTX 980M',
      '116 - AMD Radeon HD 7970M Crossfire',
      '115 - NVIDIA GeForce GTX 680M SLI',
      '114 - AMD Radeon HD 8970M Crossfire',
      '113 - AMD Radeon R9 M290X Crossfire',
      '112 - NVIDIA GeForce GTX 965M SLI',
      '111 - AMD Radeon RX 490M',
      '110 - AMD Radeon R9 290X',
      '109 - NVIDIA GeForce GTX 780M SLI',
      '108 - NVIDIA GeForce GTX 880M SLI',
      '107 - NVIDIA GeForce MX450',
      '106 - NVIDIA Quadro T1000 Max-Q',
      '105 - NVIDIA Quadro T1000',
      '104 - NVIDIA GeForce GTX 1650 Max-Q',
      '103 - AMD Radeon RX 470',
      '102 - AMD Radeon RX 570',
      '101 - AMD Radeon RX 570X',
      '100 - AMD Radeon RX 470',
      '99 - AMD Radeon Pro WX 7100',
      '98 - AMD Radeon RX 480',
      '97 - NVIDIA Quadro P3000 Max-Q',
      '96 - NVIDIA GeForce GTX 1060 Max-Q',
      '95 - NVIDIA GeForce GTX 1650 Ti Max-Q',
      '94 - NVIDIA GeForce GTX 1650',
      '93 - NVIDIA GeForce GTX 1650 Mobile',
      '92 - NVIDIA GeForce GTX 970',
      '91 - NVIDIA Quadro P3000',
      '90 - AMD Radeon RX 5300M',
      '89 - AMD Radeon Pro 5300M',
      '88 - AMD Radeon RX Vega Mobile',
      '87 - NVIDIA GeForce GTX 780 Ti',
      '86 - AMD Radeon RX 580',
      '85 - AMD Radeon RX 580X',
      '84 - NVIDIA Quadro P3200',
      '83 - NVIDIA Quadro P4000 Max-Q',
      '82 - AMD Radeon Pro 5500M',
      '81 - AMD Radeon RX 5500M',
      '80 - NVIDIA GeForce GTX 1060 Mobile',
      '79 - AMD Radeon RX 480',
      '78 - NVIDIA GeForce GTX 1650 Ti Mobile',
      '76 - NVIDIA Quadro T2000 Max-Q',
      '75 - NVIDIA Quadro T2000',
      '74 - NVIDIA Quadro P4000',
      '73 - AMD Radeon RX 570',
      '72 - NVIDIA GeForce GTX 1060',
      '71 - NVIDIA GeForce GTX 970M SLI',
      '70 - AMD Radeon R9 390X',
      '69 - NVIDIA Quadro M5500',
      '68 - NVIDIA GeForce GTX 980',
      '67 - AMD Radeon RX 580',
      '66 - AMD Radeon RX 590',
      '65 - NVIDIA GeForce GTX 980',
      '64 - AMD Radeon R9 Nano',
      '63 - AMD Radeon R9 Fury',
      '62 - NVIDIA GeForce GTX 980M SLI',
      '61 - NVIDIA Quadro P5000 Max-Q',
      '60 - NVIDIA GeForce GTX 1660 Ti Max-Q',
      '59 - AMD Radeon Pro 5600M',
      '58 - NVIDIA GeForce GTX 1070 Max-Q',
      '57 - NVIDIA GeForce GTX 1660',
      '56 - NVIDIA GeForce GTX 980 Ti',
      '55 - AMD Radeon RX 5600M',
      '54 - NVIDIA GeForce GTX 1660 Ti Mobile',
      '53 - NVIDIA Quadro P5000',
      '52 - NVIDIA GeForce GTX 1660 Super',
      '51 - NVIDIA GeForce GTX 1660 Ti',
      '50 - NVIDIA Quadro P4200',
      '49 - NVIDIA GeForce GTX 1070 Mobile',
      '48 - NVIDIA GeForce RTX 2060 Max-Q',
      '47 - AMD Radeon Pro Vega 56',
      '46 - NVIDIA GeForce GTX 1080 Max-Q',
      '45 - AMD Radeon RX 5600 XT',
      '44 - NVIDIA GeForce GTX 1070',
      '43 - NVIDIA Quadro P5200',
      '42 - NVIDIA GeForce GTX 980 SLI',
      '41 - NVIDIA GeForce RTX 2060 Mobile',
      '40 - AMD Radeon RX Vega 56',
      '39 - NVIDIA Quadro RTX 3000 Max-Q',
      '38 - NVIDIA Quadro RTX 3000',
      '37 - NVIDIA GeForce RTX 2070 Max-Q',
      '36 - NVIDIA GeForce GTX 1070 Ti',
      '35 - NVIDIA GeForce RTX 2070 Super Max-Q',
      '34 - NVIDIA GeForce RTX 2060',
      '33 - NVIDIA Quadro RTX 4000 Max-Q',
      '32 - NVIDIA Quadro RTX 4000',
      '31 - NVIDIA GeForce GTX 1080 Mobile',
      '30 - AMD Radeon RX Vega 64',
      '29 - AMD Radeon RX 5700M',
      '28 - AMD Radeon RX 5700',
      '27 - NVIDIA GeForce RTX 2060 Super',
      '26 - NVIDIA GeForce RTX 2070 Mobile',
      '25 - NVIDIA GeForce RTX 2070 Super Mobile',
      '24 - NVIDIA GeForce GTX 1080',
      '22 - NVIDIA GeForce RTX 2070',
      '21 - AMD Radeon RX 5700 XT',
      '20 - AMD Radeon VII',
      '19 - NVIDIA GeForce RTX 2070 Super',
      '18 - NVIDIA GeForce RTX 2080 Max-Q',
      '17 - NVIDIA GeForce RTX 2080 Super Max-Q',
      '16 - NVIDIA GeForce GTX 1070 SLI',
      '15 - NVIDIA GeForce GTX 1070 SLI',
      '14 - NVIDIA GeForce GTX 1080 SLI',
      '13 - NVIDIA Titan X Pascal',
      '12 - NVIDIA GeForce GTX 1080 Ti',
      '11 - NVIDIA GeForce RTX 2080 Mobile',
      '10 - NVIDIA GeForce RTX 2080 Super Mobile',
      '9 - NVIDIA Quadro RTX 5000 Max-Q',
      '8 - NVIDIA Quadro RTX 5000',
      '6 - NVIDIA GeForce RTX 2080',
      '5 - NVIDIA GeForce RTX 2080 Super',
      '4 - NVIDIA Quadro RTX 6000',
      '2 - NVIDIA GeForce RTX 2080 Ti',
      '1 - NVIDIA Titan RTX',
  ];
  const GPU_BENCHMARK_SCORE_MOBILE = [
      '973 - ARM Mali-200',
      '972 - Qualcomm Adreno 200',
      '971 - PowerVR SGX530',
      '970 - PowerVR SGX531',
      '969 - PowerVR SGX535',
      '968 - Vivante GC800',
      '967 - Qualcomm Adreno 203',
      '966 - Qualcomm Adreno 205',
      '964 - PowerVR SGX540',
      '962 - NVIDIA GeForce ULP (Tegra 2)',
      '961 - ARM Mali-400 MP',
      '960 - ARM Mali-400 MP2',
      '959 - Vivante GC1000+ Dual-Core',
      '958 - Qualcomm Adreno 220',
      '957 - Broadcom VideoCore-IV',
      '956 - NVIDIA GeForce ULP (Tegra 3)',
      '955 - ARM Mali-400 MP4',
      '954 - Vivante GC4000',
      '953 - Qualcomm Adreno 225',
      '945 - Qualcomm Adreno 302',
      '944 - Vivante GC7000UL',
      '943 - ARM Mali-T720',
      '942 - Qualcomm Adreno 304',
      '941 - Qualcomm Adreno 305',
      '940 - Qualcomm Adreno 306',
      '939 - Qualcomm Adreno 308',
      '938 - PowerVR SGX544',
      '937 - ARM Mali-T720 MP2',
      '936 - PowerVR SGX544MP2',
      '935 - PowerVR SGX545',
      '932 - PowerVR SGX543MP2',
      '922 - PowerVR SGX543MP3',
      '914 - ARM Mali-T830 MP1',
      '913 - ARM Mali-450 MP4',
      '912 - ARM Mali-T720 MP4',
      '911 - PowerVR GE8100',
      '910 - PowerVR GE8300',
      '909 - PowerVR GE8320',
      '908 - ARM Mali-T760 MP2',
      '907 - Qualcomm Adreno 320',
      '906 - ARM Mali-T624',
      '905 - PowerVR SGX543MP4',
      '878 - ARM Mali-T830 MP2',
      '877 - Qualcomm Adreno 405',
      '876 - PowerVR G6200',
      '875 - NVIDIA GeForce Tegra 4',
      '870 - ARM Mali-T604 MP4',
      '864 - ARM Mali-T830 MP3',
      '863 - ARM Mali-T860 MP2',
      '859 - Qualcomm Adreno 504',
      '858 - Qualcomm Adreno 505',
      '857 - PowerVR GE8322 / IMG8322',
      '856 - Qualcomm Adreno 506',
      '855 - Qualcomm Adreno 508',
      '854 - Qualcomm Adreno 509',
      '853 - ARM Mali-T628 MP4',
      '852 - PowerVR SGX554MP4',
      '814 - ARM Mali-T760 MP4',
      '813 - ARM Mali-T628 MP6',
      '812 - Intel HD Graphics (Bay Trail)',
      '811 - PowerVR G6400',
      '810 - PowerVR GX6250',
      '809 - PowerVR G6430',
      '808 - Qualcomm Adreno 330',
      '807 - Qualcomm Adreno 510',
      '806 - Qualcomm Adreno 512',
      '805 - Qualcomm Adreno 610',
      '804 - Qualcomm Adreno 612',
      '741 - Intel HD Graphics (Cherry Trail)',
      '728 - ARM Mali-G51 MP4',
      '726 - Qualcomm Adreno 616',
      '725 - Qualcomm Adreno 618',
      '724 - Qualcomm Adreno 418',
      '704 - Qualcomm Adreno 620',
      '703 - Qualcomm Adreno 420',
      '702 - PowerVR GX6450',
      '692 - ARM Mali-T880 MP2',
      '691 - ARM Mali-T760 MP6',
      '659 - ARM Mali-G52 MP1',
      '658 - ARM Mali-G52 MP2',
      '657 - ARM Mali-G52 MP6',
      '656 - ARM Mali-T880 MP4',
      '655 - ARM Mali-G72 MP3',
      '634 - Qualcomm Adreno 430',
      '631 - ARM Mali-G71 MP2',
      '630 - ARM Mali-T760 MP8',
      '583 - ARM Mali-G76 MP4',
      '582 - ARM Mali-T880 MP12',
      '581 - Apple A9 / PowerVR GT7600',
      '580 - NVIDIA Tegra K1 Kepler GPU',
      '579 - PowerVR GXA6850',
      '578 - Qualcomm Adreno 530',
      '577 - PowerVR GM9446',
      '538 - ARM Mali-G71 MP8',
      '537 - ARM Mali-G72 MP12',
      '536 - ARM Mali-G71 MP20',
      '535 - ARM Mali-G72 MP18',
      '534 - ARM Mali-G57 MP6',
      '533 - Qualcomm Adreno 540',
      '532 - ARM Mali-G76 MP10',
      '531 - ARM Mali-G76 MP12',
      '530 - Qualcomm Adreno 630',
      '529 - Qualcomm Adreno 640',
      '528 - ARM Mali-G76 MP16',
      '527 - ARM Mali-G77 MP11',
      '512 - Apple A10 Fusion GPU / PowerVR',
      '421 - NVIDIA Tegra X1 Maxwell GPU',
      '392 - Apple A9X / PowerVR Series 7XT',
      '356 - Apple A10X Fusion GPU / PowerVR',
      '355 - Apple A11 Bionic GPU',
      '354 - Qualcomm Adreno 650',
      '353 - Apple A12 Bionic GPU',
      '347 - Apple A13 Bionic GPU',
      '320 - Apple A12X Bionic GPU',
      '319 - Apple A12Z Bionic GPU',
  ];

  const cleanEntryString = (entryString) => entryString
      .toLowerCase() // Lowercase all for easier matching
      .split('- ')[1] // Remove prelude score (`3 - `)
      .split(' /')[0]; // Reduce 'apple a9x / powervr series 7xt' to 'apple a9x'

  const cleanRendererString = (rendererString) => {
      let cleanedRendererString = rendererString.toLowerCase();
      // Strip off ANGLE and Direct3D version
      if (cleanedRendererString.includes('angle (') && cleanedRendererString.includes('direct3d')) {
          cleanedRendererString = cleanedRendererString.replace('angle (', '').split(' direct3d')[0];
      }
      // Strip off the GB amount (1060 6gb was being concatenated to 10606 and because of it using the fallback)
      if (cleanedRendererString.includes('nvidia') && cleanedRendererString.includes('gb')) {
          cleanedRendererString = cleanedRendererString.split(/\dgb/)[0];
      }
      return cleanedRendererString;
  };

  /**
   * The following defined constants and descriptions are directly ported from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
   *
   * Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/
   *
   * Contributors
   *
   * See: https://developer.mozilla.org/en-US/profiles/Sheppy
   * See: https://developer.mozilla.org/en-US/profiles/fscholz
   * See: https://developer.mozilla.org/en-US/profiles/AtiX
   * See: https://developer.mozilla.org/en-US/profiles/Sebastianz
   *
   * These constants are defined on the WebGLRenderingContext / WebGL2RenderingContext interface
   */
  /**
   * Passed to clear to clear the current color buffer
   * @constant {number}
   */
  const GL_COLOR_BUFFER_BIT = 0x00004000;
  /**
   * Passed to drawElements or drawArrays to draw triangles. Each set of three vertices creates a separate triangle
   * @constant {number}
   */
  const GL_TRIANGLES = 0x0004;
  // Buffers
  // Constants passed to WebGLRenderingContext.bufferData(), WebGLRenderingContext.bufferSubData(), WebGLRenderingContext.bindBuffer(), or WebGLRenderingContext.getBufferParameter()
  /**
   * Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often
   * @constant {number}
   */
  const GL_STATIC_DRAW = 0x88e4;
  /**
   * Passed to bindBuffer or bufferData to specify the type of buffer being used
   * @constant {number}
   */
  const GL_ARRAY_BUFFER = 0x8892;
  /**
   * @constant {number}
   */
  const GL_UNSIGNED_BYTE = 0x1401;
  /**
   * @constant {number}
   */
  const GL_FLOAT = 0x1406;
  /**
   * @constant {number}
   */
  const GL_RGBA = 0x1908;
  // Shaders
  // Constants passed to WebGLRenderingContext.getShaderParameter()
  /**
   * Passed to createShader to define a fragment shader
   * @constant {number}
   */
  const GL_FRAGMENT_SHADER = 0x8b30;
  /**
   * Passed to createShader to define a vertex shader
   * @constant {number}
   */
  const GL_VERTEX_SHADER = 0x8b31;

  // Vendor
  // Apple GPU (iOS 12.2+, Safari 14+)
  // SEE: https://github.com/TimvanScherpenzeel/detect-gpu/issues/7
  // CREDIT: https://medium.com/@Samsy/detecting-apple-a10-iphone-7-to-a11-iphone-8-and-b019b8f0eb87
  // CREDIT: https://github.com/Samsy/appleGPUDetection/blob/master/index.js
  const deobfuscateAppleGPU = (gl, renderer, isMobileTier) => {
      if (isMobileTier) {
          const vertexShaderSource = /* glsl */ `
    precision highp float;

    attribute vec3 aPosition;

    varying float vvv;

    void main() {
      vvv = 0.31622776601683794;

      gl_Position = vec4(aPosition, 1.0);
    }
  `;
          const fragmentShaderSource = /* glsl */ `
    precision highp float;

    varying float vvv;

    void main() {
      vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * vvv;
      enc = fract(enc);
      enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);

      gl_FragColor = enc;
    }
  `;
          const vertexShader = gl.createShader(GL_VERTEX_SHADER);
          const fragmentShader = gl.createShader(GL_FRAGMENT_SHADER);
          const program = gl.createProgram();
          if (fragmentShader !== null && vertexShader !== null && program !== null) {
              gl.shaderSource(vertexShader, vertexShaderSource);
              gl.shaderSource(fragmentShader, fragmentShaderSource);
              gl.compileShader(vertexShader);
              gl.compileShader(fragmentShader);
              gl.attachShader(program, vertexShader);
              gl.attachShader(program, fragmentShader);
              gl.linkProgram(program);
              gl.detachShader(program, vertexShader);
              gl.detachShader(program, fragmentShader);
              gl.deleteShader(vertexShader);
              gl.deleteShader(fragmentShader);
              gl.useProgram(program);
              const vertexArray = gl.createBuffer();
              gl.bindBuffer(GL_ARRAY_BUFFER, vertexArray);
              gl.bufferData(GL_ARRAY_BUFFER, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), GL_STATIC_DRAW);
              const aPosition = gl.getAttribLocation(program, 'aPosition');
              gl.vertexAttribPointer(aPosition, 3, GL_FLOAT, false, 0, 0);
              gl.enableVertexAttribArray(aPosition);
              gl.clearColor(1.0, 1.0, 1.0, 1.0);
              gl.clear(GL_COLOR_BUFFER_BIT);
              gl.viewport(0, 0, 1, 1);
              gl.drawArrays(GL_TRIANGLES, 0, 3);
              const pixels = new Uint8Array(4);
              gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_UNSIGNED_BYTE, pixels);
              const result = pixels.join('');
              gl.deleteProgram(program);
              gl.deleteBuffer(vertexArray);
              switch (result) {
                  case '801621810':
                      // iPhone 11, 11 Pro, 11 Pro Max (Apple A13 GPU)
                      // iPad Pro (Apple A12X GPU)
                      // iPhone XS, XS Max, XR (Apple A12 GPU)
                      // iPhone 8, 8 Plus (Apple A11 GPU)
                      renderer = 'apple a13 gpu';
                      break;
                  case '8016218135':
                      // iPhone SE, 6S, 6S Plus (Apple A9 GPU)
                      // iPhone 7, 7 Plus (Apple A10 GPU)
                      // iPad Pro (Apple A10X GPU)
                      renderer = 'apple a10 gpu';
                      break;
              }
              console.warn(`iOS 12.2+ obfuscates its GPU type and version, using closest match: ${renderer}`);
          }
      }
      else {
          // TODO: add support for deobfuscating Safari 14 GPU
          console.warn('Safari 14+ obfuscates its GPU type and version, using fallback');
      }
      return renderer;
  };
  const deobfuscateRenderer = (gl, renderer, isMobileTier) => {
      if (renderer === 'apple gpu') {
          renderer = deobfuscateAppleGPU(gl, renderer, isMobileTier);
      }
      return renderer;
  };

  // Get benchmark entry's by percentage of the total benchmark entries
  const getBenchmarkByPercentage = (benchmark, percentages) => {
      let chunkOffset = 0;
      const benchmarkTiers = percentages.map((percentage) => {
          const chunkSize = Math.round((benchmark.length / 100) * percentage);
          const chunk = benchmark.slice(chunkOffset, chunkOffset + chunkSize);
          chunkOffset += chunkSize;
          return chunk;
      });
      return benchmarkTiers;
  };

  var isSSR = typeof window === 'undefined';
  var DetectUA = /** @class */ (function () {
      /**
       * Detect a users browser, browser version and whether it is a mobile-, tablet- or desktop device
       *
       * @param forceUserAgent Force a user agent string (useful for testing)
       */
      function DetectUA(forceUserAgent) {
          this.userAgent = forceUserAgent
              ? forceUserAgent
              : !isSSR && window.navigator
                  ? window.navigator.userAgent
                  : '';
          this.isAndroidDevice = !/like android/i.test(this.userAgent) && /android/i.test(this.userAgent);
          this.iOSDevice = this.match(1, /(iphone|ipod|ipad)/i).toLowerCase();
          // Workaround for ipadOS, force detection as tablet
          // SEE: https://github.com/lancedikson/bowser/issues/329
          // SEE: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
          if (!isSSR &&
              navigator.platform === 'MacIntel' &&
              navigator.maxTouchPoints > 2 &&
              !window.MSStream) {
              this.iOSDevice = 'ipad';
          }
      }
      /**
       * Match entry based on position found in the user-agent string
       *
       * @param pattern regular expression pattern
       */
      DetectUA.prototype.match = function (position, pattern) {
          var match = this.userAgent.match(pattern);
          return (match && match.length > 1 && match[position]) || '';
      };
      Object.defineProperty(DetectUA.prototype, "isMobile", {
          /**
           * Returns if the device is a mobile device
           */
          get: function () {
              return (
              // Default mobile
              !this.isTablet &&
                  (/[^-]mobi/i.test(this.userAgent) ||
                      // iPhone / iPod
                      this.iOSDevice === 'iphone' ||
                      this.iOSDevice === 'ipod' ||
                      // Android
                      this.isAndroidDevice ||
                      // Nexus mobile
                      /nexus\s*[0-6]\s*/i.test(this.userAgent)));
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(DetectUA.prototype, "isTablet", {
          /**
           * Returns if the device is a tablet device
           */
          get: function () {
              return (
              // Default tablet
              (/tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent)) ||
                  // iPad
                  this.iOSDevice === 'ipad' ||
                  // Android
                  (this.isAndroidDevice && !/[^-]mobi/i.test(this.userAgent)) ||
                  // Nexus tablet
                  (!/nexus\s*[0-6]\s*/i.test(this.userAgent) && /nexus\s*[0-9]+/i.test(this.userAgent)));
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(DetectUA.prototype, "isDesktop", {
          /**
           * Returns if the device is a desktop device
           */
          get: function () {
              return !this.isMobile && !this.isTablet;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(DetectUA.prototype, "isMacOS", {
          /**
           * Returns if the device is running MacOS (and if so which version)
           *
           * '5' => Leopard'
           * '6' => Snow Leopard'
           * '7' => Lion'
           * '8' => Mountain Lion'
           * '9' => Mavericks'
           * '10' => Yosemite'
           * '11' => El Capitan'
           * '12' => Sierra'
           * '13' => High Sierra'
           * '14' => Mojave'
           * '15' => Catalina'
           */
          get: function () {
              return (/macintosh/i.test(this.userAgent) && {
                  version: this.match(1, /mac os x (\d+(\.?_?\d+)+)/i)
                      .replace(/[_\s]/g, '.')
                      .split('.')
                      .map(function (versionNumber) { return versionNumber; })[1],
              });
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(DetectUA.prototype, "isWindows", {
          /**
           * Returns if the device is running Windows (and if so which version)
           *
           * 'NT' => 'NT'
           * 'XP' => 'XP'
           * 'NT 5.0' => '2000'
           * 'NT 5.1' => 'XP'
           * 'NT 5.2' => '2003'
           * 'NT 6.0' => 'Vista'
           * 'NT 6.1' => '7'
           * 'NT 6.2' => '8'
           * 'NT 6.3' => '8.1'
           * 'NT 10.0' => '10'
           */
          get: function () {
              return (/windows /i.test(this.userAgent) && {
                  version: this.match(1, /Windows ((NT|XP)( \d\d?.\d)?)/i),
              });
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(DetectUA.prototype, "isiOS", {
          /**
           * Returns if the device is an iOS device (and if so which version)
           */
          get: function () {
              return (!!this.iOSDevice && {
                  version: this.match(1, /os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g, '.') ||
                      this.match(1, /version\/(\d+(\.\d+)?)/i),
              });
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(DetectUA.prototype, "isAndroid", {
          /**
           * Returns if the device is an Android device (and if so which version)
           */
          get: function () {
              return (this.isAndroidDevice && {
                  version: this.match(1, /android[ \/-](\d+(\.\d+)*)/i),
              });
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(DetectUA.prototype, "browser", {
          /**
           * Returns the browser name and version
           */
          get: function () {
              var versionIdentifier = this.match(1, /version\/(\d+(\.\d+)?)/i);
              if (/opera/i.test(this.userAgent)) {
                  // Opera
                  return {
                      name: 'Opera',
                      version: versionIdentifier || this.match(1, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i),
                  };
              }
              else if (/opr\/|opios/i.test(this.userAgent)) {
                  // Opera
                  return {
                      name: 'Opera',
                      version: this.match(1, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier,
                  };
              }
              else if (/SamsungBrowser/i.test(this.userAgent)) {
                  // Samsung Browser
                  return {
                      name: 'Samsung Internet for Android',
                      version: versionIdentifier || this.match(1, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i),
                  };
              }
              else if (/yabrowser/i.test(this.userAgent)) {
                  // Yandex Browser
                  return {
                      name: 'Yandex Browser',
                      version: versionIdentifier || this.match(1, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i),
                  };
              }
              else if (/ucbrowser/i.test(this.userAgent)) {
                  // UC Browser
                  return {
                      name: 'UC Browser',
                      version: this.match(1, /(?:ucbrowser)[\s\/](\d+(\.\d+)?)/i),
                  };
              }
              else if (/msie|trident/i.test(this.userAgent)) {
                  // Internet Explorer
                  return {
                      name: 'Internet Explorer',
                      version: this.match(1, /(?:msie |rv:)(\d+(\.\d+)?)/i),
                  };
              }
              else if (/(edge|edgios|edga|edg)/i.test(this.userAgent)) {
                  // Edge
                  return {
                      name: 'Microsoft Edge',
                      version: this.match(2, /(edge|edgios|edga|edg)\/(\d+(\.\d+)?)/i),
                  };
              }
              else if (/firefox|iceweasel|fxios/i.test(this.userAgent)) {
                  // Firefox
                  return {
                      name: 'Firefox',
                      version: this.match(1, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i),
                  };
              }
              else if (/chromium/i.test(this.userAgent)) {
                  // Chromium
                  return {
                      name: 'Chromium',
                      version: this.match(1, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier,
                  };
              }
              else if (/chrome|crios|crmo/i.test(this.userAgent)) {
                  // Chrome
                  return {
                      name: 'Chrome',
                      version: this.match(1, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i),
                  };
              }
              else if (/safari|applewebkit/i.test(this.userAgent)) {
                  // Safari
                  return {
                      name: 'Safari',
                      version: versionIdentifier,
                  };
              }
              else {
                  // Everything else
                  return {
                      name: this.match(1, /^(.*)\/(.*) /),
                      version: this.match(2, /^(.*)\/(.*) /),
                  };
              }
          },
          enumerable: false,
          configurable: true
      });
      return DetectUA;
  }());

  // Vendor
  const device = new DetectUA();
  const { browser, isMobile, isTablet } = device;

  const getEntryVersionNumber = (entryString) => entryString.replace(/[\D]/g, ''); // Grab and concat all digits in the string

  const getWebGLUnmaskedRenderer = (gl) => {
      const glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return (glExtensionDebugRendererInfo &&
          gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL));
  };

  const isWebGLSupported = (browser, failIfMajorPerformanceCaveat = true) => {
      const attributes = {
          alpha: false,
          antialias: false,
          depth: false,
          failIfMajorPerformanceCaveat,
          powerPreference: 'high-performance',
          stencil: false,
      };
      // Workaround for Safari 12
      // SEE: https://github.com/TimvanScherpenzeel/detect-gpu/issues/5
      if (typeof browser !== 'boolean' && browser.name === 'Safari' && browser.version.includes('12')) {
          delete attributes.powerPreference;
      }
      // Keep reference to the canvas and context in order to clean up
      // after the necessary information has been extracted
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);
      if (!gl || !(gl instanceof WebGLRenderingContext)) {
          return;
      }
      return gl;
  };

  // Compute the difference (distance) between two strings
  // SEE: https://en.wikipedia.org/wiki/Levenshtein_distance
  // CREDIT: https://gist.github.com/keesey/e09d0af833476385b9ee13b6d26a2b84
  const getLevenshteinDistance = (a, b) => {
      const an = a ? a.length : 0;
      const bn = b ? b.length : 0;
      if (an === 0) {
          return bn;
      }
      if (bn === 0) {
          return an;
      }
      const matrix = new Array(bn + 1);
      for (let i = 0; i <= bn; ++i) {
          const row = (matrix[i] = new Array(an + 1));
          row[0] = i;
      }
      const firstRow = matrix[0];
      for (let j = 1; j <= an; ++j) {
          firstRow[j] = j;
      }
      for (let i = 1; i <= bn; ++i) {
          for (let j = 1; j <= an; ++j) {
              if (b.charAt(i - 1) === a.charAt(j - 1)) {
                  matrix[i][j] = matrix[i - 1][j - 1];
              }
              else {
                  matrix[i][j] = Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
              }
          }
      }
      return matrix[bn][an];
  };

  // Generated data
  const getGPUTier = ({ mobileBenchmarkPercentages = [
      0,
      50,
      30,
      20,
  ], desktopBenchmarkPercentages = [
      0,
      50,
      30,
      20,
  ], forceRendererString = '', forceMobile = false, glContext, failIfMajorPerformanceCaveat = true, } = {}) => {
      let renderer;
      const isMobileTier = isMobile || isTablet || forceMobile;
      const createGPUTier = (index = 1, GPUType = 'FALLBACK') => ({
          tier: `GPU_${isMobileTier ? 'MOBILE' : 'DESKTOP'}_TIER_${index}`,
          type: GPUType,
      });
      if (forceRendererString) {
          renderer = forceRendererString;
      }
      else {
          const gl = glContext || isWebGLSupported(browser, failIfMajorPerformanceCaveat);
          if (!gl) {
              return createGPUTier(0, 'WEBGL_UNSUPPORTED');
          }
          renderer = getWebGLUnmaskedRenderer(gl);
          renderer = cleanRendererString(renderer);
          renderer = deobfuscateRenderer(gl, renderer, isMobileTier);
      }
      // GPU BLACKLIST
      // https://wiki.mozilla.org/Blocklisting/Blocked_Graphics_Drivers
      // https://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists
      // https://chromium.googlesource.com/chromium/src/+/master/gpu/config/software_rendering_list.json
      // https://chromium.googlesource.com/chromium/src/+/master/gpu/config/gpu_driver_bug_list.json
      const isGPUBlacklisted = /(radeon hd 6970m|radeon hd 6770m|radeon hd 6490m|radeon hd 6630m|radeon hd 6750m|radeon hd 5750|radeon hd 5670|radeon hd 4850|radeon hd 4870|radeon hd 4670|geforce 9400m|geforce 320m|geforce 330m|geforce gt 130|geforce gt 120|geforce gtx 285|geforce 8600|geforce 9600m|geforce 9400m|geforce 8800 gs|geforce 8800 gt|quadro fx 5|quadro fx 4|radeon hd 2600|radeon hd 2400|radeon r9 200|mali-4|mali-3|mali-2|google swiftshader|sgx543|legacy|sgx 543)/.test(renderer);
      if (isGPUBlacklisted) {
          return createGPUTier(0, 'BLACKLISTED');
      }
      const [tier, type] = (isMobileTier ? getMobileRank : getDesktopRank)(getBenchmarkByPercentage(isMobileTier ? GPU_BENCHMARK_SCORE_MOBILE : GPU_BENCHMARK_SCORE_DESKTOP, isMobileTier ? mobileBenchmarkPercentages : desktopBenchmarkPercentages), renderer, getEntryVersionNumber(renderer));
      return createGPUTier(tier, type);
  };
  const getMobileRank = (benchmark, renderer, rendererVersionNumber) => {
      const type = [
          'adreno',
          'apple',
          'mali-t',
          'mali',
          'nvidia',
          'powervr',
      ].find((rendererType) => renderer.includes(rendererType));
      const ranks = [];
      if (type) {
          for (let index = 0; index < benchmark.length; index++) {
              const benchmarkTier = benchmark[index];
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < benchmarkTier.length; i++) {
                  const entry = cleanEntryString(benchmarkTier[i]);
                  if (entry.includes(type) &&
                      (entry !== 'mali' || !entry.includes('mali-t')) &&
                      getEntryVersionNumber(entry).includes(rendererVersionNumber)) {
                      ranks.push({
                          rank: [index, `BENCHMARK - ${entry}`],
                          distance: getLevenshteinDistance(renderer, entry),
                      });
                  }
              }
          }
      }
      const ordered = sortByLevenshteinDistance(ranks);
      return ordered.length > 0 ? ordered[0].rank : [undefined, undefined];
  };
  const sortByLevenshteinDistance = (ranks) => ranks.sort((rank1, rank2) => rank1.distance - rank2.distance);
  const getDesktopRank = (benchmark, renderer, rendererVersionNumber) => {
      const type = ['intel', 'amd', 'nvidia'].find((rendererType) => renderer.includes(rendererType));
      const ranks = [];
      if (type) {
          for (let index = 0; index < benchmark.length; index++) {
              const benchmarkTier = benchmark[index];
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < benchmarkTier.length; i++) {
                  const entry = cleanEntryString(benchmarkTier[i]);
                  if (entry.includes(type) && getEntryVersionNumber(entry).includes(rendererVersionNumber)) {
                      ranks.push({
                          rank: [index, `BENCHMARK - ${entry}`],
                          distance: getLevenshteinDistance(renderer, entry),
                      });
                  }
              }
          }
      }
      const ordered = sortByLevenshteinDistance(ranks);
      return ordered.length > 0 ? ordered[0].rank : [undefined, undefined];
  };

  exports.getGPUTier = getGPUTier;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
