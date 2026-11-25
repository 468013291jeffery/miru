import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 线上路径：https://miru.plus/web/dist/ （部署脚本把仓库 web/ 目录整体拷到站点根目录）
export default defineConfig({ plugins: [react()], base: '/web/dist/', build: { outDir: 'dist', emptyOutDir: true } });
