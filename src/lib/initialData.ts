import { Product, Slot, Booking } from '../types';

// =============================================================================
// AYYAN FIREWORKS FACTORY — OFFICIAL SHOWROOM INVENTORY (141 SKUs)
// Bunny Brand Sivakasi Green Cracker Catalogue
// =============================================================================
export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "ayyan-001",
    "code": "001",
    "name": "Ganesh Cracker",
    "category": "Maroons",
    "price": 62,
    "piece_count": "1 Pkt",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Ganesh-Crackers-10-Pkt.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.503Z"
  },
  {
    "id": "ayyan-002",
    "code": "002",
    "name": "Lakshmi Cracker",
    "category": "Maroons",
    "price": 35,
    "piece_count": "1 Pkt",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/lakshmi-crackers.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.510Z"
  },
  {
    "id": "ayyan-003",
    "code": "003",
    "name": "Bird Crackers",
    "category": "Maroons",
    "price": 15.8,
    "piece_count": "1 Pkt",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Bird-Crackers-10-Pkt.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.510Z"
  },
  {
    "id": "ayyan-004",
    "code": "004",
    "name": "7 cm Electric Sparkler",
    "category": "Sparklers",
    "price": 19.6,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/7-cm-Electric-Sparklers-10-box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.515Z"
  },
  {
    "id": "ayyan-005",
    "code": "005",
    "name": "7 cm Colour Sparkler",
    "category": "Sparklers",
    "price": 22.95,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50-cm-Coloured-Sparklers-10-box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.518Z"
  },
  {
    "id": "ayyan-006",
    "code": "006",
    "name": "10 cm Ruby Sparklers",
    "category": "Sparklers",
    "price": 35.65,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/10cm-Ruby-Sparklers-10-box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.520Z"
  },
  {
    "id": "ayyan-007",
    "code": "007",
    "name": "12 cm Electric Sparkler",
    "category": "Sparklers",
    "price": 28.65,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50cm-electric-sparklers.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.524Z"
  },
  {
    "id": "ayyan-008",
    "code": "008",
    "name": "12 cm Colour Sparkler",
    "category": "Sparklers",
    "price": 38.75,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50-cm-Coloured-Sparklers-10-box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.527Z"
  },
  {
    "id": "ayyan-009",
    "code": "009",
    "name": "15 cm Electric Sparkler",
    "category": "Sparklers",
    "price": 55.8,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50cm-electric-sparklers.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.529Z"
  },
  {
    "id": "ayyan-010",
    "code": "010",
    "name": "15 cm Colour Sparkler",
    "category": "Sparklers",
    "price": 72.85,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50-cm-Coloured-Sparklers-10-box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.531Z"
  },
  {
    "id": "ayyan-011",
    "code": "011",
    "name": "15 cm Ruby Sparkler",
    "category": "Sparklers",
    "price": 60.5,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/10cm-Ruby-Sparklers-10-box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.533Z"
  },
  {
    "id": "ayyan-012",
    "code": "012",
    "name": "15 cm Panchavarnam Sparkler",
    "category": "Sparklers",
    "price": 66.65,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2025/06/IMG-20250601-WA0020.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.535Z"
  },
  {
    "id": "ayyan-013",
    "code": "013",
    "name": "30 cm Electric Sparkler",
    "category": "Sparklers",
    "price": 55.8,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50cm-electric-sparklers.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.538Z"
  },
  {
    "id": "ayyan-014",
    "code": "014",
    "name": "30 cm Colour Sparkler",
    "category": "Sparklers",
    "price": 72.85,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50-cm-Coloured-Sparklers-10-box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.540Z"
  },
  {
    "id": "ayyan-015",
    "code": "015",
    "name": "50 cm Electric Sparkler",
    "category": "Sparklers",
    "price": 168.5,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50cm-electric-sparklers.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.541Z"
  },
  {
    "id": "ayyan-016",
    "code": "016",
    "name": "50 cm Colour Sparkler",
    "category": "Sparklers",
    "price": 208.5,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50-cm-Coloured-Sparklers-10-box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.543Z"
  },
  {
    "id": "ayyan-017",
    "code": "017",
    "name": "75 cm Electric Sparkler",
    "category": "Sparklers",
    "price": 280.7,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50cm-electric-sparklers.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.545Z"
  },
  {
    "id": "ayyan-018",
    "code": "018",
    "name": "75 cm Colour Sparklers",
    "category": "Sparklers",
    "price": 338.5,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/50-cm-Coloured-Sparklers-10-box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.547Z"
  },
  {
    "id": "ayyan-019",
    "code": "019",
    "name": "Ground Chakkar Big",
    "category": "Ground Chakkars",
    "price": 164.3,
    "piece_count": "25 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Ground-Chakkar-Big-25-pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.547Z"
  },
  {
    "id": "ayyan-020",
    "code": "020",
    "name": "Ground Chakkar Spl.",
    "category": "Ground Chakkars",
    "price": 148.8,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/1696660841-AYYAN-Ground-Super-Deluxe.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.548Z"
  },
  {
    "id": "ayyan-021",
    "code": "021",
    "name": "Ground Chakkar Deluxe",
    "category": "Ground Chakkars",
    "price": 263.5,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/1696660841-AYYAN-Ground-Super-Deluxe.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.550Z"
  },
  {
    "id": "ayyan-022",
    "code": "022",
    "name": "Krishna Chakkar Big",
    "category": "Ground Chakkars",
    "price": 209.15,
    "piece_count": "25 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/05/Untitled-1_0002_Untitled-1-12_0005_Layer-8-1-1.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.551Z"
  },
  {
    "id": "ayyan-023",
    "code": "023",
    "name": "Krishna Chakkar Spl.",
    "category": "Ground Chakkars",
    "price": 158.1,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/05/Untitled-1_0002_Untitled-1-12_0005_Layer-8-1-1.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.553Z"
  },
  {
    "id": "ayyan-024",
    "code": "024",
    "name": "Giant Wheel",
    "category": "Wheels",
    "price": 189.1,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2026/09/Screenshot_2026-09-06-11-13-18-82_e5d3893ac03954c6bb675ef2555b879b.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.554Z"
  },
  {
    "id": "ayyan-025",
    "code": "025",
    "name": "Joke Wheel",
    "category": "Wheels",
    "price": 189.1,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2025/06/IMG-20250401-WA0023.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.556Z"
  },
  {
    "id": "ayyan-026",
    "code": "026",
    "name": "Star Wheel",
    "category": "Wheels",
    "price": 167.4,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/05/Untitled-1_0012_Untitled-1-12_0008_Layer-5.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.556Z"
  },
  {
    "id": "ayyan-027",
    "code": "027",
    "name": "Classic Wheel",
    "category": "Wheels",
    "price": 271.25,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Classic-Night-240-shot-four-colour.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.558Z"
  },
  {
    "id": "ayyan-028",
    "code": "028",
    "name": "Whistling Wheel",
    "category": "Wheels",
    "price": 192.2,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Whistling-Wheel.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.558Z"
  },
  {
    "id": "ayyan-029",
    "code": "029",
    "name": "Glittering Wheel",
    "category": "Wheels",
    "price": 189.1,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Screenshot_2026-05-20-14-14-57-94_680d03679600f7af0b4c700c6b270fe7.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.558Z"
  },
  {
    "id": "ayyan-030",
    "code": "030",
    "name": "Tinto Wheel",
    "category": "Wheels",
    "price": 176.4,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/rio-wheel-1.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.559Z"
  },
  {
    "id": "ayyan-031",
    "code": "031",
    "name": "Rio Wheel",
    "category": "Wheels",
    "price": 176.4,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/rio-wheel-1.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.560Z"
  },
  {
    "id": "ayyan-032",
    "code": "032",
    "name": "Lotus",
    "category": "Wheels",
    "price": 127.1,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/lotus.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.560Z"
  },
  {
    "id": "ayyan-033",
    "code": "033",
    "name": "Cocktail Spinner",
    "category": "Wheels",
    "price": 53,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Cocktail-Spinners.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.562Z"
  },
  {
    "id": "ayyan-034",
    "code": "034",
    "name": "Flower Pots Night",
    "category": "Flower Pots",
    "price": 133.3,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Screenshot_2026-05-20-14-17-44-14_680d03679600f7af0b4c700c6b270fe7.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.563Z"
  },
  {
    "id": "ayyan-035",
    "code": "035",
    "name": "Flower Pots Spl.",
    "category": "Flower Pots",
    "price": 213.9,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Screenshot_2026-05-20-14-17-44-14_680d03679600f7af0b4c700c6b270fe7.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.565Z"
  },
  {
    "id": "ayyan-036",
    "code": "036",
    "name": "Flower Pots Giant",
    "category": "Flower Pots",
    "price": 465,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Screenshot_2026-05-20-14-17-44-14_680d03679600f7af0b4c700c6b270fe7.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.565Z"
  },
  {
    "id": "ayyan-037",
    "code": "037",
    "name": "Flower Pots Red",
    "category": "Flower Pots",
    "price": 226.1,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Red-1.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.565Z"
  },
  {
    "id": "ayyan-038",
    "code": "038",
    "name": "Tri Colour Fountain",
    "category": "Colourful Fountains",
    "price": 392.15,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Tri-Colour-Fountain-5-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.565Z"
  },
  {
    "id": "ayyan-039",
    "code": "039",
    "name": "Rangoli",
    "category": "Colourful Fountains",
    "price": 244.9,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Rangoli-5-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.565Z"
  },
  {
    "id": "ayyan-040",
    "code": "040",
    "name": "Colour Koti Deluxe",
    "category": "Flower Pots",
    "price": 713,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/05/Untitled-1_0005_Untitled-1-12_0002_Layer-12.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.566Z"
  },
  {
    "id": "ayyan-041",
    "code": "041",
    "name": "Jugnu",
    "category": "Colourful Fountains",
    "price": 275.9,
    "piece_count": "4 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/tri-colour-fountain-ayyanfire-copy.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.567Z"
  },
  {
    "id": "ayyan-042",
    "code": "042",
    "name": "Mano Rajai",
    "category": "Sparklers",
    "price": 275.9,
    "piece_count": "4 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Manoranjan.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.569Z"
  },
  {
    "id": "ayyan-043",
    "code": "043",
    "name": "Roop Khela",
    "category": "Sparklers",
    "price": 463.45,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Roopkela.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.571Z"
  },
  {
    "id": "ayyan-044",
    "code": "044",
    "name": "Varna Jalam",
    "category": "Sparklers",
    "price": 443.3,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/varnajal.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.572Z"
  },
  {
    "id": "ayyan-045",
    "code": "045",
    "name": "Kiddy's Joy",
    "category": "Sparklers",
    "price": 178.25,
    "piece_count": "5 Pcs / 1 Pkt",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Kiddys-Joy-5-in-One.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.574Z"
  },
  {
    "id": "ayyan-046",
    "code": "046",
    "name": "Super Star (Crackling)",
    "category": "Aerial Multi-Shots",
    "price": 145,
    "piece_count": "1 Pkt",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/camel-star.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.575Z"
  },
  {
    "id": "ayyan-047",
    "code": "047",
    "name": "Dil Se",
    "category": "Sparklers",
    "price": 180,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2025/06/IMG-20250601-WA0019.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.576Z"
  },
  {
    "id": "ayyan-048",
    "code": "048",
    "name": "Little Dove",
    "category": "Sparklers",
    "price": 195,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2026/02/IMG-20260204-WA0020.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.577Z"
  },
  {
    "id": "ayyan-049",
    "code": "049",
    "name": "Crackling Star",
    "category": "Aerial Multi-Shots",
    "price": 367.35,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/camel-star.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.579Z"
  },
  {
    "id": "ayyan-050",
    "code": "050",
    "name": "Chhota Bhai (Mini Siren)",
    "category": "Sparklers",
    "price": 161.2,
    "piece_count": "1 Pkt",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Chota-Bhai-Mini-Siren-5-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.580Z"
  },
  {
    "id": "ayyan-051",
    "code": "051",
    "name": "Super Sonic (Siren)",
    "category": "Sparklers",
    "price": 260.4,
    "piece_count": "1 Pkt",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/05/Untitled-1_0003_Untitled-1-12_0004_Layer-10.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.582Z"
  },
  {
    "id": "ayyan-052",
    "code": "052",
    "name": "Lemon Tree (4 Colours)",
    "category": "Colourful Fountains",
    "price": 380,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/08/IMG-20240822-WA0004.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.582Z"
  },
  {
    "id": "ayyan-053",
    "code": "053",
    "name": "Tora-Tora",
    "category": "Colourful Fountains",
    "price": 511.5,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/05/Untitled-1_0000_Layer-1.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.582Z"
  },
  {
    "id": "ayyan-054",
    "code": "054",
    "name": "Mega Peacock Gold",
    "category": "Colourful Fountains",
    "price": 666.5,
    "piece_count": "1 Pce",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Mega-Peacock.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.582Z"
  },
  {
    "id": "ayyan-055",
    "code": "055",
    "name": "Mega Peacock Silver",
    "category": "Colourful Fountains",
    "price": 666.5,
    "piece_count": "1 Piece",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Screenshot_2026-05-20-14-23-43-75_680d03679600f7af0b4c700c6b270fe7.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.582Z"
  },
  {
    "id": "ayyan-056",
    "code": "056",
    "name": "Twinkling 45 cm",
    "category": "Colourful Fountains",
    "price": 56.6,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Twinkling-Star-120-cms.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.585Z"
  },
  {
    "id": "ayyan-057",
    "code": "057",
    "name": "Twinkling Star 120 cm",
    "category": "Colourful Fountains",
    "price": 189.1,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Twinkling-Star-120-cms.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.588Z"
  },
  {
    "id": "ayyan-058",
    "code": "058",
    "name": "Electric Diamond",
    "category": "Colourful Fountains",
    "price": 72,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Electric-Diamond.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.588Z"
  },
  {
    "id": "ayyan-059",
    "code": "059",
    "name": "Pencil",
    "category": "Colourful Fountains",
    "price": 141.05,
    "piece_count": "20 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Pencil.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.589Z"
  },
  {
    "id": "ayyan-060",
    "code": "060",
    "name": "Pencil Dlx",
    "category": "Colourful Fountains",
    "price": 137.95,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Pencil.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.590Z"
  },
  {
    "id": "ayyan-061",
    "code": "061",
    "name": "Mint Candle",
    "category": "Colourful Fountains",
    "price": 168.1,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/mint-candle-copy.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.590Z"
  },
  {
    "id": "ayyan-062",
    "code": "062",
    "name": "Rainbow Candle",
    "category": "Colourful Fountains",
    "price": 217,
    "piece_count": "1 Box / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Rainbow-Candle.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.591Z"
  },
  {
    "id": "ayyan-063",
    "code": "063",
    "name": "Hydro Bomb",
    "category": "Maroons",
    "price": 103.85,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Hydrogen-bomb-Foils.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.593Z"
  },
  {
    "id": "ayyan-064",
    "code": "064",
    "name": "Shogun Bomb",
    "category": "Maroons",
    "price": 181.35,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Shogun-Bomb.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.593Z"
  },
  {
    "id": "ayyan-065",
    "code": "065",
    "name": "Double Sound Small",
    "category": "Maroons",
    "price": 49,
    "piece_count": "1 Pkt / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Double-Sound-Crackers-10-Pkt.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.594Z"
  },
  {
    "id": "ayyan-066",
    "code": "066",
    "name": "Double Sound Big",
    "category": "Maroons",
    "price": 66,
    "piece_count": "1 Pkt / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/1696590285-DOUBLE-SOUND-BIG-AYYAN.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.596Z"
  },
  {
    "id": "ayyan-067",
    "code": "067",
    "name": "Three Sound with Colour",
    "category": "Maroons",
    "price": 85.25,
    "piece_count": "1 Pkt / 5 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Three-Sound-with-Colour-10-Pkt.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.596Z"
  },
  {
    "id": "ayyan-068",
    "code": "068",
    "name": "Flower Bomb Deluxe",
    "category": "Maroons",
    "price": 272.8,
    "piece_count": "1 Box / 1 Pce",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Deluxe-5-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.598Z"
  },
  {
    "id": "ayyan-069",
    "code": "069",
    "name": "Tito Special",
    "category": "Sparklers",
    "price": 114.7,
    "piece_count": "1 Box / 3 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Special-600x600-1.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.600Z"
  },
  {
    "id": "ayyan-070",
    "code": "070",
    "name": "Ulta Pulta",
    "category": "Sparklers",
    "price": 158.1,
    "piece_count": "1 Box / 1 Pce",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Ulta-Pulta-Flower-Bomb-5-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.600Z"
  },
  {
    "id": "ayyan-071",
    "code": "071",
    "name": "Photo Flash",
    "category": "Maroons",
    "price": 62,
    "piece_count": "1 Pkt / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2026/02/IMG-20260204-WA0038.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.602Z"
  },
  {
    "id": "ayyan-072",
    "code": "072",
    "name": "Laser Red / Green",
    "category": "Maroons",
    "price": 79.05,
    "piece_count": "1 Pkt / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Crimson-Red.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.603Z"
  },
  {
    "id": "ayyan-073",
    "code": "073",
    "name": "Colour Rocket",
    "category": "Sky Rockets",
    "price": 120.9,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Multi-colour-Rocket-or-Flower-Missle.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.605Z"
  },
  {
    "id": "ayyan-074",
    "code": "074",
    "name": "Rocket Bomb",
    "category": "Sky Rockets",
    "price": 150.35,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Rocket-Bomb.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.605Z"
  },
  {
    "id": "ayyan-075",
    "code": "075",
    "name": "Flower Missile",
    "category": "Sky Rockets",
    "price": 138.7,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Multi-colour-Rocket-or-Flower-Missle.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.607Z"
  },
  {
    "id": "ayyan-076",
    "code": "076",
    "name": "Sound Missile",
    "category": "Sky Rockets",
    "price": 170.5,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/40116629_1-ayyan-fireworks-crackers-classic-rocket-sound.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.608Z"
  },
  {
    "id": "ayyan-077",
    "code": "077",
    "name": "Whistle Sound Rocket",
    "category": "Sky Rockets",
    "price": 209.25,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/40116629_1-ayyan-fireworks-crackers-classic-rocket-sound.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.610Z"
  },
  {
    "id": "ayyan-078",
    "code": "078",
    "name": "Dlx Rocket Colour",
    "category": "Sky Rockets",
    "price": 189.1,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Multi-colour-Rocket-or-Flower-Missle.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.611Z"
  },
  {
    "id": "ayyan-079",
    "code": "079",
    "name": "Classic Rocket Sound",
    "category": "Sky Rockets",
    "price": 223.2,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/40116629_1-ayyan-fireworks-crackers-classic-rocket-sound.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.614Z"
  },
  {
    "id": "ayyan-080",
    "code": "080",
    "name": "Parachute Rocket",
    "category": "Sky Rockets",
    "price": 293.2,
    "piece_count": "1 Box / 4 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Parachute-Rocket.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.614Z"
  },
  {
    "id": "ayyan-081",
    "code": "081",
    "name": "Air Whistle",
    "category": "Sky Rockets",
    "price": 251.1,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Screenshot_2025-04-04-18-58-59-46_e5d3893ac03954c6bb675ef2555b879b.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.614Z"
  },
  {
    "id": "ayyan-082",
    "code": "082",
    "name": "Super Whistle",
    "category": "Sky Rockets",
    "price": 399.5,
    "piece_count": "1 Box / 10 Pcs",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/05/Untitled-1_0003_Untitled-1-12_0004_Layer-10.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.616Z"
  },
  {
    "id": "ayyan-083",
    "code": "083",
    "name": "Pop-Pop",
    "category": "Novelties",
    "price": 49.6,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Pop-Pop.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.616Z"
  },
  {
    "id": "ayyan-084",
    "code": "084",
    "name": "Seven Shot Red",
    "category": "Aerial Multi-Shots",
    "price": 192.2,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/03/7-shots-red.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.616Z"
  },
  {
    "id": "ayyan-085",
    "code": "085",
    "name": "Seven Shot Gold",
    "category": "Aerial Multi-Shots",
    "price": 192.2,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Seven-Shot-Gold-5-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.616Z"
  },
  {
    "id": "ayyan-086",
    "code": "086",
    "name": "Mojo",
    "category": "Novelties",
    "price": 260.4,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2026/02/IMG-20260204-WA0027.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.618Z"
  },
  {
    "id": "ayyan-087",
    "code": "087",
    "name": "Dancing Butterfly",
    "category": "Novelties",
    "price": 136.4,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2025/06/IMG-20250401-WA0015-rotated.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.618Z"
  },
  {
    "id": "ayyan-088",
    "code": "088",
    "name": "Super Drone",
    "category": "Novelties",
    "price": 181.35,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Super-Drone.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.618Z"
  },
  {
    "id": "ayyan-089",
    "code": "089",
    "name": "Funny & Bonny",
    "category": "Sparklers",
    "price": 217,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Funny-Bunny-10-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.620Z"
  },
  {
    "id": "ayyan-090",
    "code": "090",
    "name": "Magic Mystery",
    "category": "Aerial Multi-Shots",
    "price": 217,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Magic-Mystery-10-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.620Z"
  },
  {
    "id": "ayyan-091",
    "code": "091",
    "name": "Chori Chori",
    "category": "Sparklers",
    "price": 217,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Chori-Chori-10-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.620Z"
  },
  {
    "id": "ayyan-092",
    "code": "092",
    "name": "Min Mini",
    "category": "Sparklers",
    "price": 217,
    "piece_count": "10 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/min-mini-copy.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.622Z"
  },
  {
    "id": "ayyan-093",
    "code": "093",
    "name": "Ninja Chakkar",
    "category": "Ground Chakkars",
    "price": 108.5,
    "piece_count": "2 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Ninja-Chakkar.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.622Z"
  },
  {
    "id": "ayyan-094",
    "code": "094",
    "name": "Pogo Mixed",
    "category": "Novelties",
    "price": 69.7,
    "piece_count": "2 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Pogo-Silvergoldredviolet-2Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.624Z"
  },
  {
    "id": "ayyan-095",
    "code": "095",
    "name": "Helicopter",
    "category": "Novelties",
    "price": 83.7,
    "piece_count": "5 Pcs / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Helicopter-5-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.624Z"
  },
  {
    "id": "ayyan-096",
    "code": "096",
    "name": "1¼\" Cells",
    "category": "Aerial Multi-Shots",
    "price": 562.65,
    "piece_count": "1 Pkt (5 Pcs) / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.626Z"
  },
  {
    "id": "ayyan-097",
    "code": "097",
    "name": "1¾\" Cells",
    "category": "Aerial Multi-Shots",
    "price": 441.75,
    "piece_count": "1 Pkt (3 Pcs) / 1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.628Z"
  },
  {
    "id": "ayyan-098",
    "code": "098",
    "name": "2\" Cells",
    "category": "Aerial Multi-Shots",
    "price": 186,
    "piece_count": "1 Piece",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.630Z"
  },
  {
    "id": "ayyan-099",
    "code": "099",
    "name": "3\" Cells - Rocky / AK",
    "category": "Aerial Multi-Shots",
    "price": 455.7,
    "piece_count": "1 Piece",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Paw-PatrolZoomaRocky-5Pcs-1.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.632Z"
  },
  {
    "id": "ayyan-100",
    "code": "100",
    "name": "3\" Cells Premium",
    "category": "Aerial Multi-Shots",
    "price": 511.5,
    "piece_count": "1 Piece",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.634Z"
  },
  {
    "id": "ayyan-101",
    "code": "101",
    "name": "Dekhe Man (12 Star)",
    "category": "Aerial Multi-Shots",
    "price": 214,
    "piece_count": "1 Piece",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Dekhe-Man-12-stars.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.634Z"
  },
  {
    "id": "ayyan-102",
    "code": "102",
    "name": "Daisy Beds (12 Star)",
    "category": "Aerial Multi-Shots",
    "price": 232.5,
    "piece_count": "1 Piece",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Daisy-Bees-12-shot-yellow.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.636Z"
  },
  {
    "id": "ayyan-103",
    "code": "103",
    "name": "Pink Panther (12 Star)",
    "category": "Aerial Multi-Shots",
    "price": 232.5,
    "piece_count": "1 Piece",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Pink-Panther-12-shot-pink.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.636Z"
  },
  {
    "id": "ayyan-104",
    "code": "104",
    "name": "Zeta, Beta, Sigma, Omega (12 Star)",
    "category": "Aerial Multi-Shots",
    "price": 291.4,
    "piece_count": "1 Piece",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Zetabetasigmaalphaomega-12-star-crackling-with-colors.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.638Z"
  },
  {
    "id": "ayyan-105",
    "code": "105",
    "name": "Sky Storms (25 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 220,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Sky-Storm-12-shot-crackling.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.640Z"
  },
  {
    "id": "ayyan-106",
    "code": "106",
    "name": "Chal Mere Sath",
    "category": "Sparklers",
    "price": 418.5,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Chal-Mere-Sath-25-shot.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.640Z"
  },
  {
    "id": "ayyan-107",
    "code": "107",
    "name": "Thor",
    "category": "Aerial Multi-Shots",
    "price": 581.25,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Thor-Multi-Colour-Cracklings.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.640Z"
  },
  {
    "id": "ayyan-108",
    "code": "108",
    "name": "Dil Mange More (50 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 744,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Dil-Maange-More-50-shot.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.641Z"
  },
  {
    "id": "ayyan-109",
    "code": "109",
    "name": "Balle - Balle",
    "category": "Sparklers",
    "price": 533.2,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Balle-balle-soneri-barsath-25-shots-cracklin.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.643Z"
  },
  {
    "id": "ayyan-110",
    "code": "110",
    "name": "Sunhari Barsat",
    "category": "Sparklers",
    "price": 448,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Balle-balle-soneri-barsath-25-shots-cracklin.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.645Z"
  },
  {
    "id": "ayyan-111",
    "code": "111",
    "name": "Singing Bird (25 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 837,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Singing-birs-12-shot-whistle.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.646Z"
  },
  {
    "id": "ayyan-112",
    "code": "112",
    "name": "Singing Bird (12 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 403,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Singing-birs-12-shot-whistle.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.648Z"
  },
  {
    "id": "ayyan-113",
    "code": "113",
    "name": "Indian Delight (30 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 883.5,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/05/Untitled-1_0011_Untitled-1-12_0009_Layer-4.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.648Z"
  },
  {
    "id": "ayyan-114",
    "code": "114",
    "name": "Indian Delight (15 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 475.85,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/05/Untitled-1_0011_Untitled-1-12_0009_Layer-4.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.648Z"
  },
  {
    "id": "ayyan-115",
    "code": "115",
    "name": "Wonder Night (60 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 1542,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Wonder-night-60-shot-four-colour.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.649Z"
  },
  {
    "id": "ayyan-116",
    "code": "116",
    "name": "Mystic Magic",
    "category": "Aerial Multi-Shots",
    "price": 1635,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/673beb43707bb-38d7b522-4a7f-f4a1-f8d4-22f350c3c272.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.649Z"
  },
  {
    "id": "ayyan-117",
    "code": "117",
    "name": "Rang-O-Rang",
    "category": "Sparklers",
    "price": 2402,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Low / Silent",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Orange-Bloom.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.650Z"
  },
  {
    "id": "ayyan-118",
    "code": "118",
    "name": "Sky Boomers (120 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 2852,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Sky-Storm-12-shot-crackling.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.652Z"
  },
  {
    "id": "ayyan-119",
    "code": "119",
    "name": "Classic Night",
    "category": "Aerial Multi-Shots",
    "price": 2790,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Classic-Night-240-shot-four-colour.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.652Z"
  },
  {
    "id": "ayyan-120",
    "code": "120",
    "name": "Arabian Night (240 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 3069,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Untitled-1_0005_Layer-6.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.654Z"
  },
  {
    "id": "ayyan-121",
    "code": "121",
    "name": "Classic Nighty",
    "category": "Aerial Multi-Shots",
    "price": 5859,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Classic-Night-240-shot-four-colour.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.655Z"
  },
  {
    "id": "ayyan-122",
    "code": "122",
    "name": "Arabian Nights",
    "category": "Aerial Multi-Shots",
    "price": 6587.5,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/wonder-nights.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.657Z"
  },
  {
    "id": "ayyan-123",
    "code": "123",
    "name": "Suba Mangalam (500 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 13872.5,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.659Z"
  },
  {
    "id": "ayyan-124",
    "code": "124",
    "name": "Sarva Mangalam (1000 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 27977.5,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.661Z"
  },
  {
    "id": "ayyan-125",
    "code": "125",
    "name": "Festiva (50 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 3022.5,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.663Z"
  },
  {
    "id": "ayyan-126",
    "code": "126",
    "name": "Festiva (100 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 6045,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.664Z"
  },
  {
    "id": "ayyan-127",
    "code": "127",
    "name": "Floral Fantasy (100 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 6626.25,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Screenshot_2025-04-04-19-03-45-75_e5d3893ac03954c6bb675ef2555b879b.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.666Z"
  },
  {
    "id": "ayyan-128",
    "code": "128",
    "name": "Floral Fantasy (180 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 11315,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Screenshot_2025-04-04-19-03-45-75_e5d3893ac03954c6bb675ef2555b879b.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.668Z"
  },
  {
    "id": "ayyan-129",
    "code": "129",
    "name": "Top Star (24 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 7267.5,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/camel-star.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.669Z"
  },
  {
    "id": "ayyan-130",
    "code": "130",
    "name": "Fun Club (24 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 6192.35,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Funny-Bunny-10-Pcs.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.671Z"
  },
  {
    "id": "ayyan-131",
    "code": "131",
    "name": "Fashion Parade (24 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 6192,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/AS-CI-1730.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.672Z"
  },
  {
    "id": "ayyan-132",
    "code": "132",
    "name": "Angel (16 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 10493,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2026/02/IMG-20260204-WA0043.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.674Z"
  },
  {
    "id": "ayyan-133",
    "code": "133",
    "name": "Paris-Paris (10 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 5347.5,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Paris-Paris-3-inch-10-shots.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.674Z"
  },
  {
    "id": "ayyan-134",
    "code": "134",
    "name": "Casanova (20 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 10472.5,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.676Z"
  },
  {
    "id": "ayyan-135",
    "code": "135",
    "name": "Night Rider (100 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 3875,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Untitled-1_0005_Layer-6.jpg",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.678Z"
  },
  {
    "id": "ayyan-136",
    "code": "136",
    "name": "Big Show (100 Shots)",
    "category": "Aerial Multi-Shots",
    "price": 6161.25,
    "piece_count": "1 Box",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "High Spectacle",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Silk-Show.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.679Z"
  },
  {
    "id": "ayyan-137",
    "code": "137",
    "name": "Assorted Gift Box - A",
    "category": "Gift Boxes",
    "price": 790.5,
    "piece_count": "24 Items",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Gift-Box-Dino-40-items.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.681Z"
  },
  {
    "id": "ayyan-138",
    "code": "138",
    "name": "Assorted Gift Box - B",
    "category": "Gift Boxes",
    "price": 1085,
    "piece_count": "28 Items",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Gift-Box-Dino-40-items.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.683Z"
  },
  {
    "id": "ayyan-139",
    "code": "139",
    "name": "Assorted Gift Box - C",
    "category": "Gift Boxes",
    "price": 1581,
    "piece_count": "30 Items",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Gift-Box-Dino-40-items.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.684Z"
  },
  {
    "id": "ayyan-140",
    "code": "140",
    "name": "Assorted Gift Box - D",
    "category": "Gift Boxes",
    "price": 1813.5,
    "piece_count": "36 Items",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Gift-Box-Dino-40-items.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.686Z"
  },
  {
    "id": "ayyan-141",
    "code": "141",
    "name": "Dino Gift Box",
    "category": "Gift Boxes",
    "price": 1821,
    "piece_count": "40 Items",
    "description": "Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.",
    "safety_instructions": "Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.",
    "safety_tags": [
      "Bunny Brand",
      "Green Cracker",
      "Sivakasi Authentic"
    ],
    "sound_level": "Medium",
    "image_url": "https://ayyansworld.com/wp-content/uploads/2024/02/Gift-Box-Dino-40-items.png",
    "is_active": true,
    "created_at": "2026-10-13T15:52:38.687Z"
  }
];

