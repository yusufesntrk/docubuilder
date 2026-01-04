# Orchestration Phases - Detailed Reference

## Phase 0: Planning-Agent (PFLICHT!)

**⚠️ KRITISCH: IMMER mit Planning-Agent starten!**

### Warum ein Planning-Agent?

| Problem ohne Planung | Lösung mit Planning-Agent |
|----------------------|---------------------------|
| Blindes Implementieren | Strukturierte Analyse |
| Falsche Annahmen | Codebase-basierte Entscheidungen |
| Rework nötig | User-Approval vor Arbeit |
| Context-Verlust | Plan als Referenz |

### Schritt 1: Planning-Agent spawnen

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    @.claude/agents/planning-agent/AGENT.md

    Erstelle einen Plan für: [FEATURE BESCHREIBUNG]
```

### Was der Planning-Agent macht

1. **Codebase analysieren** (Glob, Grep, Read)
2. **Patterns identifizieren** (bestehende Hooks, Components, DB Schema)
3. **Plan schreiben** in `.claude/plans/PLAN.md`
4. **Zusammenfassung zurückgeben**

### Schritt 2: Plan dem User präsentieren

Nach Agent-Rückkehr:

```markdown
## PLAN für [Feature]

[Plan aus .claude/plans/PLAN.md zeigen]

**Soll ich mit der Implementierung starten?**
```

### Schritt 3: User-Approval abwarten

**NICHT weitermachen ohne explizites "Ja" vom User!**

### Schritt 4: Dev-Server prüfen (nach Approval)

```bash
lsof -i :5173 | grep LISTEN
```
Falls nicht läuft: `npm run dev` im Hintergrund starten.

### Dann: Weiter mit Phase 1

---

### Plan-Datei Struktur

Der Planning-Agent erstellt `.claude/plans/PLAN.md`:

```markdown
# PLAN: [Feature Name]

## Summary
[1-2 Sätze]

## Analysis
- Existing Patterns Found
- Files to Create
- Files to Modify

## Implementation Plan
- Phase 1: Backend
- Phase 2: Frontend
- Phase 3-5: Review & Tests

## Architecture Decisions
## Risks & Considerations
## Estimated Scope
```

---

## Phase 1: Backend

### Backend Agent spawnen

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der Backend Agent.

    ## Aufgabe
    Erstelle Datenbank-Infrastruktur für: [FEATURE]

    ## Was erstellen
    - Migration in supabase/migrations/
    - RLS Policies (tenant_id Isolation!)
    - Hook in src/hooks/use[Feature].ts

    ## Regeln
    - IMMER tenant_id Column
    - IMMER RLS aktivieren
    - IMMER ?? [] Fallback in Hooks

    ## Output Format
    ### Status: ✅ SUCCESS | ❌ FAIL
    ### Erstellte Dateien: [liste]
    ### Probleme: [falls vorhanden]
```

### Bei FAIL → Fix-Loop
```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der Backend Fix Agent.
    ## Problem: [aus vorherigem Result]
    ## Aufgabe: Fixe das Problem.
```

---

## Phase 2: Frontend

### Frontend Agent spawnen

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der Frontend Agent.

    ## Aufgabe
    Erstelle React-Komponenten für: [FEATURE]

    ## Was erstellen
    - Component(s) in src/components/[feature]/
    - Integration in bestehende Page ODER neue Page

    ## Regeln
    - TypeScript Props typisieren
    - shadcn/ui Komponenten verwenden
    - Tailwind CSS (keine Inline-Styles)
    - Hook von Phase 1 verwenden

    ## Output Format
    ### Status: ✅ SUCCESS | ❌ FAIL
    ### Erstellte Dateien: [liste]
    ### Probleme: [falls vorhanden]
```

---

## Phase 3: UI Review + Auto-Fix

### Schritt 1: UI Review Agent spawnen

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der UI Review Agent.

    ## Aufgabe
    1. Navigiere zu http://localhost:5173/[route] (headless: true)
    2. Mache Screenshot mit Playwright MCP:
       - mcp__playwright__playwright_navigate
       - mcp__playwright__playwright_screenshot (downloadsDir: ".screenshots", savePng: true)
    3. Analysiere den Screenshot
    4. Prüfe Code-Patterns

    ## Prüfe
    - Text-Vollständigkeit (nichts abgeschnitten?)
    - Layout & Alignment
    - Spacing-Konsistenz
    - Keine hover:scale-* bei Cards
    - Korrekte Icon-Größen (h-4 w-4)

    ## Output Format
    ### Status: ✅ PASS | ❌ FAIL
    ### Issues (wenn FAIL):
    - file: [path]
    - line: [number]
    - problem: [beschreibung]
    - fix: [lösung]
```

### Schritt 2: Bei FAIL → Auto-Fix

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der UI Fix Agent.
    ## Issues zu fixen: [aus Review]
    Fixe JEDEN Issue mit Edit-Tool.
