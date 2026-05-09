import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface BannerSlide {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaLink: string;
  image: string;
  accent: string;
  dots: { size: string; top: string; left: string; color: string }[];
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
})
export class BannerComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  isAnimating = false;
  private interval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  slides: BannerSlide[] = [
    {
      badge: '🎧 Music is Classic',
      title: 'Sequoia Inspiring Musico.',
      subtitle: 'Clear Sounds',
      description: 'Making your dream music come true, stay with Sequios Sounds!',
      cta: 'View All Products',
      ctaLink: '#',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      accent: '#c8f135',
      dots: [
        { size: 'w-3 h-3', top: '15%', left: '55%', color: '#94a3b8' },
        { size: 'w-5 h-5', top: '10%', left: '85%', color: '#1e40af' },
        { size: 'w-4 h-4', top: '55%', left: '92%', color: '#1e3a8a' },
        { size: 'w-2.5 h-2.5', top: '80%', left: '78%', color: '#475569' },
        { size: 'w-6 h-6', top: '72%', left: '58%', color: '#1d4ed8' },
      ],
    },
    {
      badge: '📸 Capture Everything',
      title: 'Visions Beyond the Frame.',
      subtitle: 'Ultra Clarity',
      description: 'Precision-engineered lenses for photographers who refuse to compromise.',
      cta: 'Explore Cameras',
      ctaLink: '#',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      accent: '#fb923c',
      dots: [
        { size: 'w-4 h-4', top: '12%', left: '60%', color: '#f97316' },
        { size: 'w-3 h-3', top: '20%', left: '88%', color: '#9a3412' },
        { size: 'w-5 h-5', top: '65%', left: '90%', color: '#ea580c' },
        { size: 'w-2 h-2', top: '78%', left: '62%', color: '#78716c' },
        { size: 'w-4 h-4', top: '50%', left: '95%', color: '#c2410c' },
      ],
    },
    {
      badge: '⌚ Smart Living',
      title: 'Time Wears a New Face.',
      subtitle: 'Stay Connected',
      description: 'Track your health, your day, your world — all from your wrist.',
      cta: 'Shop Wearables',
      ctaLink: '#',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      accent: '#34d399',
      dots: [
        { size: 'w-3 h-3', top: '18%', left: '58%', color: '#6ee7b7' },
        { size: 'w-5 h-5', top: '8%', left: '82%', color: '#065f46' },
        { size: 'w-4 h-4', top: '60%', left: '93%', color: '#059669' },
        { size: 'w-2 h-2', top: '82%', left: '70%', color: '#94a3b8' },
        { size: 'w-6 h-6', top: '75%', left: '55%', color: '#10b981' },
      ],
    },
  ];

  get current(): BannerSlide {
    return this.slides[this.currentIndex];
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.interval = setInterval(() => this.next(), 4500);
  }

  stopAutoplay(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  goTo(index: number): void {
    if (index === this.currentIndex || this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex = index;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => (this.isAnimating = false), 500);
    }
    this.stopAutoplay();
    this.startAutoplay();
  }

  next(): void {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.isAnimating = true;
    this.currentIndex = nextIndex;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => (this.isAnimating = false), 500);
    }
  }

  prev(): void {
    this.goTo((this.currentIndex - 1 + this.slides.length) % this.slides.length);
  }
}