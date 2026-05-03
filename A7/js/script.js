// js/script.js

const firebaseConfig = {
  apiKey: "AIzaSyCWWHyRw7cdgoy2QSNPwItvs79wvMTn9lo",
  authDomain: "a7-store-fa7a4.firebaseapp.com",
  projectId: "a7-store-fa7a4",
  storageBucket: "a7-store-fa7a4.firebasestorage.app",
  messagingSenderId: "348232244072",
  appId: "1:348232244072:web:1348b0cd0a7d80c8a3d4dd",
  measurementId: "G-CYGS0GWMH2"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let allProducts = [];
let currentLang = 'ar';

document.addEventListener('DOMContentLoaded', () => {

  // Intercept scroll for reveal animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Mobile navigation background handling
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(5, 5, 5, 0.95)';
      nav.style.padding = '1rem 10%';
    } else {
      nav.style.background = 'rgba(5, 5, 5, 0.8)';
      nav.style.padding = '1.5rem 10%';
    }
  });

  // Contact form validation
  const form = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic Check
      if (!name || !email || !phone) {
        if (currentLang === 'ar') {
          formMessage.textContent = 'من فضلك املأ جميع الحقول المطلوبة.';
        } else {
          formMessage.textContent = 'Please fill out all required fields.';
        }
        formMessage.className = 'form-message error';
        return;
      }

      // Email Format Check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (currentLang === 'ar') {
          formMessage.textContent = 'من فضلك ادخل بريد إلكتروني صحيح.';
        } else {
          formMessage.textContent = 'Please enter a valid email address.';
        }
        formMessage.className = 'form-message error';
        return;
      }

      // Success
      if (currentLang === 'ar') {
        formMessage.innerHTML = `شكراً، ${name}! سيتم توجيهك إلى واتساب الآن <img src="https://img.icons8.com/color/48/whatsapp--v1.png" style="width:20px; height:20px; vertical-align:middle; margin-right:8px;">`;
      } else {
        formMessage.innerHTML = `Thanks, ${name}! Redirecting you to WhatsApp now <img src="https://img.icons8.com/color/48/whatsapp--v1.png" style="width:20px; height:20px; vertical-align:middle; margin-left:8px;">`;
      }
      formMessage.className = 'form-message success';
      
      if (window.lucide) lucide.createIcons();

      // WhatsApp redirection
      const whatsappNumber = '201063267221';
      const greeting = currentLang === 'ar' ? 'رسالة جديدة من الموقع' : 'New Message from Website';
      const nameLabel = currentLang === 'ar' ? 'الاسم' : 'Name';
      const emailLabel = currentLang === 'ar' ? 'البريد' : 'Email';
      const phoneLabel = currentLang === 'ar' ? 'الموبايل' : 'Phone';
      const msgLabel = currentLang === 'ar' ? 'الرسالة' : 'Message';

      const whatsappMessage = `${greeting}%0A---%0A${nameLabel}: ${name}%0A${emailLabel}: ${email}%0A${phoneLabel}: ${phone}%0A${msgLabel}: ${message}`;
      
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
        form.reset();
        formMessage.className = 'form-message';
      }, 1500);
    });
  }

  // Smooth scroll for nav anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Initialize Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Start countdown for product 1 (mock logic for demo)
  const daysEl = document.getElementById('cd-days');
  if (daysEl) {
    startCountdown(7, {
      days: daysEl,
      hours: document.getElementById('cd-hours'),
      mins: document.getElementById('cd-mins'),
      secs: document.getElementById('cd-secs')
    });
  }

  // Global Dynamic Countdown Timer for Products
  setInterval(() => {
    document.querySelectorAll('.dynamic-countdown').forEach(timer => {
      const endTime = parseInt(timer.getAttribute('data-endtime'));
      if (!endTime) return;
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        timer.style.display = 'none';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      const dEl = timer.querySelector('.cd-d');
      const hEl = timer.querySelector('.cd-h');
      const mEl = timer.querySelector('.cd-m');
      const sEl = timer.querySelector('.cd-s');

      if (dEl) dEl.innerText = days.toString().padStart(2, '0');
      if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
      if (mEl) mEl.innerText = mins.toString().padStart(2, '0');
      if (sEl) sEl.innerText = secs.toString().padStart(2, '0');
    });
  }, 1000);

  // Set default language and apply
  applyLanguage();
  
  // Fetch Products from Firebase
  fetchProducts();
});

