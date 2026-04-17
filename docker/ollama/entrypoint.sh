#!/bin/bash
set -e

MODEL_NAME=${OLLAMA_MODEL:-nomic-embed-text:latest}

echo "Starting Ollama server in background..."
ollama serve &
OLLAMA_PID=$!

echo "Waiting for Ollama to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "Ollama is ready!"
        break
    fi
    sleep 1
done

echo "Checking if model $MODEL_NAME exists..."
if ! ollama list | grep -q "^$MODEL_NAME "; then
    echo "Model $MODEL_NAME not found, pulling..."
    ollama pull "$MODEL_NAME"
    echo "Model $MODEL_NAME pulled successfully!"
else
    echo "Model $MODEL_NAME already exists, skipping pull."
fi

echo "Stopping background Ollama..."
kill $OLLAMA_PID 2>/dev/null || true
wait $OLLAMA_PID 2>/dev/null || true

echo "Starting Ollama server..."
exec ollama serve