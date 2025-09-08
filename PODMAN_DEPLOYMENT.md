# Podman Deployment Guide for Rainfall Dashboard

This guide provides instructions for building and deploying the Rainfall Data Dashboard using Podman (instead of Docker).

## 📋 Prerequisites

- Podman installed (version 4.0 or higher)
- At least 2GB of available disk space
- The Rainfall Data API running (if connecting to local API)

## 🔨 Building the Podman Image

### Build the Image
```bash
# Build the image with Podman
podman build -t rainfall-dashboard .

# View built images
podman images
```

### Run the Container
```bash
# Run the container
podman run -d -p 3000:80 --name rainfall-dashboard rainfall-dashboard

# Run with port mapping
podman run -d -p 8080:80 --name rainfall-dashboard-alt rainfall-dashboard
```

## 🚀 Deployment Commands

### Basic Deployment
```bash
# Start the container
podman run -d \
  --name rainfall-dashboard \
  -p 3000:80 \
  --restart=unless-stopped \
  rainfall-dashboard

# Check running containers
podman ps

# View logs
podman logs rainfall-dashboard

# Follow logs in real-time
podman logs -f rainfall-dashboard
```

### Advanced Deployment with Volume
```bash
# Create a volume for persistent data (if needed)
podman volume create rainfall-data

# Run with volume mounting
podman run -d \
  --name rainfall-dashboard \
  -p 3000:80 \
  -v rainfall-data:/data \
  --restart=unless-stopped \
  rainfall-dashboard
```

## 🌐 Accessing the Application

After successful deployment:
- **Dashboard URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Connection**: Ensure your API is running on http://localhost:8080

## ⚙️ Podman-Specific Commands

### Container Management
```bash
# List running containers
podman ps

# List all containers (including stopped)
podman ps -a

# Stop the container
podman stop rainfall-dashboard

# Start the container
podman start rainfall-dashboard

# Restart the container
podman restart rainfall-dashboard

# Remove the container
podman rm rainfall-dashboard

# Remove container and image
podman rm rainfall-dashboard && podman rmi rainfall-dashboard
```

### Image Management
```bash
# List images
podman images

# Remove image
podman rmi rainfall-dashboard

# Remove unused images
podman image prune

# Build without cache
podman build --no-cache -t rainfall-dashboard .
```

### Logs and Debugging
```bash
# View container logs
podman logs rainfall-dashboard

# Execute commands inside container
podman exec -it rainfall-dashboard sh

# Inspect container details
podman inspect rainfall-dashboard

# Check container stats
podman stats rainfall-dashboard
```

## 🔧 Alternative: Using Podman-Compose

If you have podman-compose installed:

```bash
# Install podman-compose (if not installed)
pip3 install podman-compose

# Use the docker-compose.yml file
podman-compose up --build

# Run in background
podman-compose up -d --build

# Stop services
podman-compose down
```

## 🐛 Troubleshooting with Podman

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Use a different port
podman run -d -p 8080:80 --name rainfall-dashboard rainfall-dashboard
```

#### 2. Permission Issues
```bash
# Run with user mapping (if needed)
podman run -d \
  --userns=keep-id \
  -p 3000:80 \
  --name rainfall-dashboard \
  rainfall-dashboard
```

#### 3. Network Issues
```bash
# Create a custom network
podman network create rainfall-network

# Run container with custom network
podman run -d \
  --network rainfall-network \
  -p 3000:80 \
  --name rainfall-dashboard \
  rainfall-dashboard
```

#### 4. API Connection from Container
```bash
# Check API connectivity from container
podman exec -it rainfall-dashboard curl http://host.containers.internal:8080/v3/api-docs

# Or use the host IP
podman exec -it rainfall-dashboard curl http://10.0.2.2:8080/v3/api-docs
```

## 🌍 Production Deployment with Podman

### Using Systemd Services
```bash
# Generate systemd service file
podman generate systemd --new --name rainfall-dashboard > ~/.config/systemd/user/rainfall-dashboard.service

# Enable and start the service
systemctl --user enable rainfall-dashboard.service
systemctl --user start rainfall-dashboard.service

# Check service status
systemctl --user status rainfall-dashboard.service
```

### Pod Deployment (Multiple Containers)
```bash
# Create a pod
podman pod create --name rainfall-pod -p 3000:80 -p 8080:8080

# Run frontend in the pod
podman run -d \
  --pod rainfall-pod \
  --name rainfall-frontend \
  rainfall-dashboard

# Run API in the same pod (if available)
# podman run -d \
#   --pod rainfall-pod \
#   --name rainfall-api \
#   your-rainfall-api:latest

# List pods
podman pod ps

# Stop the entire pod
podman pod stop rainfall-pod
```

## 📦 Image Export/Import

### Export Image
```bash
# Save image to tar file
podman save -o rainfall-dashboard.tar rainfall-dashboard

# Compress the image
gzip rainfall-dashboard.tar
```

### Import Image
```bash
# Load image from tar file
podman load -i rainfall-dashboard.tar.gz
```

## 🔄 Updates and Maintenance

### Update the Application
```bash
# Pull latest code and rebuild
git pull origin main
podman build -t rainfall-dashboard .

# Stop old container
podman stop rainfall-dashboard
podman rm rainfall-dashboard

# Start new container
podman run -d -p 3000:80 --name rainfall-dashboard rainfall-dashboard
```

### Cleanup
```bash
# Remove stopped containers
podman container prune

# Remove unused images
podman image prune

# Remove everything unused
podman system prune -a
```

## 🔐 Security with Podman

### Rootless Containers
Podman runs rootless by default, which is more secure:

```bash
# Check if running rootless
podman info | grep -i rootless

# Run with specific user
podman run -d \
  --user 1000:1000 \
  -p 3000:80 \
  --name rainfall-dashboard \
  rainfall-dashboard
```

### SELinux Considerations
```bash
# If SELinux is enabled, you might need:
podman run -d \
  --security-opt label=disable \
  -p 3000:80 \
  --name rainfall-dashboard \
  rainfall-dashboard
```

## 📊 Performance Monitoring

### Resource Usage
```bash
# Monitor container resources
podman stats rainfall-dashboard

# Check system resources
podman system df

# View detailed container info
podman inspect rainfall-dashboard | jq '.[0].State'
```

### Health Checks
```bash
# Manual health check
curl http://localhost:3000/health

# Check container health status
podman inspect rainfall-dashboard | jq '.[0].State.Health'
```

## 🚀 Quick Start Script

Create a deployment script:

```bash
#!/bin/bash
# deploy.sh

echo "Building Rainfall Dashboard..."
podman build -t rainfall-dashboard .

echo "Stopping existing container..."
podman stop rainfall-dashboard 2>/dev/null || true
podman rm rainfall-dashboard 2>/dev/null || true

echo "Starting new container..."
podman run -d \
  --name rainfall-dashboard \
  -p 3000:80 \
  --restart=unless-stopped \
  rainfall-dashboard

echo "Dashboard deployed at http://localhost:3000"
echo "Health check: http://localhost:3000/health"

# Make executable: chmod +x deploy.sh
# Run: ./deploy.sh
```

## 🆘 Support

For Podman-specific issues:
1. Check Podman documentation: https://docs.podman.io/
2. Verify container logs: `podman logs rainfall-dashboard`
3. Check Podman info: `podman info`
4. Ensure proper networking: `podman network ls`

The Dockerfile and nginx configuration work the same with Podman as they do with Docker! 