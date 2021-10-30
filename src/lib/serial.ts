import { Subject } from 'rxjs';

export const packetProducer = new Subject<DataPacket>();

let gStream: ReadableStream | null = null;

packetProducer.subscribe({ next: (value) => console.info(value) });

export async function setupDataPipeline(stream: ReadableStream<Uint8Array>): Promise<void> {
	gStream = stream;
	const reader = stream
		.pipeThrough(new TextDecoderStream())
		.pipeThrough(new TransformStream<string, string>(new LineBreakTransformer()))
		.pipeThrough(new TransformStream<string, DataPacket>(new JSONTransformer()))
		.getReader();

	readContinuous(reader);
}

export async function teardownDataPipeline(): Promise<void> {
	await gStream.cancel();
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
