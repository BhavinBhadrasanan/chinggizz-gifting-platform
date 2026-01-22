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

/**
 * Data Initializer - Creates default admin user and sample data
 */
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
            new BigDecimal("799.00"), ProductType.CUSTOMISED_ITEM, personalizedGifts,
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
            true, new BigDecimal("200.00"), 50,
            new BigDecimal("21"), new BigDecimal("30"), new BigDecimal("0.5"),
            "{\"type\":\"caricature\",\"hasPhotoUpload\":true,\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Individual\",\"price\":0,\"description\":\"Single person caricature\"}," +
                    "{\"name\":\"Couple\",\"price\":500,\"description\":\"Two people caricature\"}" +
                "]}," +
                "{\"category\":\"Size\",\"choices\":[" +
                    "{\"name\":\"A4 (21×30 cm)\",\"price\":0,\"width\":21,\"height\":30}," +
                    "{\"name\":\"A3 (30×42 cm)\",\"price\":300,\"width\":30,\"height\":42}," +
                    "{\"name\":\"A2 (42×59 cm)\",\"price\":600,\"width\":42,\"height\":59}" +
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

        // 12. Jewellery Items - NEW
        createProductWithOptions("Jewellery Items",
            "Beautiful jewellery pieces for every occasion. Choose from necklaces, bracelets, earrings, and more.",
            new BigDecimal("999.00"), ProductType.CUSTOMISED_ITEM, fashionAccessories,
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
            true, new BigDecimal("200.00"), 80,
            new BigDecimal("5"), new BigDecimal("5"), new BigDecimal("2"),
            "{\"type\":\"jewellery\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Necklace\",\"price\":0,\"description\":\"Elegant necklace\"}," +
                    "{\"name\":\"Bracelet\",\"price\":-200,\"description\":\"Stylish bracelet\"}," +
                    "{\"name\":\"Earrings\",\"price\":-300,\"description\":\"Beautiful earrings\"}," +
                    "{\"name\":\"Ring\",\"price\":200,\"description\":\"Stunning ring\"}," +
                    "{\"name\":\"Jewellery Set\",\"price\":500,\"description\":\"Complete matching set\"}" +
                "]}," +
                "{\"category\":\"Material\",\"choices\":[" +
                    "{\"name\":\"Silver Plated\",\"price\":0,\"description\":\"Elegant silver finish\"}," +
                    "{\"name\":\"Gold Plated\",\"price\":300,\"description\":\"Luxurious gold finish\"}," +
                    "{\"name\":\"Rose Gold\",\"price\":400,\"description\":\"Trendy rose gold\"}," +
                    "{\"name\":\"Artificial Diamonds\",\"price\":600,\"description\":\"Sparkling diamond-like stones\"}" +
                "]}" +
            "]}");

        // 13. Watch or Accessories - NEW
        createProductWithOptions("Watch & Accessories",
            "Stylish watches and fashion accessories. Perfect gift for him or her.",
            new BigDecimal("1499.00"), ProductType.CUSTOMISED_ITEM, fashionAccessories,
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500",
            true, new BigDecimal("300.00"), 60,
            new BigDecimal("5"), new BigDecimal("5"), new BigDecimal("3"),
            "{\"type\":\"accessories\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Men's Watch\",\"price\":0,\"description\":\"Classic men's wristwatch\"}," +
                    "{\"name\":\"Women's Watch\",\"price\":200,\"description\":\"Elegant women's watch\"}," +
                    "{\"name\":\"Couple Watches\",\"price\":1000,\"description\":\"Matching pair of watches\"}," +
                    "{\"name\":\"Sunglasses\",\"price\":-500,\"description\":\"Stylish sunglasses\"}," +
                    "{\"name\":\"Wallet\",\"price\":-700,\"description\":\"Premium leather wallet\"}," +
                    "{\"name\":\"Belt\",\"price\":-800,\"description\":\"Genuine leather belt\"}" +
                "]}," +
                "{\"category\":\"Style\",\"choices\":[" +
                    "{\"name\":\"Classic\",\"price\":0,\"description\":\"Timeless design\"}," +
                    "{\"name\":\"Modern\",\"price\":200,\"description\":\"Contemporary style\"}," +
                    "{\"name\":\"Sport\",\"price\":100,\"description\":\"Athletic design\"}," +
                    "{\"name\":\"Luxury\",\"price\":500,\"description\":\"Premium luxury finish\"}" +
                "]}" +
            "]}");

        // 14. Dress of Choice - NEW
        createProductWithOptions("Dress of Choice",
            "Beautiful dresses for special occasions. Choose style, size, and color.",
            new BigDecimal("1999.00"), ProductType.CUSTOMISED_ITEM, fashionAccessories,
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
            true, new BigDecimal("0"), 50,
            new BigDecimal("30"), new BigDecimal("40"), new BigDecimal("5"),
            "{\"type\":\"dress\",\"options\":[" +
                "{\"category\":\"Type\",\"choices\":[" +
                    "{\"name\":\"Casual Dress\",\"price\":0,\"description\":\"Comfortable everyday wear\"}," +
                    "{\"name\":\"Party Dress\",\"price\":500,\"description\":\"Glamorous party outfit\"}," +
                    "{\"name\":\"Formal Dress\",\"price\":800,\"description\":\"Elegant formal attire\"}," +
                    "{\"name\":\"Traditional Dress\",\"price\":600,\"description\":\"Cultural traditional wear\"}" +
                "]}," +
                "{\"category\":\"Size\",\"choices\":[" +
                    "{\"name\":\"XS\",\"price\":0}," +
                    "{\"name\":\"S\",\"price\":0}," +
                    "{\"name\":\"M\",\"price\":0}," +
                    "{\"name\":\"L\",\"price\":0}," +
                    "{\"name\":\"XL\",\"price\":0}," +
                    "{\"name\":\"XXL\",\"price\":100}" +
                "]}," +
                "{\"category\":\"Color\",\"choices\":[" +
                    "{\"name\":\"Red\",\"price\":0}," +
                    "{\"name\":\"Blue\",\"price\":0}," +
                    "{\"name\":\"Black\",\"price\":0}," +
                    "{\"name\":\"White\",\"price\":0}," +
                    "{\"name\":\"Pink\",\"price\":0}," +
                    "{\"name\":\"Green\",\"price\":0}," +
                    "{\"name\":\"Yellow\",\"price\":0}," +
                    "{\"name\":\"Multi-Color\",\"price\":200}" +
                "]}" +
            "]}");

        // ========================================
        // 🍫 EDIBLES & TREATS CATEGORY
        // ========================================

        // 15. Chocolates - NEW
        createProductWithOptions("Premium Chocolates",
            "Delicious handcrafted chocolates. Choose from various flavors and gift boxes.",
            new BigDecimal("499.00"), ProductType.EDIBLE_ITEM, edibleTreats,
            "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500",
            true, BigDecimal.ZERO, 150,
            new BigDecimal("15"), new BigDecimal("15"), new BigDecimal("5"),
            "{\"type\":\"chocolates\",\"options\":[" +
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
            "{\"type\":\"fragrance\",\"options\":[" +
                "{\"name\":\"Lavender\",\"price\":0,\"description\":\"Calming lavender scent\",\"color\":\"#9B7EBD\"}," +
                "{\"name\":\"Vanilla Rose\",\"price\":50,\"description\":\"Sweet vanilla with rose notes\",\"color\":\"#FFB6C1\"}," +
                "{\"name\":\"Sandalwood\",\"price\":100,\"description\":\"Traditional sandalwood fragrance\",\"color\":\"#D2B48C\"}," +
                "{\"name\":\"Jasmine\",\"price\":50,\"description\":\"Fresh jasmine aroma\",\"color\":\"#FFFACD\"}," +
                "{\"name\":\"Citrus Fresh\",\"price\":0,\"description\":\"Energizing citrus blend\",\"color\":\"#FFA500\"}," +
                "{\"name\":\"Apple\",\"price\":0,\"description\":\"Fresh apple fragrance\",\"color\":\"#DC143C\"}" +
            "]}");

        // 18. Perfumes - Customer selects fragrance
        createProductWithOptions("Premium Perfumes",
            "Long-lasting premium fragrances. 50ml bottle. Choose your signature scent.",
            new BigDecimal("799.00"), ProductType.EDIBLE_ITEM, homeDecor,
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
            true, BigDecimal.ZERO, 80,
            new BigDecimal("5"), new BigDecimal("12"), new BigDecimal("5"),
            "{\"type\":\"fragrance\",\"options\":[" +
                "{\"name\":\"Floral Essence\",\"price\":0,\"description\":\"Delicate floral notes\"}," +
                "{\"name\":\"Woody Musk\",\"price\":200,\"description\":\"Sophisticated woody fragrance\"}," +
                "{\"name\":\"Citrus Fresh\",\"price\":0,\"description\":\"Refreshing citrus blend\"}," +
                "{\"name\":\"Oriental Spice\",\"price\":150,\"description\":\"Exotic spicy notes\"}," +
                "{\"name\":\"Ocean Breeze\",\"price\":100,\"description\":\"Fresh aquatic scent\"}" +
            "]}");

        // 19. Mini Indoor Plants - Customer selects plant type
        createProductWithOptions("Mini Indoor Plants",
            "Low-maintenance mini plants in decorative pots. Perfect for desk or home.",
            new BigDecimal("249.00"), ProductType.EDIBLE_ITEM, homeDecor,
            "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=500",
            true, BigDecimal.ZERO, 120,
            new BigDecimal("8"), new BigDecimal("12"), new BigDecimal("8"),
            "{\"type\":\"plant\",\"options\":[" +
                "{\"category\":\"Plant Type\",\"choices\":[" +
                    "{\"name\":\"Succulent\",\"price\":0,\"description\":\"Cute succulent, very low maintenance\"}," +
                    "{\"name\":\"Cactus\",\"price\":0,\"description\":\"Small cactus, minimal watering needed\"}," +
                    "{\"name\":\"Money Plant\",\"price\":50,\"description\":\"Lucky money plant, brings prosperity\"}," +
                    "{\"name\":\"Snake Plant\",\"price\":100,\"description\":\"Air purifying, very hardy\"}," +
                    "{\"name\":\"Jade Plant\",\"price\":50,\"description\":\"Symbol of good luck and friendship\"}" +
                "]}" +
            "]}");

        // 20. Live Outdoor Plants
        createProductWithOptions("Live Outdoor Plants",
            "Beautiful flowering plants for balcony or garden. Comes with care instructions.",
            new BigDecimal("349.00"), ProductType.EDIBLE_ITEM, homeDecor,
            "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500",
            true, BigDecimal.ZERO, 70,
            new BigDecimal("12"), new BigDecimal("20"), new BigDecimal("12"),
            "{\"type\":\"plant\",\"options\":[" +
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

