import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear directorio de uploads si no existe
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'listings');
console.log('Simple upload - Directory:', uploadDir);

if (!fs.existsSync(uploadDir)) {
    console.log('Creating upload directory...');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Upload directory created successfully');
} else {
    console.log('Upload directory already exists');
}

// Configuración simple de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Simple upload - Destination called');
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `simple-${uniqueSuffix}${ext}`;
        console.log('Simple upload - Filename:', filename);
        cb(null, filename);
    }
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo por archivo
        files: 5 // Máximo 5 archivos
    }
});

// Middleware para manejar errores de upload
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
    console.log('Simple upload - Error handler:', error);
    
    if (error instanceof multer.MulterError) {
        console.log('Simple upload - Multer error:', error.code, error.message);
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                message: 'El archivo es demasiado grande. Máximo 5MB por imagen.' 
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                success: false, 
                message: 'Demasiados archivos. Máximo 5 imágenes por gato.' 
            });
        }
    }
    
    next(error);
};

// Función para eliminar archivos
export const deleteFile = (filename: string) => {
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Función para eliminar múltiples archivos
export const deleteFiles = (filenames: string[]) => {
    filenames.forEach(filename => {
        deleteFile(filename);
    });
};
