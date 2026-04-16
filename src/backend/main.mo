import CatalogTypes "types/catalog";
import CartTypes "types/cart";
import OrderTypes "types/orders";
import WishlistTypes "types/wishlist";
import AuthTypes "types/auth";
import AuthLib "lib/auth";
import CatalogLib "lib/catalog";

import CatalogApi "mixins/catalog-api";
import CartApi "mixins/cart-api";
import OrdersApi "mixins/orders-api";
import WishlistApi "mixins/wishlist-api";
import AuthApi "mixins/auth-api";

import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";

actor {
  // --- Shared state ---
  let admins = Set.empty<AuthTypes.UserId>();
  let products = Map.empty<CatalogTypes.ProductId, CatalogTypes.Product>();
  let nextProductIdBox = { var value : Nat = 0 };
  let carts = Map.empty<CartTypes.UserId, [CartTypes.CartItem]>();
  let orders = Map.empty<OrderTypes.OrderId, OrderTypes.Order>();
  let userOrders = Map.empty<OrderTypes.UserId, List.List<OrderTypes.OrderId>>();
  let nextOrderIdBox = { var value : Nat = 0 };
  let wishlists = Map.empty<WishlistTypes.UserId, [WishlistTypes.ProductId]>();

  // --- Seed sample products ---
  var seeded : Bool = false;

  func seedProducts() {
    if (seeded) return;
    seeded := true;

    let seedData : [CatalogTypes.ProductInput] = [
      {
        title = "Sony WH-1000XM5 Wireless Headphones";
        description = "Industry-leading noise cancellation headphones with 30-hour battery life, multipoint Bluetooth connection, and exceptional sound quality for immersive listening.";
        price = 34999; // $349.99
        images = ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"];
        category = "Headphones";
        inventoryCount = 50;
      },
      {
        title = "Jabra Evolve2 85 Wireless Headset";
        description = "Professional wireless headset with world-class ANC, 37-hour battery, 10-speaker array, and UC certified busylight integration for seamless remote work.";
        price = 37900; // $379.00
        images = ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600"];
        category = "Headphones";
        inventoryCount = 30;
      },
      {
        title = "Apple Watch Series 9 GPS (45mm)";
        description = "Advanced smartwatch with Always-On Retina display, Double Tap gesture, ECG app, blood oxygen monitoring, crash detection, and up to 18 hours battery.";
        price = 42999; // $429.99
        images = ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600"];
        category = "Smartwatches";
        inventoryCount = 35;
      },
      {
        title = "Garmin Fenix 7X Pro Solar";
        description = "Rugged multisport GPS smartwatch with solar charging, built-in LED flashlight, 37-day battery life, and advanced health monitoring including ECG.";
        price = 89900; // $899.00
        images = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"];
        category = "Smartwatches";
        inventoryCount = 18;
      },
      {
        title = "Bose SoundLink Max Portable Speaker";
        description = "Premium portable Bluetooth speaker with 360-degree sound, IP67 water resistance, 20-hour playtime, and built-in voice assistant support.";
        price = 39999; // $399.99
        images = ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"];
        category = "Speakers";
        inventoryCount = 45;
      },
      {
        title = "JBL Charge 5 Waterproof Speaker";
        description = "Portable Bluetooth speaker with 20 hours of playtime, JBL Pro Sound, IP67 waterproof rating, and a built-in powerbank to charge your devices.";
        price = 17999; // $179.99
        images = ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"];
        category = "Speakers";
        inventoryCount = 80;
      },
      {
        title = "Keychron Q3 Max Wireless Mechanical Keyboard";
        description = "Compact tenkeyless mechanical keyboard with hot-swappable switches, aluminium body, QMK/VIA support, and tri-mode wireless connectivity.";
        price = 19999; // $199.99
        images = ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600"];
        category = "Keyboards";
        inventoryCount = 60;
      },
      {
        title = "Logitech MX Keys Advanced Keyboard";
        description = "Advanced wireless illuminated keyboard with smart backlit keys, multi-device pairing, Perfect Stroke key mechanism, and USB-C recharging.";
        price = 11999; // $119.99
        images = ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"];
        category = "Keyboards";
        inventoryCount = 70;
      },
      {
        title = "LG 27GP850-B 27\" QHD Gaming Monitor";
        description = "27-inch QHD IPS gaming monitor with 180Hz refresh rate, 1ms GtG response time, NVIDIA G-SYNC Compatible, and HDR 400 for stunning visuals.";
        price = 44900; // $449.00
        images = ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"];
        category = "Monitors";
        inventoryCount = 25;
      },
      {
        title = "Dell UltraSharp 32\" 4K USB-C Monitor";
        description = "32-inch 4K IPS monitor with 100% sRGB and Rec. 709 color coverage, 90W USB-C power delivery, and ComfortView Plus for reduced eye strain.";
        price = 79900; // $799.00
        images = ["https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600"];
        category = "Monitors";
        inventoryCount = 15;
      },
      {
        title = "Anker 737 MagGo 3-in-1 Charger";
        description = "3-in-1 wireless charging station for iPhone, Apple Watch, and AirPods with 15W fast charging, Qi2 certified, and a 67W wall charger included.";
        price = 8999; // $89.99
        images = ["https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600"];
        category = "Accessories";
        inventoryCount = 120;
      },
      {
        title = "Elgato Stream Deck MK.2";
        description = "Professional studio controller with 15 customisable LCD keys, adjustable stand, and seamless integration with streaming software, apps, and tools.";
        price = 14999; // $149.99
        images = ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"];
        category = "Accessories";
        inventoryCount = 55;
      },
    ];

    for (input in seedData.values()) {
      let id = nextProductIdBox.value;
      nextProductIdBox.value += 1;
      let _ = CatalogLib.createProduct(products, id, input);
    };
  };

  // Run seed on init
  seedProducts();

  // --- Mixin includes ---
  include AuthApi(admins);
  include CatalogApi(products, nextProductIdBox, admins);
  include CartApi(carts);
  include OrdersApi(orders, userOrders, nextOrderIdBox, carts, products, admins);
  include WishlistApi(wishlists);
};
