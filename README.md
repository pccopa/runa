# Runa

A Collaborative API Testing Tool

I’ve tried countless apps, but there’s always one problem: lack of synchronization.

## About Runa

Runa was born from a recurring challenge in many teams I’ve worked with. Collaborative development often breaks down over time due to missing standardization or synchronization. This can happen because team members can’t sync their collections, or because companies—especially smaller ones—avoid purchasing licenses for apps like Postman, Insomnia, or Bruno.

## The Concept

Runa is designed from the ground up to manage collections in a decentralized way. The coordinator functions essentially as a Git repository. Each collection exists as a shared system directory, and every file can self-identify as part of the project.

This approach allows collections created by different team members over time to be easily reorganized, merged, mixed, or deleted as needed.

Everything works naturally, like a file manager integrated with a repository. Developers can sync their files or simply copy Runa files to organize them according to their personal preferences.

## Funding and Vision

From the beginning, Runa is intended to be 100% free, open-source, and completely ad-free.
It’s a personal project, but everyone is invited to contribute, collaborate, or make donations to support its development.

## Development (Tauri on Linux)

The desktop shell needs WebKitGTK and related libraries. If `cargo` fails on `soup3-sys` or `javascriptcore-rs-sys`, install the [Tauri Linux prerequisites](https://v2.tauri.app/start/prerequisites/#linux) (Debian/Ubuntu example):

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev pkg-config
```

Then run `npm install` at the repo root and `npm run tauri:dev`.