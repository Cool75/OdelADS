import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    title: "END OF SEASON",
    subtitle: "SALE",
    discount: "30%",
    bg: "bg-gradient-to-br from-orange-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "NEW ARRIVALS",
    subtitle: "COLLECTION",
    discount: "40%",
    bg: "bg-gradient-to-br from-orange-600 to-red-500",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "SUMMER STYLE",
    subtitle: "FASHION",
    discount: "25%",
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop"
  }
];

const brands = [
  { name: "Levi's", logo: "LEVI'S" },
  { name: "US Polo", logo: "U.S. POLO ASSN." },
  { name: "Armani", logo: "A|X" },
  { name: "Cotton", logo: "cotton COLLECTION" },
  { name: "Calvin Klein", logo: "Calvin Klein" },
];

const products = [
  { id: 1, name: "Calvin Klein Men's Relaxed T-Shirt", price: 15015, oldPrice: 19990, discount: 30, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop" },
  { id: 2, name: "Us Polo Brand Embossed Twill Cap", price: 5565, oldPrice: 7950, discount: 30, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop" },
  { id: 3, name: "Us Polo Mid Rise Regular Fit Trousers", price: 10485, oldPrice: 14950, discount: 30, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&auto=format&fit=crop" },
  { id: 4, name: "Us Polo Austin Trim Fit Stretch Trousers", price: 10115, oldPrice: 14450, discount: 30, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&auto=format&fit=crop" },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [brandOffset, setBrandOffset] = useState(0);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollBrands = (direction: 'left' | 'right') => {
    setBrandOffset(prev => direction === 'left' ? Math.min(prev + 1, 0) : Math.max(prev - 1, -(brands.length - 4)));
  };

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col font-sans">
      <header className="bg-zinc-950 text-white py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-full px-2 py-1.5">
            <div className="flex items-center gap-2 px-3">
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-sm font-semibold">ODEL</span>
            </div>
            <nav className="hidden md:flex items-center">
              <button className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Features</button>
              <button className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Pricing</button>
              <button className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Docs</button>
              <button className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Blog</button>
            </nav>
            <div className="flex items-center gap-1 pl-2">
              <button onClick={handleLogin} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                Sign In
              </button>
              <Button 
                onClick={handleLogin} 
                size="sm"
                className="rounded-full bg-white text-black hover:bg-zinc-200 font-medium px-4"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-4 p-4 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {slides.map((slide, index) => (
              index === currentSlide && (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className={`${slide.bg} rounded-lg p-8 min-h-[300px] md:min-h-[400px] flex flex-col justify-center relative overflow-hidden`}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1/2">
                    <img src={slide.image} alt="" className="h-full w-full object-cover opacity-40" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-white/80 text-sm font-medium mb-2">{slide.title}</p>
                    <h2 className="text-white text-6xl md:text-8xl font-bold tracking-tight">
                      {slide.subtitle}<br/>
                      <span className="text-7xl md:text-9xl">{slide.discount}</span>
                    </h2>
                    <p className="text-white/60 text-xs mt-4">T&C APPLY</p>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
          
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-8 min-h-[300px] md:min-h-[400px] flex flex-col justify-center relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 bottom-0 w-1/2">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop" alt="" className="h-full w-full object-cover opacity-40" />
            </div>
            <div className="relative z-10 text-right">
              <p className="text-white/80 text-sm font-medium mb-2">END OF SEASON</p>
              <h2 className="text-white text-6xl md:text-8xl font-bold tracking-tight">
                SALE<br/>
                <span className="text-7xl md:text-9xl">40%</span>
              </h2>
              <p className="text-white/60 text-xs mt-4">T&C APPLY</p>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-orange-500 w-6' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </section>

      <section className="py-8 bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-white font-bold text-sm mb-6">SHOP BY BRAND</h3>
          <div className="relative">
            <button 
              onClick={() => scrollBrands('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            
            <div className="overflow-hidden mx-10">
              <motion.div 
                className="flex gap-4"
                animate={{ x: brandOffset * 220 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {brands.map((brand, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="min-w-[200px] bg-white rounded-lg p-6 flex items-center justify-center h-24 cursor-pointer"
                  >
                    <span className="text-xl font-bold text-gray-800">{brand.logo}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <button 
              onClick={() => scrollBrands('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">All Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {product.discount}%
                </span>
                <button className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
                </button>
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">LKR {product.price.toLocaleString()}</span>
                <span className="text-sm text-gray-400 line-through">LKR {product.oldPrice.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="bg-zinc-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Return & Refund</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Service Payment</li>
                <li className="hover:text-white cursor-pointer transition-colors">Store Locator</li>
                <li className="hover:text-white cursor-pointer transition-colors">CRM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Get To Know Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Investor Information</li>
                <li className="hover:text-white cursor-pointer transition-colors">Odel Magazine</li>
              </ul>
              <div className="flex gap-3 mt-4">
                <Facebook className="h-8 w-8 p-1.5 bg-zinc-700 rounded-full cursor-pointer hover:bg-zinc-600 transition-colors" />
                <Twitter className="h-8 w-8 p-1.5 bg-zinc-700 rounded-full cursor-pointer hover:bg-zinc-600 transition-colors" />
                <Instagram className="h-8 w-8 p-1.5 bg-zinc-700 rounded-full cursor-pointer hover:bg-zinc-600 transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Let Us Help You</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">My Account</li>
                <li className="hover:text-white cursor-pointer transition-colors">My Orders</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms Of Use</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Sign up for Newsletter</h4>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter your email address" 
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                />
              </div>
              <Button className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white">
                Subscribe
              </Button>
            </div>
          </div>
          
          <div className="border-t border-zinc-800 pt-8">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-400 mb-4">Shop At Our Group Companies</p>
              <div className="flex justify-center gap-8 items-center">
                <span className="text-lg font-bold">mysoftlogic.lk</span>
                <span className="text-xl font-bold">GLOMARK</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-10 h-6 bg-red-600 rounded"></div>
              <div className="w-10 h-6 bg-blue-600 rounded"></div>
              <div className="w-10 h-6 bg-orange-500 rounded"></div>
            </div>
            <p className="text-center text-xs text-gray-500">
              Copyright ©{new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
