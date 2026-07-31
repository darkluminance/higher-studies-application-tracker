FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

RUN bun install

COPY app ./app

EXPOSE 3000

CMD ["bun", "run", "dev", "--port", "3000"]