"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORIES, CHANNELS, STATUSES } from "@/lib/products"

export type Filters = {
  search: string
  category: string
  channel: string
  status: string
}

type Props = {
  filters: Filters
  onChange: (patch: Partial<Filters>) => void
}

const categoryItems: Record<string, string> = {
  all: "Todas as categorias",
  ...Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label])),
}
const channelItems: Record<string, string> = {
  all: "Todos os canais",
  ...Object.fromEntries(CHANNELS.map((c) => [c.id, c.label])),
}
const statusItems: Record<string, string> = {
  all: "Todos os status",
  ...Object.fromEntries(STATUSES.map((s) => [s.value, s.label])),
}

export function ProductsToolbar({ filters, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Buscar por nome ou SKU"
          className="pl-9"
          aria-label="Buscar produtos"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          items={categoryItems}
          value={filters.category}
          onValueChange={(v) => onChange({ category: v as string })}
        >
          <SelectTrigger className="h-9 w-full min-w-40 sm:w-auto" aria-label="Filtrar por categoria">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          items={channelItems}
          value={filters.channel}
          onValueChange={(v) => onChange({ channel: v as string })}
        >
          <SelectTrigger className="h-9 w-full min-w-40 sm:w-auto" aria-label="Filtrar por canal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todos os canais</SelectItem>
              {CHANNELS.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          items={statusItems}
          value={filters.status}
          onValueChange={(v) => onChange({ status: v as string })}
        >
          <SelectTrigger className="h-9 w-full min-w-36 sm:w-auto" aria-label="Filtrar por status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todos os status</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
