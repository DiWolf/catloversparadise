import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear directorio de uploads si no existe
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'listings');
console.log('Upload directory:', uploadDir);
console.log('Directory exists:', fs.existsSync(uploadDir));
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Directory created');
}

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Saving file to:', uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `listing-${uniqueSuffix}${ext}`);
    }
});

// Filtro para tipos de archivo permitidos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WEBP)'));
    }
};

// Configuración de multer
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo por archivo
        files: 5 // Máximo 5 archivos
    },
    fileFilter: fileFilter
});

// Middleware para manejar errores de upload
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
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
    
    if (error.message.includes('Solo se permiten archivos de imagen')) {
        return res.status(400).json({ 
            success: false, 
            message: error.message 
        });
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
