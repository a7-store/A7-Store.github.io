// js/script.js

const firebaseConfig = {
  // Version: 1.2 (Updated Limit)
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

// Enable offline caching for instant loads
db.enablePersistence().catch(function(err) {
  console.log("Firebase persistence error:", err);
});

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

  // Initialize Background Sparkles
  initSparkles();
});

function initSparkles() {
  const container = document.getElementById('sparkles-container');
  if (!container) return;
  
  const count = 50;
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    const size = Math.random() * 3 + 1 + 'px';
    sparkle.style.width = size;
    sparkle.style.height = size;
    
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    
    const duration = Math.random() * 3 + 2 + 's';
    const delay = Math.random() * 5 + 's';
    
    sparkle.style.setProperty('--duration', duration);
    sparkle.style.setProperty('--delay', delay);
    
    container.appendChild(sparkle);
  }
}

function fetchProducts() {
  const grid = document.getElementById('collection-grid');
  const spinner = document.getElementById('loading-spinner');
  
  db.collection('products').orderBy('createdAt', 'desc').limit(50).onSnapshot(async (snapshot) => { // Force Limit 50
    // Auto-migrate default products if DB is empty
    if (snapshot.empty) {
      if (allProducts.length === 0) {
        await seedDefaultProducts();
      }
      return; 
    }
    
    if (spinner) spinner.style.display = 'none';
    allProducts = [];
    
    let htmlString = '';
    snapshot.forEach(doc => {
      const p = doc.data();
      p.id = doc.id;
      allProducts.push(p);
      htmlString += renderProductCard(p, null);
    });
    
    if (grid) grid.innerHTML = htmlString;
    
    // Explicitly apply the current active category filter to newly added products
    const activeBtn = document.querySelector('.cat-btn.active');
    const activeCategory = activeBtn ? activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'all';
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
      if (activeCategory === 'all' || product.getAttribute('data-category') === activeCategory) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });

    // Also force the collection section to be visible in case IntersectionObserver missed it
    const collectionSection = document.getElementById('collection');
    if (collectionSection) {
      collectionSection.classList.add('visible');
    }
    
  }, (error) => {
    console.error("Error fetching products: ", error);
    if(spinner) spinner.innerHTML = "Error loading products.";
  });
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
  const sizesStr = encodeURIComponent(JSON.stringify(p.sizes && p.sizes.length > 0 ? p.sizes : ['One Size']));
  const colorsStr = encodeURIComponent(JSON.stringify(p.colors && p.colors.length > 0 ? p.colors : ['black', 'white']));
  
  const cardHTML = `
    <div class="product-card" data-category="${p.category}" style="position:relative;">
      ${discountBadge}
      <div class="product-img-wrapper" style="position:relative;">
        <img src="${mainImage}" alt="${name}" class="product-img" loading="lazy">
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
  
  if (grid) {
    grid.insertAdjacentHTML('beforeend', cardHTML);
  }
  return cardHTML;
}

function openDynamicModal(name, price, imagesStr, sizesStr, colorsStr) {
  const images = JSON.parse(decodeURIComponent(imagesStr));
  const sizes = JSON.parse(decodeURIComponent(sizesStr));
  const colors = JSON.parse(decodeURIComponent(colorsStr));
  const displayPrice = `LE${price}${currentLang === 'ar' ? ' جنيه' : 'EGP'}`;
  openModal(name, displayPrice, sizes, images, colors);
}

async function seedDefaultProducts() {
  const beautyProducts = [
    // Skincare (12)
    { name_en: "Rose Water Glow Mist", name_ar: "رذاذ الورد لنضارة البشرة", price: 150, category: "skincare", desc_en: "Natural rose water for instant hydration.", desc_ar: "ماء ورد طبيعي لترطيب فوري.", images: ["https://images.unsplash.com/photo-1599305090598-fe179d501227?w=600&fit=crop"] },
    { name_en: "Vitamin C Brightening Serum", name_ar: "سيروم فيتامين سي للتفتيح", price: 350, category: "skincare", desc_en: "Boosts radiance and evens skin tone.", desc_ar: "يعزز الإشراق ويوحد لون البشرة.", images: ["https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=600&fit=crop"] },
    { name_en: "Hyaluronic Acid Gel", name_ar: "جل الهيالورونيك لترطيب عميق", price: 420, category: "skincare", desc_en: "Deep hydration for a youthful look.", desc_ar: "ترطيب عميق لمظهر شبابي.", images: ["https://images.unsplash.com/photo-1617897903246-719242758050?w=600&fit=crop"] },
    { name_en: "Night Recovery Oil", name_ar: "زيت التعافي الليلي", price: 480, category: "skincare", desc_en: "Nourishes skin while you sleep.", desc_ar: "يغذي البشرة أثناء النوم.", images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&fit=crop"] },
    { name_en: "Charcoal Detox Mask", name_ar: "قناع الفحم للتنقية", price: 120, category: "skincare", desc_en: "Deep cleans pores and removes impurities.", desc_ar: "ينظف المسام بعمق ويزيل الشوائب.", images: ["https://images.unsplash.com/photo-1615397323356-11f81d5854ad?w=600&fit=crop"] },
    { name_en: "Jade Facial Roller", name_ar: "أداة تدليك الوجه (اليشم)", price: 250, category: "skincare", desc_en: "Reduces puffiness and improves circulation.", desc_ar: "يقلل الانتفاخ ويحسن الدورة الدموية.", images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&fit=crop"] },
    { name_en: "Sun Defense SPF 50", name_ar: "واقي شمس SPF 50", price: 290, category: "skincare", desc_en: "Lightweight protection against UV rays.", desc_ar: "حماية خفيفة الوزن ضد الأشعة فوق البنفسجية.", images: ["https://cdn.dummyjson.com/product-images/skin-care/olay-ultra-moisture-shea-butter-body-wash/1.webp"] },
    { name_en: "Under-Eye Revival Patches", name_ar: "لصقات إحياء منطقة تحت العين", price: 85, category: "skincare", desc_en: "Smooths fine lines and dark circles.", desc_ar: "ينعم الخطوط الدقيقة والهالات السوداء.", images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&fit=crop"] },
    { name_en: "Gentle Cleansing Foam", name_ar: "رغوة تنظيف لطيفة", price: 180, category: "skincare", desc_en: "Cleanses without stripping natural oils.", desc_ar: "ينظف دون تجريد الزيوت الطبيعية.", images: ["https://cdn.dummyjson.com/product-images/skin-care/attitude-super-leaves-hand-soap/1.webp"] },
    { name_en: "Exfoliating Coffee Scrub", name_ar: "مقشر القهوة للجسم", price: 140, category: "skincare", desc_en: "Softens skin and improves texture.", desc_ar: "ينعم البشرة ويحسن ملمسها.", images: ["https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&fit=crop"] },
    { name_en: "Aloe Vera Soothing Gel", name_ar: "جل الصبار المهدئ", price: 110, category: "skincare", desc_en: "Instant relief for sun-exposed skin.", desc_ar: "راحة فورية للبشرة المعرضة للشمس.", images: ["https://cdn.dummyjson.com/product-images/skin-care/vaseline-men-body-and-face-lotion/1.webp"] },
    { name_en: "Retinol Anti-Aging Cream", name_ar: "كريم الريتينول لمكافحة الشيخوخة", price: 550, category: "skincare", desc_en: "Reduces wrinkles and firms skin.", desc_ar: "يقلل التجاعيد ويشد البشرة.", images: ["https://images.unsplash.com/photo-1583241496466-930ffc878e47?w=600&fit=crop"] },

    // Makeup (13)
    { name_en: "Matte Liquid Lipstick", name_ar: "أحمر شفاه سائل مطفي", price: 190, category: "makeup", desc_en: "Long-lasting color with a velvet finish.", desc_ar: "لون يدوم طويلاً مع ملمس مخملي.", images: ["https://cdn.dummyjson.com/product-images/beauty/red-lipstick/1.webp"] },
    { name_en: "Midnight Mascara", name_ar: "ماسكارا منتصف الليل", price: 220, category: "makeup", desc_en: "Volume and length for dramatic lashes.", desc_ar: "كثافة وطول لرموش درامية.", images: ["https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"] },
    { name_en: "Golden Hour Highlighter", name_ar: "هايلايتر الساعة الذهبية", price: 280, category: "makeup", desc_en: "Shimmery glow for a sun-kissed look.", desc_ar: "توهج لامع لمظهر مشرق.", images: ["https://images.unsplash.com/photo-1512496015851-a1faebefadd9?w=600&fit=crop"] },
    { name_en: "Precision Eyeliner Pen", name_ar: "قلم آيلاينر دقيق", price: 160, category: "makeup", desc_en: "Waterproof and smudge-proof application.", desc_ar: "مقاوم للماء والتلطخ.", images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&fit=crop"] },
    { name_en: "Velvet Foundation Stick", name_ar: "عصا كريم أساس مخملي", price: 340, category: "makeup", desc_en: "Full coverage with a natural finish.", desc_ar: "تغطية كاملة مع لمسة طبيعية.", images: ["https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp"] },
    { name_en: "Nude Eyeshadow Palette", name_ar: "باليت ظلال عيون ترابية", price: 450, category: "makeup", desc_en: "12 versatile shades for any occasion.", desc_ar: "12 درجة متنوعة لكل المناسبات.", images: ["https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp"] },
    { name_en: "Peach Blush Compact", name_ar: "بلاشر خوخي مدمج", price: 210, category: "makeup", desc_en: "Natural flush for healthy-looking cheeks.", desc_ar: "توريد طبيعي لخدود تبدو صحية.", images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&fit=crop"] },
    { name_en: "Eyebrow Sculpting Kit", name_ar: "مجموعة نحت الحواجب", price: 240, category: "makeup", desc_en: "Defines and fills for perfect brows.", desc_ar: "يحدد ويملأ لحواجب مثالية.", images: ["https://images.unsplash.com/photo-1625080036655-b46eb24e4d41?w=600&fit=crop"] },
    { name_en: "Glossy Lip Tint", name_ar: "تنت شفاه لامع", price: 130, category: "makeup", desc_en: "Sheer color with a high-shine finish.", desc_ar: "لون شفاف مع لمعان عالٍ.", images: ["https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp"] },
    { name_en: "Makeup Setting Spray", name_ar: "بخاخ مثبت مكياج", price: 270, category: "makeup", desc_en: "Locks in your look all day long.", desc_ar: "يثبت مظهرك طوال اليوم.", images: ["https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&fit=crop"] },
    { name_en: "Concealer Wand", name_ar: "خافي عيوب سائل", price: 180, category: "makeup", desc_en: "Hides imperfections and brightens eyes.", desc_ar: "يخفي العيوب ويفتح منطقة العين.", images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&fit=crop"] },
    { name_en: "Bronze Goddess Powder", name_ar: "بودرة برونزر آلهة البرونز", price: 310, category: "makeup", desc_en: "Warmth and definition for the face.", desc_ar: "دفء وتحديد للوجه.", images: ["https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&fit=crop"] },
    { name_en: "Lip Liner Pencil", name_ar: "قلم تحديد شفاه", price: 90, category: "makeup", desc_en: "Prevents feathering and defines lips.", desc_ar: "يمنع التلطخ ويحدد الشفاه.", images: ["https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&fit=crop"] },

    // Hair Accessories (12)
    { name_en: "Silk Scrunchie Set", name_ar: "مجموعة توك حرير", price: 120, category: "hair", desc_en: "Gentle on hair, prevents breakage.", desc_ar: "لطيفة على الشعر وتمنع التكسر.", images: ["https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/1.webp"] },
    { name_en: "Pearl Hair Clip", name_ar: "مشبك شعر لؤلؤي", price: 75, category: "hair", desc_en: "Elegant accessory for any hairstyle.", desc_ar: "إكسسوار أنيق لأي تسريحة شعر.", images: ["https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/1.webp"] },
    { name_en: "Velvet Headband", name_ar: "بندانا مخملية", price: 95, category: "hair", desc_en: "Stylish and comfortable all-day wear.", desc_ar: "أنيقة ومريحة للارتداء طوال اليوم.", images: ["https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=600&fit=crop"] },
    { name_en: "Matte Claw Clip", name_ar: "توكة كليب مطفية", price: 60, category: "hair", desc_en: "Strong hold for thick hair.", desc_ar: "ثبات قوي للشعر الكثيف.", images: ["https://images.unsplash.com/photo-1583241496466-930ffc878e47?w=600&fit=crop"] },
    { name_en: "Boho Floral Band", name_ar: "طوق شعر بوهيمي مشجر", price: 80, category: "hair", desc_en: "Perfect for summer outings.", desc_ar: "مثالي للخروجات الصيفية.", images: ["https://cdn.dummyjson.com/product-images/fragrances/dior-jadore/1.webp"] },
    { name_en: "Satin Sleep Cap", name_ar: "بونية ستان للنوم", price: 150, category: "hair", desc_en: "Protects curls and reduces frizz.", desc_ar: "يحمي الكيرلي ويقلل الهيشان.", images: ["https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/1.webp"] },
    { name_en: "Gold Minimalist Pins", name_ar: "بنس شعر ذهبية بسيطة", price: 45, category: "hair", desc_en: "Set of 5 chic metal pins.", desc_ar: "مجموعة من 5 بنس معدنية شيك.", images: ["https://images.unsplash.com/photo-1615397323356-11f81d5854ad?w=600&fit=crop"] },
    { name_en: "Geometric Hair Barrette", name_ar: "توكة شعر هندسية", price: 70, category: "hair", desc_en: "Modern design for a sleek look.", desc_ar: "تصميم عصري لمظهر انسيابي.", images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&fit=crop"] },
    { name_en: "Braided Leather Band", name_ar: "طوق شعر جلد مضفر", price: 110, category: "hair", desc_en: "Adds a touch of edge to your style.", desc_ar: "يضيف لمسة جريئة لأسلوبك.", images: ["https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/1.webp"] },
    { name_en: "Crystal Hair Comb", name_ar: "مشط شعر كريستال", price: 180, category: "hair", desc_en: "Sparkling accessory for special events.", desc_ar: "إكسسوار لامع للمناسبات الخاصة.", images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&fit=crop"] },
    { name_en: "Tortoise Shell Clip", name_ar: "مشبك نقشة النمر", price: 65, category: "hair", desc_en: "Classic pattern that never goes out of style.", desc_ar: "نقشة كلاسيكية لا تنتهي موضتها.", images: ["https://images.unsplash.com/photo-1512496015851-a1faebefadd9?w=600&fit=crop"] },
    { name_en: "Sports Grip Headband", name_ar: "بندانا رياضية مانعة للانزلاق", price: 55, category: "hair", desc_en: "Keeps hair back during workouts.", desc_ar: "يبقي الشعر للخلف أثناء التمارين.", images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&fit=crop"] },

    // Beauty Tools (13)
    { name_en: "Professional Brush Set", name_ar: "مجموعة فرش احترافية", price: 650, category: "tools", desc_en: "15 high-quality synthetic brushes.", desc_ar: "15 فرشاة صناعية عالية الجودة.", images: ["https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&fit=crop"] },
    { name_en: "Beauty Blending Sponge", name_ar: "إسفنجة دمج المكياج", price: 80, category: "tools", desc_en: "For a flawless, airbrushed finish.", desc_ar: "للحصول على لمسة نهائية مثالية.", images: ["https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&fit=crop"] },
    { name_en: "Heated Eyelash Curler", name_ar: "مكبس رموش حراري", price: 210, category: "tools", desc_en: "Quick and safe curl for your lashes.", desc_ar: "ثني سريع وآمن لرموشك.", images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&fit=crop"] },
    { name_en: "LED Vanity Mirror", name_ar: "مرآة ليد للمكياج", price: 580, category: "tools", desc_en: "Adjustable brightness for perfect lighting.", desc_ar: "إضاءة قابلة للتعديل لمكياج مثالي.", images: ["https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=600&fit=crop"] },
    { name_en: "Electronic Pore Vacuum", name_ar: "شفاط دهون المسام الإلكتروني", price: 420, category: "tools", desc_en: "Deep suction to remove blackheads.", desc_ar: "شفط عميق لإزالة الرؤوس السوداء.", images: ["https://images.unsplash.com/photo-1617897903246-719242758050?w=600&fit=crop"] },
    { name_en: "Rose Gold Tweezers", name_ar: "ملقاط روز جولد", price: 50, category: "tools", desc_en: "Precision grip for easy plucking.", desc_ar: "قبضة دقيقة لسهولة الاستخدام.", images: ["https://images.unsplash.com/photo-1599305090598-fe179d501227?w=600&fit=crop"] },
    { name_en: "Facial Steamer", name_ar: "جهاز بخار للوجه", price: 750, category: "tools", desc_en: "Opens pores for better absorption.", desc_ar: "يفتح المسام لامتصاص أفضل.", images: ["https://images.unsplash.com/photo-1615397323356-11f81d5854ad?w=600&fit=crop"] },
    { name_en: "Makeup Organizer Case", name_ar: "شنطة منظم مكياج", price: 320, category: "tools", desc_en: "Keeps your collection tidy and portable.", desc_ar: "تحافظ على مجموعتك مرتبة وسهلة الحمل.", images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&fit=crop"] },
    { name_en: "Silicone Brush Cleaner", name_ar: "منظف فرش سيليكون", price: 45, category: "tools", desc_en: "Quickly removes makeup residue.", desc_ar: "يزيل بقايا المكياج بسرعة.", images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&fit=crop"] },
    { name_en: "Micro-Needle Roller", name_ar: "ديرما رولر", price: 260, category: "tools", desc_en: "Stimulates collagen and skin repair.", desc_ar: "يحفز الكولاجين وإصلاح البشرة.", images: ["https://images.unsplash.com/photo-1583241496466-930ffc878e47?w=600&fit=crop"] },
    { name_en: "Face Mask Applicator", name_ar: "فرشاة فرد ماسك الوجه", price: 35, category: "tools", desc_en: "Hygienic application of creams and masks.", desc_ar: "توزيع صحي للكريمات والأقنعة.", images: ["https://images.unsplash.com/photo-1625080036655-b46eb24e4d41?w=600&fit=crop"] },
    { name_en: "Electric Foot File", name_ar: "مبرد قدم كهربائي", price: 380, category: "tools", desc_en: "Removes calluses for soft feet.", desc_ar: "يزيل الجلد الميت لقدمين ناعمتين.", images: ["https://images.unsplash.com/photo-1512496015851-a1faebefadd9?w=600&fit=crop"] },
    { name_en: "Sonic Cleansing Brush", name_ar: "فرشاة تنظيف بالموجات الصوتية", price: 490, category: "tools", desc_en: "Vibrating brush for deep facial cleansing.", desc_ar: "فرشاة مهتزة لتنظيف الوجه بعمق.", images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&fit=crop"] }
  ];
  
  const batch = db.batch();
  for (const p of beautyProducts) {
    p.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    p.sizes = ["One Size"];
    p.colors = ["Rose Gold", "Silver", "Elegant Black"];
    const docRef = db.collection('products').doc();
    batch.set(docRef, p);
  }
  await batch.commit();
  // onSnapshot will handle the UI update automatically
}

// Add this function to the global scope to allow users to reset their DB
window.resetAndSeedBeauty = async function() {
  if (confirm("This will delete all current products and add 50 beauty products. Proceed?")) {
    const snapshot = await db.collection('products').get();
    const batch = db.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    await seedDefaultProducts();
    alert("Brand converted successfully!");
  }
};

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

function filterCategory(category, btnElement) {
  const products = document.querySelectorAll('.product-card');
  const buttons = document.querySelectorAll('.cat-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (btnElement) {
    btnElement.classList.add('active');
  } else if (typeof event !== 'undefined' && event && event.target) {
    event.target.classList.add('active');
  } else {
    // Fallback: try to find the button for this category
    const targetBtn = document.querySelector(`.cat-btn[onclick*="'${category}'"]`);
    if (targetBtn) targetBtn.classList.add('active');
  }

  products.forEach(product => {
    if (category === 'all' || product.getAttribute('data-category') === category) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });

  // Scroll to collection start
  const collection = document.getElementById('collection');
  if (collection && typeof event !== 'undefined' && event && event.type === 'click') {
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
    hero_title: "A7 Beauty",
    hero_title_main: "A Magical Touch for Eternal Glow",
    hero_desc: "Discover the finest beauty products and care accessories that give you confidence and elegance in every moment.",
    hero_explore: "Explore Collection",
    hero_contact: "Contact Us",
    about_title: "About A7 Beauty",
    about_p1: "A7 Beauty is a premium brand dedicated to high-quality beauty accessories and skincare tools. We believe in enhancing your natural beauty with the finest materials and elegant designs.",
    about_p2: "Our curated selection includes everything from professional makeup brushes to luxury skin rollers, ensuring you have the best tools for your beauty routine.",
    collection_title: "Our Beauty Collection",
    view_buy: "View / Buy",

    contact_title: "Get in Touch",
    contact_subtitle: "Reach out for inquiries or beauty tips.",
    form_name: "Your Name",
    form_email: "Your Email",
    form_phone: "Your Phone Number",
    form_message: "Your Message (Optional)",
    form_submit: "Send Message",
    contact_whatsapp: 'WhatsApp',
    contact_instagram: 'Instagram',
    contact_facebook: 'Facebook',
    contact_tiktok: 'TikTok',
    footer_brand: "A7 Beauty",
    footer_desc: "A7 Modern Beauty & Premium Accessories.",
    footer_quick_links: "Quick Links",
    footer_follow: "Follow Us",
    footer_copy: "© 2026 A7 Beauty. All rights reserved.",
    back_to_top: "Back to Top",
    modal_color: "Select Shade/Color:",
    modal_size: "Select Size/Option:",
    modal_confirm: "Confirm Order",
    lang_btn: "العربية",
    lbl_days: "Days",
    lbl_hours: "Hours",
    lbl_mins: "Mins",
    lbl_secs: "Secs",
    admin_panel: "Admin Panel",


    modal_qty: "Quantity:",
    feat_quality: "Premium Quality",
    feat_quality_desc: "Dermatologically tested & high-grade materials.",
    feat_shipping: "Fast Delivery",
    feat_shipping_desc: "Safe & quick delivery to your doorstep.",
    feat_exchange: "Easy Returns",
    feat_exchange_desc: "Flexible 14-day return policy.",
    feat_material: "Eco-Friendly",
    feat_design: "Elegant Design",
    cat_all: "All Products",
    cat_skincare: "Skincare",
    cat_makeup: "Makeup",
    cat_hair: "Hair Accessories",
    cat_tools: "Beauty Tools",
    search_placeholder: "Search for beauty products...",
    loading_products: "Loading collection..."
  },
  ar: {
    nav_home: "الرئيسية",
    nav_about: "من نحن",
    nav_collection: "المجموعات",

    nav_contact: "اتصل بنا",
    hero_title: "A7 Beauty",
    hero_title_main: "لمسة سحرية لتألق لا ينطفئ",
    hero_desc: "اكتشفي أرقى منتجات التجميل وإكسسوارات العناية التي تمنحك الثقة والأناقة في كل لحظة.",
    hero_explore: "استكشف المجموعة",
    hero_contact: "اتصل بنا",
    about_title: "عن A7 Beauty",
    about_p1: "A7 Beauty هي علامة تجارية رائدة متخصصة في إكسسوارات التجميل وأدوات العناية بالبشرة عالية الجودة. نؤمن بتعزيز جمالك الطبيعي من خلال أرقى الخامات والتصاميم الأنيقة.",
    about_p2: "تشمل مجموعتنا المختارة كل شيء من فرش المكياج الاحترافية إلى أدوات تدليك البشرة الفاخرة، مما يضمن حصولك على أفضل الأدوات لروتين جمالك.",
    collection_title: "مجموعة الجمال",
    view_buy: "عرض / شراء",

    contact_title: "تواصل معنا",
    contact_subtitle: "تواصل معنا للاستفسارات أو نصائح الجمال.",
    form_name: "اسمك",
    form_email: "بريدك الإلكتروني",
    form_phone: "رقم هاتفك",
    form_message: "رسالتك (اختياري)",
    form_submit: "إرسال الرسالة",
    contact_whatsapp: 'واتساب',
    contact_instagram: 'إنستجرام',
    contact_facebook: 'فيسبوك',
    contact_tiktok: 'تيك توك',
    footer_brand: "A7 Beauty",
    footer_desc: "A7 للجمال الحديث والإكسسوارات الفاخرة.",
    footer_quick_links: "روابط سريعة",
    footer_follow: "تابعنا",
    footer_copy: "© 2026 A7 Beauty. جميع الحقوق محفوظة.",
    back_to_top: "العودة للأعلى",
    modal_color: "اختر الدرجة/اللون:",
    modal_size: "اختر الحجم/الخيار:",
    modal_confirm: "تأكيد الطلب",
    lang_btn: "English",
    lbl_days: "أيام",
    lbl_hours: "ساعة",
    lbl_mins: "دقيقة",
    lbl_secs: "ثانية",
    admin_panel: "لوحة التحكم",


    modal_qty: "الكمية:",
    feat_quality: "جودة ممتازة",
    feat_quality_desc: "مختبرة جلدياً ومن مواد عالية الجودة.",
    feat_shipping: "شحن سريع",
    feat_shipping_desc: "توصيل آمن وسريع لباب منزلك.",
    feat_exchange: "إرجاع سهل",
    feat_exchange_desc: "سياسة إرجاع مرنة خلال 14 يوماً.",
    feat_material: "صديق للبيئة",
    feat_design: "تصميم أنيق",
    cat_all: "كل المنتجات",
    cat_skincare: "العناية بالبشرة",
    cat_makeup: "مكياج",
    cat_hair: "إكسسوارات شعر",
    cat_tools: "أدوات تجميل",
    search_placeholder: "ابحث عن منتجات الجمال...",
    loading_products: "جاري تحميل المجموعة..."
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