// Helper date offset function
export const getFormattedDateOffset = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

// Seed Slot generation for showroom visitations (Visakhapatnam showroom)
export const generateInitialSlots = (): Slot[] => {
  const slots: Slot[] = [];
  const today = new Date();

  for (let d = 0; d < 14; d++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + d);
    const dateStr = slotDate.toISOString().split('T')[0];

    const hours = [
      { start: '05:00:00', end: '06:00:00', cap: 120 },
      { start: '06:00:00', end: '07:00:00', cap: 120 },
      { start: '07:00:00', end: '08:00:00', cap: 120 },
      { start: '08:00:00', end: '09:00:00', cap: 120 },
      { start: '09:00:00', end: '10:00:00', cap: 120 },
      { start: '10:00:00', end: '11:00:00', cap: 120 },
      { start: '11:00:00', end: '12:00:00', cap: 120 },
      { start: '12:00:00', end: '13:00:00', cap: 120 },
      { start: '14:00:00', end: '15:00:00', cap: 120 },
      { start: '15:00:00', end: '16:00:00', cap: 120 },
      { start: '16:00:00', end: '17:00:00', cap: 120 },
      { start: '17:00:00', end: '18:00:00', cap: 120 },
      { start: '18:00:00', end: '19:00:00', cap: 120 },
      { start: '19:00:00', end: '20:00:00', cap: 120 },
      { start: '20:00:00', end: '21:00:00', cap: 120 },
      { start: '21:00:00', end: '22:00:00', cap: 120 }
    ];

    hours.forEach((h, index) => {
      slots.push({
        id: `slot-${dateStr}-${index}`,
        slot_date: dateStr,
        start_time: h.start,
        end_time: h.end,
        total_capacity: h.cap,
        booked_capacity: 0,
        is_blocked: false,
        created_at: new Date().toISOString()
      });
    });
  }

  return slots;
};

export const generateInitialBookings = (_slots?: Slot[]): Booking[] => {
  return [];
};
