const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta donde se guardarán los avatares en Supabase
const AVATARS_FOLDER = 'default-avatars';

// Nombres de los archivos de avatar (deben estar en la carpeta public/avatars)
const AVATAR_FILES = [
  'avatar1.jpg',
  'avatar2.jpg',
  'avatar3.jpg',
  'avatar4.jpg',
  'avatar5.jpg'
];

async function uploadAvatars() {
  console.log('Iniciando carga de avatares predeterminados...');
  
  try {
    // Asegurarse de que el bucket existe
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) throw bucketsError;

    const bucketExists = buckets.some(bucket => bucket.name === 'avatars');
    if (!bucketExists) {
      console.log('Creando bucket de avatares...');
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('avatars', { public: true });
      
      if (createBucketError) throw createBucketError;
    }

    // Subir cada avatar
    for (const avatarFile of AVATAR_FILES) {
      const filePath = path.join(process.cwd(), 'public', 'avatars', avatarFile);
      
      // Leer el archivo
      const file = fs.readFileSync(filePath);
      const fileExt = path.extname(avatarFile);
      const fileName = `default-${Date.now()}${fileExt}`;
      const filePathInBucket = `${AVATARS_FOLDER}/${fileName}`;

      console.log(`Subiendo ${avatarFile} como ${filePathInBucket}...`);
      
      // Subir el archivo
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePathInBucket, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: `image/${fileExt.replace('.', '')}`
        });

      if (uploadError) {
        console.error(`Error subiendo ${avatarFile}:`, uploadError.message);
        continue;
      }

      // Hacer el archivo público
      const { data: publicUrlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePathInBucket);

      console.log(`✅ ${avatarFile} subido correctamente:`);
      console.log('URL Pública:', publicUrlData.publicUrl);
      console.log('---');
    }

    console.log('✅ Todos los avatares se han subido correctamente');
  } catch (error) {
    console.error('Error inesperado:', error);
  }
}

uploadAvatars();
