// https://web.dev/streams/

import { randomNumberInRange } from "$lib/utils/math";

const startTime = Date.now();

function* fakePacketGenerator(): Generator<DataPacket, DataPacket, DataPacket> {
    while (true) {
        const time = Math.floor((Date.now() - startTime) / 10);
        const entry = {
            time: time,
            acceleration: {
                x: randomNumberInRange(-30000, 30000),
                y: randomNumberInRange(-30000, 30000),
                z: randomNumberInRange(-30000, 30000)
            },
            magnetometer: {
                x: randomNumberInRange(-100, 100),
                y: randomNumberInRange(-100, 100),
                z: randomNumberInRange(-100, 100)
            },
            gyro: { x: randomNumberInRange(-100, 100), y: randomNumberInRange(-100, 100), z: randomNumberInRange(-100, 100) },
            channels: Array.from({length: 14}, () => randomNumberInRange(-3600, 3600)),
        };
        yield entry;
    }
}


class FakePacketStream {
    interval: number;
    packetGenerator: Generator<DataPacket, DataPacket, DataPacket>;

    constructor() {
        this.packetGenerator = fakePacketGenerator();
    }

    async start(controller: ReadableStreamController<Uint8Array>) {
        this.interval = window.setInterval(() => {
            const { value } = this.packetGenerator.next();
            const entry = JSON.stringify(value) + '\r\n';
            const arraybuf = Uint8Array.from(entry, c => c.charCodeAt(0));
            controller.enqueue(arraybuf);
        }, 100);
    }

    async cancel() {
        window.clearInterval(this.interval);
    }
}

export function createFakeSerialStream(): ReadableStream<Uint8Array> {
    return new ReadableStream(new FakePacketStream());
}

