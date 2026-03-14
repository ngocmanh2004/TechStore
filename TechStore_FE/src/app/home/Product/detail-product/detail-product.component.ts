import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../Service/productService';
import { ReviewService } from '../../../Service/review-service';
import { userService } from '../../../Service/userService';
import { CartService, CartItem } from '../../../Service/cart.service';
import { OrderService } from '../../../Service/order-service';
import { OrderDetailService } from '../../../Service/order-detail-service';
import { Product } from '../../../Models/product';
import { Reviews } from '../../../Models/reviews';
import { Order } from '../../../Models/order';
import { NgForm } from '@angular/forms';
import { Location, isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';

declare var bootstrap: any;

// SỬ DỤNG LINK REMOTE trong image_url và PathAnh
const MOCK_PRODUCTS_DETAIL: { [key: number]: Product } = {
    1: { product_id: 1, product_name: 'iPhone 15 Pro Max', price: 21000000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg', description: 'Chip A17 Pro, camera 48MP, thiết kế Titanium', brand_id: 101, quantity: 1, PathAnh: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg' },
    2: { product_id: 2, product_name: 'Samsung Galaxy S23 Ultra', price: 19000000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/249948/samsung-galaxy-s23-ultra-thumb-hong-600x600.jpg', description: 'Màn hình Dynamic AMOLED 2X, bút S Pen', brand_id: 102, quantity: 1, PathAnh: 'https://cdn.tgdd.vn/Products/Images/42/249948/samsung-galaxy-s23-ultra-thumb-hong-600x600.jpg' },
    3: { product_id: 3, product_name: 'Dell XPS 13', price: 20000000, category_id: 2, image_url: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327907/dell-xps-13-9340-ultra-7-hxrgt-638763566656439373-600x600.jpg', description: 'Ultrabook cao cấp, InfinityEdge', brand_id: 201, quantity: 1, PathAnh: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327907/dell-xps-13-9340-ultra-7-hxrgt-638763566656439373-600x600.jpg' },
    4: { product_id: 4, product_name: 'HP Pavilion 14', price: 9990000, category_id: 2, image_url: 'https://ttcenter.com.vn/uploads/product/8xe1vdsl-588-hp-pavilion-14-dv2075tu-core-i5-1235u-ram-8gb-ssd-512gb-14-fhd-new.png', description: 'Laptop văn phòng, hiệu năng ổn', brand_id: 202, quantity: 1, PathAnh: 'https://ttcenter.com.vn/uploads/product/8xe1vdsl-588-hp-pavilion-14-dv2075tu-core-i5-1235u-ram-8gb-ssd-512gb-14-fhd-new.png' },
    5: { product_id: 5, product_name: 'iPad Pro 12.9"', price: 12999000, category_id: 3, image_url: 'https://cdn.tgdd.vn/Products/Images/522/294105/ipad-pro-m2-12.5-wifi-bac-thumb-600x600.jpg', description: 'Chip M2, Liquid Retina XDR', brand_id: 101, quantity: 1, PathAnh: 'https://cdn.tgdd.vn/Products/Images/522/294105/ipad-pro-m2-12.5-wifi-bac-thumb-600x600.jpg' },
    6: { product_id: 6, product_name: 'Apple AirPods Pro 2', price: 5990000, category_id: 4, image_url: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-airpods-pro-2-usb-c_1_.png', description: 'Chống ồn chủ động, USB-C', brand_id: 101, quantity: 1, PathAnh: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-airpods-pro-2-usb-c_1_.png' },
    7: { product_id: 7, product_name: 'Xiaomi Redmi Note 12', price: 5590000, category_id: 1, image_url: 'https://cdn.tgdd.vn/Products/Images/42/303298/xiaomi-redmi-note-12-vang-1-thumb-momo-600x600.jpg', description: 'Màn AMOLED 120Hz, pin 5000mAh', brand_id: 103, quantity: 1, PathAnh: 'https://cdn.tgdd.vn/Products/Images/42/303298/xiaomi-redmi-note-12-vang-1-thumb-momo-600x600.jpg' },
};

const MOCK_REVIEWS: Reviews[] = [
    { id: 1, product_id: 1, user_id: 101, content: 'Sản phẩm tuyệt vời, giao hàng nhanh!', rating: 5, create_at: new Date(2025, 10, 15), username: 'User101' },
    { id: 2, product_id: 1, user_id: 102, content: 'Giá hơi cao nhưng đáng tiền.', rating: 4, create_at: new Date(2025, 10, 16), username: 'User102' },
    { id: 3, product_id: 4, user_id: 103, content: 'Laptop ổn định cho sinh viên.', rating: 5, create_at: new Date(2025, 11, 1), username: 'User103' },
];

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css'],
})
export class DetailProductComponent implements OnInit {
  product!: Product;
  reviews: Reviews[] = [];
  newReview: string = '';
  rating: number = 0;
  contenReview: string = '';
  ratingReview: number = 0;
  selectedReview: Reviews | null = null;
  product_id!: number;
  currentUserId: number | null = null;
  isAdmin: boolean = false;
  dangThemSua: boolean = false;
  selectedItem: any = null;
  number_of_products: number = 1;
  showSuccessMessage: boolean = false;
  isBanking: boolean = false;
  bankInfo: string | null = null;
  transferInstructions: string | null = null;
  qrCodeUrl: string = 'assets/img/maQR2.jpg';
  errorMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    public userService: userService,
    private cartService: CartService,
    private orderService: OrderService,
    private orderDetailService: OrderDetailService,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const id = Number(this.route.snapshot.paramMap.get('product_id'));
    this.product_id = id;
    this.loadProduct_Mock(id);
    this.loadReviews_Mock(id);

    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.currentUserId = currentUser.user_id;
      this.isAdmin = currentUser.role_id === 1;
    }

    this.userService.getCurrentUserObservable().subscribe((user) => {
      if (user) {
        this.currentUserId = user.user_id;
        this.isAdmin = user.role_id === 1;
      } else {
        this.currentUserId = null;
        this.isAdmin = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  loadProduct_Mock(id: number) {
    const data = MOCK_PRODUCTS_DETAIL[id]; 
    if (data) {
        this.product = data;
        // SỬA: Gán PathAnh bằng link remote (image_url)
        this.product.PathAnh = data.image_url;
    } else {
        console.error(`Không tìm thấy sản phẩm mockup với ID: ${id}`);
        // Fallback: Nếu không tìm thấy ID, hiển thị sản phẩm ID 1
        this.product = MOCK_PRODUCTS_DETAIL[1];
        this.product_id = 1; 
    }
  }

  loadReviews_Mock(productId: number) {
    const mockData = MOCK_REVIEWS.filter(r => r.product_id === productId); 
    this.reviews = mockData;
  }

  loadProduct(id: number) {
    this.loadProduct_Mock(id);
  }

  loadReviews(productId: number) {
    this.loadReviews_Mock(productId);
  }

  submitReview() {
    if (!this.newReview.trim() || this.rating === 0) {
      alert('Vui lòng nhập nội dung và chọn số sao.');
      return;
    }

    if (!this.currentUserId) {
      alert('Vui lòng đăng nhập để đánh giá.');
      this.router.navigate(['/home/login']);
      return;
    }

    alert('Mockup: Gửi đánh giá thành công! (Không lưu vào BE)');
    this.newReview = '';
    this.rating = 0;
    this.loadReviews(this.product_id);
  }

  editReview(review: Reviews) {
    this.selectedReview = review;
    this.contenReview = review.content;
    this.ratingReview = review.rating;
  }

  suaReview() {
    if (!this.selectedReview) {
      alert('Không có đánh giá để sửa.');
      return;
    }

    alert('Mockup: Cập nhật đánh giá thành công! (Không lưu vào BE)');
    this.loadReviews(this.product_id);
    this.selectedReview = null;
    this.contenReview = '';
    this.ratingReview = 0;
  }

  deleteReview(reviewId: number) {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    alert(`Mockup: Xóa đánh giá ID ${reviewId} thành công! (Không gọi BE)`);
    this.loadReviews(this.product_id);
  }

  addToCart() {
    if (!this.currentUserId) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      this.router.navigate(['/home/login']);
      return;
    }

    if (!this.product?.product_id) {
      alert('Không tìm thấy sản phẩm.');
      return;
    }

    alert('🛒 Mockup: Đã thêm vào giỏ hàng! (Không gọi BE)');
  }

  themDon() {
    if (!this.currentUserId) {
      alert('Vui lòng đăng nhập để tiếp tục đặt hàng.');
      this.router.navigate(['/home/login']);
      return;
    }

    if (!this.product) {
      alert('Sản phẩm không tồn tại.');
      return;
    }

    this.selectedItem = {
      product: this.product,
      quantity: this.number_of_products,
      PathAnh: this.product.PathAnh,
      price: this.product.price,
      total_amount: this.product.price * this.number_of_products,
    };
    this.dangThemSua = true;
  }

  muaNgay(paymentForm: NgForm) {
    if (!paymentForm.valid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin hợp lệ!';
      return;
    }

    const formValue = paymentForm.value;
    this.isBanking = formValue.payment === 'Banking';
    const orderStatus = this.isBanking ? 'Chờ xác nhận' : 'Đang xử lý';

    console.log('Mock Order Data:', { ...formValue, total: this.selectedItem.total_amount });
    
    this.showSuccessMessage = true;
    setTimeout(() => {
      if (this.isBanking) {
        this.bankInfo =
          'Ngân hàng: MBbank\nSố tài khoản: 0337431736\nChủ tài khoản: Nguyễn Đặng Thành Huy';
        this.transferInstructions = `Vui lòng quét mã QR, nhập ${this.selectedItem.total_amount.toLocaleString(
          'vi-VN'
        )} VNĐ, nội dung "DH123" (Mock ID) trong 24h.`;
        this.showSuccessMessage = false;
      } else {
        alert('Đặt hàng (COD) thành công! Sẽ chuyển đến Lịch sử mua hàng (Mockup).');
        this.closeModal();
      }
    }, 2000);
  }

  dong() {
    this.dangThemSua = false;
    this.selectedItem = null;
    this.number_of_products = 1;
    this.showSuccessMessage = false;
    this.isBanking = false;
    this.bankInfo = null;
    this.transferInstructions = null;
    this.errorMessage = null;
    this.closeModal();
  }

  closeModal() {
    const modal = document.getElementById('exampleModal');
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) bootstrapModal.hide();
  }

  confirmTransfer() {
    this.closeModal();
    this.router.navigate([`/home/user/viewOH/${this.currentUserId}`]);
  }
}