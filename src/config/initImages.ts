import { PrismaClient } from '@prisma/client';
import  imageService  from "../services/image"

const prisma = new PrismaClient();

const IMAGE_URLS = [
  '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png',
  '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png',
  '21.png', '22.png', '23.png', '24.png', '25.png', '26.png', '27.png', '28.png', '29.png', '30.png',
  '31.png', '32.png',
];

const initImages = async () => {
  try {
    console.info('Vérification des images existantes...');

    const existingImages = await prisma.image.findMany();

    if (existingImages.length > 0) {
      console.info('Des images existent déjà, aucune injection nécessaire.');
      return;
    }

    console.info('Aucune image trouvée. Injection des nouvelles images...');

    for (const imageUrl of IMAGE_URLS) {
      await imageService.createImage(imageUrl);
      console.info(`Image ${imageUrl} ajoutée avec succès.`);
    }

    console.info('Injection des images terminée.');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des images:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Exécuter le script
initImages();
