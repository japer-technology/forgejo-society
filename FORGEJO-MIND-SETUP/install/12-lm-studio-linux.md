# LM Studio (Linux)

LM Studio is a desktop application and headless server for running large language models locally on consumer hardware. In the Forgejo-Mind stack, LM Studio runs on the RTX 4090 LLM inference host and exposes an OpenAI-compatible REST API on port 1234. Forgejo-Mind automation agents send chat completion requests to this endpoint to perform code review, issue triage, commit message generation, and other AI-assisted workflows — all without sending code or data to any external cloud provider. The RTX 4090's 24 GB VRAM is sufficient to run Gemma 3 27B at 4-bit quantisation in real time.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — LLM inference host only.
- [NVIDIA Drivers](11-nvidia-drivers.md) — GPU drivers must be installed and `nvidia-smi` must report the RTX 4090 successfully for GPU-accelerated inference.
- [UFW Firewall](02-ufw-firewall.md) — UFW must be active so that port 1234 can be restricted to the local subnet.

---

## Installation

### 1. Install libfuse2 (AppImage Dependency)

LM Studio on Linux is distributed as an AppImage. AppImages require `libfuse2` to mount and execute the embedded filesystem.

```bash
sudo apt install -y libfuse2 libfuse2t64 2>/dev/null || sudo apt install -y libfuse2
# Ubuntu 24.04 may use libfuse2t64 — try both; one will succeed

# Verify
dpkg -l | grep -i fuse2
```

### 2. Download LM Studio

Check https://lmstudio.ai/download for the current Linux x86_64 AppImage. Replace the version number as appropriate.

```bash
# Create an applications directory
mkdir -p ~/Applications

# Download the AppImage
wget -O ~/Applications/lmstudio.AppImage \
  "https://releases.lmstudio.ai/linux/x86_64/0.3.5/LM_Studio-0.3.5.AppImage"

# Make it executable
chmod +x ~/Applications/lmstudio.AppImage
```

### 3. Download a Model

LM Studio's built-in model browser requires the GUI. For a headless server, download models via the CLI or by running LM Studio interactively once:

```bash
# First interactive run to allow model downloading via the GUI
~/Applications/lmstudio.AppImage --no-sandbox &
# Use the GUI to search for and download:
# - Gemma 3 27B (Q4_K_M) — best quality on RTX 4090 (uses ~20 GB VRAM)
# - Gemma 3 12B (Q4_K_M) — faster option (~8 GB VRAM)
# Models are stored in ~/lm-studio/models/ by default
```

After downloading the model, close the GUI. The next steps configure headless operation.

### 4. Open UFW Port 1234 to the Local Subnet

```bash
sudo ufw allow from 192.168.0.0/24 to any port 1234 proto tcp \
  comment 'LM Studio API - local subnet only'

sudo ufw status | grep 1234
# Expected: 1234/tcp   ALLOW IN   192.168.0.0/24
```

### 5. Create a Systemd Service for Headless Operation

For production use, LM Studio should start automatically and run without a GUI session. Find the exact model file path in `~/lm-studio/models/` and substitute it in the service file.

```bash
# Find the model path (example for Gemma 3 27B)
find ~/lm-studio/models/ -name "*.gguf" | head -5
# Note the full path to the desired model file

# Create the systemd user service (runs as the current user)
mkdir -p ~/.config/systemd/user

cat > ~/.config/systemd/user/lmstudio-server.service <<EOF
[Unit]
Description=LM Studio Inference Server
After=network.target

[Service]
Type=simple
ExecStart=%h/Applications/lmstudio.AppImage \
  --no-sandbox \
  -- \
  server start \
  --model %h/lm-studio/models/lmstudio-community/gemma-3-27b-it-GGUF/gemma-3-27b-it-Q4_K_M.gguf \
  --port 1234 \
  --host 0.0.0.0
Restart=always
RestartSec=10s
Environment=DISPLAY=:0
Environment=HOME=%h

[Install]
WantedBy=default.target
EOF

# Enable lingering so the user service starts at boot without login
sudo loginctl enable-linger "$USER"

# Reload and enable the service
systemctl --user daemon-reload
systemctl --user enable lmstudio-server
systemctl --user start lmstudio-server
systemctl --user status lmstudio-server
```

### 6. Verify the API is Running

