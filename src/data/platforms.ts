// Latest public release. Artifacts below point at this tag's assets on
// GitHub; bump `tag`/`date` and re-check sizes each release.
export const release = {
	tag: "cuprated-0.1.0-preview",
	version: "0.1.0-preview",
	date: "2026-08-01",
} as const;

const releaseUrl = `https://github.com/Cuprate/cuprate/releases/download/${release.tag}`;

export interface Artifact {
	url: string;
	size: string;
	date: string;
}

const artifact = (file: string, size: string): Artifact => ({
	url: `${releaseUrl}/${file}`,
	size,
	date: release.date,
});

export interface Build {
	name: string;
	/** Present only when the latest release ships this binary. */
	artifact?: Artifact;
}

// Platforms we ship binaries for. Shared by the homepage list and the
// releases picker so they cannot drift. `icon` is a key into assets/icons.
export const platforms: { name: string; icon: string; builds: Build[] }[] = [
	{
		name: "Linux",
		icon: "platforms/linux",
		builds: [
			{
				name: "GNU x86_64",
				artifact: artifact(
					"cuprated-0.1.0-preview-x86_64-unknown-linux-gnu.tar.gz",
					"11.2 MB",
				),
			},
			{ name: "Musl x86_64" },
			{
				name: "ARM",
				artifact: artifact(
					"cuprated-0.1.0-preview-aarch64-unknown-linux-gnu.tar.gz",
					"10.7 MB",
				),
			},
		],
	},
	{
		name: "macOS",
		icon: "platforms/apple",
		builds: [
			{ name: "x86_64" },
			{
				name: "ARM",
				artifact: artifact(
					"cuprated-0.1.0-preview-aarch64-apple-darwin.tar.gz",
					"9.19 MB",
				),
			},
		],
	},
	{
		name: "Windows",
		icon: "platforms/windows",
		builds: [
			{
				name: "x86_64",
				artifact: artifact(
					"cuprated-0.1.0-preview-x86_64-pc-windows-msvc.zip",
					"8.8 MB",
				),
			},
		],
	},
	{
		name: "FreeBSD",
		icon: "platforms/freebsd",
		builds: [{ name: "x86_64" }],
	},
	{
		name: "OpenBSD",
		icon: "platforms/openbsd",
		builds: [{ name: "x86_64" }],
	},
];

/** One entry per downloadable build, e.g. "Linux GNU x86_64". */
export const builds = platforms.flatMap((p) =>
	p.builds.map((b) => ({
		label: `${p.name} ${b.name}`,
		artifact: b.artifact,
	})),
);
