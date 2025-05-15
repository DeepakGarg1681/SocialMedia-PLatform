import fs from 'fs';
import https from 'https';
import path from 'path';

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

const images = [
  {
  name: 'deepak.jpg',
    url: 'https://example.com/deepak.jpg'
  },
  {
    name: 'ankush.jpg',
    url: 'https://example.com/ankush.jpg'
  },
  {
    name: 'raj.jpg',
    url: 'https://example.com/raj.jpg'
  },
  {
    name: 'raj.jpg',
    url: 'https://example.com/raj.jpg'
  }
];

const downloadAllImages = async () => {
  const publicFolder = path.join(process.cwd(), '..', 'public', 'images');
  
  if (!fs.existsSync(publicFolder)) {
    fs.mkdirSync(publicFolder, { recursive: true });
  }

  for (const image of images) {
    const filepath = path.join(publicFolder, image.name);
    try {
      await downloadImage(image.url, filepath);
      console.log(`Downloaded ${image.name}`);
    } catch (err) {
      console.error(`Error downloading ${image.name}:`, err.message);
    }
  }
};

downloadAllImages(); 