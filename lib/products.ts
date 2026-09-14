export type ChannelId = "tiktok" | "shopify" | "mercadolivre"

export type ProductStatus = "ativo" | "rascunho" | "inativo"

export type SyncMode = "master" | "mirror"

export type SyncStatus = "synced" | "pending" | "error"

export type ProductCategory =
  | "eletronicos"
  | "acessorios"
  | "vestuario"
  | "casa"
  | "esporte"

export type ChannelConfig = {
  enabled: boolean
  syncMode: SyncMode
  mappedCategory: string
  syncStatus: SyncStatus
}

export type ProductVariation = {
  id: string
  color: string
  size: string
  price: number
  stock: number
}

export type ProductImage = {
  id: string
  url: string
  alt: string
}

export type Product = {
  id: string
  name: string
  sku: string
  shortDescription: string
  longDescription: string
  category: ProductCategory
  price: number
  promoPrice?: number
  currency: string
  stock: number
  weight: number
  dimensions: { length: number; width: number; height: number }
  status: ProductStatus
  createdAt: string
  images: ProductImage[]
  variations: ProductVariation[]
  channels: Record<ChannelId, ChannelConfig>
}

export const CHANNELS: { id: ChannelId; label: string }[] = [
  { id: "tiktok", label: "TikTok Shop" },
  { id: "shopify", label: "Shopify" },
  { id: "mercadolivre", label: "Mercado Livre" },
]

export const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "acessorios", label: "Acessórios" },
  { value: "vestuario", label: "Vestuário" },
  { value: "casa", label: "Casa" },
  { value: "esporte", label: "Esporte" },
]

export const STATUSES: { value: ProductStatus; label: string }[] = [
  { value: "ativo", label: "Ativo" },
  { value: "rascunho", label: "Rascunho" },
  { value: "inativo", label: "Inativo" },
]

export const SYNC_MODES: { value: SyncMode; label: string }[] = [
  { value: "master", label: "Datacrazy é o catálogo mestre" },
  { value: "mirror", label: "Espelhar do canal externo" },
]

export function categoryLabel(value: ProductCategory) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function statusLabel(value: ProductStatus) {
  return STATUSES.find((s) => s.value === value)?.label ?? value
}

export function channelLabel(id: ChannelId) {
  return CHANNELS.find((c) => c.id === id)?.label ?? id
}

export function formatCurrency(value: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}

function defaultChannels(
  overrides?: Partial<Record<ChannelId, Partial<ChannelConfig>>>,
): Record<ChannelId, ChannelConfig> {
  const base: Record<ChannelId, ChannelConfig> = {
    tiktok: { enabled: false, syncMode: "master", mappedCategory: "", syncStatus: "pending" },
    shopify: { enabled: false, syncMode: "master", mappedCategory: "", syncStatus: "pending" },
    mercadolivre: { enabled: false, syncMode: "master", mappedCategory: "", syncStatus: "pending" },
  }
  if (!overrides) return base
  for (const key of Object.keys(overrides) as ChannelId[]) {
    base[key] = { ...base[key], ...overrides[key] }
  }
  return base
}

