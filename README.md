<div align="center">
  <a href="https://github.com/lukas-sgx/gateflow">
    <img src="assets/gateflow-logo.svg" alt="Logo" height="125" style="border-radius: 10px">
  </a>

  <h3 align="center">Gateflow | GitHub CI/CD Integration</h3>

  <p align="center">
    Automates PR labeling, release creation, CI workflows and more via GitHub webhooks.
    <br />
    <a href="https://github.com/lukas-sgx/gateflow"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/lukas-sgx/gateflow">View Demo</a>
    &middot;
    <a href="https://github.com/lukas-sgx/gateflow/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/lukas-sgx/gateflow/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

**Gateflow** is a GitHub App that listens to GitHub webhook events and automates your repository workflows. Connect it to your repos and let it handle the repetitive stuff — labeling PRs, triggering CI pipelines, creating releases, and more.

No more manually tagging PRs or forgetting to add labels. Gateflow reacts to events in real time and keeps your workflow consistent.

### Built With

[![Node.js][Node-shield]][Node-url]

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js 18+
- A GitHub App registered on your account or organization ([create one here](https://github.com/settings/apps/new))
- A public URL or tunnel (e.g. [ngrok](https://ngrok.com/)) to receive webhook events locally

### Installation

1. Clone the repo

```sh
git clone https://github.com/lukas-sgx/gateflow.git
cd gateflow
```

2. Install dependencies

```sh
npm install
```

3. Copy the example environment file and fill in your GitHub App credentials

```sh
cp .env.example .env
```

```env
INSTALLATION_ID=YOUR_INSTALLATION_ID
APP_ID=YOUR_APP_ID
PRIVATE_KEY=YOUR_SECRET_KEY
```

4. Start the server

```sh
npm start prod
```

## Usage

Once running, Gateflow listens for incoming GitHub webhook payloads. Here's an example of what happens when a PR is opened:

```
[webhook] pull_request.opened → #42 "feat: add dark mode"
  ├── title matches pattern "feat:*"   → label: enhancement
  ├── files changed: src/styles/**     → label: ui
  └── author: first-time contributor  → label: good first issue
```

Labeling rules are defined in a config file at the root of your repository:

```yaml
# .gateflow.yml
labels:
  - pattern: "feat:*"
    label: enhancement
  - pattern: "fix:*"
    label: bug
  - paths:
      - "src/styles/**"
    label: ui
```

*For more advanced examples, please refer to the [Documentation](https://github.com/lukas-sgx/gateflow).*

## Roadmap

- [x] GitHub webhook receiver
- [x] Automated PR labeling from title patterns
- [ ] Automated PR labeling from changed file paths
- [ ] Automated release creation on merge to `main`
- [ ] CI workflow triggers based on PR events

See the [open issues](https://github.com/lukas-sgx/gateflow/issues) for a full list of proposed features and known issues.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/lukas-sgx/gateflow/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lukas-sgx/gateflow" alt="contrib.rocks image" />
</a>

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## Contact

Lukas Soigneux - lukas.soigneux@epitech.eu

## Acknowledgments

* [Octokit](https://github.com/octokit/octokit.js) - GitHub API client
* [GitHub Webhooks Docs](https://docs.github.com/en/webhooks) - Official webhook reference

[Node-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/