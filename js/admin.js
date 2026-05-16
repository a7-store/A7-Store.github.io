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
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// UI Elements
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const loginMsg = document.getElementById('login-msg');
const msg = document.getElementById('msg');
const addBtn = document.getElementById('add-btn');

// Check Auth State
auth.onAuthStateChanged((user) => {
  if (user) {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    loadProducts();
  } else {
    loginSection.style.display = 'block';
    adminSection.style.display = 'none';
  }
});

// Login / Register Logic
async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    loginMsg.innerText = "الرجاء إدخال البريد وكلمة المرور.";
    return;
  }

  try {
    loginMsg.innerText = "جاري تسجيل الدخول...";
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    // If user not found, create new account automatically
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      try {
        loginMsg.innerText = "جاري إنشاء الحساب لأول مرة...";
        await auth.createUserWithEmailAndPassword(email, password);
      } catch (err2) {
        loginMsg.innerText = "خطأ: " + err2.message;
      }
    } else {
      loginMsg.innerText = "خطأ: " + error.message;
    }
  }
}

// Logout
function logout() {
  auth.signOut();
}

let editModeId = null;
let allProductsData = {};
// Image upload logic removed as per request

// Image rendering and compression functions removed

// Add or Update Product
async function addProduct() {
  const nameAr = document.getElementById('p_name_ar').value.trim();
  const nameEn = document.getElementById('p_name_en').value.trim();
  const price = document.getElementById('p_price').value.trim();
  const oldPrice = document.getElementById('p_old_price').value.trim();
  const offerEndDate = document.getElementById('p_offer_end_date').value;
  const category = document.getElementById('p_category').value;
  const descAr = document.getElementById('p_desc_ar').value.trim();
  const descEn = document.getElementById('p_desc_en').value.trim();
  const sizes = document.getElementById('p_sizes').value.trim();
  const colors = document.getElementById('p_colors').value.trim();
  if (!nameAr || !nameEn || !price) {
    msg.innerText = "الرجاء ملء الاسم والسعر.";
    msg.style.color = "#e74c3c";
    return;
  }

  addBtn.disabled = true;
  addBtn.innerText = editModeId ? "جاري التحديث... يرجى الانتظار" : "جاري الرفع... يرجى الانتظار";
  msg.innerText = "";

  try {
    let finalImages = editModeId ? allProductsData[editModeId].images : ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&text=Beauty"];


    const sizesArr = sizes ? sizes.split(',').map(s => s.trim()).filter(s => s) : [];
    const colorsArr = colors ? colors.split(',').map(c => c.trim()).filter(c => c) : [];
    
    let offerEnd = null;
    if (offerEndDate) {
      const d = new Date(offerEndDate);
      if (!isNaN(d.getTime())) {
        d.setHours(23, 59, 59, 999);
        offerEnd = d.getTime();
      }
    }

    const productData = {
      name_ar: nameAr,
      name_en: nameEn,
      price: Number(price),
      old_price: oldPrice ? Number(oldPrice) : null,
      offer_end: offerEnd,
      category: category,
      desc_ar: descAr,
      desc_en: descEn,
      sizes: sizesArr,
      colors: colorsArr,
      images: finalImages
    };

    if (editModeId) {
      // Update existing
      await db.collection('products').doc(editModeId).update(productData);
      msg.innerText = "تم تحديث المنتج بنجاح! 🎉";
    } else {
      // Create new
      productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('products').add(productData);
      msg.innerText = "تمت إضافة المنتج بنجاح! 🎉";
    }
    
    msg.style.color = "#2ecc71";
    cancelEdit(); // Clears form and resets state

  } catch (error) {
    console.error(error);
    msg.innerText = "حدث خطأ: " + error.message;
    msg.style.color = "#e74c3c";
  }

  addBtn.disabled = false;
  addBtn.innerText = editModeId ? "حفظ التعديلات" : "إضافة المنتج للموقع";
}



