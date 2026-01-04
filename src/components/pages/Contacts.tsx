import { Plus, Search, Users, Upload } from 'lucide-react'

export default function Contacts() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">Kontakte</h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Importieren
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <Plus className="w-4 h-4" />
            Kontakt hinzufügen
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Kontakte durchsuchen..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-text-main mb-2">Keine Kontakte</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Füge Kontakte hinzu um Dokumente schneller zu versenden und den Überblick zu behalten.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              Kontakte importieren
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
              <Plus className="w-4 h-4" />
              Kontakt hinzufügen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
