FROM node:18 as base
COPY . /
RUN npm ci
ENV NODE_ENV=production
RUN npm run build
RUN npm install pm2 -g
CMD ["pm2-runtime", "build/index.js"]
