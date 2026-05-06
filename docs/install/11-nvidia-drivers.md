# NVIDIA Drivers

The NVIDIA driver package provides the kernel module and user-space libraries that allow software to communicate with the RTX 4090 GPU in the Forgejo-Mind LLM inference host. Without a correctly installed driver, the GPU is not accessible to any application — LM Studio falls back to CPU-only inference, which is orders of magnitude slower. The RTX 4090 has 24 GB of GDDR6X VRAM and can run large quantised language models (27B parameters at Q4) in real time. This guide covers selecting the correct driver version, handling Secure Boot, installing the CUDA toolkit, and enabling persistence mode so the GPU is immediately ready for inference requests without a warm-up delay.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — LLM inference host only. This guide is not required on the forge server or runner nodes.

---

## Installation

### 1. Check if Drivers Are Already Installed

If the system was previously configured or if the NVIDIA driver was included in the OEM image, it may already be present:

```bash
nvidia-smi
# If this command succeeds, drivers are already installed.
# Review the output and skip to the Validation section if the driver version is current.
```

### 2. Check Secure Boot Status

NVIDIA's proprietary kernel module must be signed if Secure Boot is enabled. Unsigned modules will be rejected by the UEFI firmware and the driver will fail to load after a reboot.

```bash
mokutil --sb-state
# Possible outputs:
# "SecureBoot enabled"  → must sign the module OR disable Secure Boot
# "SecureBoot disabled" → proceed normally
```

**If Secure Boot is enabled**, the simplest approach for a trusted internal host is to disable it in BIOS/UEFI:

1. Reboot the host
2. Enter BIOS/UEFI setup (typically Del, F2, or F10 at the manufacturer splash screen)
3. Navigate to the Security or Boot section
4. Disable Secure Boot
5. Save and reboot

Alternatively, use `mokutil` to enrol your own MOK (Machine Owner Key) and use `dkms` to sign the module — this is more complex and is beyond the scope of this guide.

### 3. Discover the Recommended Driver

```bash
sudo ubuntu-drivers devices
# Expected output lists the GPU and recommended driver:
# model    : NVIDIA GeForce RTX 4090
# driver   : nvidia-driver-565 - third-party non-free recommended
```

Note the recommended driver version (e.g., `nvidia-driver-565`).

### 4. Install the NVIDIA Driver

**Option A — Automatic (recommended):**

```bash
sudo ubuntu-drivers install
# Installs the recommended driver automatically
```

**Option B — Manual (if you need a specific version):**

```bash
sudo apt install -y nvidia-driver-565
```

> After the driver is installed, a **reboot is mandatory** for the kernel module to load.

```bash
sudo reboot
```

### 5. Verify the Driver is Loaded After Reboot

```bash
nvidia-smi
# Expected output:
# +-----------------------------------------------------------------------------------+
# | NVIDIA-SMI 565.x.x     Driver Version: 565.x.x     CUDA Version: 12.x            |
# |-------------------------------+----------------------+-----------------------------+
# | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC       |
# | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M.        |
# |===============================+======================+=============================+
# |   0  NVIDIA GeForce RTX ...  Off  | 00000000:XX:00.0 Off |  N/A                   |
# |  0%   45C    P8    25W / 450W|      0MiB / 24564MiB |      0%      Default       |
# +-----------------------------------------------------------------------------------+
```

### 6. Enable GPU Persistence Mode

Without persistence mode, the GPU driver reinitialises on every inference request, adding hundreds of milliseconds of latency. Persistence mode keeps the GPU initialised continuously.

```bash
# Enable persistence mode (survives until next reboot)
sudo nvidia-smi -pm 1
# Expected: Enabled persistence mode for GPU 00000000:XX:00.0.

# To make persistence mode survive reboots, create a systemd service:
sudo tee /etc/systemd/system/nvidia-persistenced.service > /dev/null <<'EOF'
[Unit]
Description=NVIDIA Persistence Daemon
After=syslog.target

[Service]
Type=forking
ExecStart=/usr/bin/nvidia-persistenced --verbose
ExecStopPost=/bin/rm -rf /var/run/nvidia-persistenced
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable nvidia-persistenced
sudo systemctl start nvidia-persistenced
```

