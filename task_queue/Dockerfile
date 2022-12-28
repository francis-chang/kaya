FROM node:18 as base

COPY . /
RUN npm ci
RUN npm run build

# no workdir for production because npm run build messes up the build placement
FROM base as production
ENV NODE_ENV=production
CMD ["npm", "run", "start"]

FROM base as dev
WORKDIR /src
COPY . /src
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]