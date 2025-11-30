# SSPLP Backend — quick run & connect guide

1. Copy `.env.example` to `.env` and fill values (JWT_SECRET, MONGODB_URI, FRONTEND_URL, optional TWILIO/EMAIL creds).

2. Install and run:
   - npm install
   - npm run dev   # uses nodemon or: node server.js

3. Frontend connection:
   - Set FRONTEND_URL in backend `.env` to your frontend origin (e.g. http://localhost:3000).
   - From frontend, call backend endpoints:
     - POST http://localhost:5000/api/auth/register
     - POST http://localhost:5000/api/auth/login

4. Notes:
   - Keep `.env` secret and do not commit it.
   - If using Twilio trial, verify recipient numbers in Twilio console.
   - If MongoDB Atlas SRV gives DNS errors, use local URI: `mongodb://localhost:27017/ssplp`.

If you want, I can also:
- Add global CORS middleware in server.js instead of per-router.
- Add a small frontend example (fetch/axios) showing login/register calls.
