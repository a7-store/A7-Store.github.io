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
let currentEditImages = []; // URLs from server
let pendingFiles = []; // local Files to upload

// Listen to file input changes to append instead of replace
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('p_image');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      for (let i = 0; i < e.target.files.length; i++) {
        pendingFiles.push(e.target.files[i]);
      }
      fileInput.value = ''; // clear input so user can click again
      renderExistingImages();
    });
  }
});

function renderExistingImages() {
  const container = document.getElementById('existing-images-container');
  container.innerHTML = '';
  
  // Combine server images and local pending files for display
  const allDisplayImages = [
    ...currentEditImages.map(url => ({ type: 'server', src: url, data: url })),
    ...pendingFiles.map(file => ({ type: 'local', src: URL.createObjectURL(file), data: file }))
  ];

  allDisplayImages.forEach((imgObj, index) => {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = '100px';
    div.style.height = '120px';
    div.style.border = index === 0 ? '3px solid #2ecc71' : '1px solid #ccc';
    div.style.borderRadius = '5px';
    div.style.padding = '5px';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'center';
    
    const imgEl = document.createElement('img');
    imgEl.src = imgObj.src;
    imgEl.style.width = '100%';
    imgEl.style.height = '70px';
    imgEl.style.objectFit = 'cover';
    imgEl.style.borderRadius = '3px';
    
    const label = document.createElement('span');
    label.style.fontSize = '10px';
    label.style.color = index === 0 ? '#2ecc71' : '#888';
    label.style.fontWeight = index === 0 ? 'bold' : 'normal';
    label.innerText = index === 0 ? 'الأساسية' : 'فرعية';
    
    const makeMainBtn = document.createElement('button');
    makeMainBtn.innerText = 'جعلها الأساسية';
    makeMainBtn.style.fontSize = '9px';
    makeMainBtn.style.marginTop = '2px';
    makeMainBtn.style.cursor = 'pointer';
    makeMainBtn.onclick = (e) => {
      e.preventDefault();
      // Move this item to index 0
      if (imgObj.type === 'server') {
        const idx = currentEditImages.indexOf(imgObj.data);
        currentEditImages.splice(idx, 1);
        currentEditImages.unshift(imgObj.data);
      } else {
        const idx = pendingFiles.indexOf(imgObj.data);
        pendingFiles.splice(idx, 1);
        // to make it absolutely first, we need to move it to server images if there are any?
        // Let's just swap it with index 0 of the combined array... Wait, it's easier to just manage one array.
        // For simplicity, if they make a local file main, we put it at the start of pendingFiles,
        // AND if there are server images, we must clear them or move them? 
        // Best approach: If we just want to make it main, it must be the FIRST item overall.
        // If it's local, we move it to start of pendingFiles, and we also move all currentEditImages AFTER pendingFiles?
        // No, let's keep it simple: Just swap with index 0 of whichever array, but visual order might not match.
        // Actually, let's just re-order the underlying arrays.
      }
      
      // Let's simplify: 
      // If we want to move an image to the absolute front:
      if (index > 0) {
        if (imgObj.type === 'server') {
           const idx = currentEditImages.indexOf(imgObj.data);
           currentEditImages.splice(idx, 1);
           currentEditImages.unshift(imgObj.data);
        } else {
           const idx = pendingFiles.indexOf(imgObj.data);
           pendingFiles.splice(idx, 1);
           // We need it to be first overall. If currentEditImages has items, local file can't be first unless we change logic.
           // Let's just put it at start of pendingFiles.
           pendingFiles.unshift(imgObj.data);
           // AND swap currentEditImages out? 
           // Let's just warn:
           alert('لجعل صورة جديدة هي الأساسية، يجب أن تحذف الصور القديمة أو سيتم رفعها كصورة ثانية.');
        }
      }
      renderExistingImages();
    };
    
    const delBtn = document.createElement('button');
    delBtn.innerText = 'X';
    delBtn.style.position = 'absolute';
    delBtn.style.top = '-5px';
    delBtn.style.right = '-5px';
    delBtn.style.background = 'red';
    delBtn.style.color = 'white';
    delBtn.style.border = 'none';
    delBtn.style.borderRadius = '50%';
    delBtn.style.cursor = 'pointer';
    delBtn.style.width = '20px';
    delBtn.style.height = '20px';
    delBtn.style.fontSize = '12px';
    
    delBtn.onclick = function(e) {
      e.preventDefault();
      if (imgObj.type === 'server') {
        const idx = currentEditImages.indexOf(imgObj.data);
        currentEditImages.splice(idx, 1);
      } else {
        const idx = pendingFiles.indexOf(imgObj.data);
        pendingFiles.splice(idx, 1);
      }
      renderExistingImages();
    };
    
    div.appendChild(imgEl);
    div.appendChild(label);
    if (index !== 0) div.appendChild(makeMainBtn);
    div.appendChild(delBtn);
    container.appendChild(div);
  });
}


