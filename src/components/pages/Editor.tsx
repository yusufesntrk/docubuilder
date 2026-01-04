import { useParams } from 'react-router-dom'
import { Save, Share, Download, MoreHorizontal, Type, Image, Table, Signature } from 'lucide-react'

export default function Editor() {
  const { id } = useParams()

  const tools = [
    { icon: Type, label: 'Text' },
    { icon: Image, label: 'Bild' },
    { icon: Table, label: 'Tabelle' },
    { icon: Signature, label: 'Signatur' },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <input
            type="text"
            defaultValue={id ? `Dokument ${id}` : 'Unbenanntes Dokument'}
            className="text-lg font-medium text-text-main bg-transparent border-none focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-5 h-5 text-text-secondary" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Share className="w-4 h-4" />
            Teilen
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <Save className="w-4 h-4" />
            Speichern
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Tools Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 py-4">
          <div className="space-y-2 px-2">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.label}
                  className="w-full p-3 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center gap-1"
                  title={tool.label}
                >
                  <Icon className="w-5 h-5 text-text-secondary" />
                  <span className="text-xs text-text-secondary">{tool.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm min-h-[800px] p-12">
            <div className="text-center text-text-secondary py-32">
              <p className="text-lg mb-2">Editor-Bereich</p>
              <p className="text-sm">Hier wird das Dokument bearbeitet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
