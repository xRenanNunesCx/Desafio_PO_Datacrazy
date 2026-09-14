import { ProductsPage } from "@/components/products/products-page"
import { SettingsShell } from "@/components/products/settings-shell"

export default function Page() {
  return (
    <SettingsShell>
      <main className="min-h-screen bg-muted/30">
        <ProductsPage />
      </main>
    </SettingsShell>
  )
}
