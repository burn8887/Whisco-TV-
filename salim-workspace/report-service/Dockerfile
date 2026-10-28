FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 HOST=0.0.0.0 PORT=8080
WORKDIR /app
COPY server.py admin.html admin.js ./
RUN addgroup --system --gid 10001 salim && adduser --system --uid 10001 --ingroup salim salim && mkdir -p /app/data && chown -R salim:salim /app
USER 10001:10001
EXPOSE 8080
CMD ["python3", "/app/server.py"]
