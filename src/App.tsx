import { useState, useEffect, useRef, FormEvent } from 'react';
import { ShoppingCart, Phone, MessageCircle, X, Plus, Minus, Menu, Instagram, Facebook, Star, ArrowUpRight, ArrowRight, Sparkles, ShoppingBag, Heart, ShieldCheck, Truck, Award, Send, User } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { PRODUCTS, Product, CartItem } from './types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("सर्व");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const CONTACT_NUMBER = "9403130281";
  
  const getWhatsAppUrl = (items: CartItem[] = cart, singleItem?: Product) => {
    const baseUrl = `https://wa.me/91${CONTACT_NUMBER}`;
    
    let message = "";
    
    if (singleItem) {
      message = `नमस्कार राधा पैठणी, मला ही साडी आवडली आहे आणि मला ती खरेदी करायची आहे:\n\n🛍️ *${singleItem.name}*\n• श्रेणी: ${singleItem.category}\n• किंमत: ₹${singleItem.price.toLocaleString('en-IN')}\n\n`;
      if (customerName) message += `👤 *ग्राहक:* ${customerName}\n`;
      if (customerEmail) message += `📧 *ईमेल:* ${customerEmail}\n`;
      if (customerAddress) message += `📍 *पत्ता:* ${customerAddress}\n\n`;
      message += `कृपया मला अधिक माहिती द्या. धन्यवाद!`;
      return `${baseUrl}?text=${encodeURIComponent(message)}`;
    }

    if (items.length === 0) {
      return `${baseUrl}?text=${encodeURIComponent("नमस्कार राधा पैठणी, मला तुमच्या साडी कलेक्शनमध्ये रस आहे. कृपया मला अधिक माहिती द्या.")}`;
    }

    message = "नमस्कार राधा पैठणी, मला खालील साड्यांची ऑर्डर द्यायची आहे:\n\n";
    items.forEach((item, index) => {
      message += `🛍️ *${index + 1}. ${item.name}*\n`;
      message += `   • श्रेणी: ${item.category}\n`;
      message += `   • किंमत: ₹${item.price.toLocaleString('en-IN')}\n`;
      message += `   • प्रमाण: ${item.quantity}\n`;
      message += `   • एकूण: ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n\n`;
    });
    
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `💰 *एकूण ऑर्डर मूल्य: ₹${total.toLocaleString('en-IN')}*\n\n`;
    
    if (customerName) message += `👤 *ग्राहक:* ${customerName}\n`;
    if (customerEmail) message += `📧 *ईमेल:* ${customerEmail}\n`;
    if (customerAddress) message += `📍 *पत्ता:* ${customerAddress}\n\n`;
    
    message += `कृपया माझी ऑर्डर कन्फर्म करा आणि पेमेंटची माहिती द्या. धन्यवाद!`;

    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  };

  const TAGLINES = [
    "✨ राधा पैठणी – परंपरेचं सौंदर्य, प्रत्येक घडीत!",
    "🌸 राधा पैठणी – मराठमोळ्या संस्कृतीची ओळख!",
    "👑 राधा पैठणी – प्रत्येक साडीत राजेशाही झळाळी!",
    "💃 राधा पैठणी – खास क्षणांसाठी खास निवड!",
    "🌺 राधा पैठणी – परंपरा, प्रेम आणि सौंदर्याचा संगम!",
    "✨ राधा पैठणी – घाला आणि उजळवा तुमचा प्रत्येक दिवस!",
    "👗 राधा पैठणी – प्रत्येक धाग्यात मराठी अभिमान!",
    "💫 राधा पैठणी – साडीतून बोलणारं सौंदर्य!"
  ];

  const TESTIMONIALS = [
    { name: "स्नेहल पाटील", text: "साडीचा रंग आणि पोत अगदी फोटोत दिसतो तसाच आहे. खूपच सुंदर!", location: "पुणे", image: "https://picsum.photos/seed/user1/100/100" },
    { name: "प्रिया कुलकर्णी", text: "येवल्याची अस्सल पैठणी आता घरबसल्या मिळाली. पॅकेजिंग आणि डिलिव्हरी उत्तम!", location: "मुंबई", image: "https://picsum.photos/seed/user2/100/100" },
    { name: "अश्विनी देशपांडे", text: "लग्नासाठी घेतलेली पैठणी सर्वांना खूप आवडली. धन्यवाद राधा पैठणी!", location: "नाशिक", image: "https://picsum.photos/seed/user3/100/100" }
  ];

  const STYLING_TIPS = [
    { title: "दागिन्यांची निवड", text: "पैठणीवर पारंपारिक ठुशी किंवा कोल्हापुरी साज अतिशय उठून दिसतो.", icon: "💍" },
    { title: "केशरचना", text: "अंबाडा आणि त्यावर माळलेला मोगऱ्याचा गजरा पैठणीचा लूक पूर्ण करतो.", icon: "🌸" },
    { title: "मेकअप", text: "कपाळावर चंद्रकोर आणि नाकात नथ यामुळे राजेशाही थाट येतो.", icon: "✨" }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    const taglineInterval = setInterval(() => {
      setTaglineIndex(prev => (prev + 1) % TAGLINES.length);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(taglineInterval);
    };
  }, []);

  const CATEGORIES = [
    { title: "येवला पैठणी", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800", size: "large" },
    { title: "शुद्ध रेशीम", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800", size: "small" },
    { title: "लग्नासाठी", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800", size: "small" },
    { title: "पेशवाई", image: "https://images.unsplash.com/photo-1610030469668-935142b96fe4?auto=format&fit=crop&q=80&w=800", size: "medium" },
    { title: "डिझायनर", image: "https://images.unsplash.com/photo-1610030469613-255d49f05955?auto=format&fit=crop&q=80&w=800", size: "medium" }
  ];

  useEffect(() => {
    if (isCartOpen || isMenuOpen || isOrderPlaced) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (!isCartOpen) setShowCheckoutForm(false);
    }
  }, [isCartOpen, isMenuOpen, isOrderPlaced]);

  const addToCart = (product: Product) => {
    console.log('Adding to cart:', product);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = selectedCategory === "सर्व" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const allCategories = ["सर्व", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const handleInquiry = () => {
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) {
      alert("कृपया सर्व माहिती भरा.");
      return;
    }
    const baseUrl = `https://wa.me/91${CONTACT_NUMBER}`;
    const message = `नमस्कार राधा पैठणी, मला एक चौकशी करायची आहे:\n\n👤 *नाव:* ${inquiryName}\n📧 *ईमेल:* ${inquiryEmail}\n💬 *संदेश:* ${inquiryMessage}\n\nधन्यवाद!`;
    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, '_blank');
    setInquiryName("");
    setInquiryEmail("");
    setInquiryMessage("");
  };

  const handleCheckout = () => {
    if (!showCheckoutForm) {
      setShowCheckoutForm(true);
      return;
    }
    
    if (!customerName.trim() || !customerAddress.trim()) {
      alert("कृपया आपले नाव आणि पत्ता भरा.");
      return;
    }

    const url = getWhatsAppUrl(cart);
    window.open(url, '_blank');
    setIsOrderPlaced(true);
    setCart([]);
    setIsCartOpen(false);
    setShowCheckoutForm(false);
  };

  return (
    <div className="min-h-screen selection:bg-brand-gold selection:text-white overflow-x-hidden">
      {/* Custom Cursor */}
      <div 
        className="hidden lg:block custom-cursor"
        style={{ 
          left: cursorPos.x - 10, 
          top: cursorPos.y - 10,
          transform: `scale(${isHovering ? 2.5 : 1})`,
          backgroundColor: isHovering ? 'rgba(197, 160, 89, 0.1)' : 'transparent'
        }}
      />
      <div 
        className="hidden lg:block custom-cursor-dot"
        style={{ left: cursorPos.x - 2, top: cursorPos.y - 2 }}
      />

      {/* Floating WhatsApp FAB */}
      <motion.div
        className="fixed bottom-8 right-8 z-[60] flex flex-col gap-4"
      >
        <motion.a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group relative"
        >
          <MessageCircle size={28} />
          <span className="absolute right-full mr-4 bg-[#25D366] text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            संपर्क करा
          </span>
        </motion.a>
      </motion.div>

      {/* Paithani Top Border */}
      <div className="h-4 w-full paithani-border fixed top-0 z-[70]" />

      {/* Top Banner */}
      <div className="bg-brand-maroon text-white py-2 overflow-hidden z-[60] relative mt-4">
        <motion.div 
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap text-[10px] uppercase tracking-[0.3em] font-bold"
        >
          ✨ नवीन कलेक्शनवर १०% सूट! कोड: RADHA10 ✨ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
          🌸 मोफत डिलिव्हरी ₹५००० पेक्षा जास्त खरेदीवर! 🌸 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          👑 येवल्याची अस्सल पैठणी - राधा पैठणी 👑
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors">
              <Menu className={scrolled ? 'text-brand-maroon' : 'text-white'} />
            </button>
            <h1 className={`text-2xl sm:text-3xl md:text-5xl font-yatra tracking-wider transition-colors duration-500 ${scrolled ? 'text-brand-maroon' : 'text-white'}`}>
              <span className={scrolled ? '' : 'shimmer-text'}>राधा पैठणी</span>
            </h1>
          </div>

          <div className="hidden lg:flex gap-10 font-medium">
            {[
              { name: 'संग्रह', link: '#collection' },
              { name: 'आमच्याबद्दल', link: '#about' },
              { name: 'संपर्क', link: '#contact' }
            ].map(item => (
              <a 
                key={item.name} 
                href={item.link} 
                className={`relative group text-sm uppercase tracking-widest transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-full transition-all duration-300 ${scrolled ? 'bg-brand-maroon/5 text-brand-maroon hover:bg-brand-maroon/10' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <ShoppingCart size={22} className={cartCount > 0 ? 'cart-bounce' : ''} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-plum">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-brand-plum/40 via-transparent to-brand-plum/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1610030469915-03077f229521?auto=format&fit=crop&q=80&w=2000"
            alt="Radha Paithani Hero"
            className="w-full h-full object-cover scale-110"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-brand-gold/50" />
              <span className="text-brand-gold font-display tracking-[0.3em] uppercase text-sm">येवल्याची अस्सल परंपरा</span>
              <div className="h-[1px] w-12 bg-brand-gold/50" />
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-yatra text-white leading-tight relative py-10 px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -top-4 -left-16 text-brand-gold floating-motif hidden md:block"
              >
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" fillOpacity="0.2" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </motion.div>
              
              <span className="shimmer-text logo-text">राधा</span> <span className="text-brand-gold shimmer-text logo-text">पैठणी</span>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="absolute -bottom-4 -right-16 text-brand-gold floating-motif hidden md:block"
                style={{ animationDelay: '1s' }}
              >
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 10C50 10 30 40 30 60C30 71.0457 38.9543 80 50 80C61.0457 80 70 71.0457 70 60C70 40 50 10 50 10Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
                  <circle cx="50" cy="60" r="8" fill="currentColor" />
                  <path d="M50 30L55 40H45L50 30Z" fill="currentColor" />
                </svg>
              </motion.div>
            </h1>

            <div className="h-12 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-xl md:text-2xl text-brand-gold/90 font-serif italic"
                >
                  {TAGLINES[taglineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-premium btn-gold group"
              >
                कलेक्शन पहा <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
              <motion.a 
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="btn-premium border-white/20 text-white hover:bg-white hover:text-brand-maroon backdrop-blur-sm"
              >
                व्हॉट्सअँप ऑर्डर
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Decorative Pallu Border */}
        <div className="absolute bottom-0 left-0 w-full h-12 paithani-pallu z-30 flex items-center justify-center">
          <div className="flex gap-12">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-brand-gold/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-brand-gold/50 text-[10px] uppercase tracking-[0.2em] vertical-text">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-gold/50 to-transparent" />
        </motion.div>
      </section>

      {/* Categories Bento Grid */}
      <section className="py-32 bg-brand-paper floral-pattern">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl text-brand-maroon">आमची <span className="italic">खासियत</span></h2>
              <p className="text-gray-600 max-w-md font-serif">प्रत्येक साडी ही एक कलाकृती आहे, जी पिढ्यानपिढ्या चालत आलेल्या कौशल्याने विणलेली आहे.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-3xl font-display text-brand-maroon">५००+</p>
                <p className="text-xs text-brand-gold uppercase tracking-widest">डिझाईन्स</p>
              </div>
              <div className="w-[1px] h-12 bg-brand-gold/30" />
              <div className="text-right">
                <p className="text-3xl font-display text-brand-maroon">१००%</p>
                <p className="text-xs text-brand-gold uppercase tracking-widest">शुद्ध सिल्क</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[800px]">
            {/* Large Item */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-2 md:row-span-2 bento-item group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img src={CATEGORIES[0].image} alt="" className="w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/90 via-brand-maroon/20 to-transparent flex flex-col justify-end p-10">
                <span className="text-brand-gold text-sm uppercase tracking-[0.3em] mb-2">सर्वात लोकप्रिय</span>
                <h3 className="text-4xl text-white mb-4">{CATEGORIES[0].title}</h3>
                <button className="flex items-center gap-2 text-brand-gold hover:text-white transition-colors group/btn">
                  कलेक्शन पहा <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Medium Items */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-2 bento-item group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img src={CATEGORIES[3].image} alt="" className="w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/90 via-transparent to-transparent flex flex-col justify-end p-8">
                <h3 className="text-3xl text-white">{CATEGORIES[3].title}</h3>
              </div>
            </motion.div>

            {/* Small Items */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bento-item group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img src={CATEGORIES[1].image} alt="" className="w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/90 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl text-white">{CATEGORIES[1].title}</h3>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bento-item group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img src={CATEGORIES[2].image} alt="" className="w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/90 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl text-white">{CATEGORIES[2].title}</h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-brand-plum text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 floral-pattern" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: <Truck size={32} />, title: "मोफत डिलिव्हरी", desc: "संपूर्ण भारतात" },
              { icon: <ShieldCheck size={32} />, title: "सुरक्षित पेमेंट", desc: "१००% सुरक्षित" },
              { icon: <Award size={32} />, title: "अस्सल गुणवत्ता", desc: "येवला पैठणी" },
              { icon: <Sparkles size={32} />, title: "कस्टमायझेशन", desc: "तुमच्या आवडीनुसार" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="text-brand-gold flex justify-center">{feature.icon}</div>
                <h4 className="text-xl font-display">{feature.title}</h4>
                <p className="text-white/60 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Collection */}
      <section id="collection" className="py-32 silk-texture relative">
        <div className="absolute top-0 left-0 w-full h-2 paithani-border opacity-50" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <span className="text-brand-gold uppercase tracking-[0.4em] text-xs">नवीन कलेक्शन</span>
            <h2 className="text-6xl text-brand-maroon">आमची <span className="italic">उत्कृष्ट</span> उत्पादने</h2>
            <div className="w-24 h-[1px] bg-brand-gold mx-auto mt-8" />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {allCategories.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-full text-sm font-bold tracking-widest transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-brand-maroon text-white shadow-xl' 
                    : 'bg-white text-brand-maroon border border-brand-maroon/10 hover:border-brand-maroon/30'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div 
                    className="premium-card overflow-hidden relative cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="absolute top-6 left-6 z-10">
                      <span className="bg-white/90 backdrop-blur-md text-brand-maroon px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-bold">
                        {product.category}
                      </span>
                    </div>

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-brand-maroon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-14 h-14 bg-white text-brand-maroon rounded-full flex items-center justify-center shadow-xl hover:bg-brand-gold hover:text-white transition-colors"
                      >
                        <ShoppingBag size={20} />
                      </motion.button>
                      <motion.a 
                        href={getWhatsAppUrl([], product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-14 h-14 bg-white text-brand-maroon rounded-full flex items-center justify-center shadow-xl hover:bg-brand-gold hover:text-white transition-colors"
                      >
                        <MessageCircle size={20} />
                      </motion.a>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3 text-center relative pb-6">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] paithani-border opacity-30" />
                    <h3 className="text-2xl text-brand-maroon group-hover:text-brand-gold transition-colors">{product.name}</h3>
                    <p className="text-gray-500 font-serif text-sm line-clamp-2 px-4">{product.description}</p>
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <span className="text-2xl font-display text-brand-maroon">₹{product.price.toLocaleString('en-IN')}</span>
                      <div className="h-4 w-[1px] bg-brand-gold/30" />
                      <div className="flex text-brand-gold">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                    </div>
                    
                    {/* Mobile Action Buttons */}
                    <div className="flex lg:hidden gap-3 px-4 pt-4">
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-brand-maroon text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={18} /> बॅगेत टाका
                      </button>
                      <a 
                        href={getWhatsAppUrl([], product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 border-2 border-brand-maroon text-brand-maroon py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={18} /> ऑर्डर
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-32 bg-brand-rose relative overflow-hidden floral-pattern">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-maroon/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[40rem] rounded-[3rem] overflow-hidden shadow-2xl z-10">
                <img 
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000" 
                  alt="About Radha Paithani" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/40 to-transparent" />
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 border-8 border-brand-gold/20 rounded-full z-0" />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-brand-gold/10 rounded-full z-0 blur-2xl" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Our Story</span>
                <h3 className="text-5xl md:text-7xl font-serif text-brand-maroon mb-8 leading-tight">आमच्याबद्दल</h3>
              </div>
              
              <div className="space-y-8 text-gray-700 leading-relaxed text-xl font-serif italic">
                <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-brand-gold first-letter:mr-3 first-letter:float-left">
                  परंपरा, सौंदर्य आणि संस्कृती यांचा अनमोल वारसा जपणारी पैठणी साडी म्हणजे प्रत्येक स्त्रीच्या आयुष्यातील एक खास भावना आहे. आमच्या वेबसाइटद्वारे आम्ही हीच परंपरा आधुनिकतेसोबत तुमच्यापर्यंत पोहोचवत आहोत.
                </p>
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2rem] border border-brand-gold/10 shadow-sm">
                  <p className="font-bold text-brand-maroon mb-4 not-italic font-serif text-2xl">आमचे उद्दिष्ट –</p>
                  <p className="text-lg">
                    प्रत्येक ग्राहकाला उच्च दर्जाच्या, अस्सल आणि आकर्षक पैठणी साड्या योग्य किमतीत उपलब्ध करून देणे. पारंपरिक डिझाईनसोबतच नव्या ट्रेंडनुसार तयार केलेल्या साड्यांचा संग्रह आम्ही तुमच्यासाठी घेऊन आलो आहोत.
                  </p>
                </div>
                <p className="text-2xl text-brand-maroon font-serif not-italic border-l-4 border-brand-gold pl-6 py-2">
                  आमच्याकडे प्रत्येक साडी ही फक्त एक वस्त्र नसून, ती एक कला, एक परंपरा आणि एक अभिमानाची गोष्ट आहे.
                </p>
                
                <div className="pt-4">
                  <h4 className="text-xl font-bold text-brand-maroon mb-6 not-italic font-serif tracking-wider uppercase">✨ आमची वैशिष्ट्ये:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      "अस्सल आणि विश्वासार्ह गुणवत्ता",
                      "विविध रंग आणि डिझाईन्स",
                      "ग्राहकांच्या समाधानाला प्राधान्य",
                      "सोपी आणि सुरक्षित ऑनलाइन खरेदी"
                    ].map((feature, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 bg-white/40 p-4 rounded-2xl border border-white/60"
                      >
                        <div className="w-10 h-10 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold">
                          <Plus size={20} />
                        </div>
                        <span className="not-italic font-sans font-medium text-base text-gray-800">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <p className="pt-8 font-serif text-2xl text-brand-maroon not-italic text-center">
                  तुमच्या प्रत्येक खास क्षणाला अधिक सुंदर बनवण्यासाठी आम्ही नेहमीच तत्पर आहोत.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Styling Tips Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-4 block">Styling Guide</span>
            <h3 className="text-5xl md:text-7xl font-display text-brand-maroon mb-6 leading-tight">तुमचा लूक <span className="italic text-brand-gold">पूर्ण</span> करा</h3>
            <div className="w-24 h-0.5 bg-brand-gold/30 mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-16">
            {STYLING_TIPS.map((tip, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mx-auto text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  {tip.icon}
                </div>
                <h4 className="text-2xl font-display text-brand-maroon mb-4">{tip.title}</h4>
                <p className="text-gray-500 font-serif italic text-lg leading-relaxed">{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-brand-silk relative overflow-hidden">
        <div className="floral-pattern absolute inset-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <span className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-4 block">Customer Love</span>
            <h3 className="text-5xl md:text-7xl font-display text-brand-maroon leading-tight">आमच्या <span className="italic text-brand-gold">ग्राहकांचे</span> अनुभव</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {TESTIMONIALS.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-12 shadow-2xl relative group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="absolute -top-6 left-12 w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-white text-2xl shadow-lg font-serif">
                  "
                </div>
                <div className="text-brand-gold mb-8 flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 font-serif italic mb-10 text-xl leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-5 border-t border-gray-100 pt-8">
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold/20" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-display text-brand-maroon font-bold text-lg">{t.name}</p>
                    <p className="text-xs text-brand-gold uppercase tracking-[0.2em] font-bold">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-brand-maroon text-white relative overflow-hidden">
        <div className="absolute inset-0 silk-overlay opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-6 block">Get In Touch</span>
            <h3 className="text-6xl md:text-8xl font-display mb-10 leading-tight">आमच्या <br /> <span className="italic text-brand-gold">दुकानाला</span> <br /> भेट द्या</h3>
            <p className="text-white/60 mb-12 text-xl font-serif italic leading-relaxed max-w-lg">
              आमच्या साड्यांचा पोत आणि समृद्धीचा प्रत्यक्ष अनुभव घेण्यासाठी आम्ही तुमचे स्वागत करतो. आमचे तज्ञ तुम्हाला तुमच्या खास दिवसासाठी योग्य पैठणी शोधण्यात मदत करतील.
            </p>
            <div className="space-y-10">
              <div className="flex items-center gap-8 group">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-brand-gold/20 transition-all duration-500 border border-white/10">
                  <Phone className="text-brand-gold" size={32} />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold mb-2">आम्हाला कॉल करा</p>
                  <p className="text-3xl font-display tracking-wider">+91 {CONTACT_NUMBER}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-brand-gold/20 transition-all duration-500 border border-white/10">
                  <MessageCircle className="text-brand-gold" size={32} />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold mb-2">व्हाट्सअँप</p>
                  <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="text-3xl font-display tracking-wider hover:text-brand-gold transition-colors block">
                    आमच्याशी चॅट करा
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/10 shadow-2xl relative"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/10 blur-3xl rounded-full" />
            <h4 className="text-4xl font-display mb-12 text-center italic text-brand-gold">त्वरीत चौकशी</h4>
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleInquiry(); }}>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.3em] font-bold text-white/40 ml-4">नाव</label>
                <input 
                  type="text" 
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="तुमचे नाव" 
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 focus:outline-none focus:border-brand-gold focus:bg-white/10 transition-all text-xl font-serif" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.3em] font-bold text-white/40 ml-4">ईमेल</label>
                <input 
                  type="email" 
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="ईमेल पत्ता" 
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 focus:outline-none focus:border-brand-gold focus:bg-white/10 transition-all text-xl font-serif" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.3em] font-bold text-white/40 ml-4">संदेश</label>
                <textarea 
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="तुमचा संदेश येथे लिहा..." 
                  rows={4} 
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 focus:outline-none focus:border-brand-gold focus:bg-white/10 transition-all text-xl font-serif resize-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full btn-premium btn-gold text-xl py-6 shadow-2xl shadow-black/40">
                संदेश पाठवा
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-32 bg-brand-silk relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 paithani-border opacity-50" />
        <div className="floral-pattern absolute inset-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <span className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-4 block">Follow Our Journey</span>
              <h3 className="text-5xl md:text-7xl font-display text-brand-maroon leading-tight">आमचे <span className="italic text-brand-gold">इंस्टाग्राम</span> जग</h3>
            </div>
            <a href="#" className="btn-premium btn-outline">
              <Instagram size={20} /> @radha_paithani
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1610030469668-935142b96fe4?auto=format&fit=crop&q=80&w=600"
            ].map((img, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="aspect-square overflow-hidden shadow-xl relative group"
              >
                <img src={img} alt="Instagram post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-brand-maroon/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="text-white" size={32} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-brand-gold uppercase tracking-[0.4em] text-xs">आमचे ग्राहक</span>
            <h2 className="text-6xl text-brand-maroon mt-4">ग्राहकांचे <span className="italic">मनोगत</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "प्रिया कुलकर्णी", city: "पुणे", text: "राधा पैठणीची साडी खरंच खूप सुंदर आहे. कापड आणि नक्षीकाम एकदम अस्सल आहे. धन्यवाद!" },
              { name: "स्नेहल पाटील", city: "मुंबई", text: "मी माझ्या लग्नासाठी इथून पैठणी घेतली. सर्वांना ती खूप आवडली. डिलिव्हरी सुद्धा वेळेवर झाली." },
              { name: "अंजली देशपांडे", city: "नाशिक", text: "येवल्याची अस्सल पैठणी हवी असेल तर राधा पैठणी हा सर्वोत्तम पर्याय आहे. खूप छान कलेक्शन आहे." }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-12 bg-brand-plum/5 rounded-[3rem] relative"
              >
                <div className="text-brand-gold mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-brand-maroon/80 font-serif text-lg italic leading-relaxed mb-8">"{review.text}"</p>
                <div>
                  <h4 className="text-xl text-brand-maroon font-bold">{review.name}</h4>
                  <p className="text-brand-gold text-sm uppercase tracking-widest">{review.city}</p>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <Award size={80} className="text-brand-gold" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-plum text-white py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl font-serif font-bold tracking-tight">राधा पैठणी</h2>
            <p className="text-brand-rose/60 text-sm font-serif italic">परंपरा, सौंदर्य आणि संस्कृती यांचा अनमोल वारसा.</p>
            <p className="text-white/20 text-xs uppercase tracking-widest">© 2026 राधा पैठणी. सर्व हक्क राखीव.</p>
          </div>
          <div className="flex gap-8">
            {[
              { icon: <Instagram size={24} />, link: '#' },
              { icon: <Facebook size={24} />, link: '#' },
              { icon: <MessageCircle size={24} />, link: getWhatsAppUrl() }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.link} 
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-white transition-all duration-300 transform hover:-translate-y-1"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Product Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md md:text-gray-400 md:hover:bg-gray-100"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-1/2 h-[400px] md:h-auto relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-brand-maroon text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center space-y-8 overflow-y-auto">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl text-brand-maroon">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-display text-brand-gold">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    <div className="flex text-brand-gold">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 font-serif text-lg leading-relaxed italic">
                  {selectedProduct.description}
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <Truck size={18} className="text-brand-gold" /> मोफत होम डिलिव्हरी
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <ShieldCheck size={18} className="text-brand-gold" /> १००% अस्सल येवला पैठणी
                  </div>
                </div>

                <div className="space-y-4 pt-4 bg-brand-silk p-6 rounded-2xl border border-brand-maroon/5">
                  <h4 className="text-sm font-bold text-brand-maroon uppercase tracking-widest">डिलिव्हरीसाठी माहिती (पर्यायी)</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="तुमचे नाव"
                      className="w-full p-3 bg-white border border-brand-maroon/10 rounded-xl text-sm focus:outline-none focus:border-brand-maroon/30"
                    />
                    <input 
                      type="email" 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="ईमेल पत्ता"
                      className="w-full p-3 bg-white border border-brand-maroon/10 rounded-xl text-sm focus:outline-none focus:border-brand-maroon/30"
                    />
                    <textarea 
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="तुमचा पत्ता"
                      rows={2}
                      className="w-full p-3 bg-white border border-brand-maroon/10 rounded-xl text-sm focus:outline-none focus:border-brand-maroon/30 resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-brand-maroon text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-plum transition-all shadow-xl"
                  >
                    <ShoppingBag size={22} /> बॅगेत टाका
                  </button>
                  <a 
                    href={getWhatsAppUrl([], selectedProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border-2 border-brand-maroon text-brand-maroon py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-maroon hover:text-white transition-all shadow-lg"
                  >
                    <MessageCircle size={22} /> ऑर्डर करा
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center bg-brand-rose">
                <h3 className="text-2xl font-serif font-bold text-brand-maroon">तुमची खरेदी बॅग</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X />
                </button>
              </div>

              {cart.length > 0 && (
                <div className="px-6 py-4 bg-brand-silk border-b">
                  <div className="flex justify-between text-xs font-bold text-brand-maroon mb-2">
                    <span>{cartTotal >= 5000 ? "मोफत डिलिव्हरी पात्र! 🎉" : `मोफत डिलिव्हरीसाठी ₹${(5000 - cartTotal).toLocaleString()} बाकी`}</span>
                    <span>₹5,000</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (cartTotal / 5000) * 100)}%` }}
                      className="h-full bg-brand-gold"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <ShoppingCart size={64} strokeWidth={1} />
                    <p className="text-lg">तुमची बॅग रिकामी आहे</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-brand-maroon font-medium underline underline-offset-4"
                    >
                      खरेदी सुरू करा
                    </button>
                  </div>
                ) : showCheckoutForm ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <button 
                      onClick={() => setShowCheckoutForm(false)}
                      className="text-brand-maroon flex items-center gap-2 text-sm font-bold"
                    >
                      ← बॅगेत परत जा
                    </button>
                    <div className="space-y-4">
                      <h4 className="text-xl text-brand-maroon font-bold">डिलिव्हरी माहिती</h4>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">पूर्ण नाव</label>
                        <input 
                          type="text" 
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="तुमचे नाव लिहा"
                          className="w-full p-4 bg-brand-silk border border-brand-maroon/10 rounded-xl focus:outline-none focus:border-brand-maroon/30 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">ईमेल पत्ता</label>
                        <input 
                          type="email" 
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="तुमचा ईमेल लिहा"
                          className="w-full p-4 bg-brand-silk border border-brand-maroon/10 rounded-xl focus:outline-none focus:border-brand-maroon/30 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">पूर्ण पत्ता</label>
                        <textarea 
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="तुमचा पत्ता लिहा (उदा. घर क्र., गल्ली, शहर, पिनकोड)"
                          rows={4}
                          className="w-full p-4 bg-brand-silk border border-brand-maroon/10 rounded-xl focus:outline-none focus:border-brand-maroon/30 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-brand-maroon font-bold">₹{item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 border rounded hover:bg-gray-50"><Minus size={14} /></button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 border rounded hover:bg-gray-50"><Plus size={14} /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                        <X size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-brand-cream border-t space-y-4">
                  <div className="flex justify-between text-lg font-bold text-brand-maroon">
                    <span>एकूण</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-brand-maroon text-white py-4 rounded-xl font-bold hover:bg-brand-maroon/90 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {showCheckoutForm ? (
                      <>व्हाट्सअँप वर ऑर्डर पाठवा <MessageCircle size={20} /></>
                    ) : (
                      "चेकआउट करा"
                    )}
                  </button>
                  {!showCheckoutForm && (
                    <a 
                      href={getWhatsAppUrl(cart)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full border-2 border-brand-maroon text-brand-maroon py-4 rounded-xl font-bold hover:bg-brand-maroon hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={20} /> व्हाट्सअँप वरून ऑर्डर करा
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order Success Screen */}
      <AnimatePresence>
        {isOrderPlaced && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[100] flex items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md space-y-8"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-5xl">
                ✓
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-serif font-bold text-brand-maroon">धन्यवाद!</h2>
                <p className="text-xl text-gray-600 font-serif">तुमची ऑर्डर यशस्वीरित्या नोंदवली गेली आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू.</p>
              </div>
              <button 
                onClick={() => setIsOrderPlaced(false)}
                className="btn-premium px-12 py-4 rounded-xl"
              >
                खरेदी सुरू ठेवा
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            className="fixed inset-0 bg-brand-maroon z-[100] p-8 flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="text-white p-2">
                <X size={32} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-8 text-center">
              {[
                { name: 'संग्रह', link: '#collection' },
                { name: 'आमच्याबद्दल', link: '#about' },
                { name: 'संपर्क', link: '#contact' }
              ].map(item => (
                <a 
                  key={item.name} 
                  href={item.link} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-serif text-white hover:text-brand-gold transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="text-center text-white/60 space-y-2">
              <p className="text-sm uppercase tracking-widest">संपर्क</p>
              <p className="text-xl font-medium">+91 {CONTACT_NUMBER}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
