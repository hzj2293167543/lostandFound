FROM ollama/ollama:0.20.5

ENV OLLAMA_HOST=0.0.0.0:11434

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]