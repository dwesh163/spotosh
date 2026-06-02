FROM oven/bun:1

RUN apt-get update && apt-get install -y --no-install-recommends \
    mpv alsa-utils ffmpeg python3 python3-pip curl && \
    pip3 install --break-system-packages --retries 5 yt-dlp && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

EXPOSE 4000
CMD ["node", "src/index.mjs"]
