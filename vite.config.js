

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/website/',  // ← هنا مسار المجلد على الاستضافة
  plugins: [react()],
});
