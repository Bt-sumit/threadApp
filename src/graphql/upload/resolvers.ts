import { GraphQLUpload } from 'graphql-upload-ts';
import { finished } from 'stream/promises';
import path from 'path';
import fs from 'fs';
import { mkdir } from 'fs/promises';

const Mutation = {
    singleUpload: async (_parent: any, { file }: { file: any }) => {
        const upload = file[0]?.file;
        if (!upload ||
            typeof upload.createReadStream !== 'function' ||
            !upload.filename
        ) {
            throw new Error('Invalid upload file structure');
        }
        const { createReadStream, filename, mimetype, encoding } = upload;
        const uploadDir = path.join(process.cwd(), 'public/tempUploads');
        await mkdir(uploadDir, { recursive: true });
        const newFilename = `${Date.now()}___${filename}`;
        const filePath = path.join(uploadDir, newFilename);
        const stream = createReadStream();
        const out = fs.createWriteStream(filePath);
        stream.pipe(out);
        await finished(out);
        console.log('✅ File saved:', filePath);
        return {
            filename: newFilename,
            mimetype,
            encoding,
            url: `/tempUploads/${newFilename}`,
        };
    },
};

export const resolvers = {
    Upload: GraphQLUpload,
    Mutation,
};
