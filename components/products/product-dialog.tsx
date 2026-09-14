"use client"

import { useEffect, useState } from "react"
import { ImagePlus, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  CATEGORIES,
  CHANNELS,
  STATUSES,
  SYNC_MODES,
  type ChannelId,
  type Product,
  type ProductCategory,
  type ProductStatus,
  type ProductVariation,
  type SyncMode,
  channelLabel,
  createEmptyProduct,
} from "@/lib/products"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSave: (product: Product) => void
}

const CURRENCIES = [
  { value: "BRL", label: "Real (BRL)" },
  { value: "USD", label: "Dólar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
]

const categoryItems: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label]),
)
const statusItems: Record<string, string> = Object.fromEntries(
  STATUSES.map((s) => [s.value, s.label]),
)
const currencyItems: Record<string, string> = Object.fromEntries(
  CURRENCIES.map((c) => [c.value, c.label]),
)
const syncModeItems: Record<string, string> = Object.fromEntries(
  SYNC_MODES.map((m) => [m.value, m.label]),
)

export function ProductDialog({ open, onOpenChange, product, onSave }: Props) {
  const [draft, setDraft] = useState<Product>(createEmptyProduct())
  const isEditing = Boolean(product)

  useEffect(() => {
    if (open) {
      setDraft(product ? structuredClone(product) : createEmptyProduct())
    }
  }, [open, product])

  function patch(patch: Partial<Product>) {
    setDraft((d) => ({ ...d, ...patch }))
  }

  function patchChannel(id: ChannelId, value: Partial<Product["channels"][ChannelId]>) {
    setDraft((d) => ({
      ...d,
      channels: { ...d.channels, [id]: { ...d.channels[id], ...value } },
    }))
  }

  function addVariation() {
    const v: ProductVariation = {
      id: crypto.randomUUID(),
      color: "",
      size: "",
      price: draft.price,
      stock: 0,
    }
    patch({ variations: [...draft.variations, v] })
  }

  function updateVariation(id: string, value: Partial<ProductVariation>) {
    patch({
      variations: draft.variations.map((v) => (v.id === id ? { ...v, ...value } : v)),
    })
  }

  function removeVariation(id: string) {
    patch({ variations: draft.variations.filter((v) => v.id !== id) })
  }

  function handleSave() {
    onSave({
      ...draft,
      id: draft.id || crypto.randomUUID(),
      createdAt: draft.createdAt || new Date().toISOString(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{isEditing ? "Editar produto" : "Novo produto"}</DialogTitle>
          <DialogDescription>
            Configure as informações do produto e a distribuição entre os canais de venda.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b px-6">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-0 bg-transparent p-0">
              <TabsTrigger value="info" className="whitespace-nowrap">
                Informações
              </TabsTrigger>
              <TabsTrigger value="media" className="whitespace-nowrap">
                Imagens & Variações
              </TabsTrigger>
              <TabsTrigger value="pricing" className="whitespace-nowrap">
                Precificação & Estoque
              </TabsTrigger>
              <TabsTrigger value="channels" className="whitespace-nowrap">
                Canais de Venda
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <TabsContent value="info" className="mt-0">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nome do produto</FieldLabel>
                  <Input
                    id="name"
                    value={draft.name}
                    onChange={(e) => patch({ name: e.target.value })}
                    placeholder="Ex: Fone de Ouvido Wireless Pro"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="sku">SKU</FieldLabel>
                    <Input
                      id="sku"
                      value={draft.sku}
                      onChange={(e) => patch({ sku: e.target.value })}
                      placeholder="FON-WP-001"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="category">Categoria</FieldLabel>
                    <Select
                      items={categoryItems}
                      value={draft.category}
                      onValueChange={(v) => patch({ category: v as ProductCategory })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="short">Descrição curta</FieldLabel>
                  <Input
                    id="short"
                    value={draft.shortDescription}
                    onChange={(e) => patch({ shortDescription: e.target.value })}
                    placeholder="Resumo exibido nas listagens"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="long">Descrição completa</FieldLabel>
                  <Textarea
                    id="long"
                    rows={5}
                    value={draft.longDescription}
                    onChange={(e) => patch({ longDescription: e.target.value })}
                    placeholder="Descrição detalhada do produto, materiais, especificações..."
                  />
                  <FieldDescription>
                    Essa descrição é enviada para os canais que suportam texto rico.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select
                    items={statusItems}
                    value={draft.status}
                    onValueChange={(v) => patch({ status: v as ProductStatus })}
                  >
                    <SelectTrigger id="status" className="sm:w-60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="media" className="mt-0">
              <FieldGroup>
                <Field>
                  <FieldLabel>Imagens do produto</FieldLabel>
                  <div className="flex flex-wrap gap-3">
                    {draft.images.map((img) => (
                      <div
                        key={img.id}
                        className="group/img relative size-24 overflow-hidden rounded-lg border"
                      >
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={img.alt}
                          className="size-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            patch({ images: draft.images.filter((i) => i.id !== img.id) })
                          }
                          className="absolute top-1 right-1 rounded-full bg-background/90 p-0.5 text-foreground opacity-0 shadow transition-opacity group-hover/img:opacity-100"
                          aria-label="Remover imagem"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          images: [
                            ...draft.images,
                            {
                              id: crypto.randomUUID(),
                              url: "/placeholder.svg?height=96&width=96",
                              alt: draft.name || "Nova imagem",
                            },
                          ],
                        })
                      }
                      className="flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <ImagePlus className="size-5" />
                      <span className="text-xs">Adicionar</span>
                    </button>
                  </div>
                  <FieldDescription>
                    A primeira imagem é usada como capa em todos os canais.
                  </FieldDescription>
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Variações</FieldLabel>
                    <Button type="button" variant="outline" size="sm" onClick={addVariation}>
                      <Plus data-icon="inline-start" />
                      Adicionar variação
                    </Button>
                  </div>

                  {draft.variations.length === 0 ? (
                    <div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                      Nenhuma variação cadastrada. Use variações para cor, tamanho e outras opções.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {draft.variations.map((v) => (
                        <div
                          key={v.id}
                          className="grid grid-cols-2 items-end gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
                        >
                          <Field>
                            <FieldLabel className="text-xs">Cor</FieldLabel>
                            <Input
                              value={v.color}
                              onChange={(e) => updateVariation(v.id, { color: e.target.value })}
                              placeholder="Preto"
                            />
                          </Field>
                          <Field>
                            <FieldLabel className="text-xs">Tamanho</FieldLabel>
                            <Input
                              value={v.size}
                              onChange={(e) => updateVariation(v.id, { size: e.target.value })}
                              placeholder="M"
                            />
                          </Field>
                          <Field>
                            <FieldLabel className="text-xs">Preço</FieldLabel>
                            <Input
                              type="number"
                              value={v.price || ""}
                              onChange={(e) =>
                                updateVariation(v.id, { price: Number(e.target.value) })
                              }
                            />
                          </Field>
                          <Field>
                            <FieldLabel className="text-xs">Estoque</FieldLabel>
                            <Input
                              type="number"
                              value={v.stock || ""}
                              onChange={(e) =>
                                updateVariation(v.id, { stock: Number(e.target.value) })
                              }
                            />
                          </Field>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-9 text-muted-foreground hover:text-destructive"
                            onClick={() => removeVariation(v.id)}
                          >
                            <Trash2 />
                            <span className="sr-only">Remover variação</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="pricing" className="mt-0">
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="price">Preço base</FieldLabel>
                    <Input
                      id="price"
                      type="number"
                      value={draft.price || ""}
                      onChange={(e) => patch({ price: Number(e.target.value) })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="promo">Preço promocional</FieldLabel>
                    <Input
                      id="promo"
                      type="number"
                      value={draft.promoPrice ?? ""}
                      onChange={(e) =>
                        patch({
                          promoPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="currency">Moeda</FieldLabel>
                    <Select
                      items={currencyItems}
                      value={draft.currency}
                      onValueChange={(v) => patch({ currency: v as string })}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="stock">Estoque total</FieldLabel>
                  <Input
                    id="stock"
                    type="number"
                    className="sm:w-60"
                    value={draft.stock || ""}
                    onChange={(e) => patch({ stock: Number(e.target.value) })}
                  />
                  <FieldDescription>Quantidade disponível para venda.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Logística</FieldLabel>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <Field>
                      <FieldLabel htmlFor="weight" className="text-xs">
                        Peso (kg)
                      </FieldLabel>
                      <Input
                        id="weight"
                        type="number"
                        value={draft.weight || ""}
                        onChange={(e) => patch({ weight: Number(e.target.value) })}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="len" className="text-xs">
                        Comp. (cm)
                      </FieldLabel>
                      <Input
                        id="len"
                        type="number"
                        value={draft.dimensions.length || ""}
                        onChange={(e) =>
                          patch({
                            dimensions: { ...draft.dimensions, length: Number(e.target.value) },
                          })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="wid" className="text-xs">
                        Larg. (cm)
                      </FieldLabel>
                      <Input
                        id="wid"
                        type="number"
                        value={draft.dimensions.width || ""}
                        onChange={(e) =>
                          patch({
                            dimensions: { ...draft.dimensions, width: Number(e.target.value) },
                          })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="hei" className="text-xs">
                        Alt. (cm)
                      </FieldLabel>
                      <Input
                        id="hei"
                        type="number"
                        value={draft.dimensions.height || ""}
                        onChange={(e) =>
                          patch({
                            dimensions: { ...draft.dimensions, height: Number(e.target.value) },
                          })
                        }
                      />
                    </Field>
                  </div>
                </Field>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="channels" className="mt-0">
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Ative os canais onde este produto deve ser publicado e defina como a
                  sincronização deve funcionar em cada um.
                </p>
                {CHANNELS.map((channel) => {
                  const config = draft.channels[channel.id]
                  return (
                    <div
                      key={channel.id}
                      className={cn(
                        "rounded-lg border p-4 transition-colors",
                        config.enabled && "border-primary/40 bg-accent/40",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{channelLabel(channel.id)}</p>
                          <p className="text-xs text-muted-foreground">
                            {config.enabled
                              ? "Produto publicado neste canal"
                              : "Canal desativado"}
                          </p>
                        </div>
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(checked) =>
                            patchChannel(channel.id, { enabled: checked })
                          }
                          aria-label={`Ativar ${channelLabel(channel.id)}`}
                        />
                      </div>

                      {config.enabled && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <Field>
                            <FieldLabel className="text-xs">Modo de sincronização</FieldLabel>
                            <Select
                              items={syncModeItems}
                              value={config.syncMode}
                              onValueChange={(v) =>
                                patchChannel(channel.id, { syncMode: v as SyncMode })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {SYNC_MODES.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                      {m.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field>
                            <FieldLabel className="text-xs">Categoria no canal</FieldLabel>
                            <Input
                              value={config.mappedCategory}
                              onChange={(e) =>
                                patchChannel(channel.id, { mappedCategory: e.target.value })
                              }
                              placeholder="Ex: Eletrônicos > Áudio"
                            />
                          </Field>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </div>

          <DialogFooter className="mx-0 mb-0 items-center border-t px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!draft.name.trim() || !draft.sku.trim()}>
              {isEditing ? "Salvar alterações" : "Criar produto"}
            </Button>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
