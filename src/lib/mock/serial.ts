// https://web.dev/streams/

const startTime = Date.now();

function* fakePacketGenerator(): Generator<DataPacket, DataPacket, DataPacket> {
    while (true) {
        const time = Math.floor((Date.now() - startTime) / 10);
        const entry = {
            time: time,
            acceleration: {
                x: randomNumber(-30000, 30000),
                y: randomNumber(-30000, 30000),
                z: randomNumber(-30000, 30000)
            },
            magnetometer: {
                x: randomNumber(-100, 100),
                y: randomNumber(-100, 100),
                z: randomNumber(-100, 100)
            },
            gyro: { x: randomNumber(-100, 100), y: randomNumber(-100, 100), z: randomNumber(-100, 100) }
        };
        yield entry;
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
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

