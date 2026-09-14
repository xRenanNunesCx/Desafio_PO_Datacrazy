import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  type ChannelId,
  type ProductStatus,
  type SyncStatus,
  channelLabel,
  statusLabel,
} from "@/lib/products"

const channelStyles: Record<ChannelId, string> = {
  tiktok:
    "border-transparent bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
  shopify:
    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  mercadolivre:
    "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
}

export function ChannelBadge({ id }: { id: ChannelId }) {
  return (
    <Badge className={cn("font-medium", channelStyles[id])}>
      {channelLabel(id)}
    </Badge>
  )
}

const statusStyles: Record<ProductStatus, string> = {
  ativo:
    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  rascunho:
    "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  inativo:
    "border-transparent bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
}

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge className={cn("font-medium", statusStyles[status])}>
      <span
        className={cn(
          "mr-1 inline-block size-1.5 rounded-full",
          status === "ativo" && "bg-emerald-500",
          status === "rascunho" && "bg-amber-500",
          status === "inativo" && "bg-neutral-400",
        )}
      />
      {statusLabel(status)}
    </Badge>
  )
}

const syncStyles: Record<SyncStatus, { label: string; className: string; dot: string }> = {
  synced: {
    label: "Sincronizado",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  error: {
    label: "Erro",
    className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    dot: "bg-red-500",
  },
}

export function SyncStatusBadge({ status }: { status: SyncStatus }) {
  const s = syncStyles[status]
  return (
    <Badge className={cn("border-transparent font-medium", s.className)}>
      <span className={cn("mr-1 inline-block size-1.5 rounded-full", s.dot)} />
      {s.label}
    </Badge>
  )
}
