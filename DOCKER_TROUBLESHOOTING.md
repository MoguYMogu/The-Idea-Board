# Docker Troubleshooting Guide

## 🚨 Common Issue: "The system cannot find the file specified"

This error occurs when Docker Desktop isn't properly running or initialized.

### ✅ Step-by-Step Fix

#### 1. Check Docker Desktop Status
```powershell
# Check if Docker Desktop process is running
Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
```

#### 2. Start Docker Desktop Properly
- **Option A**: Click the Docker Desktop icon on your desktop
- **Option B**: Search "Docker Desktop" in Windows Start menu
- **Option C**: Run from Command Prompt: `"C:\Program Files\Docker\Docker\Docker Desktop.exe"`

#### 3. Wait for Full Initialization
- Look for the whale 🐳 icon in your system tray (bottom-right corner)
- Wait until it shows "Docker Desktop is running"
- This can take 1-3 minutes on first startup

#### 4. Verify Docker is Working
```powershell
# Test Docker connection
docker --version
docker info
```

### 🔧 Advanced Troubleshooting

#### If Docker Desktop Won't Start:
1. **Restart Docker Desktop**
   - Right-click the whale icon → "Restart"
   - Or close Docker Desktop completely and reopen

2. **Check Windows Features**
   - Enable "Windows Subsystem for Linux" (WSL)
   - Enable "Virtual Machine Platform"
   - Restart your computer after enabling

3. **Reset Docker Desktop**
   - Docker Desktop → Settings → Troubleshoot → "Reset to factory defaults"

4. **Check System Requirements**
   - Windows 10/11 Pro, Enterprise, or Education
   - Hyper-V enabled
   - At least 4GB RAM available

#### If Still Having Issues:
```powershell
# Check Windows version
winver

# Check if Hyper-V is enabled
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All

# Check WSL status
wsl --status
```

### 🎯 Quick Fix Commands

#### Restart Docker Service:
```powershell
# Stop Docker
Stop-Service -Name "Docker Desktop Service" -Force

# Start Docker
Start-Service -Name "Docker Desktop Service"
```

#### Alternative: Use Docker Desktop GUI
1. Right-click Docker Desktop icon in system tray
2. Select "Restart"
3. Wait for green "Running" status

### 📋 Pre-Deployment Checklist

Before running `.\docker-setup.ps1 prod`:

- [ ] Docker Desktop is installed
- [ ] Docker Desktop is running (whale icon visible)
- [ ] `docker --version` works in PowerShell
- [ ] `docker info` returns system information
- [ ] No other applications using ports 3000 or 5000

### 🔍 Port Conflict Resolution

If you get "port already in use" errors:

```powershell
# Check what's using port 3000
netstat -ano | findstr ":3000"

# Check what's using port 5000  
netstat -ano | findstr ":5000"

# Kill a process using port (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### 💡 Success Indicators

You'll know everything is working when:
- No error messages during `docker-compose up`
- http://localhost:3000 shows the IdeaBoard frontend
- http://localhost:5000/health returns `{"status":"OK","timestamp":"..."}`
- `docker-compose ps` shows all services as "running"

### 🆘 Last Resort

If nothing works:
1. Completely uninstall Docker Desktop
2. Restart your computer
3. Reinstall Docker Desktop from https://www.docker.com/products/docker-desktop/
4. Enable WSL 2 integration during setup
5. Try deployment again

---

**Need more help?** Check the main README.md for additional deployment options or create an issue in the repository.