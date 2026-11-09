import {
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Destination } from './schemas/destination.schema';
import { DestinationDto } from './dto/destination.dto';

const colomboSummary =
  'Sri Lanka’s vibrant coastal capital blends colonial-era landmarks, lively markets, oceanfront promenades and a thriving food scene.';
const colomboDescription =
  'Colombo is a lively coastal city where Sri Lanka’s many influences meet. In the Fort district, historic buildings and grand facades sit alongside the modern skyline, while nearby Pettah is a maze of busy streets, markets and small shops. The city is best explored at an easy pace: browse a market, pause at a temple, then watch the evening light settle over the Indian Ocean from Galle Face Green.\\n\\nAround Beira Lake, Gangaramaya Temple offers a colorful glimpse of the city’s religious and cultural life. Contemporary Colombo is just as memorable for its food, from quick street-side snacks to restaurants serving Sri Lankan favorites. Set aside time for both the well-known landmarks and the neighborhoods in between—the contrast is part of what makes the capital distinctive.';

const ambewelaSummary =
  'Visit a dairy farm in cool upland country surrounded by grassland, tea fields and mountain views.';
const ambewelaDescription =
  'Ambewela Farm sits in the cool, open highlands near Nuwara Eliya, where rolling pasture, tea-covered slopes and distant mountain ridges create a very different landscape from Sri Lanka’s coast. The drive through the surrounding countryside is part of the experience, with wide views and fresh air along the way. At the farm, visitors can learn about dairy production and see the animals and working farm environment up close.\n\nAllow time to enjoy the scenery rather than treating the farm as a quick photo stop. Ambewela is often called “Little New Zealand” for its green pastures and temperate climate, though the landscape and local farming traditions are distinctly Sri Lankan. It makes a pleasant countryside outing when paired with other sights around Nuwara Eliya.';
const ambewelaNotes =
  'Pack a light jacket: the highland weather can feel cool, especially in the morning and late afternoon. Check current visitor access and opening times before setting out, and allow extra travel time for the winding roads. Please follow farm staff instructions and keep a respectful distance from livestock.';
const ambewelaImages = [
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Ambewela_New_Zealand_Dairy_Farm_-_02.jpg/1280px-Ambewela_New_Zealand_Dairy_Farm_-_02.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Ambewela_farm%2C_Sri_Lanka.jpg/1280px-Ambewela_farm%2C_Sri_Lanka.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Ambewela_farm_%28Cattle%29.jpg/1280px-Ambewela_farm_%28Cattle%29.jpg',
];
const ambewelaImageCredits = [
  'Hasitha Wanniarachch',
  'MRuwan',
  'A-wiki-guest-user',
];
const ambewelaImageLicenses = [
  'CC BY-SA 4.0',
  'CC BY-SA 4.0',
  'CC BY-SA 4.0',
];
const ambewelaImageSourceUrls = [
  'https://commons.wikimedia.org/wiki/File:Ambewela_New_Zealand_Dairy_Farm_-_02.jpg',
  'https://commons.wikimedia.org/wiki/File:Ambewela_farm,_Sri_Lanka.jpg',
  'https://commons.wikimedia.org/wiki/File:Ambewela_farm_(Cattle).jpg',
];