```

### Schritt 3: Re-Review Agent spawnen → Loop (max 3x)

---

## Phase 3.5: Design Review + Auto-Fix

**Unterschied zu Phase 3 (UI Review):**
- UI Review → Component Patterns (shadcn, Props, Types)
- Design Review → Visuelle Konsistenz (Alignment, Spacing, Responsive)

### Schritt 1: Design Review Agent spawnen

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der Design Review Agent.

    @.claude/agents/design-review-agent/AGENT.md

    ## Feature: [NAME]
    ## Route: http://localhost:5173/[ROUTE]

    ## Aufgabe
    1. Navigiere zur Route (headless: true)
    2. Mache Screenshot:
       - mcp__playwright__playwright_navigate
       - mcp__playwright__playwright_screenshot (downloadsDir: ".screenshots", savePng: true)
    3. Mobile Screenshot:
       - mcp__playwright__playwright_resize (device: "iPhone SE")
       - mcp__playwright__playwright_screenshot (name: "design-mobile")
    4. Analysiere BEIDE Screenshots
    5. Code-Audit durchführen

    ## VISUELLE CHECKS (Screenshots)
    - Text-Vollständigkeit (Truncation? Abgeschnitten?)
    - Card-Höhen konsistent in Grid-Reihen?
    - Footer-Elemente auf gleicher Höhe?
    - Layout-Alignment korrekt?
    - Mobile: Kein Horizontal-Overflow?

    ## CODE-CHECKS (kritisch!)

    ### 1. Card Alignment
    grep -rn "h-full" [component-path] | grep -v "flex-col"
    → Alle Cards brauchen flex-col + mt-auto für Footer

    ### 2. Hover Scale (verboten bei Cards in Grids!)
    grep -rn "hover:scale" [component-path]
    → Ersetzen durch hover:border-primary/30 hover:shadow-lg

    ### 3. Grid vs Scroll
    - ≤4 Items → Grid auf Desktop (lg:grid lg:grid-cols-X)
    - >4 Items → Scroll OK
    - Scroll-Dots brauchen lg:hidden!

    ### 4. Responsive Breakpoints
    grep -rL "md:\|lg:" [component-path]
    → Jede Komponente MUSS responsive Prefixes haben

    ### 5. Magic Numbers
    grep -rn "h-\[.*px\]\|w-\[.*px\]" [component-path]
    → Feste Höhen müssen berechnet/begründet sein

    ## Output Format
    ### Status: ✅ PASS | ❌ FAIL

    ### Visual Issues (wenn FAIL):
    | Problem | Screenshot | File:Line | Fix |
    |---------|------------|-----------|-----|
    | [was] | [name.png] | [path:ln] | [lösung] |

    ### Code Issues (wenn FAIL):
    | Check | File:Line | Problem | Fix |
    |-------|-----------|---------|-----|
    | Card Alignment | src/...:45 | Missing flex-col | Add flex flex-col |

    ### Mobile Status: ✅ PASS | ❌ FAIL
```

### Schritt 2: Bei FAIL → Auto-Fix

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der Design Fix Agent.

    ## Issues zu fixen:
    [Issues aus Review einfügen]

    ## Typische Fixes

    ### Card Alignment:
    <div className="h-full rounded-lg p-4">
    → <div className="h-full flex flex-col rounded-lg p-4">
    + mt-auto auf Footer-Element

    ### Hover Scale entfernen:
    hover:scale-[1.02]
    → hover:border-primary/30 hover:shadow-lg transition-all

    ### Grid auf Desktop:
    <div className="flex gap-4 overflow-x-auto">
    → <div className="flex gap-4 overflow-x-auto lg:grid lg:grid-cols-4 lg:overflow-visible">

    ### Scroll-Dots verstecken:
    <div className="flex justify-center gap-2">
    → <div className="flex justify-center gap-2 lg:hidden">

    ## Anweisung
    Fixe JEDEN Issue mit Edit-Tool.
    Nach allen Fixes: Build prüfen (npm run build)
```

### Schritt 3: Re-Screenshot + Re-Review → Loop (max 3x)

Nach Fixes MUSS neuer Screenshot gemacht werden um visuell zu verifizieren!

---

## Phase 4: Tests + Auto-Fix

### Test Agent spawnen

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der Test Agent.

    ## Aufgabe
    Erstelle E2E Test für: [FEATURE]
    Datei: tests/[feature].spec.ts

    ## Was testen
    - Feature ist sichtbar
    - CRUD Operationen
    - Error States

    ## Nach Erstellung
    Ausführen: npx playwright test tests/[feature].spec.ts --reporter=list

    ## Output Format
    ### Status: ✅ PASS | ❌ FAIL
    ### Tests: [liste mit status]
    ### Failures: [details wenn vorhanden]
```

### Bei Test-Failures → Auto-Fix → Re-Run (max 3x)

---

## Phase 5: Final QA mit User Journey Testing

**⚠️ KRITISCH: Nicht nur Initial-State testen!**

