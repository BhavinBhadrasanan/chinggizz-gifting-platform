package com.chinggizz.config;

import com.chinggizz.entity.Admin;
import com.chinggizz.entity.Category;
import com.chinggizz.entity.Product;
import com.chinggizz.enums.ProductType;
import com.chinggizz.repository.AdminRepository;
import com.chinggizz.repository.CategoryRepository;
import com.chinggizz.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-username}")
    private String defaultUsername;

    @Value("${app.admin.default-password}")
    private String defaultPassword;

    @Override
    public void run(String... args) {
        // Create default admin user
        createDefaultAdmin();

        // Create sample categories and products
        createSampleData();
    }

    private void createDefaultAdmin() {
        if (adminRepository.findByUsername(defaultUsername).isEmpty()) {
            Admin admin = Admin.builder()
                    .username(defaultUsername)
                    .password(passwordEncoder.encode(defaultPassword))
                    .fullName("System Administrator")
                    .email("admin@chinggizz.com")
                    .active(true)
                    .build();

            adminRepository.save(admin);
            log.info("Default admin user created: {}", defaultUsername);
        }
    }

    private void createSampleData() {
        if (categoryRepository.count() > 0) {
            log.info("Sample data already exists, skipping initialization");
            return;
        }

        log.info("Creating sample categories and products...");

        // Create Categories - Organized and Easy to Navigate
        Category photoMemory = createCategory("📸 Photo & Memory Items",
            "Polaroids, photo frames, stands, and scrapbooks to preserve precious memories",
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500", 1);

        Category personalizedGifts = createCategory("🎨 Personalized Gifts",
            "Caricatures, customized mugs, calendars, and wish cards with your personal touch",
            "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500", 2);

        Category fashionAccessories = createCategory("💍 Fashion & Accessories",
            "Jewellery, watches, and fashion items for the style-conscious",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500", 3);

        Category edibleTreats = createCategory("🍫 Edibles & Treats",
            "Chocolates, nuts, and delicious treats for every occasion",
            "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500", 4);

        Category homeDecor = createCategory("🏠 Home & Decor",
            "Clocks, candles, perfumes, and plants to beautify your space",
            "https://images.unsplash.com/photo-1602874801006-e7d8dc1c4ce6?w=500", 5);

        Category hamperBoxes = createCategory("🎁 Gift Boxes",
            "Beautiful hamper boxes for creating custom gift sets",
            "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500", 6);

        // ========================================
        // 📸 PHOTO & MEMORY ITEMS CATEGORY
        // ========================================

        // 1. Polaroids - Customer chooses quantity and uploads photos
        createProductWithOptions("Polaroid Photo Prints",
            "Instant-style polaroid prints. Upload your photos and choose quantity.",
            new BigDecimal("199.00"), ProductType.CUSTOMISED_ITEM, photoMemory,
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
            true, new BigDecimal("0"), 200,
            new BigDecimal("9"), new BigDecimal("11"), new BigDecimal("0.2"),
            "{\"type\":\"polaroid\",\"hasPhotoUpload\":true,\"pricePerUnit\":0,\"options\":[" +
                "{\"category\":\"Quantity\",\"choices\":[" +
                    "{\"name\":\"9 Prints\",\"quantity\":9,\"price\":0}," +
                    "{\"name\":\"18 Prints\",\"quantity\":18,\"price\":51}," +
                    "{\"name\":\"27 Prints\",\"quantity\":27,\"price\":151}," +
                    "{\"name\":\"36 Prints\",\"quantity\":36,\"price\":251}" +
                "]}" +
            "]}");

        // 2. Photo Frames - Customer selects size and uploads photo
        createProductWithOptions("Customised Photo Frame",
            "Premium wooden photo frame with custom engraving. Choose your size.",
            new BigDecimal("499.00"), ProductType.CUSTOMISED_ITEM, photoMemory,
            "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500",
            true, new BigDecimal("150.00"), 80,
            new BigDecimal("15"), new BigDecimal("20"), new BigDecimal("2"),
            "{\"type\":\"frame\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Size\",\"choices\":[" +
                    "{\"name\":\"4×6 inches\",\"price\":0,\"width\":10,\"height\":15,\"depth\":2}," +
                    "{\"name\":\"5×7 inches\",\"price\":100,\"width\":13,\"height\":18,\"depth\":2}," +
                    "{\"name\":\"8×10 inches\",\"price\":200,\"width\":20,\"height\":25,\"depth\":2}," +
                    "{\"name\":\"11×14 inches\",\"price\":400,\"width\":28,\"height\":36,\"depth\":2}" +
                "]}" +
            "]}");

        // 3. Mini Photo Frame - NEW
        createProductWithOptions("Mini Photo Frame",
            "Cute mini photo frames perfect for desk or shelf. Upload your favorite moments!",
            new BigDecimal("199.00"), ProductType.CUSTOMISED_ITEM, photoMemory,
            "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500",
            true, new BigDecimal("50.00"), 150,
            new BigDecimal("8"), new BigDecimal("10"), new BigDecimal("1.5"),
            "{\"type\":\"frame\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Style\",\"choices\":[" +
                    "{\"name\":\"Single Frame\",\"price\":0,\"description\":\"One 3×4 inch frame\"}," +
                    "{\"name\":\"Set of 3\",\"price\":150,\"description\":\"Three matching mini frames\"}," +
                    "{\"name\":\"Set of 5\",\"price\":300,\"description\":\"Five mini frames for gallery wall\"}" +
                "]}" +
            "]}");

        // 4. Wooden Engraved Photo Stand - NEW
        createProductWithOptions("Wooden Engraved Photo Stand",
            "Elegant wooden photo stand with custom engraving. Perfect for special memories.",
            new BigDecimal("699.00"), ProductType.CUSTOMISED_ITEM, photoMemory,
            "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500",
            true, new BigDecimal("200.00"), 60,
            new BigDecimal("15"), new BigDecimal("20"), new BigDecimal("5"),
            "{\"type\":\"stand\",\"hasPhotoUpload\":true,\"hasEngraving\":true,\"options\":[" +
                "{\"category\":\"Size\",\"choices\":[" +
                    "{\"name\":\"Small (4×6 inch)\",\"price\":0,\"width\":10,\"height\":15}," +
                    "{\"name\":\"Medium (5×7 inch)\",\"price\":150,\"width\":13,\"height\":18}," +
                    "{\"name\":\"Large (8×10 inch)\",\"price\":300,\"width\":20,\"height\":25}" +
                "]}" +
            "]}");

        // 5. Acrylic Photo Stand - NEW
        createProductWithOptions("Acrylic Photo Stand",
            "Modern acrylic photo stand. Sleek and contemporary design.",
            new BigDecimal("599.00"), ProductType.CUSTOMISED_ITEM, photoMemory,
            "https://images.unsplash.com/photo-1611095564732-2f3a5c3e8d3e?w=500",
            true, new BigDecimal("150.00"), 70,
            new BigDecimal("15"), new BigDecimal("20"), new BigDecimal("3"),
            "{\"type\":\"stand\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Size\",\"choices\":[" +
                    "{\"name\":\"Small (4×6 inch)\",\"price\":0,\"width\":10,\"height\":15}," +
                    "{\"name\":\"Medium (6×8 inch)\",\"price\":150,\"width\":15,\"height\":20}," +
                    "{\"name\":\"Large (8×10 inch)\",\"price\":300,\"width\":20,\"height\":25}" +
                "]}" +
            "]}");

        // 6. Caricature Photo Stand - NEW
        createProductWithOptions("Caricature Photo Stand",
            "Fun caricature artwork on a sturdy stand. Upload photo and get a unique desk decoration!",
            new BigDecimal("899.00"), ProductType.CUSTOMISED_ITEM, photoMemory,
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
            true, new BigDecimal("250.00"), 40,
            new BigDecimal("15"), new BigDecimal("20"), new BigDecimal("5"),
            "{\"type\":\"caricature_stand\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Individual\",\"price\":0,\"description\":\"Single person caricature stand\"}," +
                    "{\"name\":\"Couple\",\"price\":400,\"description\":\"Two people caricature stand\"}" +
                "]}," +
                "{\"category\":\"Stand Material\",\"choices\":[" +
                    "{\"name\":\"Wooden Base\",\"price\":0,\"description\":\"Classic wooden stand\"}," +
                    "{\"name\":\"Acrylic Base\",\"price\":150,\"description\":\"Modern clear acrylic\"}," +
                    "{\"name\":\"Metal Base\",\"price\":200,\"description\":\"Premium metal stand\"}" +
                "]}" +
            "]}");

        // 7. Handmade Scrapbook with Memories - NEW
        createProductWithOptions("Handmade Scrapbook",
            "Beautiful handcrafted scrapbook to preserve your precious memories. Upload photos and we'll create magic!",
            new BigDecimal("799.00"), ProductType.CUSTOMISED_ITEM, photoMemory,
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
            true, new BigDecimal("500.00"), 30,
            new BigDecimal("25"), new BigDecimal("30"), new BigDecimal("3"),
            "{\"type\":\"scrapbook\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Size\",\"choices\":[" +
                    "{\"name\":\"Mini (5 pages)\",\"price\":0,\"description\":\"Perfect for a special moment\"}," +
                    "{\"name\":\"Small (10 pages)\",\"price\":200,\"description\":\"Great for special occasions\"}," +
                    "{\"name\":\"Medium (20 pages)\",\"price\":400,\"description\":\"Complete memory collection\"}" +
                "]}," +
                "{\"category\":\"Theme\",\"choices\":[" +
                    "{\"name\":\"Love & Romance\",\"price\":0,\"description\":\"Hearts and romantic designs\"}," +
                    "{\"name\":\"Travel Adventures\",\"price\":0,\"description\":\"Maps and travel motifs\"}," +
                    "{\"name\":\"Birthday Celebration\",\"price\":0,\"description\":\"Festive birthday theme\"}," +
                    "{\"name\":\"Wedding Memories\",\"price\":200,\"description\":\"Elegant wedding designs\"}," +
                    "{\"name\":\"Baby Moments\",\"price\":100,\"description\":\"Cute baby-themed pages\"}" +
                "]}" +
            "]}");


        // ========================================
        // 🎨 PERSONALIZED GIFTS CATEGORY
        // ========================================

        // 8. Caricatures - Customer selects type and size, uploads photo
        createProductWithOptions("Customised Caricature",
            "Hand-drawn personalized caricature. Upload your photo and get a unique artwork!",
            new BigDecimal("900.00"), ProductType.CUSTOMISED_ITEM, personalizedGifts,
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
            true, new BigDecimal("0.00"), 50,
            new BigDecimal("22.5"), new BigDecimal("9"), new BigDecimal("0.5"),
            "{\"type\":\"caricature\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Individual\",\"price\":0,\"description\":\"Single person caricature\"}," +
                    "{\"name\":\"Couple\",\"price\":200,\"description\":\"Two people caricature\"}" +
                "]}," +
                "{\"category\":\"Size\",\"choices\":[" +
                    "{\"name\":\"22.5 cm × 9 cm\",\"price\":0,\"width\":22.5,\"height\":9}" +
                "]}" +
            "]}");

        // 9. Customised Mugs - Individual or Couple with photo upload
        createProductWithOptions("Customised Photo Mug",
            "Ceramic mug with your photo printed. Upload image and see live preview!",
            new BigDecimal("299.00"), ProductType.CUSTOMISED_ITEM, personalizedGifts,
            "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
            true, new BigDecimal("100.00"), 150,
            new BigDecimal("8"), new BigDecimal("9"), new BigDecimal("8"),
            "{\"type\":\"mug\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Individual Mug\",\"price\":0,\"description\":\"Single mug with one photo\"}," +
                    "{\"name\":\"Couple Mugs (Set of 2)\",\"price\":200,\"description\":\"Matching pair of mugs\"}" +
                "]}" +
            "]}");

        // 10. Customised Calendar
        createProductWithOptions("Customised Calendar",
            "Personalized calendar with your photos. 12 months, premium quality paper.",
            new BigDecimal("499.00"), ProductType.CUSTOMISED_ITEM, personalizedGifts,
            "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500",
            true, new BigDecimal("150.00"), 100,
            new BigDecimal("21"), new BigDecimal("30"), new BigDecimal("1"),
            "{\"type\":\"calendar\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Wall Calendar\",\"price\":0,\"width\":21,\"height\":30}," +
                    "{\"name\":\"Desk Calendar\",\"price\":-100,\"width\":15,\"height\":20}" +
                "]}" +
            "]}");

        // 11. Customised Wish Card - with optional photo upload
        createProductWithOptions("Customised Wish Card",
            "Personalized greeting card with custom message and design. Premium cardstock.",
            new BigDecimal("149.00"), ProductType.CUSTOMISED_ITEM, personalizedGifts,
            "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500",
            true, new BigDecimal("50.00"), 200,
            new BigDecimal("15"), new BigDecimal("21"), new BigDecimal("0.5"),
            "{\"type\":\"card\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Occasion\",\"choices\":[" +
                    "{\"name\":\"Birthday\",\"price\":0}," +
                    "{\"name\":\"Anniversary\",\"price\":0}," +
                    "{\"name\":\"Wedding\",\"price\":20}," +
                    "{\"name\":\"Thank You\",\"price\":0}," +
                    "{\"name\":\"Congratulations\",\"price\":0}" +
                "]}" +
            "]}");

        // ========================================
        // 💍 FASHION & ACCESSORIES CATEGORY
        // ========================================

        // 12. Jewellery Items - NEW (Price on Request - Non-Customizable)
        createProductWithOptions("Jewellery Items",
            "Beautiful jewellery pieces for every occasion. We will purchase it for you and share the details.",
            new BigDecimal("0.00"), ProductType.CUSTOMISED_ITEM, fashionAccessories,
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
            false, new BigDecimal("0"), 80,
            new BigDecimal("5"), new BigDecimal("5"), new BigDecimal("2"),
            "{\"type\":\"jewellery\",\"priceOnRequest\":true,\"priceMessage\":\"We will purchase it for you and share the details\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Necklace\",\"price\":0,\"description\":\"Elegant necklace\"}," +
                    "{\"name\":\"Bracelet\",\"price\":0,\"description\":\"Stylish bracelet\"}," +
                    "{\"name\":\"Earrings\",\"price\":0,\"description\":\"Beautiful earrings\"}," +
                    "{\"name\":\"Ring\",\"price\":0,\"description\":\"Stunning ring\"}," +
                    "{\"name\":\"Jewellery Set\",\"price\":0,\"description\":\"Complete matching set\"}" +
                "]}," +
                "{\"category\":\"Material\",\"choices\":[" +
                    "{\"name\":\"Silver Plated\",\"price\":0,\"description\":\"Elegant silver finish\"}," +
                    "{\"name\":\"Gold Plated\",\"price\":0,\"description\":\"Luxurious gold finish\"}," +
                    "{\"name\":\"Rose Gold\",\"price\":0,\"description\":\"Trendy rose gold\"}" +
                "]}" +
            "]}");

        // 13. Watches - UPDATED (Price on Request - Non-Customizable)
        createProductWithOptions("Watches",
            "Premium watches for men and women. We will purchase it for you and share the details.",
            new BigDecimal("0.00"), ProductType.CUSTOMISED_ITEM, fashionAccessories,
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500",
            false, new BigDecimal("0"), 60,
            new BigDecimal("5"), new BigDecimal("5"), new BigDecimal("3"),
            "{\"type\":\"watch\",\"priceOnRequest\":true,\"priceMessage\":\"We will purchase it for you and share the details\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Men's Watch\",\"price\":0,\"description\":\"Classic men's wristwatch\"}," +
                    "{\"name\":\"Women's Watch\",\"price\":0,\"description\":\"Elegant women's watch\"}," +
                    "{\"name\":\"Couple Watches\",\"price\":0,\"description\":\"Matching pair of watches\"}" +
                "]}," +
                "{\"category\":\"Style\",\"choices\":[" +
                    "{\"name\":\"Digital\",\"price\":0,\"description\":\"Modern digital display\"}," +
                    "{\"name\":\"Analogue\",\"price\":0,\"description\":\"Classic analogue with hands\"}," +
                    "{\"name\":\"Smartwatch\",\"price\":0,\"description\":\"Smart features with fitness tracking\"}" +
                "]}" +
            "]}");

        // 13a. Belt - NEW (Price on Request - Non-Customizable)
        createProductWithOptions("Belt",
            "Premium leather belts for men and women. We will purchase it for you and share the details.",
            new BigDecimal("0.00"), ProductType.CUSTOMISED_ITEM, fashionAccessories,
            "https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=500",
            false, new BigDecimal("0"), 50,
            new BigDecimal("10"), new BigDecimal("5"), new BigDecimal("2"),
            "{\"type\":\"belt\",\"priceOnRequest\":true,\"priceMessage\":\"We will purchase it for you and share the details\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Men's Belt\",\"price\":0,\"description\":\"Classic men's leather belt\"}," +
                    "{\"name\":\"Women's Belt\",\"price\":100,\"description\":\"Elegant women's belt\"}" +
                "]}," +
                "{\"category\":\"Material\",\"choices\":[" +
                    "{\"name\":\"Genuine Leather\",\"price\":0,\"description\":\"Premium leather\"}," +
                    "{\"name\":\"Synthetic Leather\",\"price\":-200,\"description\":\"Durable synthetic material\"}," +
                    "{\"name\":\"Canvas\",\"price\":-300,\"description\":\"Casual canvas belt\"}" +
                "]}," +
                "{\"category\":\"Color\",\"choices\":[" +
                    "{\"name\":\"Black\",\"price\":0}," +
                    "{\"name\":\"Brown\",\"price\":0}," +
                    "{\"name\":\"Tan\",\"price\":0}," +
                    "{\"name\":\"Navy Blue\",\"price\":50}" +
                "]}" +
            "]}");

        // 13b. Wallet - NEW (Separated from Watch & Accessories)
        createProductWithOptions("Wallet",
            "Premium leather wallets with multiple card slots. Perfect for daily use.",
            new BigDecimal("799.00"), ProductType.CUSTOMISED_ITEM, fashionAccessories,
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
            true, new BigDecimal("0"), 50,
            new BigDecimal("12"), new BigDecimal("9"), new BigDecimal("2"),
            "{\"type\":\"wallet\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Men's Wallet\",\"price\":0,\"description\":\"Classic bifold wallet\"}," +
                    "{\"name\":\"Women's Wallet\",\"price\":100,\"description\":\"Elegant clutch wallet\"}," +
                    "{\"name\":\"Card Holder\",\"price\":-200,\"description\":\"Slim card holder\"}" +
                "]}," +
                "{\"category\":\"Material\",\"choices\":[" +
                    "{\"name\":\"Genuine Leather\",\"price\":0,\"description\":\"Premium leather\"}," +
                    "{\"name\":\"Synthetic Leather\",\"price\":-200,\"description\":\"Durable synthetic material\"}," +
                    "{\"name\":\"Canvas\",\"price\":-300,\"description\":\"Casual canvas wallet\"}" +
                "]}," +
                "{\"category\":\"Color\",\"choices\":[" +
                    "{\"name\":\"Black\",\"price\":0}," +
                    "{\"name\":\"Brown\",\"price\":0}," +
                    "{\"name\":\"Tan\",\"price\":0}," +
                    "{\"name\":\"Navy Blue\",\"price\":50}," +
                    "{\"name\":\"Red\",\"price\":50}" +
                "]}" +
            "]}");

        // 13c. Sunglasses - NEW (Price on Request - Non-Customizable)
        createProductWithOptions("Sunglasses",
            "Stylish sunglasses with UV protection. We will purchase it for you and share the details.",
            new BigDecimal("0.00"), ProductType.CUSTOMISED_ITEM, fashionAccessories,
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
            false, new BigDecimal("0"), 50,
            new BigDecimal("15"), new BigDecimal("6"), new BigDecimal("5"),
            "{\"type\":\"sunglasses\",\"priceOnRequest\":true,\"priceMessage\":\"We will purchase it for you and share the details\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Men's Sunglasses\",\"price\":0,\"description\":\"Classic men's sunglasses\"}," +
                    "{\"name\":\"Women's Sunglasses\",\"price\":100,\"description\":\"Elegant women's sunglasses\"}," +
                    "{\"name\":\"Unisex Sunglasses\",\"price\":50,\"description\":\"Versatile unisex design\"}" +
                "]}," +
                "{\"category\":\"Frame Style\",\"choices\":[" +
                    "{\"name\":\"Aviator\",\"price\":0,\"description\":\"Classic aviator style\"}," +
                    "{\"name\":\"Wayfarer\",\"price\":100,\"description\":\"Trendy wayfarer design\"}," +
                    "{\"name\":\"Round\",\"price\":50,\"description\":\"Vintage round frames\"}," +
                    "{\"name\":\"Cat Eye\",\"price\":150,\"description\":\"Stylish cat eye frames\"}" +
                "]}," +
                "{\"category\":\"Lens Color\",\"choices\":[" +
                    "{\"name\":\"Black\",\"price\":0}," +
                    "{\"name\":\"Brown\",\"price\":0}," +
                    "{\"name\":\"Blue\",\"price\":50}," +
                    "{\"name\":\"Green\",\"price\":50}," +
                    "{\"name\":\"Gradient\",\"price\":100}" +
                "]}" +
            "]}");

        // 14. Dress of Choice - NEW (Price on Request - Non-Customizable)
        createProductWithOptions("Dress of Choice",
            "Beautiful dresses for special occasions. Choose style, size, and color. We will purchase it for you and share the details.",
            new BigDecimal("0.00"), ProductType.CUSTOMISED_ITEM, fashionAccessories,
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
            false, new BigDecimal("0"), 50,
            new BigDecimal("30"), new BigDecimal("40"), new BigDecimal("5"),
            "{\"type\":\"dress\",\"priceOnRequest\":true,\"priceMessage\":\"We will purchase it for you and share the details\",\"options\":[" +
                "{\"category\":\"Category\",\"choices\":[" +
                    "{\"name\":\"Men\",\"price\":0,\"description\":\"Men's clothing\"}," +
                    "{\"name\":\"Women\",\"price\":0,\"description\":\"Women's clothing\"}," +
                    "{\"name\":\"Boy\",\"price\":0,\"description\":\"Boys' clothing\"}," +
                    "{\"name\":\"Girl\",\"price\":0,\"description\":\"Girls' clothing\"}," +
                    "{\"name\":\"Infant\",\"price\":0,\"description\":\"Infant clothing\"}" +
                "]}," +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Casual Dress\",\"price\":0,\"description\":\"Comfortable everyday wear\"}," +
                    "{\"name\":\"Party Dress\",\"price\":0,\"description\":\"Glamorous party outfit\"}," +
                    "{\"name\":\"Formal Dress\",\"price\":0,\"description\":\"Elegant formal attire\"}," +
                    "{\"name\":\"Traditional Dress\",\"price\":0,\"description\":\"Cultural traditional wear\"}" +
                "]}," +
                "{\"category\":\"Size\",\"choices\":[" +
                    "{\"name\":\"XS\",\"price\":0}," +
                    "{\"name\":\"S\",\"price\":0}," +
                    "{\"name\":\"M\",\"price\":0}," +
                    "{\"name\":\"L\",\"price\":0}," +
                    "{\"name\":\"XL\",\"price\":0}," +
                    "{\"name\":\"XXL\",\"price\":0}" +
                "]}," +
                "{\"category\":\"Color\",\"choices\":[" +
                    "{\"name\":\"Red\",\"price\":0}," +
                    "{\"name\":\"Blue\",\"price\":0}," +
                    "{\"name\":\"Black\",\"price\":0}," +
                    "{\"name\":\"White\",\"price\":0}," +
                    "{\"name\":\"Pink\",\"price\":0}," +
                    "{\"name\":\"Green\",\"price\":0}," +
                    "{\"name\":\"Yellow\",\"price\":0}," +
                    "{\"name\":\"Multi-Color\",\"price\":0}" +
                "]}" +
            "]}");

        // ========================================
        // 🍫 EDIBLES & TREATS CATEGORY
        // ========================================

        // 15. Chocolates - NEW (Price on Request - Non-Customizable)
        createProductWithOptions("Premium Chocolates",
            "Delicious handcrafted chocolates. We will purchase it for you and share the details.",
            new BigDecimal("0.00"), ProductType.EDIBLE_ITEM, edibleTreats,
            "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500",
            false, BigDecimal.ZERO, 150,
            new BigDecimal("15"), new BigDecimal("15"), new BigDecimal("5"),
            "{\"type\":\"chocolates\",\"priceOnRequest\":true,\"priceMessage\":\"We will purchase it for you and share the details\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Milk Chocolate Box\",\"price\":0,\"description\":\"Classic milk chocolates\"}," +
                    "{\"name\":\"Dark Chocolate Box\",\"price\":100,\"description\":\"Rich dark chocolates\"}," +
                    "{\"name\":\"Assorted Box\",\"price\":150,\"description\":\"Mix of milk, dark, and white\"}," +
                    "{\"name\":\"Truffle Collection\",\"price\":300,\"description\":\"Premium chocolate truffles\"}," +
                    "{\"name\":\"Ferrero Rocher\",\"price\":200,\"description\":\"Imported Ferrero Rocher\"}" +
                "]}," +
                "{\"category\":\"Quantity\",\"choices\":[" +
                    "{\"name\":\"Small Box (12 pcs)\",\"price\":0}," +
                    "{\"name\":\"Medium Box (24 pcs)\",\"price\":200}," +
                    "{\"name\":\"Large Box (48 pcs)\",\"price\":500}," +
                    "{\"name\":\"Premium Box (100 pcs)\",\"price\":1200}" +
                "]}" +
            "]}");

        // 16. Nuts with Jar - NEW
        createProductWithOptions("Premium Nuts with Jar",
            "Healthy and delicious dry fruits in beautiful glass jars. Perfect for gifting!",
            new BigDecimal("699.00"), ProductType.EDIBLE_ITEM, edibleTreats,
            "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500",
            true, BigDecimal.ZERO, 100,
            new BigDecimal("12"), new BigDecimal("15"), new BigDecimal("12"),
            "{\"type\":\"nuts\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Almonds\",\"price\":0,\"description\":\"Premium California almonds\"}," +
                    "{\"name\":\"Cashews\",\"price\":100,\"description\":\"Whole cashew nuts\"}," +
                    "{\"name\":\"Pistachios\",\"price\":200,\"description\":\"Roasted pistachios\"}," +
                    "{\"name\":\"Mixed Nuts\",\"price\":150,\"description\":\"Assorted premium nuts\"}," +
                    "{\"name\":\"Dried Fruits Mix\",\"price\":100,\"description\":\"Dates, figs, apricots mix\"}" +
                "]}," +
                "{\"category\":\"Jar Size\",\"choices\":[" +
                    "{\"name\":\"Small Jar (250g)\",\"price\":0}," +
                    "{\"name\":\"Medium Jar (500g)\",\"price\":200}," +
                    "{\"name\":\"Large Jar (1kg)\",\"price\":500}," +
                    "{\"name\":\"Gift Set (3 Jars)\",\"price\":800,\"description\":\"Three different varieties\"}" +
                "]}" +
            "]}");

        // ========================================
        // 🏠 HOME & DECOR CATEGORY
        // ========================================

        // 17. Scented Candles - Customer selects fragrance
        createProductWithOptions("Scented Candles",
            "Premium scented candles in glass jar. 40+ hours burn time. Choose your favorite fragrance.",
            new BigDecimal("399.00"), ProductType.EDIBLE_ITEM, homeDecor,
            "https://images.unsplash.com/photo-1602874801006-e7d8dc1c4ce6?w=500",
            true, BigDecimal.ZERO, 100,
            new BigDecimal("8"), new BigDecimal("10"), new BigDecimal("8"),
            "{\"type\":\"candle\",\"options\":[" +
                "{\"category\":\"Fragrance\",\"choices\":[" +
                    "{\"name\":\"Lavender\",\"price\":0,\"description\":\"Calming lavender scent\"}," +
                    "{\"name\":\"Vanilla Rose\",\"price\":50,\"description\":\"Sweet vanilla with rose notes\"}," +
                    "{\"name\":\"Sandalwood\",\"price\":100,\"description\":\"Traditional sandalwood fragrance\"}," +
                    "{\"name\":\"Jasmine\",\"price\":50,\"description\":\"Fresh jasmine aroma\"}," +
                    "{\"name\":\"Citrus Fresh\",\"price\":0,\"description\":\"Energizing citrus blend\"}," +
                    "{\"name\":\"Apple\",\"price\":0,\"description\":\"Fresh apple fragrance\"}" +
                "]}" +
            "]}");

        // 18. Perfumes - Customer selects type (Price on Request - Non-Customizable)
        createProductWithOptions("Premium Perfumes",
            "Long-lasting premium fragrances. We will purchase it for you and share the details.",
            new BigDecimal("0.00"), ProductType.EDIBLE_ITEM, homeDecor,
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
            false, BigDecimal.ZERO, 80,
            new BigDecimal("5"), new BigDecimal("12"), new BigDecimal("5"),
            "{\"type\":\"perfume\",\"priceOnRequest\":true,\"priceMessage\":\"We will purchase it for you and share the details\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Men's Perfume\",\"price\":0,\"description\":\"Premium fragrance for men\"}," +
                    "{\"name\":\"Women's Perfume\",\"price\":0,\"description\":\"Elegant fragrance for women\"}," +
                    "{\"name\":\"Couple Perfume\",\"price\":0,\"description\":\"Matching pair of perfumes\"}" +
                "]}" +
            "]}");

        // 19. Mini Indoor Plants - Customer selects plant type (Price on Request - Non-Customizable)
        createProductWithOptions("Mini Indoor Plants",
            "Low-maintenance mini plants in decorative pots. We will purchase it for you and share the details.",
            new BigDecimal("0.00"), ProductType.EDIBLE_ITEM, homeDecor,
            "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=500",
            false, BigDecimal.ZERO, 120,
            new BigDecimal("8"), new BigDecimal("12"), new BigDecimal("8"),
            "{\"type\":\"plant\",\"priceOnRequest\":true,\"priceMessage\":\"We will purchase it for you and share the details\",\"options\":[" +
                "{\"category\":\"Plant Type\",\"choices\":[" +
                    "{\"name\":\"Succulent\",\"price\":0,\"description\":\"Cute succulent, very low maintenance\"}," +
                    "{\"name\":\"Cactus\",\"price\":0,\"description\":\"Small cactus, minimal watering needed\"}," +
                    "{\"name\":\"Money Plant\",\"price\":50,\"description\":\"Lucky money plant, brings prosperity\"}," +
                    "{\"name\":\"Snake Plant\",\"price\":100,\"description\":\"Air purifying, very hardy\"}," +
                    "{\"name\":\"Jade Plant\",\"price\":50,\"description\":\"Symbol of good luck and friendship\"}" +
                "]}" +
            "]}");

        // 20. Live Outdoor Plants (Price on Request - Non-Customizable)
        createProductWithOptions("Live Outdoor Plants",
            "Beautiful flowering plants for balcony or garden. We will purchase it for you and share the details.",
            new BigDecimal("0.00"), ProductType.EDIBLE_ITEM, homeDecor,
            "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500",
            false, BigDecimal.ZERO, 70,
            new BigDecimal("12"), new BigDecimal("20"), new BigDecimal("12"),
            "{\"type\":\"plant\",\"priceOnRequest\":true,\"priceMessage\":\"We will purchase it for you and share the details\",\"options\":[" +
                "{\"category\":\"Plant Type\",\"choices\":[" +
                    "{\"name\":\"Rose Plant\",\"price\":0,\"description\":\"Beautiful blooming roses\"}," +
                    "{\"name\":\"Jasmine Plant\",\"price\":50,\"description\":\"Fragrant jasmine flowers\"}," +
                    "{\"name\":\"Tulsi Plant\",\"price\":-50,\"description\":\"Sacred holy basil\"}," +
                    "{\"name\":\"Hibiscus Plant\",\"price\":0,\"description\":\"Colorful hibiscus blooms\"}," +
                    "{\"name\":\"Marigold Plant\",\"price\":-50,\"description\":\"Bright marigold flowers\"}" +
                "]}" +
            "]}");

        // 21. Customised Acrylic Clock - NEW
        createProductWithOptions("Customised Acrylic Clock",
            "Modern acrylic wall clock with custom photo or design. Functional and decorative!",
            new BigDecimal("899.00"), ProductType.CUSTOMISED_ITEM, homeDecor,
            "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500",
            true, new BigDecimal("200.00"), 60,
            new BigDecimal("25"), new BigDecimal("25"), new BigDecimal("3"),
            "{\"type\":\"clock\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Size\",\"choices\":[" +
                    "{\"name\":\"Small (8 inch)\",\"price\":0,\"width\":20,\"height\":20}," +
                    "{\"name\":\"Medium (10 inch)\",\"price\":150,\"width\":25,\"height\":25}," +
                    "{\"name\":\"Large (12 inch)\",\"price\":300,\"width\":30,\"height\":30}" +
                "]}," +
                "{\"category\":\"Shape\",\"choices\":[" +
                    "{\"name\":\"Round\",\"price\":0,\"description\":\"Classic round clock\"}," +
                    "{\"name\":\"Square\",\"price\":50,\"description\":\"Modern square design\"}," +
                    "{\"name\":\"Heart\",\"price\":100,\"description\":\"Romantic heart shape\"}," +
                    "{\"name\":\"Custom Shape\",\"price\":200,\"description\":\"Your custom design\"}" +
                "]}" +
            "]}");

        // ========================================
        // 🎁 GIFT BOXES CATEGORY
        // ========================================

        // 22. Hamper Boxes - with Size Variants and Box Types
        createProductWithOptions("Hamper Boxes",
            "Create your perfect gift hamper! Choose from different box types and sizes, then fill with your favorite items.",
            new BigDecimal("199.00"), ProductType.HAMPER_BOX, hamperBoxes,
            "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500",
            false, BigDecimal.ZERO, 100,
            new BigDecimal("25"), new BigDecimal("25"), new BigDecimal("10"),
            "{\"type\":\"hamper_size\",\"options\":[" +
                "{\"category\":\"Box Type\",\"choices\":[" +
                    "{\"name\":\"Closed Box\",\"price\":0,\"description\":\"Traditional closed gift box with lid\"}," +
                    "{\"name\":\"Open Display Box\",\"price\":50,\"description\":\"Open box for visible display\"}," +
                    "{\"name\":\"Transparent Box\",\"price\":100,\"description\":\"Clear box to showcase contents\"}," +
                    "{\"name\":\"Semi Transparent Box\",\"price\":150,\"description\":\"Luxury packaging with ribbon\"}," +
                    "{\"name\":\"Theme Based Hamper\",\"price\":120,\"description\":\"For your special occasion\"}" +
                "]}," +
                "{\"category\":\"Box Size\",\"choices\":[" +
                    "{\"name\":\"Small Gift Box\",\"price\":0,\"maxItems\":6,\"description\":\"Perfect for 3-6 items\",\"width\":20,\"height\":15,\"depth\":8}," +
                    "{\"name\":\"Small-Medium Gift Box\",\"price\":50,\"maxItems\":8,\"description\":\"Great for 6-8 items\",\"width\":23,\"height\":18,\"depth\":10}," +
                    "{\"name\":\"Medium Gift Box\",\"price\":100,\"maxItems\":9,\"description\":\"Ideal for 9 items\",\"width\":25,\"height\":20,\"depth\":10}," +
                    "{\"name\":\"Large Gift Box\",\"price\":200,\"maxItems\":12,\"description\":\"Best for 12 items\",\"width\":30,\"height\":25,\"depth\":13}" +
                "]}" +
            "]}");


        log.info("Sample data created successfully!");
        log.info("Created {} categories", categoryRepository.count());
        log.info("Created {} products", productRepository.count());
    }

    private Category createCategory(String name, String description, String imageUrl, int displayOrder) {
        Category category = Category.builder()
                .name(name)
                .description(description)
                .imageUrl(imageUrl)
                .displayOrder(displayOrder)
                .active(true)
                .build();
        return categoryRepository.save(category);
    }

    private Product createProduct(String name, String description, BigDecimal price,
                                   ProductType productType, Category category, String imageUrl,
                                   boolean isCustomizable, BigDecimal customizationCharge, int stockQuantity) {
        return createProduct(name, description, price, productType, category, imageUrl,
                isCustomizable, customizationCharge, stockQuantity, null, null, null);
    }

    private Product createProduct(String name, String description, BigDecimal price,
                                   ProductType productType, Category category, String imageUrl,
                                   boolean isCustomizable, BigDecimal customizationCharge, int stockQuantity,
                                   BigDecimal widthCm, BigDecimal heightCm, BigDecimal depthCm) {
        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .productType(productType)
                .category(category)
                .imageUrl(imageUrl)
                .isCustomizable(isCustomizable)
                .customizationCharge(customizationCharge)
                .stockQuantity(stockQuantity)
                .widthCm(widthCm)
                .heightCm(heightCm)
                .depthCm(depthCm)
                .active(true)
                .build();
        return productRepository.save(product);
    }

    private Product createProductWithOptions(String name, String description, BigDecimal price,
                                              ProductType productType, Category category, String imageUrl,
                                              boolean isCustomizable, BigDecimal customizationCharge, int stockQuantity,
                                              BigDecimal widthCm, BigDecimal heightCm, BigDecimal depthCm,
                                              String customizationOptions) {
        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .productType(productType)
                .category(category)
                .imageUrl(imageUrl)
                .isCustomizable(isCustomizable)
                .customizationCharge(customizationCharge)
                .customizationOptions(customizationOptions)
                .stockQuantity(stockQuantity)
                .widthCm(widthCm)
                .heightCm(heightCm)
                .depthCm(depthCm)
                .active(true)
                .build();
        return productRepository.save(product);
    }
}

