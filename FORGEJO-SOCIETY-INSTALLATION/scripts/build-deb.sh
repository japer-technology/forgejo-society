#!/usr/bin/env bash
# build-deb.sh — build a .deb of the Forgejo Society installer suite using
# raw dpkg-deb (no debhelper required).
#
# The package installs the script suite under
# /usr/share/forgejo-society/ and a thin /usr/sbin/forgejo-society wrapper
# that dispatches to install.sh. Installing the .deb does NOT install the
# forge; run `sudo forgejo-society install` afterwards.
#
# Output: dist/forgejo-society_<version>_all.deb
#
# Usage:
#   bash build-deb.sh
#
# Idempotent: re-running rebuilds the package from scratch. Adapted from
# the Ubuntu Zombie suite (scripts/build-deb.sh).
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

# shellcheck source=FORGEJO-SOCIETY-INSTALLATION/scripts/lib.sh
if [[ -r "${SCRIPT_DIR}/lib.sh" ]]; then
  . "${SCRIPT_DIR}/lib.sh"
  lib_setup_colors
else
  printf 'build-deb.sh: cannot find required library %s\n' "${SCRIPT_DIR}/lib.sh" >&2
  exit 1
fi

command -v dpkg-deb >/dev/null 2>&1 || die "dpkg-deb is required (sudo apt-get install -y dpkg-dev)." 1

if [[ -f "${SCRIPT_DIR}/VERSION" ]]; then
  VERSION="$(tr -d '[:space:]' < "${SCRIPT_DIR}/VERSION")"
else
  VERSION="1.0.0"
fi
PKG="forgejo-society"
ARCH="all"
MAINTAINER="${DEB_MAINTAINER:-Forgejo Society <maintainers@example.org>}"
OUT_DIR="${SCRIPT_DIR}/dist"
STAGE="$(mktemp -d -t "${PKG}-deb.XXXXXX")"
trap 'rm -rf "${STAGE}"' EXIT

mkdir -p "${OUT_DIR}"
info "Building ${PKG} ${VERSION} in ${STAGE}"

INSTALL_ROOT="${STAGE}/usr/share/${PKG}"
DOC_ROOT="${STAGE}/usr/share/doc/${PKG}"
SBIN="${STAGE}/usr/sbin"
DEBIAN="${STAGE}/DEBIAN"
mkdir -p "${INSTALL_ROOT}/completions" "${DOC_ROOT}" "${SBIN}" "${DEBIAN}"

# Copy the script suite.
for item in lib.sh install.sh install-runner.sh uninstall.sh build-deb.sh README.md VERSION; do
  [[ -e "${SCRIPT_DIR}/${item}" ]] || continue
  cp -a "${SCRIPT_DIR}/${item}" "${INSTALL_ROOT}/"
done
cp -a "${SCRIPT_DIR}/completions/." "${INSTALL_ROOT}/completions/"
chmod 0755 "${INSTALL_ROOT}"/*.sh

# Conventional doc copy.
cp -a "${SCRIPT_DIR}/README.md" "${DOC_ROOT}/README.md"

# /usr/sbin wrapper.
cat > "${SBIN}/${PKG}" <<EOF
#!/usr/bin/env bash
# forgejo-society — thin wrapper around the installer CLI.
set -Eeuo pipefail
INSTALLER="/usr/share/${PKG}/install.sh"
if [[ ! -x "\${INSTALLER}" ]]; then
  echo "forgejo-society: installer missing at \${INSTALLER}" >&2
  echo "  reinstall the package: sudo apt install --reinstall ${PKG}" >&2
  exit 1
fi
exec "\${INSTALLER}" "\$@"
EOF
chmod 0755 "${SBIN}/${PKG}"

# Control metadata.
cat > "${DEBIAN}/control" <<EOF
Package: ${PKG}
Version: ${VERSION}
Section: admin
Priority: optional
Architecture: ${ARCH}
Depends: bash, postgresql, curl, wget, xz-utils, openssl, jq, ca-certificates
Recommends: ufw, fail2ban, git-lfs
Maintainer: ${MAINTAINER}
Description: Forgejo Society single-host forge installer
 Installs and verifies a self-hosted Forgejo forge backed by PostgreSQL on
 owned Ubuntu hardware, with optional Caddy/HTTPS and a Forgejo Actions
 runner. Installing this package only lays down the scripts; run
 'sudo forgejo-society install' to provision the forge.
EOF
SIZE_KB="$(du -ks "${INSTALL_ROOT}" "${DOC_ROOT}" "${SBIN}" | awk '{s+=$1} END {print s}')"
printf 'Installed-Size: %s\n' "${SIZE_KB}" >> "${DEBIAN}/control"

# md5sums for `dpkg --verify`.
( cd "${STAGE}" && find usr -type f -exec md5sum {} + > "${DEBIAN}/md5sums" )

DEB_NAME="${PKG}_${VERSION}_${ARCH}.deb"
dpkg-deb --root-owner-group --build "${STAGE}" "${OUT_DIR}/${DEB_NAME}"

echo
ok "Wrote ${OUT_DIR}/${DEB_NAME}"
dpkg-deb --info "${OUT_DIR}/${DEB_NAME}" | head -20 || true
echo
info "Contents:"
dpkg-deb --contents "${OUT_DIR}/${DEB_NAME}" 2>/dev/null | cat | head -30 || true
