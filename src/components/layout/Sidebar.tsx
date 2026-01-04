import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Plus,
  Home,
  FileText,
  LayoutTemplate,
  Users,
  DollarSign,
  ShoppingBag,
  FileSpreadsheet,
  Zap,
  BarChart3,
  Code2,
  Puzzle,
  GraduationCap,
  UserPlus,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'

interface NavItem {
  icon: React.ElementType
  label: string
  path?: string
  children?: { label: string; path: string }[]
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: FileText, label: 'Dokumente', path: '/documents' },
  {
    icon: LayoutTemplate,
    label: 'Vorlagen',
    path: '/templates',
    children: [
      { label: 'Meine Vorlagen', path: '/templates' },
      { label: 'Vorlagen-Galerie', path: '/templates/gallery' },
    ],
  },
  { icon: Users, label: 'Kontakte', path: '/contacts' },
]

const secondaryNavItems: NavItem[] = [
  { icon: DollarSign, label: 'Zahlungen', path: '/payments' },
  { icon: ShoppingBag, label: 'Katalog', path: '/catalog' },
  { icon: FileSpreadsheet, label: 'Formulare', path: '/forms' },
  { icon: Zap, label: 'Automatisierungen', path: '/automations' },
  { icon: BarChart3, label: 'Berichte', path: '/reports' },
  { icon: Code2, label: 'Entwickler-Center', path: '/developer' },
  { icon: Puzzle, label: 'Erweiterungen', path: '/extensions' },
]

const footerNavItems: NavItem[] = [
  { icon: GraduationCap, label: 'Entdecken', path: '/discover' },
  { icon: UserPlus, label: 'Benutzer einladen', path: '/invite' },
  { icon: Settings, label: 'Einstellungen', path: '/settings' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    )
  }

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.label)

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpand(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-main hover:bg-gray-100 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium">
                  {item.label}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </>
            )}
          </button>
          {!collapsed && isExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children?.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-text-secondary hover:bg-gray-100'
                    }`
                  }
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <NavLink
        key={item.path}
        to={item.path!}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            collapsed ? 'justify-center' : ''
          } ${
            isActive
              ? 'text-primary bg-primary/10'
              : 'text-text-main hover:bg-gray-100'
          }`
        }
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && (
          <span className="text-sm font-medium">{item.label}</span>
        )}
      </NavLink>
    )
  }

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-text-main">DocuBuilder</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <PanelLeft className="w-5 h-5 text-text-secondary" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-text-secondary" />
          )}
        </button>
      </div>

      {/* Create Button */}
      <div className="p-3">
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Neu erstellen...</span>}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {mainNavItems.map(renderNavItem)}
        </div>

        <div className="border-t border-gray-200 my-4" />

        <div className="space-y-1">
          {secondaryNavItems.map(renderNavItem)}
        </div>
      </nav>

      {/* Footer Navigation */}
      <div className="border-t border-gray-200 p-3">
        <div className="space-y-1">
          {footerNavItems.map(renderNavItem)}
        </div>
      </div>
    </aside>
  )
}
