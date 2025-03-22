import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: './', // Использование относительных путей
  server: {
    proxy: {
      '/php': {
        target: 'http://my/vite', // Укажите URL вашего PHP-сервера
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/php/, '/src/php'),
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/php/*.php', // Путь к PHP-файлам
          dest: 'php', // Папка в dist, куда будут скопированы файлы
        },
      ],
    }),
  ],
});
