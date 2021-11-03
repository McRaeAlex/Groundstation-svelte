/// <reference types="@sveltejs/kit" />

interface Vec3 {
	x: number;
	y: number;
	z: number;
}

interface DataPacket {
	time: number;
	gyro: Vec3;
	acceleration: Vec3;
	magnetometer: Vec3;
	channels: Array<number>;
}

// TODO: remove hack
type SerialPort = any;
