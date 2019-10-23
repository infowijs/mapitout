/*
 * @Param precision: number, a value between 0 and 1. Lower is more precision.
 */
export function bspline(lats: number[], lons: number[], precision: number = 0.1) {
	let i, t, ax, ay, bx, by, cx, cy, dx, dy, lat, lon, points;
	points = [];
	// For every point
	for (i = 2; i < lats.length - 2; i++) {
		for (t = 0; t < 1; t += 0.05) {
			ax = (-lats[i - 2] + 3 * lats[i - 1] - 3 * lats[i] + lats[i + 1]) / 6
			ay = (-lons[i - 2] + 3 * lons[i - 1] - 3 * lons[i] + lons[i + 1]) / 6
			bx = (lats[i - 2] - 2 * lats[i - 1] + lats[i]) / 2
			by = (lons[i - 2] - 2 * lons[i - 1] + lons[i]) / 2
			cx = (-lats[i - 2] + lats[i]) / 2
			cy = (-lons[i - 2] + lons[i]) / 2
			dx = (lats[i - 2] + 4 * lats[i - 1] + lats[i]) / 6
			dy = (lons[i - 2] + 4 * lons[i - 1] + lons[i]) / 6
			lat = ax * Math.pow(t + 0.1, 3) + bx * Math.pow(t + 0.1, 2) + cx * (t + 0.1) + dx
			lon = ay * Math.pow(t + 0.1, 3) + by * Math.pow(t + 0.1, 2) + cy * (t + 0.1) + dy
			points.push({lat: lat, lng: lon})
		}
	}
	return points;
}
