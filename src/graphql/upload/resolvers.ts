import { GraphQLUpload } from 'graphql-upload-ts';
import path from 'path';
import fs from 'fs';
import { mkdir } from 'fs/promises';

const Mutation = {
    singleUpload: async (_parent: any, { file }: { file: any }) => {
        const upload = Array.isArray(file) ? (file[0]?.file || file[0]) : file?.file || file;
        if (!upload || typeof upload.createReadStream !== 'function' || !upload.filename) {
            return { success: false, message: 'Invalid file upload', data: null };
        }
        const { createReadStream, filename} = upload;
        const uploadDir = path.join(process.cwd(), 'public', 'tempUploads');
        await mkdir(uploadDir, { recursive: true });
        const newFilename = `${Date.now()}___${filename}`;
        const filePath = path.join(uploadDir, newFilename);
        const stream = createReadStream();
        const out = fs.createWriteStream(filePath);
        await new Promise<void>((resolve, reject) => {
            stream.pipe(out);
            stream.on('error', (error: unknown) => {
                out.destroy();
                reject(error);
            });
            out.on('finish', resolve);
            out.on('error', (error: unknown) => {
                stream.destroy();
                reject(error);
            });
        });
        return { success: true, message: 'File uploaded successfully', data: newFilename };
    },
};

export const resolvers = {
    Upload: GraphQLUpload,
    Mutation,
};
