# INSTRUCTIONS

1. Initialize ecommerce baseline:
   - Product model (id, name, price, stock, image)
   - Cart model (itemId, productId, qty, subtotal)
   - Order model (id, items, total, status)

2. Build backend endpoints:
   - GET /api/products
   - GET /api/products/:id
   - GET /api/cart
   - POST /api/cart
   - PUT /api/cart/:itemId
   - DELETE /api/cart/:itemId
   - POST /api/checkout
   - GET /api/admin/products
   - POST /api/admin/products
   - PUT /api/admin/products/:id
   - DELETE /api/admin/products/:id

3. Build frontend pages/components:
   - Product listing page
   - Cart page
   - Mock checkout page
   - Admin dashboard page

4. Integrate frontend and backend:
   - Shared API client helpers
   - Error/loading states
   - Success/failure messages

5. Run agent loop and tracing:
   - node backend/src/agentRunner.js
   - node backend/src/watcher.js

6. Log updates continuously:
   - traces/session_log/logs.txt
   - traces/session_log/agent_trace.txt
   - traces/performance/memory.txt
   - traces/performance/latency.txt

7. Write analysis and iteration output:
   - GEMINI/src/output.md
