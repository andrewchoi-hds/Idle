#!/usr/bin/env python3
from __future__ import annotations

# Single source of truth for PR Validation checklist commands.
DEFAULT_VALIDATION_COMMANDS: tuple[str, ...] = (
    "npm run typecheck",
    "npm run combat:diff:py-ts:suite",
    "npm run save:auto:regression:check",
    "npm run save:offline:regression:check",
    "npm run pr:validation:sync:check",
    "npm run pr:body:lint:regression:check",
    "npm run pr:body:gen:regression:check",
    "npm run pr:validation:sync:regression:check",
)
