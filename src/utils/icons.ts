import type { ImageMetadata } from "astro";

const icons = Object.fromEntries(
	Object.entries(
		import.meta.glob<{ default: ImageMetadata }>("../assets/icons/**/*.avif", {
			eager: true,
		}),
	).map(([path, mod]) => [
		path.split("/icons/")[1].replace(/\.avif$/, ""),
		mod.default,
	]),
);

/** Name is the path under assets/icons, e.g. "platforms/linux". */
export function getIcon(name: string): ImageMetadata {
	const icon = icons[name];
	if (!icon) throw new Error(`Unknown icon: "${name}"`);
	return icon;
}
