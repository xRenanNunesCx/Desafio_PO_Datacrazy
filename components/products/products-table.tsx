"use client"

import { MoreHorizontal, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CHANNELS, formatCurrency, formatDate, type Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { ChannelBadge, StatusBadge } from "./product-badges"

type Props = {
  products: Product[]
  page: number
  pageCount: number
  total: number
  rangeStart: number
  rangeEnd: number
  onPageChange: (page: number) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductsTable({
  products,
  page,
  pageCount,
  total,
  rangeStart,
  rangeEnd,
  onPageChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[64px]">Imagem</TableHead>
              <TableHead className="min-w-[200px]">Produto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead>Canais ativos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[48px] text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const activeChannels = CHANNELS.filter((c) => product.channels[c.id].enabled)
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.images[0]?.url || "/placeholder.svg?height=44&width=44&query=produto"}
                      alt={product.images[0]?.alt || product.name}
                      className="size-11 rounded-lg border object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{product.name}</span>
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {product.shortDescription}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      {product.promoPrice ? (
                        <>
                          <span className="font-medium">
                            {formatCurrency(product.promoPrice, product.currency)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatCurrency(product.price, product.currency)}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium">
                          {formatCurrency(product.price, product.currency)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        product.stock === 0 && "text-red-600 dark:text-red-400",
                      )}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {activeChannels.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {activeChannels.map((c) => (
                          <ChannelBadge key={c.id} id={c.id} />
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Nenhum</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={product.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(product.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal />
                            <span className="sr-only">Abrir ações</span>
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Pencil />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDelete(product)}
                          >
                            <Trash2 />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          {total === 0 ? (
            "Nenhum resultado"
          ) : (
            <>
              Mostrando <span className="font-medium text-foreground">{rangeStart}</span>–
              <span className="font-medium text-foreground">{rangeEnd}</span> de{" "}
              <span className="font-medium text-foreground">{total}</span> produtos
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft data-icon="inline-start" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {pageCount === 0 ? 0 : page} de {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
          >
            Próxima
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  )
}
