/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProperties from './components/FeaturedProperties';
import About from './components/About';
import PropertyShowcase from './components/PropertyShowcase';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import VideoSection from './components/VideoSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import {
  BookingModal,
  PropertyDetailModal,
  SearchOverlayModal,
  VideoLightboxModal,
} from './components/Modals';
import type { PropertyItem } from './data/properties';

export default function App() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(
    null
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [bookingState, setBookingState] = useState<{
    isOpen: boolean;
    propertyId?: string;
  }>({ isOpen: false });

  const handleOpenBooking = (propertyId?: string) => {
    setBookingState({ isOpen: true, propertyId });
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4A95F] selection:text-black">
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenBooking={() => handleOpenBooking()}
        />

        <main>
          <Hero
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            onOpenBooking={(propId) => handleOpenBooking(propId)}
          />
          <FeaturedProperties
            onSelectProperty={(prop) => setSelectedProperty(prop)}
          />
          <About onOpenBooking={() => handleOpenBooking()} />
          <PropertyShowcase
            onSelectProperty={(prop) => setSelectedProperty(prop)}
          />
          <Services onOpenBooking={() => handleOpenBooking()} />
          <Testimonials />
          <VideoSection onOpenVideo={() => setIsVideoOpen(true)} />
          <Contact />
        </main>

        <Footer
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Interactive Overlays & Modals */}
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onRequestViewing={(propId) => handleOpenBooking(propId)}
        />

        <VideoLightboxModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />

        <SearchOverlayModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
        />

        <BookingModal
          isOpen={bookingState.isOpen}
          preselectedPropertyId={bookingState.propertyId}
          onClose={() => setBookingState({ isOpen: false })}
        />
      </div>
    </SmoothScroll>
  );
}
