import { FileText, LayoutTemplate, Users, Plus } from 'lucide-react'

export default function Home() {
  const quickActions = [
    { icon: FileText, label: 'Neues Dokument', description: 'Erstelle ein neues Dokument' },
    { icon: LayoutTemplate, label: 'Aus Vorlage', description: 'Starte mit einer Vorlage' },
    { icon: Users, label: 'Kontakt hinzufügen', description: 'Füge einen neuen Kontakt hinzu' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Willkommen zurück</h1>
        <p className="text-text-secondary mt-1">Was möchtest du heute erstellen?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-sm transition-all text-left"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-text-main">{action.label}</h3>
                <p className="text-sm text-text-secondary">{action.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-text-main mb-4">Letzte Dokumente</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-text-secondary mb-4">Noch keine Dokumente vorhanden</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <Plus className="w-4 h-4" />
            Erstes Dokument erstellen
          </button>
        </div>
      </div>
    </div>
  )
}
