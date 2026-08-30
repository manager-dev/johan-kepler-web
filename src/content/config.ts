import { defineCollection, z } from "astro:content";

const noticiasCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    urgent: z.boolean().default(false),
    // Usar z.string() para rutas estáticas de public/
    image: z.string().optional(),
    summary: z.string().optional(),
  }),
});

export const collections = {
  noticias: noticiasCollection,
};
