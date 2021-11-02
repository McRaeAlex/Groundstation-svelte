import { Subject } from 'rxjs';

export const packetProducer = new Subject<DataPacket>();

// packetProducer.subscribe({ next: (value) => console.info(value) });

/**
 * setupDataPipeline sets up the transform streams and begins parsing the packets
 * @param stream the stream of bytes to treat as incoming packets
 * @returns a teardown function which closes the stream
 */
export function setupDataPipeline(stream: ReadableStream<Uint8Array>): () => Promise<void> {
	// setup
	const transformStream = stream
		.pipeThrough(new TextDecoderStream())
		.pipeThrough(new TransformStream<string, string>(new LineBreakTransformer()))
		.pipeThrough(new TransformStream<string, DataPacket>(new JSONTransformer()));

	const reader: ReadableStreamDefaultReader<DataPacket> = transformStream.getReader();

	// start
	readContinuous(reader);

	// teardown
	return async () => {
		// aquire lock
		await reader.cancel();
		await reader.releaseLock();
		await transformStream.cancel();
	};
}
 
async function readContinuous(reader: ReadableStreamReader<DataPacket>) {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const { value, done } = await reader.read();
		if (done) break;
		packetProducer.next(value);
	}
}

class LineBreakTransformer implements Transformer<string, string> {
	buffer: string;

	constructor() {
		this.buffer = '';
	}

	transform(chunk: string, controller: TransformStreamDefaultController<string>) {
		this.buffer += chunk;
		const lines = this.buffer.split('\r\n');
		this.buffer = lines.pop(); // avoid unfinished line
		lines.forEach((line) => controller.enqueue(line));
	}
}

class JSONTransformer implements Transformer<string, DataPacket> {
	transform(chunk: string, controller: TransformStreamDefaultController<DataPacket>) {
		try {
			controller.enqueue(JSON.parse(chunk));
		} catch (e) {
			console.info('Failed to parse chuck as JSON', chunk);
		}
	}
}