const sampleDestinations = [
  {
    name: 'Colombo',
    summary: colomboSummary,
    description: colomboDescription,
    latitude: 6.93548,
    longitude: 79.84868,
  },
  {
    name: 'Kandy',
    description:
      'Set among green hills, Kandy is home to the sacred Temple of the Tooth, a peaceful lake and rich Kandyan arts and culture.',
    latitude: 7.2906,
    longitude: 80.6337,
    imageUrl: '/destinations/temple-of-the-tooth.png',
  },
  {
    name: 'Galle',
    description:
      'Explore the atmospheric lanes of Galle Fort, a UNESCO-listed coastal town framed by ramparts, cafés and the Indian Ocean.',
    latitude: 6.0535,
    longitude: 80.221,
    imageUrl: '/destinations/galle-fort.png',
  },
  {
    name: 'Sigiriya',
    location: 'Matale District, Central Province',
    description:
      'Climb the ancient rock fortress for frescoes, landscaped gardens and wide views across Sri Lanka’s cultural heartland.',
    category: 'Heritage',
    latitude: 7.957,
    longitude: 80.76,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Sigiriya_%28141688197%29.jpeg/960px-Sigiriya_%28141688197%29.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Wrobell',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Sigiriya_(141688197).jpeg',
  },
  {
    name: 'Ella',
    location: 'Badulla District, Uva Province',
    description:
      'A relaxed hill-country town with tea-covered slopes, hiking trails and cool mornings above the southern plains.',
    category: 'Highlands',
    latitude: 6.8667,
    longitude: 81.0466,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Ella%2C_Sri_Lanka%2C_Mountains_in_clouds_12.jpg/960px-Ella%2C_Sri_Lanka%2C_Mountains_in_clouds_12.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Vyacheslav Argenberg',
    imageLicense: 'CC BY 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ella,_Sri_Lanka,_Mountains_in_clouds_12.jpg',
  },
  {
    name: 'Nine Arch Bridge',
    location: 'Badulla District, Uva Province',
    description:
      'Walk through lush tea country to this celebrated stone railway viaduct near Ella.',
    category: 'Highlands',
    latitude: 6.8767,
    longitude: 81.0608,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/The_Nine_Arches_Bridge.jpg/960px-The_Nine_Arches_Bridge.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'MichaelJames2468',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:The_Nine_Arches_Bridge.jpg',
  },
  {
    name: 'Dambulla',
    location: 'Matale District, Central Province',
    description:
      'Discover the remarkable cave-temple complex and golden Buddha that overlook the surrounding plains.',
    category: 'Heritage',
    latitude: 7.8578,
    longitude: 80.6525,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Dambulla-outside.jpg/960px-Dambulla-outside.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Lankapic',
    imageLicense: 'CC BY 2.5',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Dambulla-outside.jpg',
  },
  {
    name: 'Anuradhapura',
    location: 'Anuradhapura District, North Central Province',
    description:
      'Explore one of Sri Lanka’s ancient capitals, known for immense stupas, monastery ruins and sacred sites.',
    category: 'Heritage',
    latitude: 8.335,
    longitude: 80.4108,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Ruwanweli_Maha_Saaya.jpg/960px-Ruwanweli_Maha_Saaya.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Thisaru Tharuka',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ruwanweli_Maha_Saaya.jpg',
  },
  {
    name: 'Polonnaruwa',
    location: 'Polonnaruwa District, North Central Province',
    description:
      'Cycle between medieval palaces, stone temples and serene reservoirs in this UNESCO-listed ancient city.',
    category: 'Heritage',
    latitude: 7.9333,
    longitude: 81,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Polonnaruwa_01.jpg/960px-Polonnaruwa_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Bernard Gagnon',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Polonnaruwa_01.jpg',
  },
  {
    name: 'Yala National Park',
    location: 'Hambantota and Monaragala Districts',
    description:
      'Look for elephants, leopards and colorful birdlife across a landscape of lagoons, scrub and coastline.',
    category: 'Wildlife',
    latitude: 6.55,
    longitude: 81.5,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Blue-tailed_bee-eater_%28Merops_philippinus%29_Yala.jpg/960px-Blue-tailed_bee-eater_%28Merops_philippinus%29_Yala.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Charles J. Sharp',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Blue-tailed_bee-eater_(Merops_philippinus)_Yala.jpg',
  },
  {
    name: 'Horton Plains National Park',
    location: 'Nuwara Eliya District, Central Province',
    description:
      'Hike through misty highland grasslands and cloud forest to the dramatic escarpment known as World’s End.',
    category: 'Nature',
    latitude: 6.8,
    longitude: 80.8,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Srilankamountainforest.jpg/960px-Srilankamountainforest.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Faslan',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Srilankamountainforest.jpg',
  },
  {
    name: 'Mirissa',
    location: 'Matara District, Southern Province',
    description:
      'Spend a beach day in this laid-back southern town, known for ocean sunsets, surfing and seasonal whale watching.',
    category: 'Beach',
    latitude: 5.9483,
    longitude: 80.4716,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Mirissa-Plage_%283%29.jpg/960px-Mirissa-Plage_%283%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Ji-Elle',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Mirissa-Plage_(3).jpg',
  },
  {
    name: 'Unawatuna',
    location: 'Galle District, Southern Province',
    description:
      'Swim in a sheltered bay and wander between palm-fringed sand, local cafés and nearby coastal landmarks.',
    category: 'Beach',
    latitude: 6.0108,
    longitude: 80.2491,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Unawatuna.jpg/960px-Unawatuna.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Bernard Gagnon',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Unawatuna.jpg',
  },
  {
    name: 'Bentota',
    location: 'Galle District, Southern Province',
    description:
      'Enjoy a broad sandy shoreline and calm river scenery on Sri Lanka’s popular southwest coast.',
    category: 'Beach',
    latitude: 6.4211,
    longitude: 79.9989,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Sri_Lanka%2C_Bentota%2C_beach_%282%29.JPG/960px-Sri_Lanka%2C_Bentota%2C_beach_%282%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Vincent van Zeijst',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Sri_Lanka,_Bentota,_beach_(2).JPG',
  },
  {
    name: 'Arugam Bay',
    location: 'Ampara District, Eastern Province',
    description:
      'A relaxed east-coast surf town with long sandy beaches, warm water and nearby wildlife lagoons.',
    category: 'Beach',
    latitude: 6.8415,
    longitude: 81.8368,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Beach_of_Arugam_Bay.jpg/960px-Beach_of_Arugam_Bay.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Dennis Sylvester Hurd',
    imageLicense: 'CC0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Beach_of_Arugam_Bay.jpg',
  },
  {
    name: 'Trincomalee',
    location: 'Trincomalee District, Eastern Province',
    description:
      'Discover a historic harbor city framed by clear bays, temples and sunlit beaches on the east coast.',
    category: 'Coastal',
    latitude: 8.5667,
    longitude: 81.2333,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Bay_of_Trincomalee.jpg/960px-Bay_of_Trincomalee.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Kondephy',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Bay_of_Trincomalee.jpg',
  },
  {
    name: 'Jaffna',
    location: 'Jaffna District, Northern Province',
    description:
      'Experience the north’s distinctive Tamil culture, colorful temples, market streets and island landscapes.',
    category: 'Culture',
    latitude: 9.6615,
    longitude: 80.0255,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Jaffna_montage.jpg/960px-Jaffna_montage.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Anton 17',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Jaffna_montage.jpg',
  },
  {
    name: 'Nuwara Eliya',
    location: 'Nuwara Eliya District, Central Province',
    description:
      'Take in cool mountain air, colonial-era streets and rolling tea estates in Sri Lanka’s hill-country heart.',
    category: 'Highlands',
    latitude: 6.9667,
    longitude: 80.7667,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/NuwaraEliya_from_top.jpg/960px-NuwaraEliya_from_top.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Abdul malik77',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:NuwaraEliya_from_top.jpg',
  },
  {
    name: 'Adam’s Peak',
    location: 'Ratnapura District, Sabaragamuwa Province',
    description:
      'Join a traditional night climb to the summit for a memorable sunrise above the central highlands.',
    category: 'Nature',
    latitude: 6.8096,
    longitude: 80.4994,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Sri_Pada.JPG/960px-Sri_Pada.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Bourgeois',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Sri_Pada.JPG',
  },
  {
    name: 'Pinnawala Elephant Orphanage',
    location: 'Kegalle District, Sabaragamuwa Province',
    description:
      'Learn about elephant care at this well-known sanctuary beside the Maha Oya River.',
    category: 'Wildlife',
    latitude: 7.3006,
    longitude: 80.3875,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Pinnawala_01.jpg/960px-Pinnawala_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Bernard Gagnon',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Pinnawala_01.jpg',
  },
  {
    name: 'Udawalawe National Park',
    location: 'Ratnapura and Monaragala Districts',
    description:
      'Take a safari across open grassland and reservoir edges, a celebrated habitat for wild elephants.',
    category: 'Wildlife',
    latitude: 6.474,
    longitude: 80.888,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Udawalawe_National_Park_%28Udawalawa_Reservoir%29.jpg/960px-Udawalawe_National_Park_%28Udawalawa_Reservoir%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'AntanO',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Udawalawe_National_Park_(Udawalawa_Reservoir).jpg',
  },
  {
    name: 'Minneriya National Park',
    location: 'Polonnaruwa District, North Central Province',
    description:
      'Visit dry-zone lakes and woodland famous for seasonal gatherings of wild elephants.',
    category: 'Wildlife',
    latitude: 8.031,
    longitude: 80.891,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Birds_at_the_Minneriya-Giritale_National_Park.jpg/960px-Birds_at_the_Minneriya-Giritale_National_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Stuart Pinkney',
    imageLicense: 'CC BY 2.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Birds_at_the_Minneriya-Giritale_National_Park.jpg',
  },
  {
    name: 'Bundala National Park',
    location: 'Hambantota District, Southern Province',
    description:
      'Explore coastal lagoons and dunes that shelter migratory birds, crocodiles and other wildlife.',
    category: 'Wildlife',
    latitude: 6.195,
    longitude: 81.221,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Wildlife_Preserve_Near_Kirinda%2C_Sri_Lanka.jpg/960px-Wildlife_Preserve_Near_Kirinda%2C_Sri_Lanka.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Colby Otero',
    imageLicense: 'CC BY 2.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Wildlife_Preserve_Near_Kirinda,_Sri_Lanka.jpg',
  },
  {
    name: 'Wilpattu National Park',
    location: 'North Western and North Central Provinces',
    description:
      'Travel through forest and natural lakes in Sri Lanka’s largest national park, known for elusive wildlife.',
    category: 'Wildlife',
    latitude: 8.5,
    longitude: 80,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/WilpattuNationalPark-April2014_%283%29.JPG/960px-WilpattuNationalPark-April2014_%283%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Rehman Abubakr',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:WilpattuNationalPark-April2014_(3).JPG',
  },
  {
    name: 'Hikkaduwa',
    location: 'Galle District, Southern Province',
    description:
      'Find reef-fringed beaches, surf breaks and a lively coastal town on the southern shoreline.',
    category: 'Beach',
    latitude: 6.1407,
    longitude: 80.1012,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Hikkaduwa3.JPG/960px-Hikkaduwa3.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Astronomyinertia',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Hikkaduwa3.JPG',
  },
  {
    name: 'Tangalle',
    location: 'Hambantota District, Southern Province',
    description:
      'Slow down beside quiet coves and palm-lined beaches along the island’s southern coast.',
    category: 'Beach',
    latitude: 6.024,
    longitude: 80.794,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Goyambokka_Beach%2C_Tangalle%2C_Sri_Lanka.jpg/960px-Goyambokka_Beach%2C_Tangalle%2C_Sri_Lanka.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Satdeep Gill',
    imageLicense: 'CC BY 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Goyambokka_Beach,_Tangalle,_Sri_Lanka.jpg',
  },
  {
    name: 'Pasikuda',
    location: 'Batticaloa District, Eastern Province',
    description:
      'Wade into a calm, shallow bay with soft sand and clear water on the east coast.',
    category: 'Beach',
    latitude: 7.932,
    longitude: 81.56,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Maalu_Maalu_Beach_Resort%2C_Pasikuda%2C_Sri_Lanka.jpg/960px-Maalu_Maalu_Beach_Resort%2C_Pasikuda%2C_Sri_Lanka.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Sarala Gamage',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Maalu_Maalu_Beach_Resort,_Pasikuda,_Sri_Lanka.jpg',
  },
  {
    name: 'Batticaloa',
    location: 'Batticaloa District, Eastern Province',
    description:
      'Explore a lagoon-side city with historic forts, fishing traditions and the wide eastern shoreline.',
    category: 'Coastal',
    latitude: 7.73,
    longitude: 81.7,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Sea_Fishing%2C_Batticaloa.jpg/960px-Sea_Fishing%2C_Batticaloa.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Anton Croos',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Sea_Fishing,_Batticaloa.jpg',
  },
  {
    name: 'Kalpitiya',
    location: 'Puttalam District, North Western Province',
    description:
      'Discover a breezy peninsula of lagoons, sandbars and dolphin-watching waters.',
    category: 'Coastal',
    latitude: 8.233,
    longitude: 79.766,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/SL_Kalpitiya_asv2020-01_img4_Fishery_harbour.jpg/960px-SL_Kalpitiya_asv2020-01_img4_Fishery_harbour.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'A.Savin',
    imageLicense: 'FAL',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:SL_Kalpitiya_asv2020-01_img4_Fishery_harbour.jpg',
  },
  {
    name: 'Kumana National Park',
    location: 'Ampara District, Eastern Province',
    description:
      'Visit a peaceful eastern reserve known for its wetlands and seasonal birdlife.',
    category: 'Wildlife',
    latitude: 6.633,
    longitude: 81.716,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Kumana_National_Park_%28Kudumbigala_Sanctuary%29.JPG/960px-Kumana_National_Park_%28Kudumbigala_Sanctuary%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'AntanO',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Kumana_National_Park_(Kudumbigala_Sanctuary).JPG',
  },
  {
    name: 'Knuckles Mountain Range',
    location: 'Central Province',
    description:
      'Trek through cloud forests, mountain villages and dramatic ridgelines in this protected highland range.',
    category: 'Nature',
    latitude: 7.45,
    longitude: 80.8,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Knuckles_Range.JPG/960px-Knuckles_Range.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Astronomyinertia',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Knuckles_Range.JPG',
  },
  {
    name: 'Sinharaja Forest Reserve',
    location: 'Sabaragamuwa and Southern Provinces',
    description:
      'Walk beneath the canopy of a UNESCO-listed rainforest rich in endemic birds, plants and wildlife.',
    category: 'Nature',
    latitude: 6.4167,
    longitude: 80.5,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/20160128_Sri_Lanka_4132_Sinharaja_Forest_Preserve_sRGB_%2825674474901%29.jpg/960px-20160128_Sri_Lanka_4132_Sinharaja_Forest_Preserve_sRGB_%2825674474901%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Dan Lundberg',
    imageLicense: 'CC BY-SA 2.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:20160128_Sri_Lanka_4132_Sinharaja_Forest_Preserve_sRGB_(25674474901).jpg',
  },
  {
    name: 'Lipton’s Seat',
    location: 'Badulla District, Uva Province',
    description:
      'Follow tea-estate paths to a high viewpoint with sweeping views across the southern hill country.',
    category: 'Highlands',
    latitude: 6.744,
    longitude: 81.049,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Lipton-seat_Sri_Lanka.jpg/960px-Lipton-seat_Sri_Lanka.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'AriyaHetti',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Lipton-seat_Sri_Lanka.jpg',
  },
  {
    name: 'Diyaluma Falls',
    location: 'Badulla District, Uva Province',
    description:
      'See one of Sri Lanka’s tallest waterfalls cascade through a green landscape near Koslanda.',
    category: 'Nature',
    latitude: 6.816,
    longitude: 81.017,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Diyaluma_Falls_1.jpg/960px-Diyaluma_Falls_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Travel Local',
    imageLicense: 'CC BY 2.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Diyaluma_Falls_1.jpg',
  },
  {
    name: 'Ravana Falls',
    location: 'Badulla District, Uva Province',
    description:
      'Pause at this photogenic cascade beside the Ella–Wellawaya road, especially full after the rains.',
    category: 'Nature',
    latitude: 6.872,
    longitude: 81.057,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Ravana_Falls_Ella.jpg/960px-Ravana_Falls_Ella.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Philip Nalangan',
    imageLicense: 'CC BY 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ravana_Falls_Ella.jpg',
  },
  {
    name: 'Bambarakanda Falls',
    location: 'Badulla District, Uva Province',
    description:
      'Follow a scenic hill-country route to Sri Lanka’s highest waterfall, tucked into a forested valley.',
    category: 'Nature',
    latitude: 6.773,
    longitude: 80.838,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Bambarakanda_Waterfall.jpg/960px-Bambarakanda_Waterfall.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Kiriwattuduwa',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Bambarakanda_Waterfall.jpg',
  },
  {
    name: 'Galle Lighthouse',
    location: 'Galle District, Southern Province',
    description:
      'Walk the ramparts to this landmark lighthouse overlooking the Indian Ocean and Galle’s old harbor.',
    category: 'Heritage',
    latitude: 6.026,
    longitude: 80.219,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/SL_Galle_Fort_asv2020-01_img24.jpg/960px-SL_Galle_Fort_asv2020-01_img24.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'A.Savin',
    imageLicense: 'FAL',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:SL_Galle_Fort_asv2020-01_img24.jpg',
  },
  {
    name: 'Gangaramaya Temple',
    location: 'Colombo District, Western Province',
    description:
      'Visit a lively Colombo temple combining Buddhist shrines, intricate decoration and a lakeside setting.',
    category: 'Culture',
    latitude: 6.916,
    longitude: 79.856,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Gangaramaya_Temple.JPG/960px-Gangaramaya_Temple.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'AKS.9955',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Gangaramaya_Temple.JPG',
  },
  {
    name: 'Temple of the Tooth',
    location: 'Kandy District, Central Province',
    description:
      'Explore Sri Dalada Maligawa, a revered temple beside Kandy Lake and a centerpiece of the city’s heritage.',
    category: 'Culture',
    latitude: 7.2936,
    longitude: 80.6413,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/SL_Kandy_asv2020-01_img33_Sacred_Tooth_Temple.jpg/960px-SL_Kandy_asv2020-01_img33_Sacred_Tooth_Temple.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'A.Savin',
    imageLicense: 'FAL',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:SL_Kandy_asv2020-01_img33_Sacred_Tooth_Temple.jpg',
  },
  {
    name: 'Peradeniya Botanical Gardens',
    location: 'Kandy District, Central Province',
    description:
      'Stroll broad lawns, palm avenues and tropical plant collections at the Royal Botanic Gardens.',
    category: 'Nature',
    latitude: 7.272,
    longitude: 80.596,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Diospyros_Atrata_Jardin_botanique_de_Peradeniya_Kandy.JPG/960px-Diospyros_Atrata_Jardin_botanique_de_Peradeniya_Kandy.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Pierre André Leclercq',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Diospyros_Atrata_Jardin_botanique_de_Peradeniya_Kandy.JPG',
  },
  {
    name: 'Ambewela Farm',
    location: 'Nuwara Eliya District, Central Province',
    summary: ambewelaSummary,
    description: ambewelaDescription,
    notes: ambewelaNotes,
    category: 'Highlands',
    latitude: 6.884,
    longitude: 80.779,
    images: ambewelaImages,
    imageCredits: ambewelaImageCredits,
    imageLicenses: ambewelaImageLicenses,
    imageSourceUrls: ambewelaImageSourceUrls,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Ambewela_farm_%28New_Zealand_Farm%29.jpg/960px-Ambewela_farm_%28New_Zealand_Farm%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'A-wiki-guest-user',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ambewela_farm_(New_Zealand_Farm).jpg',
  },
  {
    name: 'St Clair’s Falls',
    location: 'Nuwara Eliya District, Central Province',
    description:
      'Admire a wide twin cascade dropping through tea country near Talawakele.',
    category: 'Nature',
    latitude: 6.947,
    longitude: 80.678,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/St._Clair%27s_Falls%2C_Talawakelle%2C_Sri_Lanka%2C_20260206_0940_9033.jpg/960px-St._Clair%27s_Falls%2C_Talawakelle%2C_Sri_Lanka%2C_20260206_0940_9033.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Jakub Hałun',
    imageLicense: 'CC BY 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:St._Clair%27s_Falls,_Talawakelle,_Sri_Lanka,_20260206_0940_9033.jpg',
  },
  {
    name: 'Victoria Park',
    location: 'Nuwara Eliya District, Central Province',
    description:
      'Take a quiet walk through a flower-filled town park in the cool highlands of Nuwara Eliya.',
    category: 'Nature',
    latitude: 6.97,
    longitude: 80.77,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Victoria_park%2C_Nuwara_Eliya_-_panoramio.jpg/960px-Victoria_park%2C_Nuwara_Eliya_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Alexey Komarov',
    imageLicense: 'CC BY 3.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Victoria_park,_Nuwara_Eliya_-_panoramio.jpg',
  },
  {
    name: 'Pigeon Island National Park',
    location: 'Trincomalee District, Eastern Province',
    description:
      'Snorkel over coral reefs and clear shallows at a small offshore national park near Nilaveli.',
    category: 'Nature',
    latitude: 8.72,
    longitude: 81.206,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Pigeon_Island_National_Park%2C_Trincomalee.jpg/960px-Pigeon_Island_National_Park%2C_Trincomalee.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'AntanO',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Pigeon_Island_National_Park,_Trincomalee.jpg',
  },
  {
    name: 'Nilaveli Beach',
    location: 'Trincomalee District, Eastern Province',
    description:
      'Relax beside a long, pale-sand beach with calm blue water north of Trincomalee.',
    category: 'Beach',
    latitude: 8.684,
    longitude: 81.201,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Nilaveli_Beach_Sri_Lanka.jpg/960px-Nilaveli_Beach_Sri_Lanka.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Chamara Madhusankha',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Nilaveli_Beach_Sri_Lanka.jpg',
  },
  {
    name: 'Delft Island',
    location: 'Jaffna District, Northern Province',
    description:
      'Discover a quiet island of coral walls, wild ponies and coastal scenery reached by ferry from Jaffna.',
    category: 'Coastal',
    latitude: 9.522,
    longitude: 79.676,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/3/30/Delft_Island_banner.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled',
    imageCredit: 'David Stanley',
    imageLicense: 'CC BY 2.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Delft_Island_banner.jpg',
  },
  {
    name: 'Jaffna Fort',
    location: 'Jaffna District, Northern Province',
    description:
      'Walk the ramparts and restored ruins of this historic coastal fort overlooking Jaffna Lagoon.',
    category: 'Heritage',
    latitude: 9.662,
    longitude: 80.008,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Jaffna_Fort_%281%29.jpg/960px-Jaffna_Fort_%281%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Rehman Abubakr',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Jaffna_Fort_(1).jpg',
  },
  {
    name: 'Koggala Lake',
    location: 'Galle District, Southern Province',
    description:
      'Take a boat past mangrove islands and quiet waters in one of the south coast’s largest lagoons.',
    category: 'Nature',
    latitude: 5.988,
    longitude: 80.335,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Lake_Koggala_mangroves.jpg/960px-Lake_Koggala_mangroves.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Richtr Jan',
    imageLicense: 'CC BY 4.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Lake_Koggala_mangroves.jpg',
  },
  {
    name: 'Mount Lavinia Beach',
    location: 'Colombo District, Western Province',
    description:
      'Escape the city for a sunset stroll and a swim at a popular beach just south of central Colombo.',
    category: 'Beach',
    latitude: 6.82,
    longitude: 79.88,
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Sri_Lanka_mount_Lavenia.jpg/960px-Sri_Lanka_mount_Lavenia.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    imageCredit: 'Sergei Gussev',
    imageLicense: 'CC BY 2.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Sri_Lanka_mount_Lavenia.jpg',
  },
  {
    name: 'Haputale',
    location: 'Badulla District, Uva Province',
    description:
      'Enjoy dramatic valley views and nearby tea-country walks from this small town on a high mountain ridge.',
    category: 'Highlands',
    latitude: 6.765,
    longitude: 80.951,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/6/6b/Haputale_town_01_640.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled',
    imageCredit: 'Kapidis',
    imageLicense: 'CC BY-SA 3.0',
    imageSourceUrl:
      'https://commons.wikimedia.org/wiki/File:Haputale_town_01_640.jpg',
  },
];

