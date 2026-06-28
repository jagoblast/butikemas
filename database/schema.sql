-- ========================================================================
-- RESET TABEL (HATI-HATI: Hanya gunakan saat inisialisasi / development)
-- ========================================================================
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS _ProductToVoucher;
DROP TABLE IF EXISTS _ProductToPromo;
DROP TABLE IF EXISTS _CategoryToPromo;
DROP TABLE IF EXISTS company_profile;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS boutiques;
DROP TABLE IF EXISTS boutique_products;
DROP TABLE IF EXISTS metal_prices;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS promos;
DROP TABLE IF EXISTS voucher_usages;
DROP TABLE IF EXISTS vouchers;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_status_logs;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS payment_methods;
DROP TABLE IF EXISTS raja_ongkir_cache;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS user_refresh_sessions;
DROP TABLE IF EXISTS users;

-- ========================================================================
-- TABEL SISTEM & PENGGUNA
-- ========================================================================

-- Tabel Konfigurasi Sistem (Tambahan untuk edge serverless)
CREATE TABLE system_settings (
    id TEXT PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Pengguna Utama (Users)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'CUSTOMER', -- CUSTOMER, ADMIN, SUPER_ADMIN
    ktp_url TEXT,
    is_kyc_verified INTEGER DEFAULT 0, -- 0 = false, 1 = true
    is_active INTEGER DEFAULT 1,
    last_login_at DATETIME,
    refresh_token TEXT,
    password_reset_token_hash TEXT,
    password_reset_expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_pwd_reset ON users(password_reset_token_hash);

-- Tabel Sesi Refresh Token
CREATE TABLE user_refresh_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_sessions_userid ON user_refresh_sessions(user_id);

-- Tabel Alamat Pengguna
CREATE TABLE addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    village TEXT,
    province TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    raja_ongkir_destination_id INTEGER,
    is_default INTEGER DEFAULT 0
);

-- ========================================================================
-- TABEL MASTER (KATEGORI, PRODUK & METODE PEMBAYARAN)
-- ========================================================================

-- Tabel Cache RajaOngkir
CREATE TABLE raja_ongkir_cache (
    cache_key TEXT PRIMARY KEY,
    payload TEXT NOT NULL, -- JSON
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Metode Pembayaran
CREATE TABLE payment_methods (
    code TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- QRIS, BANK_TRANSFER, VIRTUAL_ACCOUNT
    is_active INTEGER DEFAULT 0,
    is_locked INTEGER DEFAULT 0,
    status TEXT DEFAULT 'READY', -- READY, COMING_SOON
    config TEXT DEFAULT '{}', -- JSON
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Kategori Produk
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT
);

-- Tabel Produk Utama
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    weight_gram REAL NOT NULL,
    kadar TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Galeri Gambar Produk
CREATE TABLE product_images (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
);

-- ========================================================================
-- TABEL TRANSAKSI (ORDERS & REVIEWS)
-- ========================================================================

-- Tabel Pesanan (Orders)
-- FIX: Tambah user_id untuk relasi yang lebih kuat dengan users table
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    status TEXT DEFAULT 'PENDING',
    total_amount REAL NOT NULL,
    shipping_cost REAL NOT NULL,
    admin_fee REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    grand_total REAL NOT NULL,
    payment_method_code TEXT REFERENCES payment_methods(code) ON DELETE SET NULL,
    payment_method TEXT DEFAULT 'QRIS Manual',
    payment_method_config TEXT, -- JSON
    payment_proof_url TEXT,
    payment_proof_uploaded_at DATETIME,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_province TEXT,
    shipping_district TEXT,
    shipping_village TEXT,
    shipping_postal_code TEXT,
    shipping_courier TEXT,
    shipping_service TEXT,
    tracking_number TEXT,
    ktp_image_url TEXT,
    notes TEXT,
    cancel_reason TEXT,
    cancelled_at DATETIME,
    voucher_id TEXT, -- referensi ke vouchers, dibuat belakangan
    midtrans_transaction_id TEXT,
    snap_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Tabel Item Pesanan
CREATE TABLE order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    product_image TEXT,
    price_at_purchase REAL NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal REAL NOT NULL
);

-- Tabel Log Status Pesanan
CREATE TABLE order_status_logs (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Ulasan (Reviews)
CREATE TABLE reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    comment TEXT,
    image_url TEXT,
    is_hidden INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, order_id, product_id)
);

-- ========================================================================
-- TABEL PROMO & VOUCHER
-- ========================================================================

CREATE TABLE vouchers (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL, -- PERCENTAGE, FIXED
    discount_value REAL NOT NULL,
    min_purchase REAL DEFAULT 0,
    max_discount REAL,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    starts_at DATETIME,
    expires_at DATETIME
);

CREATE TABLE voucher_usages (
    id TEXT PRIMARY KEY,
    voucher_id TEXT NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(voucher_id, user_id, order_id)
);

CREATE TABLE promos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value REAL NOT NULL,
    max_discount REAL,
    starts_at DATETIME,
    expires_at DATETIME,
    is_active INTEGER DEFAULT 1
);

-- Tabel Relasi Many-to-Many (Junction Tables)
CREATE TABLE _CategoryToPromo (
    A TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    B TEXT NOT NULL REFERENCES promos(id) ON DELETE CASCADE,
    UNIQUE(A, B)
);

CREATE TABLE _ProductToPromo (
    A TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    B TEXT NOT NULL REFERENCES promos(id) ON DELETE CASCADE,
    UNIQUE(A, B)
);

CREATE TABLE _ProductToVoucher (
    A TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    B TEXT NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
    UNIQUE(A, B)
);

-- ========================================================================
-- TABEL KONTEN / HALAMAN DEPAN
-- ========================================================================

CREATE TABLE banners (
    id TEXT PRIMARY KEY,
    image_url TEXT NOT NULL,
    link_url TEXT,
    title TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE metal_prices (
    id TEXT PRIMARY KEY,
    metal TEXT NOT NULL, -- GOLD, SILVER
    price REAL NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_metal_prices ON metal_prices(metal, recorded_at);

-- ========================================================================
-- TABEL BUTIK
-- ========================================================================

CREATE TABLE boutique_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boutiques (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    google_maps_url TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================================
-- TABEL ARTIKEL & COMPANY PROFILE
-- ========================================================================

CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_url TEXT,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    is_published INTEGER DEFAULT 0,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_profile (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
