import { packetProducer } from '$lib/serial';
import { Subject } from 'rxjs';

const maxNumberSamples = 40;
const internalData = [];
export const data = new Subject<DataPacket[]>();

packetProducer.subscribe({
	next: (value: DataPacket) => {
		internalData.push(value);
		while (internalData.length > maxNumberSamples) {
			internalData.shift();
		}
		data.next(internalData);
	}
});

