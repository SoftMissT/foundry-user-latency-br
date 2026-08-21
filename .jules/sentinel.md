## 2025-05-18 - WebSocket Payload Validation and CSS Selector Sanitization
**Vulnerability:** Unvalidated WebSocket data from socket listeners (`game.socket.on`) and unescaped player ID string interpolation in `querySelector`.
**Learning:** Network events in Foundry VTT modules can be broadcast by any connected peer client. Processing incoming data without verifying properties or sanitizing strings used in DOM selectors can lead to runtime exceptions or CSS selector injection.
**Prevention:** Always perform runtime type and sanity checks on socket payload objects, and wrap user-controlled IDs with `CSS.escape` when constructing CSS selectors for `querySelector`.
