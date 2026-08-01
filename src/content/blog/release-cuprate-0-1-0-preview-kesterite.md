---
title: "Cuprate Beta 0.1.0-preview: Kesterite released."
description: "A special Cuprate release."
pubDate: 'August 1, 2026'
heroImage: '/img/thumbnails/release-cuprate-0-1-0-preview-kesterite.svg'
type: 'release'
---

A new version of Cuprate, codenamed Kesterite, has been released as a preview of Cuprate Beta. Wallets can now connect to and operate with Cuprate nodes.

As this is a big release, we have included some details on what Cuprate is. If you already know about the Cuprate project, you can skip to [What Has Changed Since The Last Update](#what-has-changed-since-the-last-update).

- Cuprate
  - [What](#what-is-cuprate)
  - [Why](#why-cuprate)
  - [How](#how-cuprate)
- [What Has Changed Since The Last Update](#what-has-changed-since-the-last-update)
- [What Is Next](#what-is-next)

### What is Cuprate

Cuprate is a Monero node. Nodes are the backbone of the Monero network: they keep track of the blockchain state and verify blocks and transactions. Wallets and other software communicate with these nodes to interact with the Monero peer-to-peer network.

Cuprate is the first working alternative implementation of a Monero node. The original Monero node, named monerod, is developed by The Monero Project.

### Why Cuprate

There are a few reasons for Cuprate. Firstly, by having multiple implementations, we are more likely to catch issues in the node software. Through the development of Cuprate, multiple issues in monerod have been found and fixed. Some would have been classed as being at the highest vulnerability level.

Another reason for Cuprate is that the current Monero node is pretty inefficient and fragile. There has been some improvement here recently; however, it is still far from where it should be.

### How Cuprate

Cuprate has been built from the ground up in the Rust programming language to be much clearer and more efficient than monerod. Cuprate makes great use of Rust's concurrency ecosystem, enabling high levels of parallelisation which improves the performance of the node. We try to avoid anything that could cause contention between tasks (i.e. locks). We also make heavy use of caches to prevent calls to the database on disk, which are expensive. This was kept high in mind while building; fast syncing can be done with no DB reads, except for some initial ones at the start to get the chain state. The general architecture is asynchronous and offers much better resilience under load.

Cuprate is modular which allows projects to take isolated components of Cuprate to use for themselves.
Examples of projects include:
- https://github.com/Boog900/p2p-proxy-checker. A spy node detector.
- https://github.com/Cyrix126/monero-crawler-rs. A Monero p2p network crawler.

You can see our code documentation here: https://doc.cuprate.org/

A recent and substantial effort was the creation of a custom database: https://github.com/Cuprate/Tapes. This database has also made the node much more performant. It's specialised for exactly the operations Cuprate needs. This database by itself halved our fast sync time (which was already pretty fast). With default settings, users with fast enough internet can expect to sync the blockchain in an hour.

---

## What Has Changed Since The Last Update

Since our last release, the main focus has been on getting wallets working with Cuprate. This has been a huge task that has finally been completed.
This marks a significant milestone, as you can now use Cuprate instead of monerod for syncing wallets and sending transactions.

As a tradition for the project, and because a picture is worth a thousand words, here are several performance benchmarks we have conducted between Monero and Cuprate:

<div class="plot-author">

<div class="plot-author__widget">
<img class="plot-author__avatar" src="/img/blog/boog900.jpg" alt="" width="48" height="48" />
<div class="plot-author__info">
<span class="plot-author__name">Boog900</span>
<span class="plot-author__role">Maintainer</span>
</div>
</div>

You will notice on the graphs there are 2 Cuprates. Cuprate sets the limits on the amount of blocks given out per request lower than monerod, this is because monerod sets them at the literal boundary of what is allowed by the serialisation protocol (epee). This does have an impact on the amount of blocks we can give out a second, but it is worth it for stability. For the sake of the test though I have added a version of cuprated with the limits matched.

<div class="plot">
<div class="plot-fade"><img src="/img/blog/wallet-sync-throughput.svg" alt="Wallet sync throughput" loading="lazy" /></div>
<p class="plot-caption">Cuprate can scale much better than monerod.</p>
</div>

For 1 wallet monerod and Cuprate (with increased limits) are tied, this is probably down to the bottleneck being the wallet rather than the node. This means monerod and cuprate can saturate a wallet for recent blocks. For full chain scans Cuprate is faster from personal experience. This is probably due to lower blocks having less txs so the wallet can make more RPC requests per second.

Cuprate can clearly scale better than monerod. It also has much tighter min-max ranges. monerod stays almost flat but in some runs it gives out less blocks for 16 wallets compared to 1.

If you look closely though monerod is actually slightly ahead for 2 wallets and for 4 wallets it is on average just ahead. I thought this could be because LMDB is caching blocks in memory, so only the first wallet is doing disk look-ups for blocks.

So to make the test more ~~favourable to cuprate~~ realistic, I made a new test that tests the sync of one wallet with more wallets syncing at random points in the chain to add DB pressure. In all seriousness, I do think it is something to look at, how we are poorer at caching recent look-ups. However, I do not think four syncing wallets from the same point is the thing that should be celebrated, in the real world the DB will be getting lots of different requests for different data, hence this next test.

<div class="plot">
<div class="plot-fade"><img src="/img/blog/one-80k-block-wallet-under-sync-load-bars.svg" alt="One 80k-block wallet under sync load (bars)" loading="lazy" /></div>
<p class="plot-caption">With 3 wallet clients connected at random points for database pressure, Cuprate syncs a wallet 3.5x faster than monerod.</p>
</div>

That test confirms that monerod was benefiting a lot from LMDB caching recent requested blocks.

Here are some more graphs:

<div class="plot">
<div class="plot-fade"><img src="/img/blog/wallet-refresh-latency-under-concurrency.svg" alt="Wallet refresh latency under concurrency" loading="lazy" /></div>
<p class="plot-caption">monerod refresh latency grows with concurrency, reaching >5min at 16 wallets; Cuprate stays ~1.5min following a near linear trajectory.</p>
</div>

<div class="plot">
<div class="plot-fade"><img src="/img/blog/throughput-available-to-each-wallet.svg" alt="Throughput available to each wallet" loading="lazy" /></div>
<p class="plot-caption">Cuprate keeps per-wallet throughput ~4x higher than monerod at 16 wallets.</p>
</div>

<div class="plot">
<div class="plot-fade"><img src="/img/blog/rpc-scaling-versus-one-wallet.svg" alt="RPC scaling versus one wallet" loading="lazy" /></div>
<p class="plot-caption">Consequently, RPC total throughput scales ~linearly with the number of wallets while monerod saturates under 3x baseline.</p>
</div>

</div>

Overall, we are very proud of the work accomplished on RPC. The results are already very promising for this first preview version, and we are hopeful for the future optimisations to come on our journey to a stable release.

### Dockerfile and platform support

redsh4de is a new contributor to Cuprate who has been at the forefront of many demanded tasks.

Some of their contributions include the introduction of a Dockerfile at the root of the repository for deploying a Cuprate container, proper support for Musl-based Linux distributions such as Alpine Linux, and finally support for building and running Cuprate on FreeBSD and OpenBSD.

### The node is now a library

As part of an architectural enhancement effort, the Cuprate node code has transitioned from a pure binary to be a fully working library as well. It is now possible to integrate one or multiple working Cuprate nodes into your application through our public Rust API.

If you used cuprated 0.0.9, nothing changes for you as a user.

### New website redesign

Old visitors might have noticed that the website just got a new look!

We thought that this release was the opportunity to rework the website for all users. There is now easy access to resources on the home page as well as a Download page for downloading the latest binaries. You are also more likely to see more news on this blog as we continue the development of Cuprate towards 1.0.0. Long-term Monero community members can also take their time hunting for some Easter eggs on this website ;)

---

## What Is Next

Cuprate is far from completion, and many items await as we are transitioning from Alpha to Beta. Here is a non-exhaustive list of items being or about to be worked on:

### Graceful shutdown

Another great follow-up contribution is the ongoing support for graceful shutdown of every component. So far, Cuprate currently shuts down abruptly, and redsh4de has been working on improving that process. Part of the solution has been merged into this release, and the rest will follow soon for Cuprate 0.1.0 Beta.

### Supply chain security and Reproducible build

In the long term, the Cuprate binary needs to be reproducible bit by bit. This is an important property for the security of all Monero users and is a hard requirement for stable releases.

SyntheticBird raises funds through the Community Crowdfunding System to work on this issue and on reducing supply chain security risks in Cuprate's dependency tree.
If you also think this is important for you as a user, please consider donating to their CCS: https://ccs.getmonero.org/proposals/syntheticbird_cuprate_scs_ab_3_months.html.

## Conclusion

We want to thank again every contributor to the project, whose efforts have turned what was once a simple dream into a reality. Their knowledge and experience helped shape the current form of Cuprate, and we are hopeful for the future of this project and its contributions to the Monero cryptocurrency. We would also like to thank every CCS donor, without whom no one would have been able to invest themselves so deeply into the making of this node.

We hope you have fun with this new Cuprate release.

<div class="metal-card">
    <div class="metal-card__label">Kesterite</div>
    <div class="metal-card__body">
        <div class="metal-card__image"><img src="/img/blog/kesterite.png" alt="Kesterite, a sulfide mineral" /></div>
        <div class="metal-card__text">
            <p>Kësterite is a sulfide mineral with an iron–zinc lattice, formula Cu<sub>2</sub>(Zn,Fe)SnS<sub>4</sub>. Like perovskite, it is a promising material for solar panels. It is usually found in quartz–sulfide hydrothermal veins and was first described in 1958 in Yakutia, Russia.</p>
            <p class="metal-card__source">Source: <a href="https://en.wikipedia.org/wiki/Kesterite" target="_blank" rel="noopener">Wikipedia - Kesterite</a></p>
        </div>
    </div>
</div>
