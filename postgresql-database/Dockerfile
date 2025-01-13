FROM postgres

# Copy the database initialize script
RUN mkdir -p /images/

# Copy PostgreSQL configuration files
COPY pg_hba.conf /etc/postgresql/
COPY postgresql.conf /etc/postgresql/