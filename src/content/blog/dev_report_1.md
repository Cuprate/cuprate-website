---
title: "It's been a while"
description: "Cuprate development report #1: It's been a while"
pubDate: 'June 11, 2024'
heroImage: '/img/blog-blueprint_dev_report1.png'
type: 'report'
---

*Tap tap* is this thing on ?

Hi everyone, it's been a while since the Cuprate project gave news to the wilder community. Approximately a year and a half in fact. There is so much to say, so much to ask, so much to to be happy about. Contributors have been very busy during this time and we finally have very exciting news to share. Let's quickly dive into this report.

> If you don't know what Cuprate is, we invite you to go over the [About](https://cuprate.org/about) page of this website.

## New website

Cuprate now have a brand new website, built with the [Astro](https://astro.build) framework. You can follow the blog to see development reports, learn about new releases, and see a few extra posts. You can even subscribe to the [RSS feed](https://cuprate.org/rss.xml)

We'll try to setup a presence on some social networks whenever possible to announce new releases.

## What happened since: CCS & New contributors

Most of users visiting the Matrix/IRC monero channels may already be aware, but it is always nice to remind our fellow Reddit and Twitter users. We also thanks Monero.observer, TheMoneroMoon and RevuoXMR for sharing the evolution reported in the CCSs

Since the last announcement, [SyntheticBird45](https://github.com/SyntheticBird45) quit the project, [Boog900](https://github.com/Boog900) successfully got funded their CCS proposal to work on Cuprate full-time and completed it. During winter 2023, the project received the help of a new contributor called [hinto-janai](https://github.com/hinto-janai) that you may already know for its Gupax: GUI for P2Pool/Xmrig project.

Boog900 has been working hard at implementing the P2P and Consensus mechanism in Cuprate and improving it. This has also been the opportunity to report bugs found in monerod.

Hinto-janai has been working hard at implementing the database of Cuprate, task harder than you may expect at first glance. Thanks to their work, Cuprate now have a fully working database backed by LMDB or redb.

They reviewed each other Pull Requests in order to attest a level of quality in the codebase. It also permitted to build the Contributions and Code guideline. There are improvements all across the repository on CI/test, Lints and dependencies, structure of the workspace and benchmarks.

## What is being worked on:

It happened. After a year and a half, Cuprate is now capable of syncing the monero blockchain on disk. The last month has been spent on testing the syncing with the help of a test binary. Implementing several performance improvements,
Identifying bottlenecks, fixing regressions.

If two words were to be used for describing Cuprate syncing it would be: *Blazing fast!*

### Downloading performance

In a downloading scenario, only requesting blocks from peers without syncing them on disk, Cuprate is up to 4 times faster than monerod! In the same environment (Ryzen 7, 8GB RAM, NVMe SSD) Cuprate has downloaded the blockchain in 2 hours, while it took 8 hours for monerod.

> *"Thats fucking insane" - Boog900 reaction to this result*

### Full-verification syncing

Most may not know that monerod do not actually verify the blockchain being downloaded by default. Instead, to speed up the process, monerod download the blockchain and verify the integrity of batches of 512 blocks. Just by comparing with known hashes, you're able to determine if the blockchain downloaded has been tampered. It is very useful as it avoid the CPU computation cost of verifying the datas of all individuals blocks being downloaded.

Full verification syncing take a considerable amount of time, monerod can take several days. Thanks to Rust easy parallelism and useful crates, Cuprate has been able to dramatically increase the performance of this method of syncing:

### Fast-sync

The default method used by monerod, as explained above, is to compare known hashes to batches of 512 blocks. It is fast and cheap, and it is only natural that Cuprate should profit from such method.

Introducing [jomuel](https://github.com/jomuel) and [ddull](https://github.com/ddull), participants of the MoneroKon 2024 Hackathon. They decided to help out Cuprate during the hackathon and pulled up a nicely coded fast-sync component under time pressure.

Thanks again to jomuel and ddull for having contributed to the project. We're all eager to integrate it into test binary for testing.

### Consensus documentation

Boog900 started an mdbook documenting the Monero protocol: https://monero-book.cuprate.org/ . It contains documentation on blocks, transactions, P2P network messages, pruning and hard forks.

## What is yet to be worked on:

### New contributors

In the near-term future, SyntheticBird should join back the project and help the development effort. [Yamabiiko](https://github.com/yamabiiko) is also expected to contribute to the project in the coming month.

### Roadmap

Approximate roadmap is:
- Continue testing and improving syncing performance and stability.
- RPC: JSON-RPC specifically, being worked on by hinto-janai as part of its CCS
- ZMQ: Necessary step for miners before binary.
- Binary: Build up the main `cuprated` binary.
- Testnet release
- Continue architecture documentation

### Eta release

Cuprate should be able to offer alpha testnet release at the end of the summer. Road towards mainnet is still uncertain but we hope to attest full stability and safety for mainnet launch as soon as possible. We hope for the community to help us with the testnet phase.

### Asking the community:

For the first development report of the Cuprate project, we are asking the community for taglines. Yes, the current tagline:

> An upcoming, experimental, modern & secure monero node

will soon be outdated and we would like to hear your ideas. If you have one don't hesitate to go over the #cuprate:monero.social matrix channel, #cuprate channel on Libera IRC or directly open an issue on the [cuprat-site](https://github.com/Cuprate/cuprate-site) repository.

## Thanks you

Thanks you all for reading the first development report. This project has sure been quiet for a little time but we're now happy to share the heavy works that have been done. Stay tune for new development report and testnet release.