// Helper: Compress Image using Canvas
async function compressImage(file, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
        console.log("Not an image, skipping compression:", file.name);
        return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (!blob) {
                console.warn("Compression failed for:", file.name);
                return resolve(file);
            }
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', quality);
        } catch (e) {
          console.error("Canvas error:", e);
          resolve(file);
        }
      };
      img.onerror = (e) => {
          console.error("Image load error:", e);
          resolve(file);
      };
    };
    reader.onerror = (e) => {
        console.error("FileReader error:", e);
        resolve(file);
    };
  });
}

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
  const fileInput = document.getElementById('p_image');

  if (!nameAr || !nameEn || !price) {
    msg.innerText = "الرجاء ملء الاسم والسعر.";
    msg.style.color = "#e74c3c";
    return;
  }

  addBtn.disabled = true;
  addBtn.innerText = editModeId ? "جاري التحديث... يرجى الانتظار" : "جاري الرفع... يرجى الانتظار";
  msg.innerText = "";

  try {
    let finalImages = [...currentEditImages];

    // Upload new images sequentially for stability with detailed logs
    if (pendingFiles.length > 0) {
      console.log("Starting upload for", pendingFiles.length, "files");
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i];
        try {
          msg.innerText = `جاري معالجة الصورة (${i + 1} من ${pendingFiles.length})...`;
          console.log(`Processing file ${i + 1}: ${file.name}`);
          
          // Compress (with safety)
          let fileToUpload = file;
          try {
            fileToUpload = await compressImage(file);
          } catch (compressErr) {
            console.warn("Compression failed, using original file", compressErr);
          }
          
          const uniqueName = Date.now() + '_' + Math.floor(Math.random() * 10000) + '_' + file.name;
          const storageRef = storage.ref('products/' + uniqueName);
          
          console.log(`Uploading to: ${uniqueName}`);
          const snapshot = await storageRef.put(fileToUpload);
          const url = await snapshot.ref.getDownloadURL();
          
          console.log(`Upload success: ${url}`);
          finalImages.push(url);
        } catch (fileErr) {
          console.error(`Error uploading file ${i + 1}:`, fileErr);
          alert(`فشل رفع الصورة رقم ${i + 1}: ` + fileErr.message);
        }
      }
    }
    
    if (finalImages.length === 0) {
      finalImages.push("https://placehold.co/600x800/1a1a1a/555555?text=" + encodeURIComponent(nameEn));
    }

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
  
  currentEditImages = p.images ? [...p.images] : [];
  renderExistingImages();

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
  currentEditImages = [];
  pendingFiles = [];
  renderExistingImages();

  document.getElementById('p_name_ar').value = '';
  document.getElementById('p_name_en').value = '';
  document.getElementById('p_price').value = '';
  document.getElementById('p_old_price').value = '';
  document.getElementById('p_offer_end_date').value = '';
  document.getElementById('p_desc_ar').value = '';
  document.getElementById('p_desc_en').value = '';
  document.getElementById('p_sizes').value = '';
  document.getElementById('p_colors').value = '';
  document.getElementById('p_image').value = '';
  
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

  db.collection('products').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
    loading.style.display = 'none';
    list.innerHTML = '';
    count.innerText = snapshot.size;
    allProductsData = {}; // clear cache

    snapshot.forEach((doc) => {
      const p = doc.data();
      allProductsData[doc.id] = p; // save for editing

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
          <button class="btn" style="background:#3498db; color:white; width:auto; padding:8px 15px;" onclick="editProduct('${doc.id}')">تعديل</button>
          <button class="btn btn-danger" onclick="deleteProduct('${doc.id}')">حذف</button>
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
