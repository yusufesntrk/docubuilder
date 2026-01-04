# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: DocuBuilder

PandaDoc-ähnlicher Dokumenten-Builder als UI Shell.

## Tech Stack

- **React 18** mit TypeScript
- **Vite** als Build-Tool
- **Tailwind CSS v4** für Styling
- **React Router** für Navigation
- **Lucide Icons** für Icons

## Commands

```bash
npm run dev      # Startet Dev-Server auf localhost:5173
npm run build    # Build für Production
npm run preview  # Preview des Production-Builds
```

## Projektstruktur

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx    # Collapsible Navigation
│   │   └── Layout.tsx     # Haupt-Layout mit Outlet
│   └── pages/
│       ├── Home.tsx       # Dashboard
│       ├── Documents.tsx  # Dokumentenliste
│       ├── Templates.tsx  # Vorlagen
│       ├── Contacts.tsx   # Kontakte
│       └── Editor.tsx     # Dokument-Editor
├── App.tsx                # Routes-Definition
├── main.tsx              # Entry Point
└── index.css             # Tailwind + Custom Theme
```

## Design System

Farben (definiert in `src/index.css`):
- `primary`: #248567 (Grün)
- `primary-hover`: #1d6b53
- `text-main`: #2f2f2f
- `text-secondary`: #6b7280

## Routes

- `/` - Home/Dashboard
- `/documents` - Dokumentenliste
- `/templates` - Vorlagen
- `/contacts` - Kontakte
- `/editor/:id?` - Editor
