Frontend (Vercel Git Integration only)

1. Import this GitHub repository into Vercel.
2. Set the Vercel project Root Directory to `frontend`.
3. In Vercel Project Settings > Environment Variables, add:
   - `VITE_API_URL` = https://<your-railway-domain>
4. Deploy once from Vercel dashboard.
5. Future pushes to `main` auto-deploy through Vercel Git Integration.

Backend (Railway)

- You already deployed the backend. Copy the Railway public domain (Service -> Networking) and paste it into `VITE_API_URL` in Vercel.

Manual quick test (local frontend)

- Create `frontend/.env` with:
  VITE_API_URL=https://<your-railway-domain>

- Then run:

```bash
cd frontend
npm install
npm run dev
```

Use the app in the browser and test login/project/task flows.
