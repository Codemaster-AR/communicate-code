Nothing to see here. I use this repository to communicate code betweeen all my devices and servers


# Add cloudflare gpg key
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

# Add this repo to your apt repositories
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

# install cloudflared
sudo apt-get update && sudo apt-get install cloudflared


## Part 2
sudo cloudflared service install eyJhIjoiNjg5ZDRiY2Q1ZGM4Y2JkNTMzODg0YWYyODQyZWZjZmUiLCJ0IjoiYTM4YzlmZWQtM2Y5ZC00YjI5LTlhMGYtM2NiZmVhMGE1ZWQ4IiwicyI6IlpXSTRPVEZqTnpBdE1EYzRPUzAwTUdKbUxXSmhOV0l0WW1Vd01HSmxZVEEwWkdSaCJ9

Codeberg overrides Forgejo’s default, built-in CSS by utilizing Forgejo's native Interface Customization system. They inject custom styles and override stylesheets using a dedicated custom/ directory without altering the core Forgejo codebase.Here is exactly how they do it:The Custom Path: Codeberg mounts a custom data directory mapping to $FORGEJO_CUSTOM. Forgejo automatically scans this directory for templates and public assets.Template Injection: By placing a custom header.tmpl file into custom/templates/custom/, Codeberg injects HTML <link> tags directly before the closing </head> tag on every page.Asset Overrides: Custom CSS files (and images like brand logos) are placed in custom/public/css/. Forgejo serves these files publicly at the /css/ path, allowing the custom stylesheets to cascade over and override the default Forgejo UI styles.This approach ensures Codeberg can deploy instance-wide branding and theme fixes (like adjustments to light/dark mode logos or spacing) cleanly, without having to manually patch the core Forgejo theme files on every release.
