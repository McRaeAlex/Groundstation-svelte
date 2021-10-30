export const data = {
	labels: [],
	datasets: [
		{
			label: 'X',
			data: [],
			borderColor: 'red',
			backgroundColor: 'red'
		},
		{
			label: 'Y',
			data: [],
			borderColor: 'blue',
			backgroundColor: 'blue'
		},
		{
			label: 'Z',
			data: [],
			borderColor: 'green',
			backgroundColor: 'green'
		}
	]
};

export const options = {
	responsive: true,
	maintainAspectRatio: false,
	// animations should be off....
	plugins: {
		legend: {
			position: 'top'
		},
		title: {
			text: 'Chart',
			display: true
		}
	},
	scales: {
		y: {
			display: true,
			min: -100,
			max: 100
		},
		x: {
			display: true,
			title: {
				text: 'Time',
				display: true
			}
		}
	}
};

const config = {
	type: 'line',
	data: data,
	options: options
};

export default config;