export function createEmptyProduct(): Product {
  return {
    id: "",
    name: "",
    sku: "",
    shortDescription: "",
    longDescription: "",
    category: "eletronicos",
    price: 0,
    promoPrice: undefined,
    currency: "BRL",
    stock: 0,
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    status: "rascunho",
    createdAt: new Date().toISOString(),
    images: [],
    variations: [],
    channels: defaultChannels(),
  }
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Fone de Ouvido Wireless Pro",
    sku: "FON-WP-001",
    shortDescription: "Fone over-ear com cancelamento de ruído ativo.",
    longDescription:
      "Fone de ouvido premium com cancelamento de ruído ativo, até 30 horas de bateria e áudio de alta fidelidade. Ideal para trabalho e viagens.",
    category: "eletronicos",
    price: 899.9,
    promoPrice: 749.9,
    currency: "BRL",
    stock: 128,
    weight: 0.3,
    dimensions: { length: 20, width: 18, height: 8 },
    status: "ativo",
    createdAt: "2025-11-02T10:00:00Z",
    images: [{ id: "i1", url: "/products/headphones.png", alt: "Fone de ouvido wireless preto" }],
    variations: [
      { id: "v1", color: "Preto", size: "Único", price: 899.9, stock: 90 },
      { id: "v2", color: "Prata", size: "Único", price: 899.9, stock: 38 },
    ],
    channels: defaultChannels({
      tiktok: { enabled: true, syncMode: "master", mappedCategory: "Eletrônicos > Áudio", syncStatus: "synced" },
      shopify: { enabled: true, syncMode: "master", mappedCategory: "Audio", syncStatus: "synced" },
      mercadolivre: { enabled: true, syncMode: "mirror", mappedCategory: "Fones de Ouvido", syncStatus: "pending" },
    }),
  },
  {
    id: "p2",
    name: "Tênis de Corrida AirFlow",
    sku: "TEN-AF-204",
    shortDescription: "Tênis leve com amortecimento responsivo.",
    longDescription:
      "Tênis de corrida com entressola em espuma responsiva, cabedal respirável e solado de alta durabilidade.",
    category: "esporte",
    price: 459.9,
    currency: "BRL",
    stock: 54,
    weight: 0.5,
    dimensions: { length: 32, width: 22, height: 12 },
    status: "ativo",
    createdAt: "2025-10-21T14:30:00Z",
    images: [{ id: "i2", url: "/products/sneaker.png", alt: "Tênis de corrida branco" }],
    variations: [
      { id: "v3", color: "Branco", size: "40", price: 459.9, stock: 20 },
      { id: "v4", color: "Branco", size: "42", price: 459.9, stock: 34 },
    ],
    channels: defaultChannels({
      shopify: { enabled: true, syncMode: "master", mappedCategory: "Footwear", syncStatus: "synced" },
      mercadolivre: { enabled: true, syncMode: "master", mappedCategory: "Calçados", syncStatus: "error" },
    }),
  },
  {
    id: "p3",
    name: "Mochila Urbana Flex",
    sku: "MOC-UF-330",
    shortDescription: "Mochila resistente com compartimento para notebook.",
    longDescription:
      "Mochila urbana com compartimento acolchoado para notebook de até 15 polegadas, tecido impermeável e alças ergonômicas.",
    category: "acessorios",
    price: 289.9,
    promoPrice: 229.9,
    currency: "BRL",
    stock: 76,
    weight: 0.8,
    dimensions: { length: 45, width: 30, height: 18 },
    status: "ativo",
    createdAt: "2025-09-15T09:15:00Z",
    images: [{ id: "i3", url: "/products/backpack.png", alt: "Mochila urbana cinza" }],
    variations: [],
    channels: defaultChannels({
      tiktok: { enabled: true, syncMode: "master", mappedCategory: "Bolsas & Mochilas", syncStatus: "synced" },
    }),
  },
  {
    id: "p4",
    name: "Smartwatch Pulse S2",
    sku: "SWT-PS-512",
    shortDescription: "Relógio inteligente com monitor de saúde.",
    longDescription:
      "Smartwatch com monitoramento cardíaco, GPS integrado, resistência à água e mais de 100 modos esportivos.",
    category: "eletronicos",
    price: 1299.0,
    currency: "BRL",
    stock: 0,
    weight: 0.05,
    dimensions: { length: 5, width: 4, height: 1 },
    status: "inativo",
    createdAt: "2025-08-30T16:45:00Z",
    images: [{ id: "i4", url: "/products/watch.png", alt: "Smartwatch com pulseira preta" }],
    variations: [],
    channels: defaultChannels({
      shopify: { enabled: true, syncMode: "mirror", mappedCategory: "Wearables", syncStatus: "error" },
    }),
  },
  {
    id: "p5",
    name: "Garrafa Térmica Steel 750ml",
    sku: "GAR-ST-750",
    shortDescription: "Garrafa em aço inox com isolamento a vácuo.",
    longDescription:
      "Garrafa térmica em aço inoxidável com parede dupla, mantém bebidas quentes por 12h e geladas por 24h.",
    category: "casa",
    price: 129.9,
    currency: "BRL",
    stock: 210,
    weight: 0.35,
    dimensions: { length: 8, width: 8, height: 26 },
    status: "rascunho",
    createdAt: "2025-12-01T11:20:00Z",
    images: [{ id: "i5", url: "/products/bottle.png", alt: "Garrafa térmica de aço inox" }],
    variations: [],
    channels: defaultChannels(),
  },
  {
    id: "p6",
    name: "Óculos de Sol Classic",
    sku: "OCL-CL-118",
    shortDescription: "Óculos com proteção UV400 e armação leve.",
    longDescription:
      "Óculos de sol modelo wayfarer com lentes polarizadas, proteção UV400 e armação em acetato resistente.",
    category: "acessorios",
    price: 199.9,
    promoPrice: 159.9,
    currency: "BRL",
    stock: 42,
    weight: 0.03,
    dimensions: { length: 15, width: 6, height: 5 },
    status: "ativo",
    createdAt: "2025-11-18T08:00:00Z",
    images: [{ id: "i6", url: "/products/sunglasses.png", alt: "Óculos de sol pretos" }],
    variations: [
      { id: "v5", color: "Preto", size: "Único", price: 199.9, stock: 42 },
    ],
    channels: defaultChannels({
      tiktok: { enabled: true, syncMode: "master", mappedCategory: "Óculos", syncStatus: "synced" },
      shopify: { enabled: true, syncMode: "master", mappedCategory: "Eyewear", syncStatus: "synced" },
      mercadolivre: { enabled: true, syncMode: "master", mappedCategory: "Óculos de Sol", syncStatus: "synced" },
    }),
  },
]
