# ARCHITECTURE

## System Overview
Ecommerce web app with customer flow and admin flow.

## Frontend Layer
- Product Listing: browse/search products
- Cart: add/remove/update quantities
- Checkout (Mock): place test orders
- Admin Dashboard: CRUD products and review orders

## Backend Layer
- REST API with route groups:
  - /api/products
  - /api/cart
  - /api/checkout
  - /api/admin/*
- Service logic for pricing, stock checks, and order creation

## Data Layer (Demo)
- In-memory or JSON-seeded store
- Entities: Product, CartItem, Order

## Agent/AI Layer
- agentRunner reads steps and generates code
- watcher monitors trace/perf/history files
- parser composes prompt from context + telemetry
- geminiClient writes actionable output to GEMINI/src/output.md

## Execution Flow
inputProcessor/context -> agentRunner -> file writes -> trace updates -> watcher -> parser -> geminiClient -> output

## Non-Functional Requirements
- Safe writes for generated files
- Basic race protection in watcher loop
- Deterministic logs for debugging and replay
