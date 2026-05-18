# Python 3 and pipx

Python 3 is the scripting language used throughout the Forgejo-Society automation layer — integration scripts, LLM API clients, data processing utilities, and test harnesses are all written in Python. Ubuntu 24.04 LTS ships Python 3.12 pre-installed as a system dependency, but it lacks pip, venv support, and the development headers needed to compile C-extension packages. This guide adds those missing pieces and installs `pipx`, a tool for managing Python applications in isolated virtual environments so that globally installed tools (like `black`, `ruff`, and `httpie`) do not conflict with project-level dependencies.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — Python 3 is pre-installed; this guide adds the development stack on top.

---

## Installation

### 1. Install Python 3 Development Packages

```bash
sudo apt install -y \
  python3 \
  python3-pip \
  python3-venv \
  python3-dev \
  python3-setuptools \
  python3-wheel

# Verify
python3 --version
# Expected: Python 3.12.x (or current Ubuntu 24.04 default)

pip3 --version
# Expected: pip 24.x.x from /usr/lib/python3/dist-packages/pip (python 3.12)
```

**Package explanations:**

| Package | Purpose |
| --- | --- |
| `python3` | The Python 3 interpreter (likely already installed) |
| `python3-pip` | Package installer for Python |
| `python3-venv` | Support for creating virtual environments with `python3 -m venv` |
| `python3-dev` | C headers for compiling native extensions (e.g., cryptography, psycopg2) |
| `python3-setuptools` | Build tools for packages using `setup.py` |
| `python3-wheel` | Binary distribution format support |

### 2. Install pipx

`pipx` installs Python CLI applications into isolated virtual environments while making their executables globally available in `~/.local/bin`. This prevents the "dependency hell" that occurs when multiple tools are installed into the same Python environment.

```bash
# Install pipx using pip (as a user install to avoid touching system Python)
pip3 install --user pipx

# Add pipx's bin directory to PATH
~/.local/bin/pipx ensurepath

# Reload the shell configuration to pick up the new PATH
source ~/.bashrc

# Verify
pipx --version
# Expected: 1.x.x
```

### 3. Install Global Tools with pipx

```bash
# black — the uncompromising Python code formatter
pipx install black

# ruff — an extremely fast Python linter written in Rust
pipx install ruff

# httpie — user-friendly HTTP client for API testing
pipx install httpie

# Verify
black --version
# Expected: black, 24.x.x (any Python ≥3.8)

ruff --version
# Expected: ruff 0.x.x

http --version
# Expected: HTTPie 3.x.x
```

### 4. Create a Virtual Environment for Development Work

For any Python project, always use a virtual environment to isolate dependencies:

```bash
# Example: create a venv for a project
mkdir -p ~/projects/my-forgejo-script
cd ~/projects/my-forgejo-script
python3 -m venv .venv

# Activate the venv
source .venv/bin/activate

# Install project dependencies inside the venv
pip install requests httpx python-dotenv

# Deactivate when done
deactivate
```

---

## Validation

- [ ] **Python 3 version is correct**

```bash
python3 --version
# Expected: Python 3.12.x (or current Ubuntu 24.04 default)
```

- [ ] **pip3 is installed**

```bash
pip3 --version
# Expected: pip 24.x.x from .../pip (python 3.12)
```

- [ ] **Python 3 SSL module is functional**

```bash
python3 -c "import ssl; print(ssl.OPENSSL_VERSION)"
# Expected: OpenSSL 3.x.x  ... (a version string, not an error)
```

- [ ] **Virtual environments can be created**

```bash
python3 -m venv /tmp/test-venv
/tmp/test-venv/bin/python --version
# Expected: Python 3.12.x
rm -rf /tmp/test-venv
```

- [ ] **pipx is installed and in PATH**

```bash
pipx --version
# Expected: 1.x.x

which pipx
# Expected: /home/USERNAME/.local/bin/pipx
```

- [ ] **black is installed via pipx**

```bash
black --version
# Expected: black, 24.x.x
```

- [ ] **ruff is installed via pipx**

```bash
ruff --version
# Expected: ruff 0.x.x
```

- [ ] **httpie is installed via pipx**

```bash
http --version
# Expected: HTTPie 3.x.x

# Test a simple GET request
http --ignore-stdin GET https://httpbin.org/get 2>/dev/null | head -5
# Expected: JSON response beginning with { "args": {}, ...
```

- [ ] **C extension packages can be compiled**

```bash
# Create a test venv and try installing psycopg2 (requires python3-dev)
python3 -m venv /tmp/ext-test
/tmp/ext-test/bin/pip install --quiet psycopg2-binary
/tmp/ext-test/bin/python -c "import psycopg2; print('psycopg2 OK')"
# Expected: psycopg2 OK
rm -rf /tmp/ext-test
```

---

## Deinstallation

```bash
# Step 1: List and uninstall all pipx-managed applications
pipx list
# For each application in the list:
pipx uninstall black
pipx uninstall ruff
pipx uninstall httpie
# Or uninstall all at once:
pipx uninstall-all

# Step 2: Remove pipx itself
pip3 uninstall -y pipx

# Step 3: Remove the pipx binary and venvs
rm -rf ~/.local/share/pipx
rm -rf ~/.local/bin/pipx

# Step 4: Remove the Python development packages
# NOTE: Leave python3 itself installed — system tools depend on it
sudo apt remove --purge python3-pip python3-venv python3-dev python3-setuptools python3-wheel
sudo apt autoremove -y

# Step 5: Remove user Python packages directory if empty
ls ~/.local/lib/ 2>/dev/null
# If this directory contains python3.x subdirectories with pipx packages, remove them:
rm -rf ~/.local/lib/python3.12/

# Step 6: Confirm pip3 is removed
pip3 --version
# Expected: command not found (python3 itself remains)
```

---

## Continuity Controls

- **System Python protection:** Never install packages directly into the system Python with `sudo pip3 install`. Always use `pipx` for global tools or `python3 -m venv` for project-specific environments. Installing into the system Python can break Ubuntu's package management.
- **pipx updates:** Run `pipx upgrade-all` monthly to keep globally installed tools current. All tools are in isolated venvs, so upgrades cannot break each other.
- **Virtual environment strategy:** Every project in the Forgejo-Society monorepo should have its own `.venv` directory at the project root. Add `.venv/` to the global `.gitignore` (already included in guide 13).
- **Python version upgrades:** Ubuntu releases include the Python version for the LTS lifecycle. To use a newer Python version than the Ubuntu default, consider `pyenv` (similar to nvm for Python) or the `deadsnakes` PPA.
- **ruff as a linter:** ruff replaces flake8, isort, and several other linters. Configure it in `pyproject.toml` with `[tool.ruff]`. Run `ruff check .` in CI via a Forgejo Actions workflow.
