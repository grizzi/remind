FROM python:3.12-slim-bullseye

# Install netcat to listen for the database connection
RUN apt-get update && apt-get install -y --no-install-recommends netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

# Create a user with the username 'backend'
RUN useradd -ms /bin/bash -u 1000 backend

# Add 'backed' user to the sudoers file with no password required
RUN echo 'backend ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Switch to the 'backed' user
USER backend

# Set up directory structure for gunicorn logs
RUN sudo mkdir -pv /var/{log,run}/gunicorn/
RUN sudo chown -cR backend:backend /var/{log,run}/gunicorn/

# Set work directory
WORKDIR /srv/app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies
# Guide on how to install uv in docker here
# https://docs.astral.sh/uv/guides/integration/docker/
COPY --from=ghcr.io/astral-sh/uv:0.6.14 /uv /uvx /bin/
COPY pyproject.toml uv.lock .

# Sync the project using the cache to speed up
# the process
ENV UV_LINK_MODE=copy
RUN --mount=type=cache,target=/root/.cache/uv
RUN uv sync --frozen

# Change the default shell
SHELL ["/bin/bash"]

# Copy project
COPY --chown=backend:backend . .

# Prepend the venv path to use this before
# the system python
ENV PATH="/srv/app/.venv/bin:$PATH"

# Add tools binary path
ENV PATH="/home/backend/.local/bin:$PATH"

COPY ./entrypoint.sh .
ENTRYPOINT ["/srv/app/entrypoint.sh"]
