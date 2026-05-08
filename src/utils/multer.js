import multer from 'multer';

class UploadConfig {
    constructor(config = {}) {
        this.config = {
            maxFileSize: config.maxFileSize || 10 * 1024 * 1024,
            allowedMimeTypes: config.allowedMimeTypes || [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/svg+xml',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain',
                'text/csv',
                'application/csv',
                'application/zip',
                'application/x-zip-compressed',
                'application/octet-stream'
            ]
        };

        this.storage = multer.memoryStorage();

        this.fileFilter = (req, file, cb) => {
            if (this.config.allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(`Invalid file type. Allowed types are: ${this.config.allowedMimeTypes.join(', ')}`), false);
            }
        };

        this.multerInstance = multer({
            storage: this.storage,
            fileFilter: this.fileFilter,
            limits: {
                fileSize: this.config.maxFileSize
            }
        });
    }

    handleUpload(fields = null) {
        if (!fields) {
            return this.multerInstance.any();
        }

        if (Array.isArray(fields)) {
            return this.multerInstance.fields(fields);
        }

        if (typeof fields === 'string') {
            return this.multerInstance.single(fields);
        }

        if (typeof fields === 'object' && fields.fieldName) {
            return this.multerInstance.array(fields.fieldName, fields.maxCount);
        }

        throw new Error('Invalid fields configuration');
    }

    errorHandler() {
        return (error, req, res, next) => {
            if (error instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    message: 'File upload error',
                    error: error.message
                });
            }

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next();
        };
    }
}

const defaultUploader = new UploadConfig();

export const upload = defaultUploader;

export const createUploader = (config) => new UploadConfig(config);