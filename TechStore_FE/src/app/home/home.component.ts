import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../Service/productService';
import { ActivatedRoute } from '@angular/router';
import { categoryService } from '../Service/categoryService';
import { Product } from '../Models/product';
import { Categories } from '../Models/categories';
import { userService } from '../Service/userService';
import { isPlatformBrowser } from '@angular/common';
import { filter, Subscription } from 'rxjs';

declare var bootstrap: any;

const MOCK_CATEGORIES: Categories[] = [
  { category_id: 1, category_name: 'Điện Thoại' },
  { category_id: 2, category_name: 'Laptop' },
  { category_id: 3, category_name: 'Máy Tính Bảng' },
  { category_id: 4, category_name: 'Phụ Kiện' },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  searchText: string = '';
  products: Product[] = [];
  DsDM: Categories[] = [];
  user_id: number | undefined;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  showMap: boolean = false;
  storeAddress: string = '138 Cần Vương, Nguyễn Văn Cừ, Quy Nhơn, Bình Định';

  banners: string[] = [
    'assets/img/slide1.jpg',
    'assets/img/slide2.jpg',
    'assets/img/slide3.jpg',
  ];
  currentSlide = 0;
  intervalId: any;
  isMobileMenuOpen = false;
  isLandingRoute = true;
  private routeSubscription?: Subscription;

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryService: categoryService,
    public userService: userService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.DsDanhMucSp();
    this.syncLandingRoute();

    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }

    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isMobileMenuOpen = false;
        this.syncLandingRoute();
      });

    this.userService.authenticated$.subscribe((status) => {
      this.isLoggedIn = status;
      this.checkIfAdmin();
    });

    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('userId');
      if (storedUser) {
        this.userService.setAuthenticated(true);
        this.checkIfAdmin();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.routeSubscription?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  private syncLandingRoute(): void {
    const currentUrl = this.router.url;
    this.isLandingRoute =
      currentUrl.includes('/home/list') ||
      currentUrl === '/home' ||
      currentUrl === '/home/';
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.banners.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.banners.length) % this.banners.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  DsDanhMucSp() {
    this.DsDM = MOCK_CATEGORIES;
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  timkiem() {
    if (this.searchText.trim()) {
      this.router.navigate(['/home/product/search'], {
        queryParams: { search: this.searchText },
      });
    } else {
      alert('Vui lòng nhập từ khóa tìm kiếm!');
    }
  }

  checkIfAdmin() {
    const currentUser = this.userService.getCurrentUser();
    this.isAdmin = currentUser?.role_id === 1;
  }

  openMapModal() {
    this.showMap = true;
    const modal = document.getElementById('mapModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  closeMapModal() {
    this.showMap = false;
    const modal = document.getElementById('mapModal');
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  }
}