import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear directorio de uploads si no existe
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'listings');
console.log('Upload directory:', uploadDir);

if (!fs.existsSync(uploadDir)) {
    console.log('Creating upload directory...');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Upload directory created successfully');
} else {
    console.log('Upload directory already exists');
}

// Configuración de multer con debug
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Multer destination called:', uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `listing-${uniqueSuffix}${ext}`;
        console.log('Multer filename generated:', filename);
        cb(null, filename);
    }
});

// Filtro para tipos de archivo permitidos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log('File filter called with file:', file.originalname, 'mimetype:', file.mimetype);
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        console.log('File accepted:', file.originalname);
        return cb(null, true);
    } else {
        console.log('File rejected:', file.originalname, 'mimetype:', file.mimetype);
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

// Middleware de debug
export const debugUpload = (req: any, res: any, next: any) => {
    console.log('Debug upload middleware called');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);
    next();
};

// Middleware para manejar errores de upload
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
    console.log('Upload error handler called:', error);
    
    if (error instanceof multer.MulterError) {
        console.log('Multer error:', error.code, error.message);
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
