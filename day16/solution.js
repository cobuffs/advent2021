const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
const samples = ["D2FE28", "38006F45291200", "EE00D40C823060", "8A004A801A8002F478", "620080001611562C8802118E34", "C0015000016115A2E0802F182340", "A0016C880162017C3686B18A3D4780"]
const moresamps = ["C200B40A82", "04005AC33890", "880086C3E88112", "9C0141080250320F1802104A08"]
const hexarr = input[0].split("");
const binarr = hexarr.map(v => {
    switch (v) {
        case "0": return "0000";
        case "1": return "0001";
        case "2": return "0010";
        case "3": return "0011";
        case "4": return "0100";
        case "5": return "0101";
        case "6": return "0110";
        case "7": return "0111";
        case "8": return "1000";
        case "9": return "1001";
        case "A": return "1010";
        case "B": return "1011";
        case "C": return "1100";
        case "D": return "1101";
        case "E": return "1110";
        case "F": return "1111";
        default: break;
    }
});
const binrep = binarr.join("");
let vsum = 0;
const result = parsepacket(0,binrep);

console.log(evalpacket(result.packet));

function evalpacket(packet) {
    if(packet.typeid === 4) return packet.literal;
    if(packet.typeid === 0) {
        let sum = 0;
        for (var i = 0; i < packet.subpackets.length; i++) {
            sum += evalpacket(packet.subpackets[i]);
        }
        return sum;
    }
    if(packet.typeid === 1) {
        let product = 1;
        for (var i = 0; i < packet.subpackets.length; i++) {
            product *= evalpacket(packet.subpackets[i]);
        }
        return product;
    }
    if(packet.typeid === 2) {
        let vals = [];
        for (var i = 0; i < packet.subpackets.length; i++) {
            vals.push(evalpacket(packet.subpackets[i]));
        }
        return Math.min(...vals);
    }
    if(packet.typeid === 3) {
        let vals = [];
        for (var i = 0; i < packet.subpackets.length; i++) {
            vals.push(evalpacket(packet.subpackets[i]));
        }
        return Math.max(...vals);
    }
    if(packet.typeid === 5) {
        return evalpacket(packet.subpackets[0]) > evalpacket(packet.subpackets[1]) ? 1 : 0;
    }
    if(packet.typeid === 6) {
        return evalpacket(packet.subpackets[0]) < evalpacket(packet.subpackets[1]) ? 1 : 0;
    }
    if(packet.typeid === 7) {
        return evalpacket(packet.subpackets[0]) === evalpacket(packet.subpackets[1]) ? 1 : 0;
    }
}

function parsepacket(start, binstr) {
    const version = parseInt(binstr.substr(start, 3), 2);
    const typeid = parseInt(binstr.substr(start + 3, 3), 2);
    let packet = {};
    packet["version"] = version;
    vsum += version;
    packet["typeid"] = typeid;
    let pointer = start + 6;
    if(typeid === 4) {
        //literal
        let literal = "";
        pointer = start + 6;
        let done = false;
        while (!done) {
            literal += binstr.substr(pointer + 1, 4);
            if (binstr.substr(pointer, 1) === "0") done = true;
            pointer += 5;
        }
        packet["literal"] = parseInt(literal,2);
        //keep moving the pointer until its divisible by 4
        //while (pointer %4 !== 0) pointer++;
    } else {
        //operator
        const lentypeid = binstr.substr(start + 6, 1);
        if(lentypeid === "0") {
            //If the length type ID is 0, then the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet
            const totalsublen = parseInt(binstr.substr(start + 7, 15), 2);
            subpackets = binstr.substr(start + 22, totalsublen);
            pointer = start + 22;
            packet["subpackets"] = [];
            let subpacketpointer = 0;
            while (subpacketpointer < totalsublen) {
                const result = parsepacket(0, binstr.substr(pointer));
                pointer += result.pointer;
                subpacketpointer += result.pointer;
                packet.subpackets.push(result.packet);
            }
            // packet["subpackets"].push(parsepacket(0, subpackets));
        } else {
            //If the length type ID is 1, then the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet
            const numsubpackets =  parseInt(binstr.substr(start + 7, 11), 2);
            packet["subpackets"] = [];
            pointer = start + 7 + 11;
            for(var i = 0; i < numsubpackets; i++) {
                const result = parsepacket(0, binstr.substr(pointer));
                pointer += result.pointer;
                packet.subpackets.push(result.packet);
            }
            packet["numsubpackets"] = numsubpackets;
        }

    }
    return {"pointer": pointer,"packet": packet};

}

