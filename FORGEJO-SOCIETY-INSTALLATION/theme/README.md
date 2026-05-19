# A Theme for [Forgejo](https://forgejo.org/)

Our Forgejo Society theme for Forgejo. Strong #AC43D9 Basis with all calculated colour combinations.

![Dark Screenshot](./society-dark.png)

> A dark theme and light theme for [Forgejo](https://forgejo.org/).

## Install

Check out the [install document](./INSTALL.md) for installation instructions. But, for anyone whom doesn't want to click the TLDR:

1. Drop the `.css` files into your `custom/public/assets/css/` directory.
2. Edit your `app.ini` under the `[ui]` section to add the themes to the `THEMES` list and optionally set `DEFAULT_THEME = society`.
3. Restart your instance to pick up the changes:
   ```bash
   sudo systemctl restart forgejo
   ```

## Screenshots

![Society Dark Screenshot](.society-dark.png)

---

![Society Light Screenshot](.society-light.png)

## Credits

Our Society is adapted from the [Melosso/forgejo-theme-melosso](https://github.com/melosso/forgejo-theme-melosso) is adapted from the [Dracula/Alucard theme](https://forge.axfive.net/Taylor/forgejo-theme-dracula) originally created by [Taylor C. Richberger](https://forge.axfive.net/Taylor).
