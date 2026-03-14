import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../../Models/product';
import { Brand } from '../../../Models/brand';
import { Categories } from '../../../Models/categories';
import { userService } from '../../../Service/userService';
import { isPlatformBrowser } from '@angular/common';

declare var bootstrap: any;

// ============== MOCK DATA ==============
const MOCK_PRODUCTS: Product[] = [
  // --- ĐIỆN THOẠI (Category 1) ---
  { product_id: 1, product_name: 'iPhone 15 Pro Max', price: 21000000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg', description: 'Chip A17 Pro, camera 48MP, thiết kế Titanium', brand_id: 101, quantity: 1, PathAnh: '' },
  { product_id: 2, product_name: 'Samsung Galaxy S23 Ultra', price: 19000000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/249948/samsung-galaxy-s23-ultra-thumb-hong-600x600.jpg', description: 'Màn hình Dynamic AMOLED 2X, bút S Pen', brand_id: 102, quantity: 1, PathAnh: '' },
  { product_id: 7, product_name: 'Xiaomi Redmi Note 12', price: 5590000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/303298/xiaomi-redmi-note-12-vang-1-thumb-momo-600x600.jpg', description: 'Màn AMOLED 120Hz, pin 5000mAh', brand_id: 103, quantity: 1, PathAnh: '' },
  { product_id: 8, product_name: 'Google Pixel 8 Pro', price: 23500000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/307188/google-pixel-8-pro-600x600.jpg', description: 'Tensor G3, camera AI tiên tiến', brand_id: 104, quantity: 1, PathAnh: '' },
  { product_id: 9, product_name: 'Oppo Find N3 Flip', price: 18990000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/309835/oppo-n3-flip-den-glr-1-750x500.jpg', description: 'Điện thoại gập thời thượng', brand_id: 105, quantity: 1, PathAnh: '' },
  { product_id: 10, product_name: 'iPhone SE (2022)', price: 9990000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/244141/iphone-se-black-600x600.jpeg', description: 'Chip A15, thiết kế nhỏ gọn', brand_id: 101, quantity: 1, PathAnh: '' },
  { product_id: 11, product_name: 'Samsung Galaxy A54', price: 8590000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/250103/samsung-galaxy-a54-thumb-den-600x600.jpg', description: 'Exynos 1380, camera OIS', brand_id: 102, quantity: 1, PathAnh: '' },
  { product_id: 12, product_name: 'Xiaomi 13T', price: 11990000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/309814/xiaomi-13-t-xanh-duong-thumb-thumb-600x600.jpg', description: 'Dimensity 8200, camera Leica', brand_id: 103, quantity: 1, PathAnh: '' },

  // --- LAPTOP (Category 2) ---
  { product_id: 3, product_name: 'Dell XPS 13', price: 20000000, category_id: 2, image_url: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327907/dell-xps-13-9340-ultra-7-hxrgt-638763566656439373-600x600.jpg', description: 'Ultrabook cao cấp, InfinityEdge', brand_id: 201, quantity: 1, PathAnh: '' },
  { product_id: 4, product_name: 'HP Pavilion 14', price: 9990000, category_id: 2, image_url: 'https://ttcenter.com.vn/uploads/product/8xe1vdsl-588-hp-pavilion-14-dv2075tu-core-i5-1235u-ram-8gb-ssd-512gb-14-fhd-new.png', description: 'Laptop văn phòng, hiệu năng ổn', brand_id: 202, quantity: 1, PathAnh: '' },
  { product_id: 13, product_name: 'MacBook Air M2 13"', price: 25990000, category_id: 2, image_url: 'https://cdn.tgdd.vn/Products/Images/44/282827/apple-macbook-air-m2-2022-xam-600x600.jpg', description: 'Chip M2, thiết kế siêu mỏng', brand_id: 101, quantity: 1, PathAnh: '' },
  { product_id: 14, product_name: 'Asus Zenbook 14X', price: 15500000, category_id: 2, image_url: 'https://www.laptopvip.vn/images/ab__webp/detailed/31/10001-8kws-39-www.laptopvip.vn-1678433842.webp', description: 'OLED 2.8K, Intel Core i5', brand_id: 203, quantity: 1, PathAnh: '' },
  { product_id: 15, product_name: 'Acer Nitro 5', price: 18990000, category_id: 2, image_url: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop_gaming_acer_nitro_5_an515-55-5923_nh.q7nsv.004__0004_layer_1.jpg', description: 'Gaming laptop, RTX 3050', brand_id: 204, quantity: 1, PathAnh: '' },
  { product_id: 16, product_name: 'Lenovo Legion 5', price: 31000000, category_id: 2, image_url: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/339651/lenovo-legion-5-pro-16iax10-ultra-9-83f3002gvn-1-638862961797834850-750x500.jpg', description: 'Gaming laptop cao cấp', brand_id: 205, quantity: 1, PathAnh: '' },
  { product_id: 17, product_name: 'LG Gram 17', price: 27990000, category_id: 2, image_url: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_55__2_11.png', description: 'Siêu nhẹ 1.35kg, 17 inch', brand_id: 206, quantity: 1, PathAnh: '' },

  // --- MÁY TÍNH BẢNG (Category 3) ---
  { product_id: 5, product_name: 'iPad Pro 12.9"', price: 12999000, category_id: 3, image_url: 'https://cdn.tgdd.vn/Products/Images/522/294105/ipad-pro-m2-12.5-wifi-bac-thumb-600x600.jpg', description: 'Chip M2, Liquid Retina XDR', brand_id: 101, quantity: 1, PathAnh: '' },
  { product_id: 18, product_name: 'Samsung Galaxy Tab S9', price: 18990000, category_id: 3, image_url: 'https://cdn.tgdd.vn/Products/Images/522/303299/samsung-galaxy-tab-s9-grey-thumbnew-600x600.jpg', description: 'Snapdragon 8 Gen 2, S Pen', brand_id: 102, quantity: 1, PathAnh: '' },
  { product_id: 19, product_name: 'iPad Air 5', price: 15990000, category_id: 3, image_url: 'https://cdn.tgdd.vn/Products/Images/522/248096/ipad-air-5-wifi-pink-thumb-600x600.jpg', description: 'Chip M1, màn 10.9 inch', brand_id: 101, quantity: 1, PathAnh: '' },
  { product_id: 20, product_name: 'Xiaomi Pad 6', price: 8490000, category_id: 3, image_url: 'https://cdn.tgdd.vn/Products/Images/522/309848/xiaomi-pad-6-blue-thumb-600x600.jpg', description: 'Snapdragon 870, 144Hz', brand_id: 103, quantity: 1, PathAnh: '' },

  // --- PHỤ KIỆN (Category 4) ---
  { product_id: 6, product_name: 'Apple AirPods Pro 2', price: 5990000, category_id: 4, image_url: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-airpods-pro-2-usb-c_1_.png', description: 'Chống ồn chủ động, USB-C', brand_id: 101, quantity: 1, PathAnh: '' },
  { product_id: 21, product_name: 'Samsung Galaxy Buds2 Pro', price: 3990000, category_id: 4, image_url: 'https://cdn.tgdd.vn/Products/Images/54/286045/samsung-galaxy-buds-2-r177n-den-thumb-600x600.jpg', description: 'ANC, âm thanh Hi-Fi 24bit', brand_id: 102, quantity: 1, PathAnh: '' },
  { product_id: 22, product_name: 'Apple Watch Series 9', price: 10990000, category_id: 4, image_url: 'data:image/jpeg;base64,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', description: 'Chip S9, Double Tap', brand_id: 101, quantity: 1, PathAnh: '' },
  { product_id: 23, product_name: 'Logitech MX Master 3S', price: 2490000, category_id: 4, image_url: 'https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/chuot-bluetooth-logitech-mx-master-3s-1.jpg', description: 'Chuột ergonomic cao cấp', brand_id: 207, quantity: 1, PathAnh: '' },
  { product_id: 24, product_name: 'Anker PowerCore 20000mAh', price: 890000, category_id: 4, image_url: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/7/h/7h56.png', description: 'Sạc nhanh 22.5W', brand_id: 208, quantity: 1, PathAnh: '' },
];

const MOCK_CATEGORIES: Categories[] = [
  { category_id: 1, category_name: 'Điện Thoại' },
  { category_id: 2, category_name: 'Laptop' },
  { category_id: 3, category_name: 'Máy Tính Bảng' },
  { category_id: 4, category_name: 'Phụ Kiện' },
];

const MOCK_BRANDS: Brand[] = [
  { brand_id: 101, brand_name: 'Apple', category_id: 1 },
  { brand_id: 102, brand_name: 'Samsung', category_id: 1 },
  { brand_id: 103, brand_name: 'Xiaomi', category_id: 1 },
  { brand_id: 104, brand_name: 'Google', category_id: 1 },
  { brand_id: 105, brand_name: 'Oppo', category_id: 1 },
  { brand_id: 201, brand_name: 'Dell', category_id: 2 },
  { brand_id: 202, brand_name: 'HP', category_id: 2 },
  { brand_id: 203, brand_name: 'Asus', category_id: 2 },
  { brand_id: 204, brand_name: 'Acer', category_id: 2 },
  { brand_id: 205, brand_name: 'Lenovo', category_id: 2 },
  { brand_id: 206, brand_name: 'LG', category_id: 2 },
  { brand_id: 207, brand_name: 'Logitech', category_id: 4 },
  { brand_id: 208, brand_name: 'Anker', category_id: 4 },
];

export interface GroupedProduct {
  category_id: number;
  category_name: string;
  products: Product[];
  brands: Brand[];
  visibleProducts: Product[];
  currentIndex: number;
  productsPerView: number;
}

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'],
})
export class ListProductComponent implements OnInit {
  productGroups: GroupedProduct[] = [];
  allBrands: Brand[] = [];
  selectedBrandId: string = '';
  selectedPriceRange: string = '';
  currentKeyword: string = '';
  user_id: number | null = null;
  dangThemSua = false;
  selectedItem: any = null;
  showSuccessMessage = false;
  isBanking = false;
  bankInfo: string | null = null;
  transferInstructions: string | null = null;
  qrCodeUrl = 'assets/img/maQR2.jpg';
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    public userService: userService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) this.user_id = currentUser.user_id;

    this.route.queryParams.subscribe((params) => {
      this.currentKeyword = params['search'] || '';
      this.loadProducts(this.currentKeyword);
    });

    this.updateProductsPerView();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateProductsPerView();
  }

  updateProductsPerView() {
    const w = this.getViewportWidth();
    let perView = 5;
    if (w <= 480) perView = 2;
    else if (w <= 768) perView = 3;
    else if (w <= 1024) perView = 4;

    this.productGroups.forEach(g => {
      g.productsPerView = perView;
      g.currentIndex = 0; // Reset to first page
      const startIdx = g.currentIndex * perView;
      g.visibleProducts = g.products.slice(startIdx, startIdx + perView);
    });
  }

  loadProducts(key = '') {
    const w = this.getViewportWidth();
    let perView = 5;
    if (w <= 480) perView = 2;
    else if (w <= 768) perView = 3;
    else if (w <= 1024) perView = 4;

    // ✅ Populate PathAnh từ image_url cho tất cả products
    MOCK_PRODUCTS.forEach(p => {
      if (!p.PathAnh || p.PathAnh === '') {
        p.PathAnh = p.image_url;
      }
    });

    this.allBrands = [...MOCK_BRANDS];

    this.productGroups = MOCK_CATEGORIES.map((cat) => {
      let products = MOCK_PRODUCTS.filter(p => p.category_id === cat.category_id);
      const brands = MOCK_BRANDS.filter(b => b.category_id === cat.category_id);

      if (key.trim()) {
        const lk = key.toLowerCase();
        products = products.filter(p => p.product_name.toLowerCase().includes(lk));
      }

      if (this.selectedBrandId) {
        products = products.filter(p => String(p.brand_id) === this.selectedBrandId);
      }

      if (this.selectedPriceRange) {
        products = products.filter(p => this.matchPriceRange(p.price));
      }

      return {
        category_id: cat.category_id,
        category_name: cat.category_name,
        products,
        brands,
        productsPerView: perView,
        currentIndex: 0,
        visibleProducts: products.slice(0, perView),
      };
    }).filter(g => g.products.length > 0);
  }

  applyFilters() {
    this.loadProducts(this.currentKeyword);
    this.updateProductsPerView();
  }

  resetFilters() {
    this.selectedBrandId = '';
    this.selectedPriceRange = '';
    this.applyFilters();
  }

  private matchPriceRange(price: number): boolean {
    if (this.selectedPriceRange === 'under10') return price < 10000000;
    if (this.selectedPriceRange === '10to20') return price >= 10000000 && price <= 20000000;
    if (this.selectedPriceRange === 'above20') return price > 20000000;
    return true;
  }

  private getViewportWidth(): number {
    return isPlatformBrowser(this.platformId) ? window.innerWidth : 1280;
  }

  navigateCarousel(group: GroupedProduct, dir: 'next' | 'prev') {
    const total = group.products.length;
    const pv = group.productsPerView;
    const maxIndex = Math.ceil(total / pv) - 1;

    if (dir === 'next') {
      group.currentIndex = group.currentIndex < maxIndex ? group.currentIndex + 1 : 0;
    } else {
      group.currentIndex = group.currentIndex > 0 ? group.currentIndex - 1 : maxIndex;
    }

    const startIdx = group.currentIndex * pv;
    let visible = group.products.slice(startIdx, startIdx + pv);
    
    if (visible.length < pv && startIdx + pv > total) {
      visible = visible.concat(group.products.slice(0, pv - visible.length));
    }
    group.visibleProducts = visible;
  }

  addToCart(product: Product) {
    if (!this.userService.getCurrentUser()) {
      alert('Vui lòng đăng nhập!');
      this.router.navigate(['/home/login']);
      return;
    }
    alert(`✅ Đã thêm "${product.product_name}" vào giỏ hàng!`);
  }

  themDon(product: Product) {
    const user = this.userService.getCurrentUser();
    if (!user) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      this.router.navigate(['/home/login']);
      return;
    }
    this.user_id = user.user_id;
    this.selectedItem = {
      product,
      quantity: 1,
      PathAnh: product.PathAnh || 'assets/images/default-image.jpg',
      price: product.price,
      total_amount: product.price,
    };
    this.dangThemSua = true;
    this.errorMessage = null;
  }

  muaNgay(form: any) {
    if (!form.valid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin hợp lệ!';
      return;
    }
    const v = form.value;
    this.isBanking = v.payment === 'Banking';

    this.showSuccessMessage = true;
    setTimeout(() => {
      if (this.isBanking) {
        this.bankInfo = 'Ngân hàng: MBbank\nSố tài khoản: 0779421219\nChủ TK: Nguyễn Ngọc Mạnh';
        this.transferInstructions = `Quét QR, chuyển ${this.selectedItem.total_amount.toLocaleString('vi-VN')} VNĐ, nội dung "DH123" trong 24h.`;
        this.showSuccessMessage = false;
      } else {
        alert('🎉 Đặt hàng COD thành công!');
        this.closeModal();
      }
    }, 2000);
  }

  dong() {
    this.dangThemSua = false;
    this.selectedItem = null;
    this.showSuccessMessage = false;
    this.isBanking = false;
    this.bankInfo = null;
    this.transferInstructions = null;
    this.errorMessage = null;
    this.closeModal();
  }

  closeModal() {
    const m = document.getElementById('exampleModal');
    const bm = bootstrap?.Modal?.getInstance(m);
    if (bm) bm.hide();
  }

  confirmTransfer() {
    this.closeModal();
    this.router.navigate([`/home/user/viewOH/${this.user_id}`]);
  }
}