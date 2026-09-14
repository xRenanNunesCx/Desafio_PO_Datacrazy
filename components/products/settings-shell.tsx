import type { ReactNode } from "react"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"

// Espelha a navegação real de Configurações do Datacrazy (confirmada em QA) —
// é onde a tela de Produtos vive hoje, então o protótipo reproduz esse contexto
// em vez de aparecer como uma página solta.
const SETTINGS_ITEMS = [
  "Meu perfil",
  "Planos e uso",
  "Empresa",
  "Membros",
  "Tags",
  "Produtos",
  "Motivos de perda",
  "Listas",
  "Campos adicionais",
  "Departamentos",
  "Horários de trabalho",
  "Tipos de atividades",
  "Integrações",
  "Conexões",
  "Servidor MCP",
  "Armazenamento",
  "Lixeira",
  "Notificações",
  "Execuções",
  "Parâmetros do sistema",
] as const

export function SettingsShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-56 shrink-0 border-r bg-background px-3 py-4 lg:flex lg:flex-col">
        <button
          type="button"
          className="mb-4 flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Configurações
        </button>
        <nav className="flex flex-col gap-0.5">
          {SETTINGS_ITEMS.map((item) => {
            const active = item === "Produtos"
            return (
              <span
                key={item}
                className={cn(
                  "cursor-default rounded-md px-2 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item}
              </span>
            )
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
