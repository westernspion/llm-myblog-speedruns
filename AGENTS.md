We are building a blog for Bradley Savoy, a DevOps/SRE engineer with 15 years of experience.

The site should feel professional while being synthwave-inspired, including subtle line-scan visual treatment.

Be opinionated in the technical stack choices (frontend, backend, and database), with the requirement that everything runs locally via Docker Compose.

We will eventually expose the project using a Cloudflare Tunnel.

**Note:** This development server runs on a local network machine. To access the app from your phone or other devices, ensure `docker-compose.yml` binds to `0.0.0.0` (not localhost), then open `http://bbox1.local:3000` on the same network. If mDNS/hostname resolution is unavailable on the device, use the server's local IP instead (e.g., `http://192.168.x.x:3000`).

This project will serve as a benchmark for your abilities- do your best.

When a logical amount of work is complete, create a commit with a clear, concise message.

The blog must include an admin login and admin management experience for creating, editing, and deleting posts, with Markdown supported for writing content.

When admin functionality is implemented, the output must include the admin URL link and admin credentials.
