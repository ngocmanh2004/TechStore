import { Component, OnInit } from '@angular/core';
import { Product } from '../../../Models/product';
import { userService } from '../../../Service/userService';
import { Router } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
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
  { product_id: 22, product_name: 'Apple Watch Series 9', price: 10990000, category_id: 4, image_url: 'https://cdn.tgdd.vn/Products/Images/7077/309420/apple-watch-s9-lte-41mm-vien-nhom-day-sport-loop-xanh-thumb-600x600.jpg', description: 'Chip S9, Double Tap', brand_id: 101, quantity: 1, PathAnh: '' },
  { product_id: 23, product_name: 'Logitech MX Master 3S', price: 2490000, category_id: 4, image_url: 'https://cdn.tgdd.vn/Products/Images/86/247407/logitech-mx-master-3s-den-1-2-600x600.jpg', description: 'Chuột ergonomic cao cấp', brand_id: 207, quantity: 1, PathAnh: '' },
  { product_id: 24, product_name: 'Anker PowerCore 20000mAh', price: 890000, category_id: 4, image_url: 'https://cdn.tgdd.vn/Products/Images/57/235026/pin-sac-du-phong-20000mah-anker-a1287-den-1-600x600.jpg', description: 'Sạc nhanh 22.5W', brand_id: 208, quantity: 1, PathAnh: '' },
];

const MOCK_CART: any[] = [
  { cart_id: 1, user_id: 1, product_id: 1, quantity: 2, selected: false },
  { cart_id: 2, user_id: 1, product_id: 2, quantity: 1, selected: false },
];

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  user_id: number | null = null;
  selectedItems: any[] = [];
  dangThemSua: boolean = false;
  bankInfo: string | null = null;
  transferInstructions: string | null = null;
  qrCodeUrl: string = 'assets/img/maQR2.jpg';
  showSuccessMessage: boolean = false;
  errorMessage: string | null = null;
  isBanking: boolean = false;

  constructor(
    private userService: userService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const userIdString = this.userService.getUserId();
    this.user_id = userIdString ? +userIdString : null;
    if (!this.user_id) {
      this.errorMessage = 'Vui lòng đăng nhập!';
      this.router.navigate(['/home/login']);
      return;
    }
    this.loadCart();
  }

  loadCart() {
    // Lấy giỏ hàng mockup cho user này
    const mockCart = MOCK_CART.filter(item => item.user_id === this.user_id);
    
    // Kết hợp với thông tin sản phẩm
    this.cartItems = mockCart.map(cartItem => {
      const product = MOCK_PRODUCTS.find(p => p.product_id === cartItem.product_id);
      return {
        cart_id: cartItem.cart_id,
        product: product,
        quantity: cartItem.quantity,
        PathAnh: product?.image_url || 'assets/images/default-image.jpg',
        product_id: cartItem.product_id,
        price: product?.price || 0,
        total_amount: (product?.price || 0) * cartItem.quantity,
        selected: cartItem.selected,
      };
    });

    if (this.cartItems.length === 0) {
      this.errorMessage = 'Giỏ hàng của bạn đang trống!';
    } else {
      this.errorMessage = null;
    }
    this.calculateTotal();
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.cartItems[index].total_amount = this.cartItems[index].price * this.cartItems[index].quantity;
      this.calculateTotal();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    this.cartItems[index].total_amount = this.cartItems[index].price * this.cartItems[index].quantity;
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.selectedItems = this.cartItems.filter((item) => item.selected);
    this.totalAmount = this.selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.cartItems.splice(index, 1);
      this.calculateTotal();
      alert('✅ Xóa sản phẩm thành công!');
    }
  }

  toggleSelectAll(event: any): void {
    this.cartItems.forEach((item) => (item.selected = event.target.checked));
    this.calculateTotal();
  }

  themDon(): void {
    this.calculateTotal();
    if (this.selectedItems.length === 0) {
      this.errorMessage = 'Vui lòng chọn sản phẩm!';
      return;
    }
    this.dangThemSua = true;
    this.bankInfo = null;
    this.transferInstructions = null;
    this.showSuccessMessage = false;
    this.errorMessage = null;
    this.isBanking = false;
  }

  muaNgay(paymentForm: any): void {
    if (!paymentForm.valid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      return;
    }
    const formValue = paymentForm.value;
    this.isBanking = formValue.payment === 'Banking';

    console.log('Mock Order Data:', {
      user_id: this.user_id,
      full_name: formValue.fullname,
      address: formValue.address,
      phone: formValue.phone,
      total_amount: this.totalAmount,
      items: this.selectedItems,
    });

    this.showSuccessMessage = true;
    setTimeout(() => {
      if (this.isBanking) {
        this.bankInfo =
          'Ngân hàng: MBbank\nSố tài khoản: 0779421219\nChủ tài khoản: Nguyễn Ngọc Mạnh';
        this.transferInstructions = `Vui lòng quét mã QR, nhập ${this.totalAmount.toLocaleString(
          'vi-VN'
        )} VNĐ, nội dung "DH123" trong 24h.`;
        this.showSuccessMessage = false;
      } else {
        alert('🎉 Đặt hàng COD thành công!');
        this.closeModal();
        // Xoá các item đã chọn khỏi giỏ hàng mockup
        this.selectedItems.forEach(item => {
          const idx = this.cartItems.indexOf(item);
          if (idx > -1) this.cartItems.splice(idx, 1);
        });
        this.router.navigate([`/home/user/viewOH/${this.user_id}`]);
      }
    }, 2000);
  }

  dong(): void {
    this.dangThemSua = false;
    this.bankInfo = null;
    this.transferInstructions = null;
    this.showSuccessMessage = false;
    this.errorMessage = null;
    this.isBanking = false;
    this.closeModal();
  }

  onCheckboxChange(): void {
    this.calculateTotal();
  }

  closeModal(): void {
    const modal = document.getElementById('exampleModal');
    const bootstrapModal = bootstrap?.Modal?.getInstance(modal);
    if (bootstrapModal) {
      bootstrapModal.hide();
      setTimeout(() => this.loadCart(), 300);
    }
  }

  confirmTransfer(): void {
    this.closeModal();
    this.router.navigate([`/home/user/viewOH/${this.user_id}`]);
  }
}
