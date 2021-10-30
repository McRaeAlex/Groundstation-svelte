export const accelConfig = {
	options: {
		plugins: {
			title: {
				text: 'Acceleration (m/s²)'
			}
		},
		scales: {
			y: {
				min: -40000,
				max: 40000
			}
		}
	}
};

export const magConfig = {
	options: {
		plugins: {
			title: {
				text: 'Magnetometer'
			}
		},
		scales: {
			y: {
				min: -100,
				max: 100
			}
		}
	}
};

export const gyroConfig = {
	options: {
		plugins: {
			title: {
				text: 'Gyroscrope'
			}
		},
		scales: {
			y: {
				min: -100,
				max: 100
			}
		}
	}
};
