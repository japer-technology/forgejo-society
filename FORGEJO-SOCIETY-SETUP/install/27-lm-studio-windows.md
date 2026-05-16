# LM Studio (Windows)

LM Studio on Windows provides a graphical interface for downloading, managing, and serving large language models locally. For Forgejo-Society developers working on Windows, LM Studio offers the same OpenAI-compatible REST API as the Linux inference host — making it possible to run and test AI-assisted workflows on a local machine before deploying to the central RTX 4090 inference host. Model selection depends on available VRAM: the guide includes a tiered model recommendation table. Once the local server is started in LM Studio, any agent or script that targets `http://localhost:1234` can use the local GPU for inference.

---

## Prerequisites

- Windows 10/11
- A CUDA-capable NVIDIA GPU with at least 4 GB VRAM is recommended for GPU-accelerated inference. CPU-only inference works but is much slower.
- [Forgejo](09-forgejo.md) — Forgejo should be running if this Windows machine is part of the Forgejo-Society network and the local LM Studio server will serve other hosts on the subnet.

---

## Installation

### 1. Install LM Studio via WinGet

Open PowerShell (administrator not required):

```powershell
winget install --id LMStudio.LMStudio -e --source winget
```

If WinGet cannot find the package or if you prefer the installer, download it directly from https://lmstudio.ai and run the `.exe` installer.

### 2. Launch LM Studio

Launch LM Studio from the Start menu. On first launch, LM Studio creates its model storage directory at:

```
%USERPROFILE%\.lmstudio\models\
```

or depending on your LM Studio version:

```
%USERPROFILE%\AppData\Local\LM-Studio\models\
```

Check the actual path in LM Studio → Settings → Model Storage.

### 3. Download a Model

Use LM Studio's built-in model browser (the magnifying glass icon) to search for and download a model. The recommended tier table:

| VRAM | Recommended Model | Approximate Size |
| --- | --- | --- |
| ≥ 20 GB | Gemma 3 27B (Q4_K_M) | ~18 GB |
| 8–16 GB | Gemma 3 12B (Q4_K_M) | ~8 GB |
| 4–8 GB | Gemma 3 4B (Q4_K_M) | ~3 GB |
| < 4 GB | Gemma 3 1B (Q8) — CPU fallback | ~1 GB |

1. In the model browser, search for **Gemma 3**
2. Select the appropriate quantisation level for your VRAM
3. Click **Download** — models are large (several GB); allow time for download

### 4. Start the Local Inference Server

1. Click the **Local Server** icon (looks like `<->`) in the left panel
2. Click **Select a model to load** and choose the downloaded model
3. Set the port to **1234** (matches the expected Forgejo-Society API endpoint)
4. Click **Start Server**
5. LM Studio loads the model into VRAM — this takes 5–30 seconds depending on model size

### 5. Test the API

```powershell
# List loaded models
Invoke-RestMethod -Uri "http://localhost:1234/v1/models" -Method Get |
  ConvertTo-Json -Depth 5
# Expected: JSON with "object": "list" and a "data" array with the loaded model
```

Test a chat completion:

```powershell
$body = @{
  model = "gemma-3-27b-it-Q4_K_M"
  messages = @(
    @{ role = "user"; content = "Reply with only the word: READY" }
  )
  max_tokens = 10
  temperature = 0.1
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "http://localhost:1234/v1/chat/completions" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body |
  ConvertTo-Json -Depth 5
# Expected: JSON response with "choices[0].message.content" containing "READY"
```

---

## Validation

- [ ] **LM Studio is installed**

```powershell
winget list --id LMStudio.LMStudio
# Expected: LMStudio.LMStudio  x.x.x  ...
```

- [ ] **LM Studio launches without errors**

Launch from the Start menu. The GUI should open with no error dialogs.

- [ ] **A model is loaded and the local server is started**

In LM Studio, the Local Server tab should show a green indicator next to **Server is running on port 1234**.

- [ ] **API returns the model list**

```powershell
Invoke-RestMethod -Uri "http://localhost:1234/v1/models" -Method Get |
  Select-Object -ExpandProperty data |
  Select-Object -ExpandProperty id
# Expected: the model ID string (e.g., "gemma-3-27b-it-Q4_K_M")
```

- [ ] **Chat completion request succeeds**

```powershell
$body = @{
  model = "gemma-3-27b-it-Q4_K_M"
  messages = @(@{ role = "user"; content = "Say hi in one word" })
  max_tokens = 5
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Uri "http://localhost:1234/v1/chat/completions" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

$response.choices[0].message.content
# Expected: a short word or greeting
```

- [ ] **GPU is utilised during inference**

Open Task Manager (Ctrl+Shift+Esc) → Performance → GPU. During an active inference request, GPU utilisation should spike above 0%.

---

## Deinstallation

```powershell
# Step 1: Close LM Studio and stop the inference server
# In LM Studio: Local Server tab → Stop Server
# Then close the application window

# Step 2: Uninstall LM Studio
winget uninstall --id LMStudio.LMStudio

# Step 3: Remove downloaded models (these can be several GB per model)
# Check the model storage path in LM Studio Settings first, then remove:
Remove-Item -Recurse -Force "$env:USERPROFILE\.lmstudio\models" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\LM-Studio" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.cache\lm-studio" -ErrorAction SilentlyContinue

# Step 4: Remove LM Studio configuration and logs
Remove-Item -Recurse -Force "$env:APPDATA\LM-Studio" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Programs\LM Studio" -ErrorAction SilentlyContinue

# Step 5: Confirm removal
winget list --id LMStudio.LMStudio
# Expected: no results

# Also confirm the server is not listening
Test-NetConnection -ComputerName localhost -Port 1234 -InformationLevel Quiet
# Expected: False (no listener on port 1234)
```

---

## Continuity Controls

- **Model management:** LM Studio models are large GGUF files. Keep only the models you actively use — unused models waste disk space. Check **Settings → Model Storage** to see the total storage used and remove models via the **My Models** tab.
- **VRAM management:** Only one model can be loaded at a time in standard LM Studio usage. If switching between models frequently, note that model loading takes time. Plan which model to load before starting a work session.
- **API compatibility:** LM Studio's API is OpenAI-compatible. When upgrading LM Studio, test the API with your Forgejo-Society integration scripts before relying on the new version in production.
- **LM Studio updates:** LM Studio prompts for updates automatically. Apply updates during a maintenance window and re-test the API before resuming agent operations.
- **GPU driver compatibility:** LM Studio requires the CUDA runtime that matches your NVIDIA driver version. If LM Studio fails to use the GPU after a driver update, check the LM Studio release notes for the minimum required driver version.
