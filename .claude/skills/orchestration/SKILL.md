---
name: orchestration
description: |
  Feature-Entwicklung mit Connected Agent Chain orchestrieren.

  Triggers: "orchestrate", "implementiere Feature", "baue Feature", "entwickle Feature",
  "Agent-Chain", "Multi-Step Implementation", "Backend + Frontend", "DB + UI",
  "komplettes Feature", "End-to-End Feature".

  Use when implementing features that span backend, frontend, UI review, and testing.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash, Task, mcp__playwright__*, mcp__supabase__*
version: 2.0.0
---

# Feature Orchestration

Du bist der Hauptagent (Claude). **DU orchestrierst** - kein Subagent.

## Kernprinzip: Connected Agent Chain

```
NIEMALS:  Review → Report → STOPP ❌
IMMER:    Review → FAIL? → Fix → Re-Review → Loop bis PASS ✅
```

**Agents sind KEINE isolierten Tools!** Sie sind eine verbundene Kette mit Fix-Loops.

---

## Quick Reference

| Phase | Agent/Tool | Fix-Loop | Max Attempts |
|-------|------------|----------|--------------|
| 0 | **Planning-Agent** | - | Plan + User-Approval |
| 1 | Backend | ✅ | 3 |
| 2 | Frontend | ✅ | 3 |
| 3 | UI Review | ✅ | 3 |
| 3.5 | Design Review | ✅ | 3 |
| 4 | Tests | ✅ | 3 |
| 5 | **QA + User Journey** | ✅ | Loop bis PASS |
| 6 | **FEATURES.md Update** | - | Auto |
| 7 | Feedback | - | User Rating |

---

## ⚠️ Phase 0: Planning-Agent ist PFLICHT!

**Vor jeder Implementierung MUSS ein Plan erstellt werden!**

```
/orchestrate "Feature X"
    ↓
1. Planning-Agent spawnen
    ↓
2. Agent analysiert Codebase
    ↓
3. Agent schreibt Plan in .claude/plans/PLAN.md
    ↓
4. DU präsentierst Plan → User-Approval
    ↓
5. Agent-Chain starten (Phase 1-6)
```

### Planning-Agent spawnen

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    @.claude/agents/planning-agent/AGENT.md

    Erstelle einen Plan für: [FEATURE]
```

**Detaillierte Anleitung:** [PHASES.md#phase-0](PHASES.md#phase-0-planning-agent-pflicht)

---

## ⚠️ User Journey Testing (PFLICHT!)

**Bei jedem Feature mit Interaktionen (Popups, Modals, Buttons):**

```
1. User Journey definieren:
   - Welche Klicks macht der User?
   - Was öffnet sich danach?

2. Journey durchspielen:
   - Navigate → Screenshot
   - Click → Screenshot
   - Fill → Screenshot
   - Submit → Screenshot

3. JEDEN Screenshot prüfen:
   - Text-Overflow?
   - Layout broken?
   - Buttons abgeschnitten?

4. Mobile wiederholen!
```

**Siehe:** [PHASES.md#phase-5](PHASES.md#phase-5-final-qa-mit-user-journey-testing)

---

## ⚠️ End-to-End Verification (PFLICHT!)

**UI success ≠ Backend success. Both must pass.**

### Before marking complete, run this verification:

```bash
# 1. UI Action ausführen
mcp__playwright__playwright_click → Button/Form

# 2. Console prüfen
mcp__playwright__playwright_console_logs → Errors?

# 3. Backend verifizieren (KRITISCH!)
mcp__supabase__execute_sql: "SELECT * FROM [table] ORDER BY created_at DESC LIMIT 1"
mcp__supabase__get_logs: service="edge-function" → Function aufgerufen?

# 4. Ergebnis bestätigen
# - Email: User fragen oder Resend Dashboard
# - DB: Row existiert mit korrekten Werten
# - File: Storage prüfen
```

### Real Example (aus dieser Session):

```
❌ FALSCH:
   1. TenantDetail UI gebaut
   2. Screenshot gemacht → "sieht gut aus"
   3. "Fertig" gesagt
   → User: "Einladung kam nicht an"

✅ RICHTIG:
   1. TenantDetail UI gebaut
   2. "Einladen" geklickt → Console Logs geprüft
   3. Hook Code gelesen → sah: nur DB Insert, keine Edge Function!
   4. Fix: Edge Function Call hinzugefügt
   5. Re-Test → Email versendet → Fertig
```

### Mandatory Checks bei Aktionen:

| Aktion | MUSS geprüft werden |
|--------|---------------------|
| Form Submit | DB-Eintrag + API Response |
| Email senden | Edge Function Logs + DB |
| File Upload | Storage Bucket |
| User erstellen | Auth + Profile + Roles |

**Wenn du einen Hook/Service nutzt → LIES den Code. Nicht annehmen dass er funktioniert.**

---

## Agent-Chain Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                 DU (Claude = Orchestrator)                  │
│                                                             │
│  Phase 0: Plan erstellen → User-Approval                   │
│  Phase 1: Backend → Fix-Loop                                │
│  Phase 2: Frontend → Fix-Loop                               │
│  Phase 3: UI Review → Fix-Loop                              │
│  Phase 3.5: Design Review → Fix                             │
│  Phase 4: Tests → Fix-Loop                                  │
│  Phase 5: Final QA                                          │
│  Phase 6: FEATURES.md aktualisieren                        │
│  Phase 7: Feedback sammeln → Learnings speichern           │
└─────────────────────────────────────────────────────────────┘
```