// Edit Product Form Fill
function editProduct(id) {
  const p = allProductsData[id];
  if (!p) return;

  editModeId = id;
  document.getElementById('p_name_ar').value = p.name_ar || '';
  document.getElementById('p_name_en').value = p.name_en || '';
  document.getElementById('p_price').value = p.price || '';
  document.getElementById('p_old_price').value = p.old_price || '';
  
  if (p.offer_end) {
    const d = new Date(p.offer_end);
    document.getElementById('p_offer_end_date').value = d.toISOString().split('T')[0];
  } else {
    document.getElementById('p_offer_end_date').value = '';
  }
  
  document.getElementById('p_category').value = p.category || 'hoodies';
  document.getElementById('p_desc_ar').value = p.desc_ar || '';
  document.getElementById('p_desc_en').value = p.desc_en || '';
  document.getElementById('p_sizes').value = p.sizes ? p.sizes.join(', ') : '';
  document.getElementById('p_colors').value = p.colors ? p.colors.join(', ') : '';
  
  // Image handling removed as per request


  // Show cancel button if not exists
  let cancelBtn = document.getElementById('cancel-edit-btn');
  if (!cancelBtn) {
    cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-edit-btn';
    cancelBtn.className = 'btn btn-danger';
    cancelBtn.style.marginTop = '10px';
    cancelBtn.innerText = 'إلغاء التعديل';
    cancelBtn.onclick = cancelEdit;
    addBtn.parentNode.insertBefore(cancelBtn, addBtn.nextSibling);
  }
  cancelBtn.style.display = 'block';

  addBtn.innerText = "حفظ التعديلات";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cancel Edit Mode
function cancelEdit() {
  editModeId = null;
  // Image handle reset removed

  document.getElementById('p_name_ar').value = '';
  document.getElementById('p_name_en').value = '';
  document.getElementById('p_price').value = '';
  document.getElementById('p_old_price').value = '';
  document.getElementById('p_offer_end_date').value = '';
  document.getElementById('p_desc_ar').value = '';
  document.getElementById('p_desc_en').value = '';
  document.getElementById('p_sizes').value = '';
  document.getElementById('p_colors').value = '';
  
  addBtn.innerText = "إضافة المنتج للموقع";
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.style.display = 'none';
}



// Load Products
function loadProducts() {
  const loading = document.getElementById('loading-products');
  const list = document.getElementById('products-list');
  const count = document.getElementById('p-count');

  loading.style.display = 'block';
  list.innerHTML = '';

  db.collection('products').onSnapshot((snapshot) => {
    loading.style.display = 'none';
    list.innerHTML = '';
    count.innerText = snapshot.size;
    allProductsData = {}; // clear cache

    let productsArray = [];
    snapshot.forEach((doc) => {
      const p = doc.data();
      allProductsData[doc.id] = p; // save for editing
      productsArray.push({ id: doc.id, data: p });
    });

    // Sort locally to ensure products missing createdAt are not excluded
    productsArray.sort((a, b) => {
      const tA = a.data.createdAt && typeof a.data.createdAt.toMillis === 'function' ? a.data.createdAt.toMillis() : 0;
      const tB = b.data.createdAt && typeof b.data.createdAt.toMillis === 'function' ? b.data.createdAt.toMillis() : 0;
      return tB - tA;
    });

    productsArray.forEach((item) => {
      const p = item.data;
      const div = document.createElement('div');
      div.className = 'product-item';
      div.innerHTML = `
        <div style="display:flex; align-items:center;">
          <img src="${p.images && p.images[0] ? p.images[0] : ''}" alt="${p.name_ar}">
          <div class="product-info">
            <strong>${p.name_ar} | ${p.name_en}</strong><br>
            <span style="color:#aaa;">السعر: ${p.price} جنيه | القسم: ${p.category}</span>
          </div>
        </div>
        <div class="product-actions" style="display:flex; gap:10px;">
          <button class="btn" style="background:#3498db; color:white; width:auto; padding:8px 15px;" onclick="editProduct('${item.id}')">تعديل</button>
          <button class="btn btn-danger" onclick="deleteProduct('${item.id}')">حذف</button>
        </div>
      `;
      list.appendChild(div);
    });
  }, (error) => {
    console.error(error);
    loading.innerText = "خطأ في تحميل المنتجات: " + error.message;
  });
}

// Delete Product
async function deleteProduct(id) {
  if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
    try {
      await db.collection('products').doc(id).delete();
      if (editModeId === id) cancelEdit();
    } catch (error) {
      alert("حدث خطأ: " + error.message);
    }
  }
}
