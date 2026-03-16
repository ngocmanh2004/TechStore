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
  storeAddress: string = '138 Cáº§n VÆ°Æ¡ng, Nguyá»…n VÄƒn Cá»«, Quy NhÆ¡n, BÃ¬nh Äá»‹nh';

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
    this.categoryService.getCategory().subscribe({
      next: (data: Categories[]) => {
        this.DsDM = data ?? [];
      },
      error: () => {
        this.DsDM = [];
      }
    });
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
      alert('Vui lÃ²ng nháº­p tá»« khÃ³a tÃ¬m kiáº¿m!');
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

  /** Maps a category name keyword to a Font Awesome icon class */
  getCategoryIcon(categoryName: string): string {
    const n = (categoryName ?? '').toLowerCase();
    if (n.includes('laptop') || n.includes('x\u00e1ch tay')) return 'fa fa-laptop';
    if (n.includes('\u0111i\u1ec7n tho\u1ea1i') || n.includes('di \u0111\u1ed9ng') || n.includes('phone')) return 'fa fa-mobile-alt';
    if (n.includes('tablet') || n.includes('b\u1ea3ng') || n.includes('ipad')) return 'fa fa-tablet-alt';
    if (n.includes('tai nghe') || n.includes('headphone')) return 'fa fa-headphones';
    if (n.includes('m\u00e0n h\u00ecnh') || n.includes('monitor')) return 'fa fa-desktop';
    if (n.includes('m\u00e1y t\u00ednh') || n.includes('desktop') || n.includes('pc')) return 'fa fa-desktop';
    if (n.includes('camera') || n.includes('m\u00e1y \u1ea3nh')) return 'fa fa-camera';
    if (n.includes('ph\u1ee5 ki\u1ec7n') || n.includes('accessory')) return 'fa fa-plug';
    if (n.includes('\u0111\u1ed3ng h\u1ed3') || n.includes('watch')) return 'fa fa-clock';
    if (n.includes('loa') || n.includes('speaker')) return 'fa fa-volume-up';
    return 'fa fa-microchip';
  }
}