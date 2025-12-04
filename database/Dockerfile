# Dockerfile for PostgreSQL database
FROM postgres:16-alpine

# Set environment variables
ENV POSTGRES_USER=customer_admin
ENV POSTGRES_PASSWORD=secure_password
ENV POSTGRES_DB=customer_dashboard

# Copy initialization script
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U customer_admin -d customer_dashboard || exit 1