// Platforms we ship binaries for. Shared by the homepage list and the
// releases picker so they cannot drift. `icon` is a key into assets/icons.
export const platforms = [
	{
		name: "Linux",
		icon: "platforms/linux",
		builds: ["GNU x86_64", "Musl x86_64", "ARM"],
	},
	{
		name: "macOS",
		icon: "platforms/apple",
		builds: ["x86_64", "ARM"],
	},
	{
		name: "Windows",
		icon: "platforms/windows",
		builds: ["x86_64"],
	},
	{
		name: "FreeBSD",
		icon: "platforms/freebsd",
		builds: ["x86_64"],
	},
	{
		name: "OpenBSD",
		icon: "platforms/openbsd",
		builds: ["x86_64"],
	},
];

/** One entry per downloadable build, e.g. "Linux GNU x86_64". */
export const builds = platforms.flatMap((p) =>
	p.builds.map((b) => `${p.name} ${b}`),
);
