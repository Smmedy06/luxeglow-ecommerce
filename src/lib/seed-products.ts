// This file contains the product data that should be seeded into Supabase
// Run this SQL in Supabase SQL Editor to seed the products

export const seedProductsSQL = `
INSERT INTO products (brand, name, price, category, image, description, in_stock, stock_count) VALUES
('ALLERGAN', 'Juvederm Ultra 3', '£107.99', 'Dermal Fillers', 'product-1', 'Juvederm Ultra 3 is a hyaluronic acid dermal filler designed to add volume and fullness to the face.', true, 15),
('ALLERGAN', 'Juvederm Voluma', '£143.99', 'Dermal Fillers', 'product-2', 'Juvederm Voluma is specifically designed to add volume to the cheek area.', true, 8),
('GALDERMA', 'Restylane Kysse', '£113.99', 'Dermal Fillers', 'product-3', 'Restylane Kysse is the first FDA-approved hyaluronic acid filler specifically designed for lip augmentation.', false, 0),
('ALLERGAN', 'Botox 100 Units', '£191.99', 'Anti-Wrinkle Injections', 'product-4', 'Botox 100 Units is the world''s most popular anti-wrinkle treatment.', true, 12),
('GALDERMA', 'Dysport 300 Units', '£167.99', 'Anti-Wrinkle Injections', 'product-5', 'Dysport 300 Units is an alternative to Botox for treating moderate to severe frown lines.', true, 6),
('GALDERMA', 'Azzalure 125 Units', '£149.99', 'Anti-Wrinkle Injections', 'product-6', 'Azzalure 125 Units is a botulinum toxin type A treatment for temporary improvement.', true, 9),
('TEOSYAL', 'Teosyal RHA 2', '£125.99', 'Dermal Fillers', 'product-7', 'Teosyal RHA 2 is a hyaluronic acid filler designed for fine lines and superficial wrinkles.', true, 7),
('MERZ', 'Belotero Balance', '£101.99', 'Dermal Fillers', 'product-8', 'Belotero Balance is a hyaluronic acid filler specifically designed for treating fine lines.', true, 11),
('CROMA', 'Princess Filler', '£95.99', 'Dermal Fillers', 'product-9', 'Princess Filler is a hyaluronic acid dermal filler designed for facial contouring.', true, 13),
('FILORGA', 'NCTF 135HA', '£227.99', 'Mesotherapy', 'product-10', 'NCTF 135HA is a mesotherapy treatment containing hyaluronic acid and various vitamins.', true, 5),
('PLURYAL', 'Pluryal Mesoline Shine', '£161.99', 'Mesotherapy', 'product-11', 'Pluryal Mesoline Shine provides deep hydration and skin rejuvenation.', true, 8),
('DERMALAX', 'Dermalax Hyalbag Solution', '£179.99', 'Mesotherapy', 'product-12', 'Dermalax Hyalbag Solution is a premium mesotherapy treatment.', true, 6),
('PDO', 'PDO Cog Threads 19G', '£59.99', 'Thread Lifts', 'product-13', 'PDO Cog Threads 19G for facial lifting and contouring.', true, 10),
('PDO', 'PDO Mono Threads 30G', '£47.99', 'Thread Lifts', 'product-14', 'PDO Mono Threads 30G for fine line treatment.', true, 12),
('ZO SKIN HEALTH', 'ZO Skin Health Daily Power Defense', '£149.99', 'Professional Skincare', 'product-15', 'ZO Skin Health Daily Power Defense for daily skin protection.', true, 15),
('SKINCEUTICALS', 'SkinCeuticals CE Ferulic', '£179.99', 'Professional Skincare', 'product-16', 'SkinCeuticals CE Ferulic is a premium antioxidant serum.', true, 10),
('OBAGI', 'Obagi Professional-C Serum 20%', '£161.99', 'Professional Skincare', 'product-17', 'Obagi Professional-C Serum 20% for advanced skin brightening.', true, 8),
('MEDICAL GRADE', 'Medical Grade Cannulas 20G', '£41.99', 'Medical Devices', 'product-18', 'Medical Grade Cannulas 20G for professional use.', true, 20),
('PRECISION', 'Precision Dermal Needles 30G', '£29.99', 'Medical Devices', 'product-19', 'Precision Dermal Needles 30G for precise injections.', true, 25),
('GALDERMA', 'Restylane Lyft', '£135.99', 'Dermal Fillers', 'product-20', 'Restylane Lyft for cheek augmentation and volume restoration.', true, 9);
`;