**Detaillierte Phase-Beschreibungen:** [PHASES.md](PHASES.md)

---

## Kritische Regeln

1. **NUR `general-purpose`** als subagent_type - keine custom Agent-Namen!
2. **DU (Hauptagent) machst Screenshots** mit Playwright MCP - Subagenten erben MCP-Tools automatisch
3. **Fix-Loops sind PFLICHT** - max 3 Versuche pro Phase
4. **Warte auf Results** bevor nächste Phase startet
5. **Subagenten spawnen NICHTS** - nur du koordinierst

**Fix-Loop Logik:** [FIX-LOOPS.md](FIX-LOOPS.md)

---

## UI Review vs Design Review

**Beide Phasen sind PFLICHT!** Sie prüfen unterschiedliche Aspekte:

| Aspekt | Phase 3: UI Review | Phase 3.5: Design Review |
|--------|-------------------|-------------------------|
| **Fokus** | Code-Patterns | Visuelle Konsistenz |
| **Prüft** | shadcn/ui Compliance, Props, Types | Alignment, Spacing, Responsive |
| **Checks** | Icon-Größen, Theme-Colors, Component-Struktur | Card-Höhen, Grid vs Scroll, Mobile |
| **Agent-Referenz** | - | `@.claude/agents/design-review-agent/AGENT.md` |

### Design Review Code-Checks (kritisch!)

```bash
# 1. Card Alignment - h-full ohne flex-col = FAIL
grep -rn "h-full" src/components/ | grep -v "flex-col"

# 2. Hover Scale - verboten bei Cards in Grids!
grep -rn "hover:scale" src/components/

# 3. Grid vs Scroll - ≤4 Items brauchen lg:grid
grep -rn "overflow-x-auto" src/components/

# 4. Responsive - jede Komponente braucht md:/lg:
grep -rL "md:\|lg:" src/components/*.tsx

# 5. Magic Numbers - feste Höhen müssen begründet sein
grep -rn "h-\[.*px\]" src/components/
```

### Design Review Screenshots (PFLICHT!)

```
1. Desktop Screenshot: mcp__playwright__playwright_screenshot
2. Mobile Screenshot: playwright_resize(device: "iPhone SE") → screenshot
3. BEIDE Screenshots visuell analysieren
```

**Detaillierte Anleitung:** [PHASES.md#phase-35](PHASES.md#phase-35-design-review--auto-fix)

---

## Phase 6: FEATURES.md Dokumentation (PFLICHT!)

**Nach erfolgreicher Implementierung MUSS FEATURES.md aktualisiert werden.**

### Workflow

```
1. Grep nach existierendem Feature-Eintrag:
   Grep: "Feature Name" path="FEATURES.md"

2a. Falls EXISTIERT → Status aktualisieren:
    - [ ] Feature Name  →  - [x] Feature Name

2b. Falls NICHT EXISTIERT → Neuen Eintrag hinzufügen:
    - Passende Phase/Sektion finden
    - Eintrag mit [x] (implementiert) hinzufügen
```

### Regeln

| Situation | Aktion |
|-----------|--------|
| Feature existiert als `[ ]` | Zu `[x]` ändern |
| Feature existiert nicht | In passender Phase hinzufügen |
| Neue Phase nötig | Phase mit Header anlegen |
| Teilweise implementiert | Sub-Items mit `[x]` / `[ ]` mischen |

### Beispiel-Eintrag

```markdown
### 4.3 Neues Feature ✅
- [x] Backend Migration + RLS
- [x] React Hook (useFeature)
- [x] UI Komponente
- [x] E2E Tests
```

**NICHT vergessen:** Phase-Header mit ✅ markieren wenn alle Items erledigt!

---

## Output Format (Final)

```markdown
## ORCHESTRATION COMPLETE

### Feature: [Name]
### Status: ✅ SUCCESS | ⚠️ PARTIAL | ❌ FAILED

### Erstellte Dateien:
- supabase/migrations/[date]_[feature].sql
- src/hooks/use[Feature].ts
- src/components/[feature]/[Component].tsx
- tests/[feature].spec.ts

### Agent-Chain:
1. ✅ Backend - PASS (0 loops)
2. ✅ Frontend - PASS (1 loop)
3. ✅ UI Review - PASS (2 loops)
3.5. ✅ Design Review - PASS (0 loops)
4. ✅ Tests - 4/4 passed
5. ✅ QA - PASS
6. ✅ FEATURES.md - Updated
7. ✅ Feedback - ⭐⭐⭐⭐⭐ (5/5)
```

---

## Multi-Feature Modus

Bei 2+ unabhängigen Features parallel mit `run_in_background: true`.

**Nur parallel wenn Features KEINE gemeinsamen Dateien ändern!**

**Detaillierte Anleitung:** [MULTI-FEATURE.md](MULTI-FEATURE.md)

---

## NIEMALS

- ❌ Review machen und bei FAIL stoppen ohne Fix
- ❌ `subagent_type: "backend-agent"` (existiert nicht!)
- ❌ Subagent spawnen der andere Subagenten spawnt
- ❌ Tests überspringen
- ❌ "PASS" ohne Re-Validierung nach Fix

## IMMER

- ✅ Bei FAIL → Auto-Fix → Re-Validate → Loop
- ✅ Max 3 Loops pro Phase
- ✅ DU machst Screenshots mit Playwright MCP (Subagenten erben MCP-Tools automatisch wenn tools: weggelassen)
- ✅ Auf Subagent-Results warten
- ✅ Klares Output-Format mit fix_loop_count
