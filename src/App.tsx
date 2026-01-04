import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './components/pages/Home'
import Documents from './components/pages/Documents'
import Templates from './components/pages/Templates'
import Contacts from './components/pages/Contacts'
import Editor from './components/pages/Editor'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="documents" element={<Documents />} />
        <Route path="templates" element={<Templates />} />
        <Route path="templates/gallery" element={<Templates />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="editor/:id?" element={<Editor />} />
        {/* Placeholder routes */}
        <Route path="payments" element={<PlaceholderPage title="Zahlungen" />} />
        <Route path="catalog" element={<PlaceholderPage title="Katalog" />} />
        <Route path="forms" element={<PlaceholderPage title="Formulare" />} />
        <Route path="automations" element={<PlaceholderPage title="Automatisierungen" />} />
        <Route path="reports" element={<PlaceholderPage title="Berichte" />} />
        <Route path="developer" element={<PlaceholderPage title="Entwickler-Center" />} />
        <Route path="extensions" element={<PlaceholderPage title="Erweiterungen" />} />
        <Route path="discover" element={<PlaceholderPage title="Entdecken" />} />
        <Route path="invite" element={<PlaceholderPage title="Benutzer einladen" />} />
        <Route path="settings" element={<PlaceholderPage title="Einstellungen" />} />
      </Route>
    </Routes>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-main mb-4">{title}</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-text-secondary">
        Diese Seite ist noch in Entwicklung.
      </div>
    </div>
  )
}

export default App
