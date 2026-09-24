import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API = process.env.PRINTIFY_API_KEY || process.env.PRINTIFY_TOKEN;
const SHOP_ID = process.env.PRINTIFY_SHOP_ID;

if (!API || !SHOP_ID) {
  console.error("Missing PRINTIFY_API_KEY and PRINTIFY_SHOP_ID in .env.local");
  console.log("Add: PRINTIFY_API_KEY=xxx\nPRINTIFY_SHOP_ID=1234567");
  process.exit(1);
}

const PRINTIFY = `https://api.printify.com/v1/shops/${SHOP_ID}`;

async function uploadImage(filePath) {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath).toString('base64');

  console.log(`⬆️  Uploading ${fileName}...`);

  const res = await fetch(`https://api.printify.com/v1/uploads/images.json`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_name: fileName, contents: content })
  });

  const data = await res.json();
  if (!data.id) { console.error("Upload failed:", data); throw new Error(data); }
  
  console.log(`✅ Uploaded ${fileName} -> ${data.id}`);
  return data.id;
}

async function createProduct({ title, description, blueprint_id, print_provider_id, variants, print_areas }) {
  console.log(`\n🛒 Creating product: ${title}`);
  
  const res = await fetch(`${PRINTIFY}/products.json`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, blueprint_id, print_provider_id, variants, print_areas })
  });

  const data = await res.json();
  if (data.id) {
    console.log(`✅ Created: ${title} -> ${data.id}`);
    return data.id;
  } else {
    console.error("Creation failed:", data);
    throw new Error(JSON.stringify(data));
  }
}

async function publishProduct(productId) {
  console.log(`\n🌐 Publishing product ${productId}...`);
  
  const res = await fetch(`${PRINTIFY}/products/${productId}/publish.json`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ publish: { description: true, images: true, variants: true, tags: true, keyfeatures: true, shipping_template: true } })
  });

  const data = await res.json();
  if (data.product.is_published) {
    console.log(`✅ Published: ${productId}`);
  } else {
    console.error("Publish failed:", data);
    throw new Error(JSON.stringify(data));
  }
}

// Rebel art product configurations
const rebelProducts = [
  {
    title: "Rebel Art T-Shirt",
    description: "Express your rebellious side with this unique art piece.",
    blueprint_id: 3, // T-shirt blueprint
    print_provider_id: 1, // Default print provider
    variants: [
      { id: 1, title: "Black", options: { color: "Black", size: "S" }, price: 2200 },
      { id: 2, title: "White", options: { color: "White", size: "S" }, price: 2200 },
      { id: 3, title: "Black", options: { color: "Black", size: "M" }, price: 2200 },
      { id: 4, title: "White", options: { color: "White", size: "M" }, price: 2200 },
      { id: 5, title: "Black", options: { color: "Black", size: "L" }, price: 2200 },
      { id: 6, title: "White", options: { color: "White", size: "L" }, price: 2200 }
    ]
  },
  {
    title: "Rebel Art Mug",
    description: "Start your day with a rebellious touch.",
    blueprint_id: 1, // Mug blueprint
    print_provider_id: 1,
    variants: [
      { id: 7, title: "White", options: { color: "White" }, price: 1800 },
      { id: 8, title: "Black", options: { color: "Black" }, price: 1800 }
    ]
  }
];

async function runRebelDrop() {
  try {
    // Look for rebel art images in public/printify
    const imageDir = './public/printify/';
    const imageFiles = fs.readdirSync(imageDir)
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => path.join(imageDir, file));

    if (imageFiles.length === 0) {
      console.log("No rebel art images found in public/printify/. Please add some images first.");
      return;
    }

    console.log(`Found ${imageFiles.length} rebel art images to upload...`);

    // Upload all images
    const uploadedImageIds = [];
    for (const imagePath of imageFiles) {
      const imageId = await uploadImage(imagePath);
      uploadedImageIds.push(imageId);
    }

    // Create products for each rebel art
    for (const [index, productConfig] of rebelProducts.entries()) {
      // Use the first available image for all variants of this product
      const imageId = uploadedImageIds[index % uploadedImageIds.length];
      
      // Create print areas using the uploaded image
      const printAreas = [
        {
          variant_ids: productConfig.variants.map(v => v.id),
          placeholders: [{
            position: "center",
            images: [{
              id: imageId,
              x: 0,
              y: 0,
              scale: 1,
              angle: 0
            }]
          }]
        }
      ];

      // Create the product with the uploaded image
      const productId = await createProduct({
        ...productConfig,
        print_areas: printAreas
      });

      // Publish the product
      await publishProduct(productId);
    }

    console.log("\n🎉 Rebel drop completed successfully!");
  } catch (error) {
    console.error("❌ Rebel drop failed:", error);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runRebelDrop();
}