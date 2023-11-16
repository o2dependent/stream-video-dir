import sharp, { type OverlayOptions } from "sharp";

export const stitchImagesHorizontally = async (
	imagePaths: string[],
	outputPath: string,
) => {
	// Load images
	let images = await Promise.all(
		imagePaths.map((path) => sharp(path, { failOn: "none" })),
	);
	console.log({ images });
	// First image height
	const { height } = await images[0].metadata();
	console.log({ height });
	if (!height) throw new Error("First image height not found");
	// Calculate total width for the stitched image
	// for async
	let totalWidth = 0;
	let imageWidths: number[] = [];
	await Promise.all(
		images.map(async (image, i) => {
			try {
				const { width } = await image.metadata();
				if (!width) {
					images = images.filter((_, idx) => i !== idx);
					return;
				}
				totalWidth += width ?? 0;
				imageWidths.push(width);
			} catch (error) {
				return;
			}
		}),
	);
	console.log({ imageWidths });

	// Create a new image with the calculated width and the height of the first image
	const stitchedImage = sharp({
		create: {
			width: totalWidth,
			height: height,
			channels: 3, // 3 channels for RGB
			background: { r: 255, g: 255, b: 255 }, // Background color (white in this example)
		},
	});
	console.log({ stitchedImage: true });
	// Composite images horizontally
	let xOffset = 0;
	let compositeLayers: OverlayOptions[] = [];
	await Promise.all(
		images.map(async (image, i) => {
			console.log({ xOffset });
			const input = await image.toBuffer();
			if (!input) return;
			const left = imageWidths.slice(0, i).reduce((a, b) => a + b, 0);
			compositeLayers.push({
				input,
				left,
				top: 0,
			});
		}),
	);

	stitchedImage.composite(compositeLayers);
	// Save the stitched image
	await stitchedImage.toFile(outputPath);
};
