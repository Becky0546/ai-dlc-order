#!/bin/bash
set -e

echo "=== Table Order 배포 스크립트 ==="

# 1. Docker 설치 (없으면)
if ! command -v docker &> /dev/null; then
    echo "[1/3] Docker 설치 중..."
    if command -v apt-get &> /dev/null; then
        # Ubuntu / Debian
        sudo apt-get update -y
        sudo apt-get install -y docker.io
    elif command -v yum &> /dev/null; then
        # Amazon Linux / RHEL
        sudo yum update -y
        sudo yum install -y docker
    else
        echo "지원하지 않는 OS입니다. Docker를 수동 설치해주세요."
        exit 1
    fi
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo "Docker 설치 완료."
    echo "그룹 적용을 위해 'newgrp docker' 실행 후 다시 ./deploy.sh 를 실행하세요."
    exit 0
fi

# 2. Docker Compose 설치 (없으면)
if ! docker compose version &> /dev/null; then
    echo "[2/3] Docker Compose 플러그인 설치 중..."
    sudo mkdir -p /usr/local/lib/docker/cli-plugins
    sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" \
        -o /usr/local/lib/docker/cli-plugins/docker-compose
    sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    echo "Docker Compose 설치 완료."
fi

# 3. 빌드 & 실행
echo "[3/3] 컨테이너 빌드 및 실행 중..."
docker compose down 2>/dev/null || true
docker compose up --build -d

echo ""
echo "=== 배포 완료 ==="
echo "Frontend: http://$(curl -s ifconfig.me)"
echo "Backend:  http://$(curl -s ifconfig.me):8080"
echo ""
echo "로그 확인: docker compose logs -f"
echo "중지:      docker compose down"