async function fetchProducts() {
  const grid = document.getElementById('collection-grid');
  const spinner = document.getElementById('loading-spinner');
  
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'asc').get();
    
    // Auto-migrate default products if DB is empty
    if (snapshot.empty) {
      await seedDefaultProducts();
      return; // seedDefaultProducts will call fetchProducts again
    }
    
    spinner.style.display = 'none';
    allProducts = [];
    grid.innerHTML = '';
    
    snapshot.forEach(doc => {
      const p = doc.data();
      p.id = doc.id;
      allProducts.push(p);
      renderProductCard(p, grid);
    });
    
  } catch (error) {
    console.error("Error fetching products: ", error);
    if(spinner) spinner.innerHTML = "Error loading products.";
  }
}

function renderProductCard(p, grid) {
  const name = currentLang === 'ar' ? p.name_ar : p.name_en;
  const desc = currentLang === 'ar' ? p.desc_ar : p.desc_en;
  const mainImage = p.images && p.images.length > 0 ? p.images[0] : 'https://placehold.co/600x800?text=No+Image';
  
  let priceDisplay = '';
  if (p.old_price && p.old_price > p.price) {
    priceDisplay = `<span class="old-price" style="text-decoration:line-through; color:#888; font-size:0.8em; margin-right:5px;">LE${p.old_price}</span> LE${p.price}${currentLang === 'ar' ? ' جنيه' : 'EGP'}`;
  } else {
    priceDisplay = `LE${p.price}${currentLang === 'ar' ? ' جنيه' : 'EGP'}`;
  }

  let discountBadge = '';
  if (p.old_price && p.old_price > p.price) {
    const discount = Math.round(((p.old_price - p.price) / p.old_price) * 100);
    discountBadge = `<div class="discount-badge" style="position:absolute; top:10px; left:10px; background:red; color:white; padding:5px 10px; font-weight:bold; border-radius:5px; z-index:1;">-${discount}%</div>`;
  }
  
  let countdownHTML = '';
  if (p.offer_end && p.offer_end > new Date().getTime()) {
    countdownHTML = `
      <div class="dynamic-countdown" data-endtime="${p.offer_end}" style="position:absolute; bottom:10px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:white; padding:5px 10px; border-radius:5px; display:flex; gap:10px; font-size:0.8rem; z-index:2; direction:ltr;">
        <div style="text-align:center;"><span class="cd-d" style="font-weight:bold; color:#2ecc71;">00</span><br><span style="font-size:0.6rem;">${translations[currentLang].lbl_days}</span></div>
        <div style="text-align:center;"><span class="cd-h" style="font-weight:bold;">00</span><br><span style="font-size:0.6rem;">${translations[currentLang].lbl_hours}</span></div>
        <div style="text-align:center;"><span class="cd-m" style="font-weight:bold;">00</span><br><span style="font-size:0.6rem;">${translations[currentLang].lbl_mins}</span></div>
        <div style="text-align:center;"><span class="cd-s" style="font-weight:bold; color:#e74c3c;">00</span><br><span style="font-size:0.6rem;">${translations[currentLang].lbl_secs}</span></div>
      </div>
    `;
  }
  
  // Pass strings safely
  const imagesStr = encodeURIComponent(JSON.stringify(p.images || [mainImage]));
  const sizesStr = encodeURIComponent(JSON.stringify(p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL']));
  const colorsStr = encodeURIComponent(JSON.stringify(p.colors && p.colors.length > 0 ? p.colors : ['black', 'white']));
  
  const cardHTML = `
    <div class="product-card" data-category="${p.category}" style="position:relative;">
      ${discountBadge}
      <div class="product-img-wrapper" style="position:relative;">
        <img src="${mainImage}" alt="${name}" class="product-img">
        ${countdownHTML}
      </div>
      <div class="product-info">
        <h3 class="product-name">${name}</h3>
        <p class="product-desc">${desc}</p>
        <div class="product-price">${priceDisplay}</div>
        <div class="product-action">
          <button type="button" class="btn" onclick="openDynamicModal('${name}', '${p.price}', '${imagesStr}', '${sizesStr}', '${colorsStr}')">${currentLang === 'ar' ? 'عرض / شراء' : 'View / Buy'}</button>
        </div>
      </div>
    </div>
  `;
  
  grid.insertAdjacentHTML('beforeend', cardHTML);
}

function openDynamicModal(name, price, imagesStr, sizesStr, colorsStr) {
  const images = JSON.parse(decodeURIComponent(imagesStr));
  const sizes = JSON.parse(decodeURIComponent(sizesStr));
  const colors = JSON.parse(decodeURIComponent(colorsStr));
  const displayPrice = `LE${price}${currentLang === 'ar' ? ' جنيه' : 'EGP'}`;
  openModal(name, displayPrice, sizes, images, colors);
}

async function seedDefaultProducts() {
  const defaultProducts = [
    { 
      name_en: "Oversized Heavy Hoodie", 
      name_ar: "هودي ثقيل واسع (Oversized)", 
      desc_en: "Premium cotton blend, relaxed fit.", 
      desc_ar: "مزيج قطن فاخر، مقاس مريح.", 
      price: 350, 
      category: "hoodies", 
      images: ["img/product1.jpg", "img/imgproduct1_back.png.png"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["black", "grey"]
    },
    { 
      name_en: "A7 Urban Essential Tee", 
      name_ar: "A7 أساسيات الحضر", 
      desc_en: "A7 Your Daily Essential.", 
      desc_ar: "A7 أساسياتك اليومية.", 
      price: 297.5, 
      category: "tshirts", 
      images: ["img/product2.jpg"],
      sizes: ["M", "L", "XL"],
      colors: ["white", "black"]
    },
    { 
      name_en: "Signature Logo T-Shirt", 
      name_ar: "تيشيرت الشعار الأساسي", 
      desc_en: "Heavyweight jersey, subtle print.", 
      desc_ar: "جيرسي ثقيل، طباعة هادئة.", 
      price: 320, 
      category: "tshirts", 
      images: ["img/product3_main.jpg", "img/product3.jpg", "img/product3_detail.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["black", "navy"]
    },
    { 
      name_en: "Heritage Cargo Pants", 
      name_ar: "بنطلون كارجو تراثي", 
      desc_en: "Multi-pocket utility, relaxed fit.", 
      desc_ar: "جيوب متعددة، مقاس مريح.", 
      price: 650, 
      category: "pants", 
      images: ["img/cargo_front.png.png", "img/cargo_back.png.png", "img/cargo_side.png.png"],
      sizes: ["30", "32", "34", "36"],
      colors: ["black", "beige"]
    }
  ];
  
  for (const p of defaultProducts) {
    p.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('products').add(p);
  }
  
  fetchProducts(); // Reload after seeding
}

function startCountdown(durationInDays, displayElements) {
  let endTime = localStorage.getItem('offerEndTime');
  if (!endTime) {
    endTime = new Date().getTime() + (durationInDays * 24 * 60 * 60 * 1000);
    localStorage.setItem('offerEndTime', endTime);
  }

  const timer = setInterval(function() {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      clearInterval(timer);
      displayElements.days.innerText = "00";
      displayElements.hours.innerText = "00";
      displayElements.mins.innerText = "00";
      displayElements.secs.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    displayElements.days.innerText = days.toString().padStart(2, '0');
    displayElements.hours.innerText = hours.toString().padStart(2, '0');
    displayElements.mins.innerText = mins.toString().padStart(2, '0');
    displayElements.secs.innerText = secs.toString().padStart(2, '0');
  }, 1000);
}

function applyLanguage() {
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key.startsWith('[placeholder]')) {
      const actualKey = key.replace('[placeholder]', '');
      el.placeholder = translations[currentLang][actualKey] || el.placeholder;
    } else {
      el.innerHTML = translations[currentLang][key] || el.innerHTML;
    }
  });

  const langBtn = document.getElementById('lang-switch');
  if (langBtn) {
    langBtn.innerText = currentLang === 'ar' ? 'English' : 'العربية';
  }
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  applyLanguage();
  if (window.lucide) lucide.createIcons();
  
  // Re-render products for new language
  const grid = document.getElementById('collection-grid');
  if (grid && allProducts.length > 0) {
    grid.innerHTML = '';
    allProducts.forEach(p => renderProductCard(p, grid));
  }
}

function filterCategory(category) {
  const products = document.querySelectorAll('.product-card');
  const buttons = document.querySelectorAll('.cat-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  products.forEach(product => {
    if (category === 'all' || product.getAttribute('data-category') === category) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });

  // Scroll to collection start
  const collection = document.getElementById('collection');
  if (collection) {
    const offset = 80; // Space for sticky nav
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = collection.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

function searchProducts() {
  const query = document.getElementById('productSearch').value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    const name = product.querySelector('.product-name').innerText.toLowerCase();
    const desc = product.querySelector('.product-desc').innerText.toLowerCase();
    
    if (name.includes(query) || desc.includes(query)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });

  // Scroll to collection start if user is scrolled down
  if (query.length > 0) {
    const collection = document.getElementById('collection');
    const scrollThreshold = collection.offsetTop - 200;
    if (window.scrollY > scrollThreshold) {
      const offset = 80; // Space for sticky nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = collection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}

const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_collection: "Collection",

    nav_contact: "Contact",
    hero_title: "A7",
    hero_title_main: "Define Your Street Style",
    hero_desc: "A7 is a modern streetwear brand delivering bold youth fashion and everyday style.",
    hero_explore: "Explore Collection",
    hero_contact: "Contact Us",
    about_title: "About A7",
    about_p1: "A7 is a youth-focused fashion brand offering a wide range of streetwear clothing designed for everyday confidence and style. We focus on comfort, modern design, and expressive identity.",
    about_p2: "Our pieces are crafted to empower the youth, blending minimalist aesthetics with high-quality fabrics that stand the test of time and urban lifestyles.",
    collection_title: "Latest Collection",
    view_buy: "View / Buy",

    contact_title: "Get in Touch",
    contact_subtitle: "Reach out for inquiries.",
    form_name: "Your Name",
    form_email: "Your Email",
    form_phone: "Your Phone Number",
    form_message: "Your Message (Optional)",
    form_submit: "Send Message",
    contact_whatsapp: 'WhatsApp',
    contact_instagram: 'Instagram',
    contact_facebook: 'Facebook',
    contact_tiktok: 'TikTok',
    footer_brand: "A7",
    footer_desc: "A7 Modern Streetwear & Youth Fashion.",
    footer_quick_links: "Quick Links",
    footer_follow: "Follow Us",
    footer_copy: "© 2026 A7 Streetwear. All rights reserved.",
    back_to_top: "Back to Top",
    modal_color: "Select Color:",
    modal_size: "Select Size:",
    modal_confirm: "Confirm Purchase",
    lang_btn: "العربية",
    lbl_days: "Days",
    lbl_hours: "Hours",
    lbl_mins: "Mins",
    lbl_secs: "Secs",

    p1_name: "Oversized Heavy Hoodie",
    p1_desc: "Premium cotton blend, relaxed fit.",
    p2_name: "A7 Urban Essential",
    p2_desc: "A7 Your Daily Essential.",
    p3_name: "Essential Logo Tee",
    p3_desc: "Heavyweight jersey, subtle print.",
    p4_name: "Technical Anorak",
    p4_desc: "Weather resistant, half-zip design.",
    p5_name: "Distressed Denim",
    p5_desc: "Straight leg, vintage wash.",
    p6_name: "Signature Beanie",
    p6_desc: "Ribbed knit, fold-over cuff.",
    p7_name: "Urban Crossbody Bag",
    p7_desc: "Nylon shell, adjustable strap.",
    p8_name: "Mock Neck Sweater",
    p8_desc: "Textured knit, dropped shoulders.",
    p9_name: "Heritage Cargo Pants",
    p9_desc: "Multi-pocket utility, relaxed fit.",

    modal_qty: "Quantity:",
    feat_quality: "Premium Quality",
    feat_quality_desc: "100% premium cotton fabrics.",
    feat_shipping: "Fast Delivery",
    feat_shipping_desc: "Quick shipping to all regions.",
    feat_exchange: "Easy Exchange",
    feat_exchange_desc: "Flexible and easy exchange policy.",
    feat_material: "100% Cotton",
    feat_design: "Exclusive Design",
    cat_all: "All",
    cat_hoodies: "Hoodies",
    cat_tshirts: "T-Shirts",
    cat_pants: "Pants",
    cat_acc: "Accessories",
    search_placeholder: "Search for a product...",
    loading_products: "Loading products..."
  },
  ar: {
    nav_home: "الرئيسية",
    nav_about: "من نحن",
    nav_collection: "المجموعات",

    nav_contact: "اتصل بنا",
    hero_title: "A7",
    hero_title_main: "حدد أسلوبك الخاص",
    hero_desc: "A7 هي علامة تجارية عصرية لملابس الشارع تقدم أزياء شبابية جريئة وأسلوب حياة يومي.",
    hero_explore: "استكشف المجموعة",
    hero_contact: "اتصل بنا",
    about_title: "عن A7",
    about_p1: "A7 هي علامة تجارية للأزياء تركز على الشباب ، وتقدم مجموعة واسعة من ملابس الشارع المصممة للثقة والأسلوب اليومي. نحن نركز على الراحة والتصميم الحديث والهوية التعبيرية.",
    about_p2: "تم تصميم قطعنا لتمكين الشباب ، ومزج الجماليات البسيطة مع الأقمشة عالية الجودة التي تصمد أمام اختبار الزمن وأنماط الحياة الحضرية.",
    collection_title: "أحدث مجموعة",
    view_buy: "عرض / شراء",

    contact_title: "تواصل معنا",
    contact_subtitle: "تواصل معنا للاستفسارات.",
    form_name: "اسمك",
    form_email: "بريدك الإلكتروني",
    form_phone: "رقم هاتفك",
    form_message: "رسالتك (اختياري)",
    form_submit: "إرسال الرسالة",
    contact_whatsapp: 'واتساب',
    contact_instagram: 'إنستجرام',
    contact_facebook: 'فيسبوك',
    contact_tiktok: 'تيك توك',
    footer_brand: "A7",
    footer_desc: "A7 ملابس شارع حديثة وأزياء شبابية.",
    footer_quick_links: "روابط سريعة",
    footer_follow: "تابعنا",
    footer_copy: "© 2026 A7 لملابس الشارع. جميع الحقوق محفوظة.",
    back_to_top: "العودة للأعلى",
    modal_color: "اختر اللون:",
    modal_size: "اختر المقاس:",
    modal_confirm: "تأكيد الشراء",
    lang_btn: "English",
    lbl_days: "أيام",
    lbl_hours: "ساعة",
    lbl_mins: "دقيقة",
    lbl_secs: "ثانية",

    p1_name: "هودي ثقيل واسع (Oversized)",
    p1_desc: "مزيج قطن فاخر، مقاس مريح.",
    p2_name: "A7 أساسيات الحضر",
    p2_desc: "A7 أساسياتك اليومية.",
    p3_name: "تيشيرت الشعار الأساسي",
    p3_desc: "جيرسي ثقيل، طباعة هادئة.",
    p4_name: "أنوراك تقني",
    p4_desc: "مقاوم للطقس، تصميم بنصف سحاب.",
    p5_name: "دينيم مهترئ",
    p5_desc: "رجل مستقيمة، غسيل كلاسيكي.",
    p6_name: "بيني مطرز",
    p6_desc: "حياكة مضلعة، حافة مطوية.",
    p7_name: "حقيبة كروس حضرية",
    p7_desc: "غلاف نايلون، حزام قابل للتعديل.",
    p8_name: "سويتر برقبة وهمية",
    p8_desc: "حياكة بارزة، أكتاف منسدلة.",
    p9_name: "بنطلون كارجو تراثي",
    p9_desc: "جيوب متعددة، مقاس مريح.",

    modal_qty: "الكمية:",
    feat_quality: "جودة ممتازة",
    feat_quality_desc: "خامات قطنية 100% عالية الجودة.",
    feat_shipping: "شحن سريع",
    feat_shipping_desc: "توصيل سريع لجميع المناطق.",
    feat_exchange: "استبدال سهل",
    feat_exchange_desc: "سياسة استبدال مرنة وسهلة.",
    feat_material: "قطن 100%",
    feat_design: "تصميم حصري",
    cat_all: "الكل",
    cat_hoodies: "هوديز",
    cat_tshirts: "تيشيرتات",
    cat_pants: "بناطيل",
    cat_acc: "إكسسوارات",
    search_placeholder: "ابحث عن منتج...",
    loading_products: "جاري تحميل المنتجات..."
  }
};



const colorTranslations = {
  ar: {
    'black': 'أسود',
    'white': 'أبيض',
    'red': 'أحمر',
    'blue': 'أزرق',
    'green': 'أخضر',
    'yellow': 'أصفر',
    'grey': 'رمادي',
    'gray': 'رمادي',
    'navy': 'كحلي',
    'beige': 'بيج',
    'brown': 'بني',
    'orange': 'برتقالي',
    'purple': 'بنفسجي',
    'pink': 'بمبي'
  },
  en: {
    'black': 'Black',
    'white': 'White',
    'red': 'Red',
    'blue': 'Blue',
    'green': 'Green',
    'yellow': 'Yellow',
    'grey': 'Grey',
    'gray': 'Gray',
    'navy': 'Navy',
    'beige': 'Beige',
    'brown': 'Brown',
    'orange': 'Orange',
    'purple': 'Purple',
    'pink': 'Pink'
  }
};

let selectedColorName = '';

function openModal(name, price, sizes, images, colors) {
  images = images || ['https://placehold.co/600x800/1a1a1a/555555?text=' + encodeURIComponent(name)];
  colors = colors || [];
  selectedColorName = colors.length > 0 ? colors[0] : ''; // Default to first color

  document.getElementById('modalTitle').innerText = name;
  document.getElementById('modalPrice').innerText = price;

  const mainImg = document.getElementById('modalMainImg');
  mainImg.src = images[0];

  const thumbContainer = document.getElementById('thumbGallery');
  thumbContainer.innerHTML = '';
  images.forEach((imgSrc, index) => {
    const thumb = document.createElement('img');
    thumb.src = imgSrc;
    thumb.className = 'thumb-img' + (index === 0 ? ' active' : '');
    thumb.onclick = function() {
      mainImg.src = imgSrc;
      document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    };
    thumbContainer.appendChild(thumb);
  });

  const colorContainer = document.getElementById('colorOptions');
  colorContainer.innerHTML = '';
  if (colors.length > 0) {
    colors.forEach((color, index) => {
      const cBtn = document.createElement('div');
      cBtn.className = 'color-circle' + (index === 0 ? ' active' : '');
      cBtn.style.backgroundColor = color;
      const translatedColor = colorTranslations[currentLang][color.toLowerCase()] || color;
      cBtn.title = translatedColor;
      cBtn.onclick = function () {
        document.querySelectorAll('.color-circle').forEach(d => d.classList.remove('active'));
        this.classList.add('active');
        selectedColorName = color;
      };
      colorContainer.appendChild(cBtn);
    });
  } else {
    colorContainer.innerHTML = `<p style="color: #444; font-size: 0.8rem;">${currentLang === 'ar' ? 'لا توجد خيارات ألوان متاحة.' : 'No color variants available.'}</p>`;
  }

  const sizeContainer = document.getElementById('sizeOptions');
  sizeContainer.innerHTML = '';
  if(sizes && sizes.length > 0){
    sizes.forEach((size, index) => {
      const b = document.createElement('button');
      b.className = 'size-btn' + (index === 0 ? ' active' : '');
      b.innerText = size;
      b.onclick = function () {
        document.querySelectorAll('.size-btn').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
      };
      sizeContainer.appendChild(b);
    });
  }

  document.getElementById('modalQty').value = 1;

  document.getElementById('productModal').style.display = 'block';
  document.body.style.overflow = 'hidden'; // Stop background scrolling

  // Re-init icons in modal
  if (window.lucide) {
    lucide.createIcons();
  }
}

function changeQty(delta) {
  const input = document.getElementById('modalQty');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  input.value = val;
}

function closeModal() {
  document.getElementById('productModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function sendOrder() {
  const productName = document.getElementById('modalTitle').innerText;
  const price = document.getElementById('modalPrice').innerText;
  const selectedSize = document.querySelector('.size-btn.active');
  const sizeValue = selectedSize ? selectedSize.innerText : '';
  const qtyValue = document.getElementById('modalQty').value;
  
  if (!selectedSize) {
    alert(currentLang === 'ar' ? "من فضلك اختر المقاس أولاً" : "Please select a size first");
    return;
  }

  const mainImg = document.getElementById('modalMainImg').src;
  const url = `checkout.html?item=${encodeURIComponent(productName)}&price=${encodeURIComponent(price)}&size=${encodeURIComponent(sizeValue)}&color=${encodeURIComponent(selectedColorName)}&qty=${encodeURIComponent(qtyValue)}&lang=${currentLang}&img=${encodeURIComponent(mainImg)}`;
  window.location.href = url;
}

window.onclick = function (event) {
  const modal = document.getElementById('productModal');
  if (event.target == modal) {
    closeModal();
  }
};
