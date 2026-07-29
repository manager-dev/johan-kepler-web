// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const noticiasCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        date: z.date(),
        category: z.enum(["Aviso Importante", "Académico", "Feria de Logros", "Deportes", "Comunidad"]),
        urgent: z.boolean().default(false),
        image: image().optional(),
        summary: z.string(),
    }),
});

export const collections = {
    'noticias': noticiasCollection,
};