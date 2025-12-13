import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/tickets/'));
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

export const categoryUploadFiles = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).array("attachments")