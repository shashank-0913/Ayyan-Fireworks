import fs from 'fs';

// 153 items from user prompt
const userItems = [
  { id: 'item_001', item_code: '001', name: 'Ganesh Crackers', category: 'Sparklers', price: 62.00, pieces_per_box: '1 pkt' },
  { id: 'item_002', item_code: '002', name: 'Lakshmi Crackers', category: 'Sparklers', price: 35.00, pieces_per_box: '1 pkt' },
  { id: 'item_003', item_code: '003', name: 'Ravi Crackers', category: 'Sparklers', price: 15.80, pieces_per_box: '1 pkt' },
  { id: 'item_004', item_code: '004', name: '7 cm Electric Sparkler', category: 'Sparklers', price: 19.60, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_005', item_code: '005', name: '7 cm Colour Sparkler', category: 'Sparklers', price: 22.95, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_006', item_code: '006', name: '10 cm Ruby Sparkler', category: 'Sparklers', price: 35.65, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_007', item_code: '007', name: '10 cm Electric Sparkler', category: 'Sparklers', price: 28.65, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_008', item_code: '008', name: '10 cm Colour Sparkler', category: 'Sparklers', price: 38.75, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_009', item_code: '009', name: '15 cm Electric Sparkler', category: 'Sparklers', price: 55.80, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_010', item_code: '010', name: '15 cm Colour Sparkler', category: 'Sparklers', price: 72.85, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_011', item_code: '011', name: '15 cm Ruby Sparkler', category: 'Sparklers', price: 60.50, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_012', item_code: '012', name: 'Panchavarna Sparkler', category: 'Sparklers', price: 66.65, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_013', item_code: '013', name: '30 cm Electric Sparkler', category: 'Sparklers', price: 55.80, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_014', item_code: '014', name: '30 cm Colour Sparkler', category: 'Sparklers', price: 72.85, pieces_per_box: '1 box/10 pcs' },
  { id: 'item_015', item_code: '015', name: '50 cm Electric Sparkler', category: 'Sparklers', price: 168.50, pieces_per_box: '1 box/5 pcs' },
  { id: 'item_016', item_code: '016', name: '50 cm Colour Sparkler', category: 'Sparklers', price: 208.30, pieces_per_box: '1 box/5 pcs' },
  { id: 'item_017', item_code: '017', name: '75 cm Electric Sparkler', category: 'Sparklers', price: 280.70, pieces_per_box: '1 box/5 pcs' },
  { id: 'item_018', item_code: '018', name: '75 cm Colour Sparkler', category: 'Sparklers', price: 338.50, pieces_per_box: '1 box/5 pcs' },
  { id: 'item_019', item_code: '019', name: 'Ground Chakkar Big', category: 'Ground Chakkars', price: 164.30, pieces_per_box: '25 pcs/box' },
  { id: 'item_020', item_code: '020', name: 'Ground Chakkar Small', category: 'Ground Chakkars', price: 148.80, pieces_per_box: '10 pcs/box' },
  { id: 'item_021', item_code: '021', name: 'Ground Chakkar Mix', category: 'Ground Chakkars', price: 262.50, pieces_per_box: '10 pcs/box' },
  { id: 'item_022', item_code: '022', name: 'Krishna Chakkar Big', category: 'Ground Chakkars', price: 209.25, pieces_per_box: '25 pcs/box' },
  { id: 'item_023', item_code: '023', name: 'Krishna Chakkar Small', category: 'Ground Chakkars', price: 158.10, pieces_per_box: '10 pcs/box' },
  { id: 'item_024', item_code: '024', name: 'Giant Wheel', category: 'Ground Chakkars', price: 189.10, pieces_per_box: '5 pcs/box' },
  { id: 'item_025', item_code: '025', name: 'Joker Wheel', category: 'Ground Chakkars', price: 189.10, pieces_per_box: '5 pcs/box' },
  { id: 'item_026', item_code: '026', name: 'Star Wheel', category: 'Ground Chakkars', price: 167.40, pieces_per_box: '10 pcs/box' },
  { id: 'item_027', item_code: '027', name: 'Classic Wheel', category: 'Ground Chakkars', price: 271.25, pieces_per_box: '10 pcs/box' },
  { id: 'item_028', item_code: '028', name: 'Whistling Chakkar', category: 'Ground Chakkars', price: 192.20, pieces_per_box: '5 pcs/box' },
  { id: 'item_029', item_code: '029', name: 'Glittering Wheel', category: 'Ground Chakkars', price: 189.10, pieces_per_box: '5 pcs/box' },
  { id: 'item_030', item_code: '030', name: 'Tinto Wheel', category: 'Ground Chakkars', price: 176.40, pieces_per_box: '5 pcs/box' },
  { id: 'item_031', item_code: '031', name: 'Pilo Wheel', category: 'Ground Chakkars', price: 176.40, pieces_per_box: '5 pcs/box' },
  { id: 'item_032', item_code: '032', name: 'Lotus Fountain', category: 'Colourful Fountains', price: 127.10, pieces_per_box: '1 Box' },
  { id: 'item_033', item_code: '033', name: 'Cocktail Special', category: 'Colourful Fountains', price: 153.00, pieces_per_box: '10 pcs/box' },
  { id: 'item_034', item_code: '034', name: 'Flower Pots Big', category: 'Colourful Fountains', price: 133.30, pieces_per_box: '10 pcs/box' },
  { id: 'item_035', item_code: '035', name: 'Flower Pots Special', category: 'Colourful Fountains', price: 213.90, pieces_per_box: '10 pcs/box' },
  { id: 'item_036', item_code: '036', name: 'Flower Pots Giant', category: 'Colourful Fountains', price: 465.00, pieces_per_box: '1 Box' },
  { id: 'item_037', item_code: '037', name: 'Flower Pots Deluxe', category: 'Colourful Fountains', price: 226.10, pieces_per_box: '10 pcs/box' },
  { id: 'item_038', item_code: '038', name: 'Ten Colour Fountain', category: 'Colourful Fountains', price: 392.15, pieces_per_box: '5 pcs/box' },
  { id: 'item_039', item_code: '039', name: 'Van Gogh Fountain', category: 'Colourful Fountains', price: 244.90, pieces_per_box: '5 pcs/box' },
  { id: 'item_040', item_code: '040', name: 'Colour Koti 4 Ft', category: 'Colourful Fountains', price: 713.00, pieces_per_box: '1 pc/box' },
  { id: 'item_041', item_code: '041', name: 'Rainbow Fountain Special', category: 'Colourful Fountains', price: 275.90, pieces_per_box: '1 Box' },
  { id: 'item_042', item_code: '042', name: 'Mano Rakasu', category: 'Colourful Fountains', price: 275.90, pieces_per_box: '1 pc/box' },
  { id: 'item_043', item_code: '043', name: 'Roof Kites', category: 'Colourful Fountains', price: 463.45, pieces_per_box: '10 pcs/box' },
  { id: 'item_044', item_code: '044', name: 'Vaarasi Fountain', category: 'Colourful Fountains', price: 443.30, pieces_per_box: '10 pcs/box' },
  { id: 'item_045', item_code: '045', name: 'Kiddys Joy', category: 'Colourful Fountains', price: 178.25, pieces_per_box: '1 Box' },
  { id: 'item_046', item_code: '046', name: 'Super Star (Crackling)', category: 'Colourful Fountains', price: 145.00, pieces_per_box: '1 pc/box' },
  { id: 'item_047', item_code: '047', name: 'Dil Se Fountain', category: 'Colourful Fountains', price: 180.00, pieces_per_box: '1 Box' },
  { id: 'item_048', item_code: '048', name: 'Little Angel', category: 'Colourful Fountains', price: 195.00, pieces_per_box: '1 Box' },
  { id: 'item_049', item_code: '049', name: 'Crackling Star', category: 'Colourful Fountains', price: 367.35, pieces_per_box: '5 pcs/box' },
  { id: 'item_050', item_code: '050', name: 'Chhota Bheem (Mini Siren)', category: 'Colourful Fountains', price: 161.20, pieces_per_box: '1 Box' },
  { id: 'item_051', item_code: '051', name: 'Super Sonic (Siren)', category: 'Colourful Fountains', price: 260.40, pieces_per_box: '1 Box' },
  { id: 'item_052', item_code: '052', name: 'Lemon Tree (4 Colours)', category: 'Colourful Fountains', price: 380.00, pieces_per_box: '1 Box' },
  { id: 'item_053', item_code: '053', name: 'Jolastoda Sparkler Box', category: 'Colourful Fountains', price: 511.50, pieces_per_box: '1 Box' },
  { id: 'item_054', item_code: '054', name: 'Mega Peacock Colour', category: 'Colourful Fountains', price: 666.50, pieces_per_box: '1 pc' },
  { id: 'item_055', item_code: '055', name: 'Mega Peacock Silver', category: 'Colourful Fountains', price: 666.50, pieces_per_box: '1 pc' },
  { id: 'item_056', item_code: '056', name: 'Twinkling Star Cone', category: 'Colourful Fountains', price: 56.60, pieces_per_box: '10 pcs/box' },
  { id: 'item_057', item_code: '057', name: 'Twinkling Star Dlx', category: 'Sky Rockets', price: 189.10, pieces_per_box: '1 Box' },
  { id: 'item_058', item_code: '058', name: 'Electric Diamond', category: 'Sky Rockets', price: 72.00, pieces_per_box: '10 pcs/box' },
  { id: 'item_059', item_code: '059', name: 'Pencil Mix Special', category: 'Sky Rockets', price: 141.05, pieces_per_box: '1 Box' },
  { id: 'item_060', item_code: '060', name: 'Pencil Mix Classic', category: 'Sky Rockets', price: 137.95, pieces_per_box: '1 Box' },
  { id: 'item_061', item_code: '061', name: 'Joint Candle', category: 'Sky Rockets', price: 168.10, pieces_per_box: '10 pcs/box' },
  { id: 'item_062', item_code: '062', name: 'Raja Rainbow Candle', category: 'Sky Rockets', price: 217.00, pieces_per_box: '5 pcs/box' },
  { id: 'item_063', item_code: '063', name: 'Hydro Bomb', category: 'Sky Rockets', price: 103.85, pieces_per_box: '10 pcs/box' },
  { id: 'item_064', item_code: '064', name: 'Shotgun Bomb', category: 'Sky Rockets', price: 181.35, pieces_per_box: '10 pcs/box' },
  { id: 'item_065', item_code: '065', name: 'Double Sound Small', category: 'Sky Rockets', price: 49.00, pieces_per_box: '5 pcs/pkt' },
  { id: 'item_066', item_code: '066', name: 'Double Sound Big', category: 'Sky Rockets', price: 66.00, pieces_per_box: '5 pcs/pkt' },
  { id: 'item_067', item_code: '067', name: 'Three Sound with Colour', category: 'Sky Rockets', price: 85.25, pieces_per_box: '5 pcs/pkt' },
  { id: 'item_068', item_code: '068', name: 'Flower Bomb New', category: 'Sky Rockets', price: 272.80, pieces_per_box: '1 pc/box' },
  { id: 'item_069', item_code: '069', name: 'Tito Special', category: 'Sky Rockets', price: 114.70, pieces_per_box: '2 pcs/box' },
  { id: 'item_070', item_code: '070', name: 'Ulta-Pulta Special', category: 'Sky Rockets', price: 158.10, pieces_per_box: '1 Box' },
  { id: 'item_071', item_code: '071', name: 'Photo Flash', category: 'Sky Rockets', price: 62.00, pieces_per_box: '5 pcs/box' },
  { id: 'item_072', item_code: '072', name: 'Loose Red Crackers', category: 'Sky Rockets', price: 79.05, pieces_per_box: '100 pcs/pkt' },
  { id: 'item_073', item_code: '073', name: 'Colour Rocket', category: 'Sky Rockets', price: 120.90, pieces_per_box: '10 pcs/box' },
  { id: 'item_074', item_code: '074', name: 'Rocket Bomb', category: 'Sky Rockets', price: 150.35, pieces_per_box: '10 pcs/box' },
  { id: 'item_075', item_code: '075', name: 'Flower Missile', category: 'Sky Rockets', price: 138.70, pieces_per_box: '10 pcs/box' },
  { id: 'item_076', item_code: '076', name: 'Sound Missile', category: 'Sky Rockets', price: 170.50, pieces_per_box: '10 pcs/box' },
  { id: 'item_077', item_code: '077', name: 'Hydro Sound Rocket', category: 'Sky Rockets', price: 209.25, pieces_per_box: '1 Box' },
  { id: 'item_078', item_code: '078', name: 'Mix Rocket Colour', category: 'Sky Rockets', price: 189.10, pieces_per_box: '10 pcs/box' },
  { id: 'item_079', item_code: '079', name: 'Classic Rocket Sound', category: 'Sky Rockets', price: 223.20, pieces_per_box: '10 pcs/box' },
  { id: 'item_080', item_code: '080', name: 'Parachute Rocket', category: 'Sky Rockets', price: 293.20, pieces_per_box: '1 pc/box' },
  { id: 'item_081', item_code: '081', name: 'Air Whistle', category: 'Sky Rockets', price: 251.10, pieces_per_box: '10 pcs/box' },
  { id: 'item_082', item_code: '082', name: 'Super Whistle', category: 'Sky Rockets', price: 399.50, pieces_per_box: '1 pc/box' },
  { id: 'item_083', item_code: '083', name: 'Pop-Pop (10 pkts)', category: 'Sky Rockets', price: 49.60, pieces_per_box: '10 pkts/box' },
  { id: 'item_084', item_code: '084', name: 'Seven Shot Red', category: 'Aerial Multi-Shots', price: 192.20, pieces_per_box: '5 pcs/box' },
  { id: 'item_085', item_code: '085', name: 'Seven Shot Gold', category: 'Aerial Multi-Shots', price: 192.20, pieces_per_box: '5 pcs/box' },
  { id: 'item_086', item_code: '086', name: 'Moto Aerial', category: 'Aerial Multi-Shots', price: 260.40, pieces_per_box: '5 pcs/box' },
  { id: 'item_087', item_code: '087', name: 'Dancing Butterfly', category: 'Aerial Multi-Shots', price: 136.40, pieces_per_box: '10 pcs/box' },
  { id: 'item_088', item_code: '088', name: 'Super Drone', category: 'Aerial Multi-Shots', price: 181.35, pieces_per_box: '5 pcs/box' },
  { id: 'item_089', item_code: '089', name: 'Funny Bunny Novelty', category: 'Aerial Multi-Shots', price: 217.00, pieces_per_box: '10 pcs/box' },
  { id: 'item_090', item_code: '090', name: 'Magic Star', category: 'Aerial Multi-Shots', price: 217.00, pieces_per_box: '10 pcs/box' },
  { id: 'item_091', item_code: '091', name: 'Choti Novelty', category: 'Aerial Multi-Shots', price: 217.00, pieces_per_box: '10 pcs/box' },
  { id: 'item_092', item_code: '092', name: 'Mini Mini Aerial', category: 'Aerial Multi-Shots', price: 217.00, pieces_per_box: '1 Box' },
  { id: 'item_093', item_code: '093', name: 'Ninja Chakkar', category: 'Aerial Multi-Shots', price: 108.50, pieces_per_box: '2 pcs/box' },
  { id: 'item_094', item_code: '094', name: 'Pogo Mixed', category: 'Aerial Multi-Shots', price: 69.70, pieces_per_box: '2 pcs/box' },
  { id: 'item_095', item_code: '095', name: 'Helicopter Novelty', category: 'Aerial Multi-Shots', price: 83.70, pieces_per_box: '5 pcs/box' },
  { id: 'item_096', item_code: '096', name: '1.75 Inch Cells (5 Pcs)', category: 'Aerial Multi-Shots', price: 562.65, pieces_per_box: '5 pcs/box' },
  { id: 'item_097', item_code: '097', name: '1.75 Inch Cells (3 Pcs)', category: 'Aerial Multi-Shots', price: 441.75, pieces_per_box: '3 pcs/box' },
  { id: 'item_098', item_code: '098', name: '2 Inch Cells Single', category: 'Aerial Multi-Shots', price: 186.00, pieces_per_box: '1 pc' },
  { id: 'item_099', item_code: '099', name: '3 Inch Cells Single', category: 'Aerial Multi-Shots', price: 455.70, pieces_per_box: '1 pc' },
  { id: 'item_100', item_code: '100', name: '3 Inch Cells Premium', category: 'Aerial Multi-Shots', price: 511.50, pieces_per_box: '1 pc' },
  { id: 'item_101', item_code: '101', name: 'Dekhe Man (12 Star)', category: 'Aerial Multi-Shots', price: 214.00, pieces_per_box: '1 pc' },
  { id: 'item_102', item_code: '102', name: 'Noisy Bees Flash', category: 'Aerial Multi-Shots', price: 232.50, pieces_per_box: '1 pc' },
  { id: 'item_103', item_code: '103', name: 'Pink Panther (12 Star)', category: 'Aerial Multi-Shots', price: 232.50, pieces_per_box: '1 pc' },
  { id: 'item_104', item_code: '104', name: 'Zeta Beta Sigma Omega', category: 'Aerial Multi-Shots', price: 291.40, pieces_per_box: '1 Box' },
  { id: 'item_105', item_code: '105', name: 'Sky Station', category: 'Aerial Multi-Shots', price: 220.00, pieces_per_box: '2 pcs/box' },
  { id: 'item_106', item_code: '106', name: 'Chal Mere Sath', category: 'Aerial Multi-Shots', price: 418.50, pieces_per_box: '1 Box' },
  { id: 'item_107', item_code: '107', name: 'Thor Multi Shot', category: 'Aerial Multi-Shots', price: 581.25, pieces_per_box: '1 Box' },
  { id: 'item_108', item_code: '108', name: 'Dil Mange More (50 Shots)', category: 'Aerial Multi-Shots', price: 744.00, pieces_per_box: '50 shots' },
  { id: 'item_109', item_code: '109', name: 'Balle Balle', category: 'Aerial Multi-Shots', price: 533.20, pieces_per_box: '1 Box' },
  { id: 'item_110', item_code: '110', name: 'Sunhari Barsat', category: 'Aerial Multi-Shots', price: 448.00, pieces_per_box: '1 Box' },
  { id: 'item_111', item_code: '111', name: 'Singing Bird (25 Shots)', category: 'Aerial Multi-Shots', price: 837.00, pieces_per_box: '25 shots' },
  { id: 'item_112', item_code: '112', name: 'Singing Bird (12 Shots)', category: 'Aerial Multi-Shots', price: 403.00, pieces_per_box: '12 shots' },
  { id: 'item_113', item_code: '113', name: 'Indian Delight (30 Shots)', category: 'Aerial Multi-Shots', price: 883.50, pieces_per_box: '30 shots' },
  { id: 'item_114', item_code: '114', name: 'Indian Delight (15 Shots)', category: 'Aerial Multi-Shots', price: 475.85, pieces_per_box: '15 shots' },
  { id: 'item_115', item_code: '115', name: 'Wooden Night', category: 'Aerial Multi-Shots', price: 1542.00, pieces_per_box: '1 Box' },
  { id: 'item_116', item_code: '116', name: 'Mystic Magic', category: 'Aerial Multi-Shots', price: 1635.00, pieces_per_box: '1 Box' },
  { id: 'item_117', item_code: '117', name: 'Rang-O-Rang', category: 'Aerial Multi-Shots', price: 2402.00, pieces_per_box: '1 Box' },
  { id: 'item_118', item_code: '118', name: 'Sky Boomers (120 Colour)', category: 'Aerial Multi-Shots', price: 2852.00, pieces_per_box: '120 colour' },
  { id: 'item_119', item_code: '119', name: 'Oceanic Night', category: 'Aerial Multi-Shots', price: 2790.00, pieces_per_box: '1 Box' },
  { id: 'item_120', item_code: '120', name: 'Birthday Night (240 Shots)', category: 'Aerial Multi-Shots', price: 3069.00, pieces_per_box: '240 shots' },
  { id: 'item_121', item_code: '121', name: 'Crackling Nights', category: 'Aerial Multi-Shots', price: 5859.00, pieces_per_box: '1 Box' },
  { id: 'item_122', item_code: '122', name: 'Abushi Nights', category: 'Aerial Multi-Shots', price: 6587.50, pieces_per_box: '1 Box' },
  { id: 'item_123', item_code: '123', name: 'Super Mongal (500 Shots)', category: 'Aerial Multi-Shots', price: 13872.50, pieces_per_box: '500 shots' },
  { id: 'item_124', item_code: '124', name: 'Seven Mongal (1000 Shots)', category: 'Aerial Multi-Shots', price: 27977.50, pieces_per_box: '1000 shots' },
  { id: 'item_125', item_code: '125', name: 'Celebration Premium Shot', category: 'Aerial Multi-Shots', price: 3022.50, pieces_per_box: '1 Box' },
  { id: 'item_126', item_code: '126', name: 'Festival (100 Shots)', category: 'Aerial Multi-Shots', price: 6045.00, pieces_per_box: '100 shots' },
  { id: 'item_127', item_code: '127', name: 'Floral Fantasy (100 Shots)', category: 'Aerial Multi-Shots', price: 6626.25, pieces_per_box: '100 shots' },
  { id: 'item_128', item_code: '128', name: 'Floral Fantasy (180 Shots)', category: 'Aerial Multi-Shots', price: 11315.00, pieces_per_box: '180 shots' },
  { id: 'item_129', item_code: '129', name: 'Top Star (24 Shots)', category: 'Aerial Multi-Shots', price: 7267.50, pieces_per_box: '24 shots' },
  { id: 'item_130', item_code: '130', name: 'Fun Club (24 Shots)', category: 'Aerial Multi-Shots', price: 6192.35, pieces_per_box: '24 shots' },
  { id: 'item_131', item_code: '131', name: 'Fashion Parade (24 Shots)', category: 'Aerial Multi-Shots', price: 6192.00, pieces_per_box: '24 shots' },
  { id: 'item_132', item_code: '132', name: 'Angel (16 Shots)', category: 'Aerial Multi-Shots', price: 10493.00, pieces_per_box: '16 shots' },
  { id: 'item_133', item_code: '133', name: 'Paris-Paris (10 Shots)', category: 'Aerial Multi-Shots', price: 5347.50, pieces_per_box: '10 shots' },
  { id: 'item_134', item_code: '134', name: 'Casanova (20 Shots)', category: 'Aerial Multi-Shots', price: 10472.50, pieces_per_box: '20 shots' },
  { id: 'item_135', item_code: '135', name: 'Night Rider (100 Shots)', category: 'Aerial Multi-Shots', price: 3875.00, pieces_per_box: '100 shots' },
  { id: 'item_136', item_code: '136', name: 'Big Show (100 Shots)', category: 'Aerial Multi-Shots', price: 6161.25, pieces_per_box: '100 shots' },
  { id: 'item_137', item_code: '137', name: 'Assorted Gift Box - A (24 Pcs)', category: 'Gift Boxes', price: 790.50, pieces_per_box: '24 pcs' },
  { id: 'item_138', item_code: '138', name: 'Assorted Gift Box - B (28 Pcs)', category: 'Gift Boxes', price: 1085.00, pieces_per_box: '28 pcs' },
  { id: 'item_139', item_code: '139', name: 'Assorted Gift Box - C (30 Pcs)', category: 'Gift Boxes', price: 1581.00, pieces_per_box: '30 pcs' },
  { id: 'item_140', item_code: '140', name: 'Assorted Gift Box - D (36 Pcs)', category: 'Gift Boxes', price: 1813.50, pieces_per_box: '36 pcs' },
  { id: 'item_141', item_code: '141', name: 'Nino Gift Box (40 Pcs)', category: 'Gift Boxes', price: 1821.00, pieces_per_box: '40 pcs' },
  { id: 'item_142', item_code: '142', name: 'Camel Red & Green', category: 'Novelties', price: 25.00, pieces_per_box: '1 Box' },
  { id: 'item_143', item_code: '143', name: 'Camel Match Special', category: 'Novelties', price: 45.00, pieces_per_box: '1 Box' },
  { id: 'item_144', item_code: '144', name: 'Pops (5 Colours)', category: 'Novelties', price: 125.00, pieces_per_box: '1 Box' },
  { id: 'item_145', item_code: '145', name: 'Josh Match Box', category: 'Novelties', price: 95.00, pieces_per_box: '1 Box' },
  { id: 'item_146', item_code: '146', name: 'Ninja Match Box', category: 'Novelties', price: 110.00, pieces_per_box: '1 Box' },
  { id: 'item_147', item_code: '147', name: 'Rainbow (5 Colours)', category: 'Novelties', price: 135.00, pieces_per_box: '1 Box' },
  { id: 'item_148', item_code: '148', name: 'Vadivel (10 Colours)', category: 'Novelties', price: 150.00, pieces_per_box: '1 Box' },
  { id: 'item_149', item_code: '149', name: 'Ayyan Toy Car (5 Colours)', category: 'Novelties', price: 180.00, pieces_per_box: '1 Box' },
  { id: 'item_150', item_code: '150', name: 'Ayyan Trident (3 Colours)', category: 'Novelties', price: 140.00, pieces_per_box: '1 Box' },
  { id: 'item_151', item_code: '151', name: 'Ayyan Roll Cap', category: 'Novelties', price: 90.00, pieces_per_box: '1 Box' },
  { id: 'item_152', item_code: '152', name: 'Ayyan Ring Cap', category: 'Novelties', price: 120.00, pieces_per_box: '1 Box' },
  { id: 'item_153', item_code: '153', name: 'Ayyan Hunter Gun', category: 'Novelties', price: 180.00, pieces_per_box: '1 Box' },
];

console.log('User items count:', userItems.length);

// Generate clean initialData.ts file
let out = `import { Product, Slot, Booking } from '../types';

// =============================================================================
// AYYAN FIREWORKS FACTORY — STANDARDIZED SHOWROOM INVENTORY (153 SKUs)
// Official Sivakasi Bunny Brand Green Crackers Catalogue
// =============================================================================

export interface ProductItem {
  id: string;
  item_code: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  pieces_per_box?: string;
  video_url?: string;
}

export const initialProducts: Product[] = [
`;

for (const it of userItems) {
  out += `  {
    id: "${it.id}",
    item_code: "${it.item_code}",
    code: "${it.item_code}",
    name: "${it.name}",
    category: "${it.category}",
    price: ${it.price.toFixed(2)},
    pieces_per_box: "${it.pieces_per_box}",
    piece_count: "${it.pieces_per_box}",
    is_active: true
  },\n`;
}

out += `];

// Alias for codebase compatibility
export const INITIAL_PRODUCTS: Product[] = initialProducts;

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
        id: \`slot-\${dateStr}-\${index}\`,
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
`;

fs.writeFileSync('src/lib/initialData.ts', out);
console.log('Successfully wrote src/lib/initialData.ts!');