### Schritt 1: QA Agent spawnen (User Journey Testing)

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der QA Agent.

    ## Aufgabe
    Führe User Journey Testing für [FEATURE] durch.

    ## User Journey
    Feature: [NAME]
    Route: http://localhost:5173/[ROUTE]

    ## Schritt-für-Schritt mit Playwright MCP

    1. **Navigate + Screenshot:**
       - mcp__playwright__playwright_navigate (url, headless: true)
       - mcp__playwright__playwright_screenshot (name: "qa-step-1", downloadsDir: ".screenshots", savePng: true)

    2. **Interaktion + Screenshot:**
       - mcp__playwright__playwright_click (selector)
       - mcp__playwright__playwright_screenshot (name: "qa-step-2-after-click")

    3. **Console Logs prüfen:**
       - mcp__playwright__playwright_console_logs (type: "error")

    4. **Mobile Viewport testen:**
       - mcp__playwright__playwright_resize (device: "iPhone SE")
       - Gleiche Journey nochmal durchspielen
       - mcp__playwright__playwright_screenshot (name: "qa-mobile")

    ## Für JEDEN Screenshot prüfen
    - Text-Overflow? (Text über Container-Rand)
    - Buttons abgeschnitten?
    - Layout broken?
    - Console Errors?
    - Keine "undefined" oder "null" sichtbar?

    ## Output Format
    ### User Journey Tested:
    1. ✅ Navigate - OK
    2. ❌ Click Popup - TEXT OVERFLOW!

    ### Visual Issues:
    - Screenshot: qa-step-2-after-click.png
    - Problem: [Beschreibung]
    - Fix: [Lösung]

    ### Console Errors: [ja/nein + Details]
    ### Mobile Check: [PASS/FAIL]
    ### Status: ✅ PASS | ❌ FAIL
    ### fix_required: true/false
```

### Schritt 2: Bei FAIL → Fix → Re-Test Journey

Bei Problemen spawne Fix-Agent, dann QA-Agent erneut (macht neue Screenshots).

Bei Problemen → Zurück zur zuständigen Phase.

---

## Phase 6: FEATURES.md Dokumentation

**WICHTIG: Nach erfolgreicher Implementierung FEATURES.md aktualisieren!**

### Warum dokumentieren?

- Tracking des Projekt-Fortschritts
- Übersicht was implementiert ist
- Referenz für neue Team-Mitglieder
- Vermeidet Doppel-Implementierungen

### Schritt 1: Prüfe ob Feature existiert

```bash
Grep: "[Feature Name]" path="FEATURES.md"
```

### Schritt 2a: Falls existiert → Status ändern

```
- [ ] Feature Name  →  - [x] Feature Name
```

### Schritt 2b: Falls nicht existiert → Hinzufügen

1. Finde passende Phase/Sektion in FEATURES.md
2. Füge neuen Eintrag hinzu:

```markdown
### X.Y Feature Name ✅
- [x] Backend Migration + RLS
- [x] React Hook
- [x] UI Komponente
- [x] E2E Tests
```

### Regeln

| Situation | Aktion |
|-----------|--------|
| Alle Items einer Sektion erledigt | Header mit ✅ markieren |
| Nur Teil implementiert | Nur erledigte Items mit [x] |
| Neue Phase nötig | Phase mit fortlaufender Nummer anlegen |

### Output

```markdown
### FEATURES.md Updated
- Location: Phase X, Section Y
- Changes: [was hinzugefügt/geändert]
```

---

## Phase 7: Feedback sammeln

**WICHTIG: Diese Phase läuft IMMER am Ende!**

### Warum Feedback?

- Explizites statt implizites Learning
- Strukturierte Daten für `/improve-agents`
- Identifiziert welcher Agent Probleme verursachte

### Feedback Agent spawnen

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    Du bist der Feedback Agent.

    ## Kontext
    Feature: [NAME]
    Status: [SUCCESS/PARTIAL/FAILED]
    Agents: backend, frontend, ui-review, tests, qa
    Fix-Loops: Phase 3: 2, Phase 4: 1

    ## Aufgabe
    1. Frage User nach Zufriedenheit (1-5)
    2. Frage ob manuelle Fixes nötig waren
    3. Wenn ja: Was musste korrigiert werden?
    4. Logge in .claude/learnings/sessions.jsonl
    5. Bei Issues: Logge in corrections.jsonl
```

### Feedback Format

```json
{
  "ts": "2025-12-26T...",
  "type": "orchestration_feedback",
  "feature": "Tasks System",
  "rating": 4,
  "manual_fixes_needed": true,
  "issues": ["autoSave prop fehlte"],
  "agents_used": ["backend-agent", "frontend-agent"],
  "fix_loops": {"ui-review": 2}
}
```

### Output

```markdown
## FEEDBACK COLLECTED

### Rating: ⭐⭐⭐⭐ (4/5)
### Manual Fixes: Ja (1 Issue)
### Logged: .claude/learnings/sessions.jsonl

Tipp: `/improve-agents` zeigt Verbesserungsvorschläge.
```
