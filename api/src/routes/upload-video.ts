import { FastifyInstance } from 'fastify';
import { fastifyMultipart } from '@fastify/multipart';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { prisma } from '../lib/prisma';

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25, //25Mb
    },
  });
  app.post('/videos', async (req, res) => {
    const data = await req.file();

    if (!data) {
      return res.status(400).send({ error: 'Missing file input.' });
    }

    const extention = path.extname(data.filename);

    if (extention != '.mp3') {
      return res
        .status(400)
        .send({ error: 'Invalid input type. Please upload MP3 files only.' });
    }

    const fileBaseName = path.basename(data.filename, extention);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extention}`;
    const uploadDir = path.resolve(__dirname, '../../tmp', fileUploadName);
    await pump(data.file, fs.createWriteStream(uploadDir));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDir,
      },
    });

    return { video };
  });
}