### 7. Install the CUDA Toolkit

LM Studio and other inference frameworks require CUDA libraries. The CUDA toolkit provides `nvcc` (NVIDIA's C compiler), CUDA runtime libraries, and development headers.

```bash
sudo apt install -y nvidia-cuda-toolkit

# Verify the CUDA version
nvcc --version
# Expected: Cuda compilation tools, release 12.x, V12.x.xxx
```

---

## Validation

- [ ] **nvidia-smi reports the GPU correctly**

```bash
nvidia-smi
# Expected: RTX 4090 listed, driver version, CUDA version, temperature, power
```

- [ ] **GPU name, memory, and driver version via CSV**

```bash
nvidia-smi --query-gpu=name,memory.total,driver_version,cuda_version --format=csv,noheader
# Expected: NVIDIA GeForce RTX 4090, 24564 MiB, 565.x.x, 12.x
```

- [ ] **Kernel module version**

```bash
cat /proc/driver/nvidia/version
# Expected: NVRM version: NVIDIA UNIX x86_64 Kernel Module 565.x.x
```

- [ ] **NVIDIA device files are present**

```bash
ls /dev/nvidia*
# Expected: /dev/nvidia0  /dev/nvidiactl  /dev/nvidia-uvm  /dev/nvidia-uvm-tools
```

- [ ] **Persistence mode is enabled**

```bash
nvidia-smi -q | grep "Persistence Mode"
# Expected: Persistence Mode: Enabled
```

- [ ] **CUDA toolkit is installed**

```bash
nvcc --version
# Expected: Cuda compilation tools, release 12.x ...
```

- [ ] **GPU memory is fully available**

```bash
nvidia-smi --query-gpu=memory.free,memory.total --format=csv,noheader
# Expected: values close to total (24564 MiB) when no models are loaded
```

---

## Deinstallation

> **Warning:** Removing the NVIDIA driver disables all GPU compute. LM Studio will fall back to CPU inference. If any containerised workloads use the GPU, they will fail.

```bash
# Step 1: Stop any GPU-using processes (LM Studio, etc.) before removing the driver

# Step 2: Disable persistence mode
sudo nvidia-smi -pm 0 2>/dev/null || true
sudo systemctl stop nvidia-persistenced 2>/dev/null || true
sudo systemctl disable nvidia-persistenced 2>/dev/null || true
sudo rm -f /etc/systemd/system/nvidia-persistenced.service
sudo systemctl daemon-reload

# Step 3: Remove the NVIDIA driver and all related packages
sudo apt remove --purge nvidia-driver-565 nvidia-* libnvidia-*
sudo apt remove --purge nvidia-cuda-toolkit

# Step 4: Remove any remaining NVIDIA packages
sudo apt autoremove -y

# Step 5: Rebuild the initramfs without the NVIDIA module
sudo update-initramfs -u

# Step 6: Reboot
sudo reboot

# Step 7: After reboot, confirm nvidia-smi is gone
nvidia-smi
# Expected: command not found
```

---

## Continuity Controls

- **Driver updates:** NVIDIA releases driver updates frequently. Check the Ubuntu `nvidia-driver-*` package versions with `apt list --upgradable` monthly. Apply during a maintenance window; driver updates require a reboot.
- **Temperature monitoring:** The RTX 4090 can reach 80–90°C under sustained load. Monitor GPU temperature with `watch -n 2 nvidia-smi` or add GPU temperature to the Prometheus scrape via `nvidia_gpu_exporter`. Set a thermal alert at 85°C.
- **Power limit:** The RTX 4090's TDP is 450 W. If power delivery is limited (e.g., the server PSU is under 700 W), set a power cap with `sudo nvidia-smi -pl 350` to reduce power consumption at a modest performance cost.
- **Driver/CUDA compatibility:** Ensure the CUDA toolkit version is compatible with the driver version. The CUDA compatibility matrix is at https://docs.nvidia.com/deploy/cuda-compatibility/.
- **Multiple GPUs:** This guide covers a single GPU. For multi-GPU configurations, `nvidia-smi` will list all GPUs with indices 0, 1, 2, etc. Adjust `-pl` and `-pm` commands to target specific GPUs with `-i 0`, `-i 1`, etc.
