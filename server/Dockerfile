FROM oven/bun:1-slim

# mpv + yt-dlp for full-track streaming from YouTube
RUN apt-get update && apt-get install -y --no-install-recommends \
    mpv alsa-utils python3 python3-pip curl && \
    pip3 install --break-system-packages yt-dlp && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .

EXPOSE 4000
CMD ["bun", "run", "src/index.mjs"]
