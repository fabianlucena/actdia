// vite.config.js
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default {
  build: {
    sourcemap: true
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'actdia/actdia-items.css',
          dest: ''
        }
      ]
    })
  ]
}