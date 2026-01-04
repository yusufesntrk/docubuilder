---
allowed-tools: Read, Write, Edit, Grep, Glob, Bash, Task, mcp__playwright__*, mcp__supabase__*
argument-hint: [feature-description]
description: Orchestriere Feature-Implementierung mit Connected Agent Chain
---

# Feature Orchestration: $ARGUMENTS

**DU bist der Orchestrator.** Kein Subagent. DU koordinierst die gesamte Agent-Chain.

## ⚠️ ERSTER SCHRITT: Planning-Agent spawnen!

**BEVOR du irgendetwas implementierst - spawne den Planning-Agent:**

```
Task:
  subagent_type: "general-purpose"
  prompt: |
    @.claude/agents/planning-agent/AGENT.md

    Erstelle einen Plan für: $ARGUMENTS
```

**Nach Agent-Rückkehr:**
1. Lies `.claude/plans/PLAN.md`
2. Zeige den Plan dem User
3. Warte auf User-Approval
4. Erst DANN mit Phase 1 starten

## Vollständiger Workflow

Befolge EXAKT die Anweisungen in diesem Skill:

@.claude/skills/orchestration/SKILL.md

## Kritische Regeln (NIEMALS verletzen!)

1. **Planning-Agent ZUERST** - Keine Implementierung ohne genehmigten Plan!

2. **Connected Chain** - KEIN Agent arbeitet isoliert!
   ```
   NIEMALS: Review → Report → STOPP ❌
   IMMER:   Review → FAIL? → Fix → Re-Review → Loop bis PASS ✅
   ```

3. **Nur `general-purpose`** als subagent_type - keine custom Agent-Namen!

4. **DU machst Screenshots** mit Playwright MCP - nicht Subagenten

5. **Fix-Loops sind PFLICHT** - max 3 Versuche pro Phase

## Agent-Chain Übersicht

```
Phase 0: PLANNING-AGENT → Analyse → Plan schreiben → User-Approval
    ↓
Phase 1: Backend (wenn nötig) → Fix-Loop bis PASS
    ↓
Phase 2: Frontend → Fix-Loop bis PASS
    ↓
Phase 3: UI Review + Auto-Fix → Screenshot → Review → Fix → Re-Review Loop
    ↓
Phase 4: Tests + Auto-Fix → Run → Fix Failures → Re-Run Loop
    ↓
Phase 5: Final QA → Screenshot + Console Logs → Bei Problemen zurück
```

## Jetzt starten

**Spawne JETZT den Planning-Agent für: "$ARGUMENTS"**