@Injectable()
export class DestinationsService implements OnModuleInit {
  constructor(
    @InjectModel(Destination.name)
    private readonly destinations: Model<Destination>,
  ) {}

  async onModuleInit() {
    await Promise.all(
      [
        ...sampleDestinations.map((destination) =>
          this.destinations
            .updateOne(
              { name: destination.name },
              { $setOnInsert: destination },
              { upsert: true },
            )
            .exec(),
        ),
        this.destinations
          .updateOne(
            {
              name: 'Colombo',
              description: colomboSummary,
              summary: { $exists: false },
            },
            { $set: { summary: colomboSummary, description: colomboDescription } },
          )
          .exec(),
        this.destinations
          .updateOne(
            {
              name: 'Ambewela Farm',
              description: ambewelaSummary,
              summary: { $exists: false },
              $or: [{ images: { $exists: false } }, { images: { $size: 0 } }],
            },
            {
              $set: {
                summary: ambewelaSummary,
                description: ambewelaDescription,
                notes: ambewelaNotes,
                images: ambewelaImages,
                imageCredits: ambewelaImageCredits,
                imageLicenses: ambewelaImageLicenses,
                imageSourceUrls: ambewelaImageSourceUrls,
              },
            },
          )
          .exec(),
      ],
    );
  }

  async findAll() {
    return this.destinations.find().sort({ name: 1 }).lean().exec();
  }

  async findOne(id: string) {
    const destination = isValidObjectId(id)
      ? await this.destinations.findById(id).lean().exec()
      : null;
    if (!destination) throw new NotFoundException('Destination not found.');
    return destination;
  }

  async create(dto: DestinationDto) {
    return this.destinations.create(dto);
  }

  async update(id: string, dto: DestinationDto) {
    const destination = isValidObjectId(id)
      ? await this.destinations
          .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
          .lean()
          .exec()
      : null;
    if (!destination) throw new NotFoundException('Destination not found.');
    return destination;
  }

  async remove(id: string) {
    const destination = isValidObjectId(id)
      ? await this.destinations.findByIdAndDelete(id).lean().exec()
      : null;
    if (!destination) throw new NotFoundException('Destination not found.');
    return { success: true };
  }
}
