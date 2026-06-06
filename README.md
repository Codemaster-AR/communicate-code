file send

networks:
  forgejo:
    external: false

services:
  server:
    image: codeberg.org/forgejo/forgejo:13
    container_name: forgejo
    restart: always
    networks:
      - forgejo
    volumes:
      - ./data:/data
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "2222:22"
