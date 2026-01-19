import { Link } from 'react-router-dom';
import { Gift, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-custom py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand - BEAUTIFUL ROUND LOGO */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {/* Round Logo with Fallback */}
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-xl ring-2 ring-white/20 hover:ring-orange-400/50 transition-all duration-300 overflow-hidden bg-white">
                <img
                  src="/chinggizz-logo.png"
                  alt="Chinggizz Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback: Show beautiful gradient with Gift icon if image not found
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-teal-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7 sm:w-8 sm:h-8"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg></div>';
                  }}
                />
              </div>
              <span className="text-xl font-bold text-white">Chinggizz</span>
            </div>
            <p className="text-sm text-neutral-400 mb-4">
              Creating unforgettable gift experiences with personalized touches and premium quality.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-primary-400 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/hamper-builder" className="text-sm hover:text-primary-400 transition-colors">Build Hamper</Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-sm hover:text-primary-400 transition-colors">Admin</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">Customized Gifts</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">Edible Items</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">Hamper Boxes</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">Predefined Hampers</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">info@chinggizz.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">+91 70128 97008</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 Gift Street, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-neutral-400 px-4">
            © {currentYear} Chinggizz. All rights reserved. | Made with <span className="text-secondary-500">❤</span> for special moments
          </p>
        </div>
      </div>
    </footer>
  );
}

