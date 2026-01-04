import { Plus, Search, LayoutTemplate } from 'lucide-react'

export default function Templates() {
  const templateCategories = [
    { name: 'Verträge', count: 0 },
    { name: 'Angebote', count: 0 },
    { name: 'Rechnungen', count: 0 },
    { name: 'Briefe', count: 0 },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">Vorlagen</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
          <Plus className="w-4 h-4" />
          Neue Vorlage
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Vorlagen durchsuchen..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {templateCategories.map((category) => (
          <button
            key={category.name}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-sm transition-all text-left"
          >
            <h3 className="font-medium text-text-main">{category.name}</h3>
            <p className="text-sm text-text-secondary">{category.count} Vorlagen</p>
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutTemplate className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-text-main mb-2">Keine Vorlagen</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Erstelle Vorlagen um Dokumente schneller zu erstellen und einen einheitlichen Look zu gewährleisten.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <Plus className="w-4 h-4" />
            Erste Vorlage erstellen
          </button>
        </div>
      </div>
    </div>
  )
}
