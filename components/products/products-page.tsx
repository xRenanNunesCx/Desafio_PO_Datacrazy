"use client"

import { useMemo, useState } from "react"
import { Boxes, Download, MoreVertical, PackageX, Plus, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { MOCK_PRODUCTS, type ChannelId, type Product } from "@/lib/products"
import { ProductDialog } from "./product-dialog"
import { ProductsTable } from "./products-table"
import { ProductsToolbar, type Filters } from "./products-toolbar"

const PAGE_SIZE = 5

const initialFilters: Filters = {
  search: "",
  category: "all",
  channel: "all",
  status: "all",
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) {
        return false
      }
      if (filters.category !== "all" && p.category !== filters.category) return false
      if (filters.status !== "all" && p.status !== filters.status) return false
      if (filters.channel !== "all" && !p.channels[filters.channel as ChannelId]?.enabled) {
        return false
      }
      return true
    })
  }, [products, filters])

  const total = filtered.length
  const pageCount = Math.ceil(total / PAGE_SIZE)
  const currentPage = Math.min(page, Math.max(pageCount, 1))
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, total)

  const activeFilters = filters.search !== "" || filters.category !== "all" || filters.channel !== "all" || filters.status !== "all"

  function updateFilters(patch: Partial<Filters>) {
    setFilters((f) => ({ ...f, ...patch }))
    setPage(1)
  }

  function openNew() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setDialogOpen(true)
  }

  function handleSave(product: Product) {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev]
    })
    setDialogOpen(false)
  }

  function confirmDelete() {
    if (!deleting) return
    setProducts((prev) => prev.filter((p) => p.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Boxes className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Produtos</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie seus produtos com facilidade.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openNew}>
            <Plus data-icon="inline-start" />
            Novo produto
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon">
                  <MoreVertical />
                  <span className="sr-only">Principais ações</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Upload />
                  Importar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download />
                  Exportar
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ProductsToolbar filters={filters} onChange={updateFilters} />

      {total === 0 ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageX />
            </EmptyMedia>
            <EmptyTitle>Nenhum produto encontrado</EmptyTitle>
            <EmptyDescription>
              {activeFilters
                ? "Nenhum produto corresponde aos filtros aplicados. Ajuste a busca e tente novamente."
                : "Comece cadastrando seu primeiro produto para distribuí-lo nos canais de venda."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {activeFilters ? (
              <Button variant="outline" onClick={() => updateFilters(initialFilters)}>
                Limpar filtros
              </Button>
            ) : (
              <Button onClick={openNew}>
                <Plus data-icon="inline-start" />
                Novo produto
              </Button>
            )}
          </EmptyContent>
        </Empty>
      ) : (
        <ProductsTable
          products={paged}
          page={currentPage}
          pageCount={pageCount}
          total={total}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onPageChange={setPage}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
        onSave={handleSave}
      />

      <Dialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <span className="font-medium text-foreground">{deleting?.name}</span>? Essa ação
              não pode ser desfeita e o produto será removido de todos os canais.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">Cancelar</Button>}
            />
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
