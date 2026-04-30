Frontend (Vercel) automatic deploy setup

1. Add project to Vercel and link GitHub repository.
2. In Vercel Project Settings > Environment Variables, add:
   - `VITE_API_URL` = https://<your-railway-domain>

3. Add these GitHub repository secrets (Settings > Secrets):
   - `VERCEL_TOKEN` (from your Vercel account)
   - `VERCEL_ORG_ID` (Vercel Organization ID)
   - `VERCEL_PROJECT_ID` (Vercel Project ID)
   - `VITE_API_URL` (same as above)

4. The provided GitHub Action will run on push to `main` and deploy the `frontend/` directory to Vercel.

Backend (Railway)

- You already deployed the backend. Copy the Railway public domain (Service → Networking) and paste it into `VITE_API_URL` in Vercel or as the `VITE_API_URL` GitHub secret.

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
