import { FastifyInstance } from 'fastify';
import { createReadStream } from 'fs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { openai } from '../lib/openai';

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (req, res) => {
    const bodySchema = z.object({
      videoId: z.string().uuid(),
      template: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    });
    const { videoId, template, temperature } = bodySchema.parse(req.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    if (!video.transcription) {
      return res
        .status(400)
        .send({ error: 'Video transcription was not found.' });
    }

    const promptMessage = template.replace(
      '{transcription}',
      video.transcription
    );

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature,
      messages: [{ role: 'user', content: promptMessage }],
    });

    return response;
  });
}