```bash
# Wait ~30 seconds for the model to load, then test
curl -s http://localhost:1234/v1/models | python3 -m json.tool
# Expected: JSON with "object": "list" and a "data" array containing the loaded model

# Test a chat completion
curl -s -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma-3-27b-it-Q4_K_M",
    "messages": [{"role": "user", "content": "Reply with only the word: READY"}],
    "max_tokens": 10,
    "temperature": 0.1
  }' | python3 -m json.tool
# Expected: JSON with "choices" array, content should be "READY"
```

---

## Validation

- [ ] **libfuse2 is installed**

```bash
dpkg -l | grep -E "libfuse2"
# Expected: package line showing libfuse2 or libfuse2t64 is installed
```

- [ ] **AppImage exists and is executable**

```bash
ls -lh ~/Applications/lmstudio.AppImage
# Expected: -rwxr-xr-x ... lmstudio.AppImage
```

- [ ] **API endpoint returns the model list**

```bash
curl -s http://localhost:1234/v1/models | jq '.data[].id'
# Expected: the model ID string (e.g., "gemma-3-27b-it-Q4_K_M")
```

- [ ] **Chat completion request succeeds**

```bash
curl -s -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma-3-27b-it-Q4_K_M",
    "messages": [{"role": "user", "content": "Say hi"}],
    "max_tokens": 20
  }' | jq '.choices[0].message.content'
# Expected: a short greeting string
```

- [ ] **GPU is active during inference**

```bash
# Start an inference request in one terminal, then check GPU usage
watch -n 1 nvidia-smi
# Expected: GPU-Util jumps above 0% during active inference
```

- [ ] **UFW restricts port 1234 to local subnet**

```bash
sudo ufw status | grep 1234
# Expected: 1234/tcp   ALLOW IN   192.168.0.0/24
```

- [ ] **Service starts automatically after reboot (if systemd service is configured)**

```bash
systemctl --user status lmstudio-server
# Expected: active (running)
```

---

## Deinstallation

```bash
# Step 1: Stop the LM Studio server
systemctl --user stop lmstudio-server 2>/dev/null || true
systemctl --user disable lmstudio-server 2>/dev/null || true
rm -f ~/.config/systemd/user/lmstudio-server.service
systemctl --user daemon-reload

# Step 2: Remove the AppImage
rm -f ~/Applications/lmstudio.AppImage

# Step 3: Remove downloaded models
# Check the model directory first to confirm its location
ls ~/lm-studio/models/
rm -rf ~/lm-studio/models/
# Also check the cache directory
rm -rf ~/.cache/lm-studio/ 2>/dev/null || true

# Step 4: Remove the LM Studio config and state
rm -rf ~/lm-studio/
rm -rf ~/.config/LM\ Studio/ 2>/dev/null || true

# Step 5: Remove UFW rule for port 1234
sudo ufw delete allow from 192.168.0.0/24 to any port 1234 proto tcp

# Step 6: Optionally remove libfuse2 (only if nothing else needs it)
# sudo apt remove --purge libfuse2 libfuse2t64

# Step 7: Confirm removal
curl --connect-timeout 3 http://localhost:1234/v1/models
# Expected: connection refused
```

---

## Continuity Controls

- **Model management:** LM Studio stores models as GGUF files. New model versions are released frequently. Review the model browser quarterly for improved quantisations of your preferred models. Keep at least one backup model available so inference does not go down during a model swap.
- **VRAM headroom:** The RTX 4090 has 24 GB VRAM. Gemma 3 27B Q4_K_M uses approximately 20 GB, leaving 4 GB. Do not load a second large model concurrently — VRAM overflow causes models to run on CPU, negating the GPU acceleration benefit.
- **API versioning:** LM Studio's API is OpenAI-compatible. When upgrading LM Studio, test the `/v1/chat/completions` and `/v1/models` endpoints with your automation agents before putting the new version into production.
- **Service restarts:** If the model crashes (e.g., due to a malformed request), the `Restart=always` directive in the systemd service will restart LM Studio automatically after 10 seconds. Monitor the service logs with `journalctl --user -u lmstudio-server -f`.
- **Inference host reachability:** The forge server and other subnet hosts connect to port 1234. If the LLM inference host IP changes, update the IP in any agent configuration that uses the inference API.
