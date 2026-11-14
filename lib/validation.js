import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().trim().min(1).default("Kućna adresa"),
  fullName: z.string().trim().min(3, "Unesite ime i prezime"),
  street: z.string().trim().min(3, "Unesite ulicu i broj"),
  city: z.string().trim().min(2, "Unesite grad"),
  postalCode: z.string().trim().min(5, "Unesite poštanski broj"),
  phone: z.string().trim().min(6, "Unesite telefon"),
  isDefault: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(3, "Unesite naziv"),
  sku: z.string().trim().min(2, "Unesite šifru"),
  partNumber: z.string().trim().optional().nullable(),
  description: z.string().trim().min(5, "Unesite opis"),
  price: z.coerce.number().int().min(0, "Neispravna cena"),
  oldPrice: z.coerce.number().int().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0),
  condition: z.string().trim().min(2),
  image: z.string().trim().optional().nullable(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  carModelId: z.coerce.number().int().optional().nullable(),
  categoryId: z.coerce.number().int().optional().nullable(),
});
