# Rust via rustup

Rust is a systems programming language focused on memory safety, zero-cost abstractions, and high performance. In the Forgejo-Society stack, Rust is used for performance-critical CLI tools, WebAssembly components, and any service where memory safety is a requirement without the overhead of garbage collection. The official installation method for Rust is `rustup`, a toolchain manager that handles multiple Rust versions, targets, and components in the user's home directory — similar to nvm for Node.js. The build-essential, libssl-dev, and pkg-config packages installed in guide 01 provide the C toolchain and native libraries that many Rust crates require during compilation.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — `build-essential`, `libssl-dev`, and `pkg-config` must be installed (they are part of the essential package list in guide 01).

---

## Installation

### 1. Install Rust via rustup

The `rustup` installer script downloads rustup itself, the stable Rust toolchain, and the Cargo package manager into `~/.rustup` and `~/.cargo` respectively:

```bash
# Download and run the rustup installer with non-interactive defaults
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# The -y flag accepts all defaults:
# - Installs the stable toolchain
# - Adds ~/.cargo/bin to PATH via ~/.cargo/env
# - No modifications to PATH in shell rc files beyond sourcing the env file
```

### 2. Activate the Cargo Environment

```bash
# Apply the PATH change immediately without a full logout/login
source "$HOME/.cargo/env"

# Verify
rustc --version
# Expected: rustc 1.xx.x (hash date)
cargo --version
# Expected: cargo 1.xx.x (hash date)
```

### 3. Add the Cargo env Source to Shell Configuration

The rustup installer adds a source line to `~/.profile` and/or `~/.bashrc`. Verify it is present:

```bash
grep "cargo/env" ~/.bashrc ~/.profile 2>/dev/null
# Expected: at least one file contains: source "$HOME/.cargo/env"
```

If it is not present (e.g., if you use a non-standard shell config), add it manually:

```bash
echo 'source "$HOME/.cargo/env"' >> ~/.bashrc
```

### 4. Update to the Latest Stable

The installer provides the current stable version. Run an update immediately to ensure you have the latest patch release:

```bash
rustup update
# Expected: stable updated to 1.xx.x
```

### 5. Install Useful Components

```bash
# clippy — Rust's official linter (checks for common mistakes and style issues)
rustup component add clippy

# rustfmt — Rust's official code formatter (enforces the standard style)
rustup component add rustfmt

# Verify
cargo clippy --version
# Expected: clippy 0.1.xx (rustc 1.xx.x)

rustfmt --version
# Expected: rustfmt 1.x.x-stable (hash date)
```

### 6. Install cargo-edit

`cargo-edit` adds `cargo add`, `cargo rm`, and `cargo upgrade` subcommands for managing dependencies in `Cargo.toml` without manual editing:

```bash
cargo install cargo-edit

# This may take several minutes — it compiles from source
# Expected: cargo-add, cargo-rm, cargo-upgrade are now available

cargo add --version
# Expected: cargo-add x.x.x
```

---

## Validation

- [ ] **rustc version is reported**

```bash
rustc --version
# Expected: rustc 1.xx.x (xxxxxxxx YYYY-MM-DD)
```

- [ ] **cargo version is reported**

```bash
cargo --version
# Expected: cargo 1.xx.x (xxxxxxxx YYYY-MM-DD)
```

- [ ] **rustup shows the installed toolchain**

```bash
rustup show
# Expected:
# Default host: x86_64-unknown-linux-gnu
# rustup home:  /home/USERNAME/.rustup
#
# installed toolchains
# --------------------
# stable-x86_64-unknown-linux-gnu (default)
#
# active toolchain
# ----------------
# stable-x86_64-unknown-linux-gnu (default)
# rustc 1.xx.x (xxxxxxxx YYYY-MM-DD)
```

- [ ] **clippy is available**

```bash
cargo clippy --version
# Expected: clippy x.x.x (rustc 1.xx.x)
```

- [ ] **rustfmt is available**

```bash
rustfmt --version
# Expected: rustfmt 1.x.x-stable
```

- [ ] **A test project builds and runs**

```bash
cd ~
cargo new hello-rust
cd hello-rust
cargo run
# Expected:
#    Compiling hello-rust v0.1.0 (/home/USERNAME/hello-rust)
#     Finished dev [unoptimized + debuginfo] target(s) in x.xxs
#      Running `target/debug/hello-rust`
# Hello, world!
```

- [ ] **cargo clippy runs without errors on the test project**

```bash
cd ~/hello-rust
cargo clippy
# Expected: Finished ... with no warnings or errors (new project is clean)
```

- [ ] **Clean up the test project**

```bash
rm -rf ~/hello-rust
```

---

## Deinstallation

```bash
# Step 1: Uninstall all toolchains, rustup, rustc, cargo, and the ~/.rustup directory
rustup self uninstall
# Rustup will prompt for confirmation — enter 'y'
# This removes ~/.rustup, ~/.cargo/bin/{rustup,rustc,cargo,...}

# Step 2: If the ~/.cargo directory remains, remove it
rm -rf ~/.cargo

# Step 3: Remove the source line from shell configuration files
# Edit ~/.bashrc and remove the line: source "$HOME/.cargo/env"
vim ~/.bashrc
# Also check ~/.profile, ~/.zshrc, ~/.bash_profile
grep -l "cargo/env" ~/.bashrc ~/.profile ~/.zshrc ~/.bash_profile 2>/dev/null

# Step 4: Reload the shell configuration
source ~/.bashrc

# Step 5: Confirm removal
rustc --version
# Expected: command not found
cargo --version
# Expected: command not found
```

---

## Continuity Controls

- **Regular updates:** Run `rustup update` weekly or before starting any project that might depend on recently stabilised language features. Rust has a 6-week stable release cycle; staying current avoids large compatibility jumps.
- **Edition management:** Rust code is written against an "edition" (2015, 2018, 2021, 2024). New projects should use the current edition (`cargo new` defaults to the latest). Existing projects can migrate editions with `cargo fix --edition`.
- **Compilation caching:** Rust compilation is slow for large dependency trees. Install `sccache` (`cargo install sccache`) and set `RUSTC_WRAPPER=sccache` to cache compilation artifacts across builds, reducing subsequent build times significantly on CI runner nodes.
- **Cross-compilation:** To build for different targets (e.g., compile on x86-64 Linux for ARM): `rustup target add aarch64-unknown-linux-gnu` and use `cargo build --target aarch64-unknown-linux-gnu` with an appropriate cross-linker.
- **Security audits:** Run `cargo audit` (install with `cargo install cargo-audit`) to check for known vulnerabilities in your dependency tree. Integrate this into the Forgejo Actions CI workflow.
