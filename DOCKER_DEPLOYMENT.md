# Docker Deployment Guide for Rainfall Dashboard

This guide provides instructions for building and deploying the Rainfall Data Dashboard using Docker.

## 📋 Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- At least 2GB of available disk space
- The Rainfall Data API running (if connecting to local API)

## 🔨 Building the Docker Image

### Option 1: Build with Docker Compose (Recommended)
```bash
# Build and start the application
docker-compose up --build

# Run in detached mode (background)
docker-compose up --build -d

# View logs
docker-compose logs -f rainfall-frontend
```

### Option 2: Build with Docker directly
```bash
# Build the image
docker build -t rainfall-dashboard .

# Run the container
docker run -d -p 3000:80 --name rainfall-dashboard rainfall-dashboard
```

## 🚀 Deployment Options

### Development Deployment
```bash
# Quick start for development
docker-compose up --build

# Access the application at: http://localhost:3000
```

### Production Deployment
```bash
# Start in production mode
docker-compose -f docker-compose.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🌐 Accessing the Application

After successful deployment:
- **Dashboard URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Connection**: Ensure your API is running on http://localhost:8080

## ⚙️ Configuration

### Environment Variables

You can customize the deployment using environment variables:

```bash
# Set custom port
PORT=8080 docker-compose up

# Set API URL (if different)
REACT_APP_API_URL=http://your-api-server:8080 docker-compose up
```

### Nginx Configuration

The nginx configuration includes:
- ✅ **Gzip Compression**: Reduces file sizes
- ✅ **Security Headers**: Protects against common attacks
- ✅ **Caching**: Optimizes static asset loading
- ✅ **SPA Routing**: Handles React Router navigation
- ✅ **Health Checks**: Monitors application status

### API Proxy Setup

If you need to proxy API requests through nginx, uncomment and modify the proxy section in `nginx.conf`:

```nginx
location /api/ {
    proxy_pass http://rainfall-api:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 🔧 Docker Commands Reference

### Container Management
```bash
# View running containers
docker ps

# Stop the application
docker-compose down

# Restart the application
docker-compose restart

# Remove containers and images
docker-compose down --rmi all

# View container logs
docker logs rainfall-dashboard

# Access container shell
docker exec -it rainfall-dashboard sh
```

### Image Management
```bash
# List images
docker images

# Remove unused images
docker image prune

# Remove specific image
docker rmi rainfall-dashboard

# Build without cache
docker build --no-cache -t rainfall-dashboard .
```

## 📊 Monitoring and Health Checks

### Built-in Health Checks
The container includes automatic health checks:
- **Endpoint**: `/health`
- **Interval**: Every 30 seconds
- **Timeout**: 3 seconds
- **Retries**: 3 attempts

### Monitoring Commands
```bash
# Check container health
docker inspect rainfall-dashboard | grep Health -A 10

# View health check logs
docker-compose logs rainfall-frontend | grep health

# Manual health check
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

#### 2. Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
docker run -p 8080:80 rainfall-dashboard
```

#### 3. API Connection Issues
```bash
# Check API connectivity from container
docker exec -it rainfall-dashboard curl http://host.docker.internal:8080/v3/api-docs

# For Linux, use the host IP
docker exec -it rainfall-dashboard curl http://172.17.0.1:8080/v3/api-docs
```

#### 4. Memory Issues
```bash
# Check container memory usage
docker stats rainfall-dashboard

# Increase Docker memory limit in Docker Desktop settings
```

### Debug Mode
```bash
# Run container with debug output
docker run -it --rm rainfall-dashboard sh

# Check nginx configuration
docker exec -it rainfall-dashboard nginx -t

# View nginx error logs
docker exec -it rainfall-dashboard cat /var/log/nginx/error.log
```

## 🌍 Production Considerations

### Performance Optimization
- ✅ **Multi-stage build**: Reduces final image size
- ✅ **Asset caching**: 1-year cache for static files
- ✅ **Gzip compression**: Reduces bandwidth usage
- ✅ **Security headers**: Protects against attacks

### Scaling
```bash
# Scale multiple instances
docker-compose up --scale rainfall-frontend=3

# Use with load balancer
docker-compose up nginx-proxy rainfall-frontend
```

### SSL/HTTPS Setup
1. Uncomment the nginx-proxy service in docker-compose.yml
2. Add SSL certificates to the `./ssl` directory
3. Configure the nginx-proxy.conf file

### Resource Limits
```yaml
# Add to docker-compose.yml service
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
```

## 📦 Image Information

- **Base Image**: nginx:alpine (lightweight)
- **Node Version**: 18-alpine (for building)
- **Final Size**: ~30MB (compressed)
- **Architecture**: Multi-platform (amd64, arm64)

## 🔐 Security

- Security headers enabled
- No root privileges required
- Minimal attack surface
- Regular base image updates recommended

## 📝 Maintenance

### Regular Updates
```bash
# Update base images
docker-compose pull

# Rebuild with latest dependencies
docker-compose build --pull

# Clean up old images
docker image prune -a
```

### Backup
```bash
# Export image
docker save rainfall-dashboard > rainfall-dashboard.tar

# Import image
docker load < rainfall-dashboard.tar
```

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs`
3. Verify API connectivity
4. Check Docker resources and permissions

## 📈 Performance Metrics

Expected performance with default configuration:
- **Cold start**: ~10-15 seconds
- **Memory usage**: ~20-50MB
- **Load time**: <2 seconds (with caching)
- **Build time**: ~2-5 minutes 