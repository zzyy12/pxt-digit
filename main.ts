//% weight=20 color=#006000 icon="\uf0a4" block="Dight"
namespace haoda_digit {

    const tab = [
        0x3f,
        0x06,
        0x5b,
        0x4f,
        0x66,
        0x6d,
        0x7d,
        0x07,
        0x7f,
        0x6f,
        0x77,
        0x7c,
        0x39,
        0x5e,
        0x79,
        0x71
    ]

    function TM1650_start(): void {
        pins.digitalWritePin(DigitalPin.P19, 1);
        pins.digitalWritePin(DigitalPin.P20, 1);
        control.waitMicros(1);
        pins.digitalWritePin(DigitalPin.P20, 0);
        control.waitMicros(1);

    }


    function TM1650_stop(): void {
        pins.digitalWritePin(DigitalPin.P19, 1);
        pins.digitalWritePin(DigitalPin.P20, 0);
        control.waitMicros(1);
        pins.digitalWritePin(DigitalPin.P20, 1);
        control.waitMicros(1);

    }

    function TM1650_ACK(): void {
        pins.digitalWritePin(DigitalPin.P19, 1);
        control.waitMicros(1);
        pins.digitalWritePin(DigitalPin.P19, 0);
        control.waitMicros(1);

    }

    function TM1650_write(data: number): void {
        let i;
        pins.digitalWritePin(DigitalPin.P19, 0);
        for (i = 0; i < 8; i++) {
            if (data & 0x80) {
                pins.digitalWritePin(DigitalPin.P20, 1);
            } else {
                pins.digitalWritePin(DigitalPin.P20, 0);
            }
            data <<= 1;
            pins.digitalWritePin(DigitalPin.P19, 0);
            control.waitMicros(1);
            pins.digitalWritePin(DigitalPin.P19, 1);
            control.waitMicros(1);
            pins.digitalWritePin(DigitalPin.P19, 0);
            control.waitMicros(1);
        }
    }

    function write_data(add: number, data: number) {
        TM1650_start();
        TM1650_write(add);
        TM1650_ACK();
        TM1650_write(data);
        TM1650_ACK();
        TM1650_stop();
    }

    function digit_clear(): void {
        for (let a = 0; a < 4; a++) {
            write_data(0x68 + a * 2, 0);
        }
    }

    function digit_clearbit(bit: number) {
        if (bit < 1) return;
        write_data(0x68 + 6 - (bit - 1) * 2, 0)
    }

    //% blockId="HaodaBit_TM650_SHOW_NUMBER" block="4DigitDisplay show number %num"
    //% weight=100 blockGap=8
    export function display_num(num:number):void{
        let bit;
        let d = num % 10;
        let c = num % 100/10;
        let b = num % 1000/100;
        let a = num / 1000;
        if(d != 0){
            bit = 1
        }
        if (c != 0) {
            bit = 2
        }
        if (b != 0) {
            bit = 3
        }
        if (a != 0) {
            bit = 4
        }
        switch(bit){
            case 4:
                write_data(0x68, tab[a]);
            case 3:
                write_data(0x68+2, tab[b]);
            case 2:
                write_data(0x68+4, tab[c]);
            case 1:
                write_data(0x68+6, tab[d]);
                break;
        }

    }

}