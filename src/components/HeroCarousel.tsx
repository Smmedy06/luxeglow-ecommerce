'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSlide {
  id: number;
  subtitle: string;
  title: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
  primaryButtonLink: string;
  secondaryButtonLink: string;
  image?: string;
  stats: {
    number: string;
    label: string;
  }[];
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    subtitle: "BESTSELLER COLLECTION",
    title: "Vitamin C Radiance",
    description: "Brighten and even your skin tone with our award-winning vitamin C serums and creams.",
    primaryButton: "Discover More",
    secondaryButton: "Learn More",
    primaryButtonLink: "/shop?filter=bestsellers",
    secondaryButtonLink: "/about",
    image: "/images/hero-img1.webp",
    stats: [
      { number: "500+", label: "Happy Clients" },
      { number: "100%", label: "Natural" }
    ]
  },
  {
    id: 2,
    subtitle: "PREMIUM AESTHETICS",
    title: "Professional Treatments",
    description: "Advanced dermal fillers and anti-wrinkle treatments for natural-looking results.",
    primaryButton: "View Treatments",
    secondaryButton: "Book Consultation",
    primaryButtonLink: "/shop?filter=treatments",
    secondaryButtonLink: "/contact",
    image: "/images/hero img 2.jpeg",
    stats: [
      { number: "10+", label: "Years Experience" },
      { number: "98%", label: "Satisfaction" }
    ]
  },
  {
    id: 3,
    subtitle: "CLEAN BEAUTY",
    title: "Science-Backed Skincare",
    description: "Formulated with clinically-proven ingredients for radiant, healthy skin.",
    primaryButton: "Shop Collection",
    secondaryButton: "Our Story",
    primaryButtonLink: "/shop",
    secondaryButtonLink: "/about",
    image: "/images/hero-img3.webp",
    stats: [
      { number: "50+", label: "Products" },
      { number: "0%", label: "Harmful Chemicals" }
    ]
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative bg-[#f8f7f5] min-h-[600px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider">
                {currentSlideData.subtitle}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2c2520] leading-tight">
                {currentSlideData.title}
              </h1>
              <p className="text-lg text-[#6b5d52] leading-relaxed max-w-lg">
                {currentSlideData.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={currentSlideData.primaryButtonLink}
                className="bg-[#2c2520] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1a1612] transition-colors text-center"
              >
                {currentSlideData.primaryButton}
              </Link>
              <Link
                href={currentSlideData.secondaryButtonLink}
                className="border-2 border-[#2c2520] text-[#2c2520] px-8 py-3 rounded-lg font-medium hover:bg-[#2c2520] hover:text-white transition-colors text-center"
              >
                {currentSlideData.secondaryButton}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {currentSlideData.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-[#2c2520]">
                    {stat.number}
                  </div>
                  <div className="text-sm text-[#6b5d52]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            {currentSlideData.image ? (
              <div className="relative rounded-lg h-96 lg:h-[500px] overflow-hidden">
                <Image
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={currentSlide === 0}
                />
              </div>
            ) : (
              <div className="bg-gray-300 rounded-lg h-96 lg:h-[500px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">Hero Image {currentSlide + 1}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#6b5d52] p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#6b5d52] p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 h-2 bg-[#ba9157] rounded-full'
                : 'w-2 h-2 bg-white/60 hover:bg-white/80 rounded-full'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
